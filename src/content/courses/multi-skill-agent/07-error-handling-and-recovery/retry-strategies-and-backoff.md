# Retry Strategies and Backoff

**One-Line Summary**: A guide to when and how to retry failed operations in agent systems, covering exponential backoff with jitter, idempotency considerations, and the critical distinction between retryable and non-retryable errors.

**Prerequisites**: `error-categories-in-agent-systems.md`, basic Python (decorators, async/await)

## What Are Retry Strategies and Backoff?

Imagine you call a restaurant and the line is busy. You could call back immediately, but if everyone does that, the line stays busy. Instead, you wait a minute, then two minutes, then five — giving the restaurant time to clear the queue. If you also add a little randomness to your wait time (so you and other callers are not all redialing at exactly the same moment), you have reinvented exponential backoff with jitter.

In agent systems, retries are the first line of defense against transient failures: API timeouts, rate limits, temporary network blips. But retries are not free. Each retry costs time, tokens, and money. Worse, retrying at the wrong time — against a non-retryable error, or against a non-idempotent operation that partially succeeded — can cause data corruption or duplicate side effects. A well-designed retry strategy balances persistence against waste, and it knows when to stop trying.

The key insight is that retry policy must be tuned per error type and per operation. A read-only search can be retried aggressively. A payment API call that timed out after sending the request must not be retried without first checking whether the original request succeeded. The retry strategy is not a generic wrapper — it encodes knowledge about each tool's semantics.

## How It Works

### Immediate Retry vs Exponential Backoff

The simplest retry strategy is to try again immediately. This works for very brief transient errors (a dropped packet) but fails for load-related issues (rate limits, overloaded servers) because it adds to the very load causing the problem.

Exponential backoff increases the wait time between retries, typically doubling each time:

| Attempt | Base Delay | With Jitter (example) |
|---|---|---|
| 1 | 1s | 0.7s |
| 2 | 2s | 1.8s |
| 3 | 4s | 3.2s |
| 4 | 8s | 6.9s |
| 5 | 16s | 14.1s |

```python
import random
import asyncio
import functools
from typing import TypeVar, Callable, Type

T = TypeVar("T")


def retry_with_backoff(
    max_retries: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    exponential_base: float = 2.0,
    jitter: bool = True,
    retryable_exceptions: tuple[Type[Exception], ...] = (TimeoutError, ConnectionError),
):
    """Decorator that retries a function with exponential backoff."""

    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @functools.wraps(func)
        async def wrapper(*args, **kwargs) -> T:
            last_exception = None

            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except retryable_exceptions as e:
                    last_exception = e

                    if attempt == max_retries:
                        break

                    delay = min(
                        base_delay * (exponential_base ** attempt),
                        max_delay,
                    )

                    if jitter:
                        delay = delay * (0.5 + random.random())

                    await asyncio.sleep(delay)

            raise last_exception

        return wrapper
    return decorator
```

Usage in an agent skill:

```python
@retry_with_backoff(
    max_retries=3,
    base_delay=2.0,
    retryable_exceptions=(TimeoutError, RateLimitError),
)
async def search_web(query: str) -> dict:
    """Search the web with automatic retry on transient failures."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            "https://api.search.example.com/v1/search",
            params={"q": query},
        )
        response.raise_for_status()
        return response.json()
```

### Jitter: Why Randomness Matters

Without jitter, if 100 agent instances all hit a rate limit at the same time, they all retry at exactly the same intervals — creating synchronized bursts of traffic called "thundering herd." Adding random jitter spreads the retries out over time.

There are three common jitter strategies:

```python
def full_jitter(base_delay: float, attempt: int, max_delay: float) -> float:
    """Uniform random between 0 and the exponential delay."""
    cap = min(base_delay * (2 ** attempt), max_delay)
    return random.uniform(0, cap)


def equal_jitter(base_delay: float, attempt: int, max_delay: float) -> float:
    """Half the exponential delay plus random jitter for the other half."""
    cap = min(base_delay * (2 ** attempt), max_delay)
    return cap / 2 + random.uniform(0, cap / 2)


def decorrelated_jitter(prev_delay: float, base_delay: float, max_delay: float) -> float:
    """Each delay is random between base and 3x the previous delay."""
    return min(random.uniform(base_delay, prev_delay * 3), max_delay)
```

AWS research shows decorrelated jitter produces the best overall throughput under contention, followed by full jitter. Equal jitter is a reasonable default when you want more predictable timing.

### Idempotent vs Non-Idempotent Operations

An operation is idempotent if performing it multiple times has the same effect as performing it once. This distinction is critical for retry safety.

**Safe to retry (idempotent)**:
- Reading a file or database query
- Web search
- GET requests
- Setting a value (PUT with the same body)

**Dangerous to retry (non-idempotent)**:
- Sending an email or message
- Creating a database record (POST)
- Incrementing a counter
- Transferring funds

```python
class ToolRegistry:
    """Registry that tracks idempotency of each tool."""

    def __init__(self):
        self._tools: dict[str, ToolConfig] = {}

    def register(self, name: str, func: Callable, idempotent: bool = False, max_retries: int = 3):
        self._tools[name] = ToolConfig(
            func=func,
            idempotent=idempotent,
            max_retries=max_retries if idempotent else 0,
        )

    async def execute_with_retry(self, name: str, params: dict) -> Any:
        tool = self._tools[name]

        if not tool.idempotent:
            # Non-idempotent: execute exactly once, no retry
            return await tool.func(**params)

        # Idempotent: retry with backoff
        for attempt in range(tool.max_retries + 1):
            try:
                return await tool.func(**params)
            except RetryableError as e:
                if attempt == tool.max_retries:
                    raise
                await asyncio.sleep(2 ** attempt)
```

### When NOT to Retry

Some errors are permanent. Retrying them wastes time and tokens while delaying the real fix.

**Never retry**:
- **Authentication failures (401/403)**: The credentials are wrong. Retrying will not make them right.
- **Validation errors (400/422)**: The request is malformed. The same request will fail again.
- **Resource not found (404)**: Unless the resource might be in the process of being created, it will stay missing.
- **Insufficient permissions**: No amount of retrying grants new permissions.
- **Budget/quota exceeded**: Distinct from rate limits — the allocation is genuinely exhausted.

```python
NON_RETRYABLE_STATUS_CODES = {400, 401, 403, 404, 405, 409, 422}

def is_retryable(error: ToolExecutionError) -> bool:
    """Determine if an error should trigger a retry."""
    if error.status_code in NON_RETRYABLE_STATUS_CODES:
        return False
    if error.status_code == 429:
        return True  # Rate limit — always retryable
    if 500 <= error.status_code < 600:
        return True  # Server errors — usually transient
    return False
```

## Why It Matters

### Cost and Latency Control

Without retry limits and backoff, a failing tool call can cause the agent to spin for minutes, burning API credits. A well-configured retry strategy caps total retry time at 30–60 seconds and total attempts at 3–5, keeping costs predictable. In production systems, retries account for 5–15% of total API costs; poor retry policies can push this above 40%.

### Preventing Cascading Failures

Aggressive retries against an overloaded service make the overload worse. Exponential backoff with jitter is the standard pattern for preventing this cascade. Circuit breakers — which stop retrying entirely after a threshold of failures — add a further layer of protection.

## Key Technical Details

- Exponential backoff typically uses a base of 2 seconds, doubling each attempt
- Maximum delay should be capped at 30–60 seconds for interactive agents
- Full jitter or decorrelated jitter reduces thundering herd by 40–60% vs no jitter
- Max retries of 3 is a reasonable default; more than 5 is rarely justified
- Rate-limit retries should respect the `Retry-After` header when provided
- Non-idempotent operations should use at-most-once semantics (zero retries)
- Circuit breakers should open after 5+ consecutive failures to the same service

## Common Misconceptions

**"More retries is always better"**: Beyond 3–5 retries, the probability of success drops below 5% for most transient errors. Additional retries just add latency. If a service has not recovered after 30 seconds of exponential backoff, it is likely experiencing an outage that requires minutes or hours to resolve — at which point the agent should fall back to a degraded mode rather than keep waiting.

**"Exponential backoff is only for rate limits"**: Backoff is valuable for any transient failure — network timeouts, server errors, temporary resource contention. Rate limits are just the most visible case. Even for simple connection errors, immediate retry succeeds only 30–40% of the time, while a 1-second delay raises this to 70–80%.

## Connections to Other Concepts

- `error-categories-in-agent-systems.md` — The taxonomy that determines which errors to retry
- `graceful-degradation.md` — What to do when retries are exhausted
- `self-correction-and-reflection.md` — Complementary strategy for reasoning errors that retries cannot fix
- `unit-testing-individual-skills.md` — How to test retry behavior with mocked failures

## Further Reading

- Brooker, "Exponential Backoff and Jitter" (2015) — AWS architecture blog post with simulation data comparing jitter strategies
- Nygard, "Release It!" (2018) — Chapter on stability patterns including circuit breakers and bulkheads
- Polly Project Documentation (2023) — .NET resilience library with well-documented retry patterns applicable to any language
