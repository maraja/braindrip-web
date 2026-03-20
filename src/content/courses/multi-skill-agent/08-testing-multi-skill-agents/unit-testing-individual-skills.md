# Unit Testing Individual Skills

**One-Line Summary**: How to test each agent skill in isolation using mocks, input validation tests, output format assertions, and edge case coverage — forming the base of the testing pyramid for AI agents.

**Prerequisites**: Basic Python testing (pytest), understanding of agent skill/tool interfaces

## What Is Unit Testing for Agent Skills?

Think of unit testing agent skills like testing individual instruments before an orchestra rehearsal. You would not assemble 60 musicians to find out the oboe has a stuck key — you check each instrument independently first. Similarly, you test each agent skill in isolation before testing how they work together. If the web search skill cannot parse a response, you want to discover that in a 50-millisecond unit test, not in a 30-second end-to-end agent run.

Unit testing individual skills means testing each tool function with controlled inputs, mocked external dependencies, and explicit assertions on outputs. The goal is to verify that each skill correctly handles valid inputs, rejects invalid inputs, produces properly formatted outputs, and behaves predictably under error conditions. These tests are fast (milliseconds each), deterministic (no LLM or API calls), and pinpoint exactly where a failure originates.

Agent testing follows the same testing pyramid as traditional software: a broad base of fast unit tests, a middle layer of integration tests, and a narrow top of end-to-end evaluations. Unit tests are the foundation. In a well-tested agent, 60–70% of tests are unit tests, 20–30% are integration tests, and 5–10% are end-to-end evaluations. This ratio reflects both the speed of feedback and the cost of each test type.

## How It Works

### Mocking External Dependencies

Agent skills almost always depend on external services — APIs, databases, file systems. Unit tests replace these with mocks that return controlled responses.

```python
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from agent.skills.web_search import search_web, SearchResult


@pytest.fixture
def mock_search_response():
    """A realistic mock response from the search API."""
    return {
        "results": [
            {
                "title": "Python Documentation",
                "url": "https://docs.python.org",
                "snippet": "Welcome to Python.org",
            },
            {
                "title": "Python Tutorial",
                "url": "https://docs.python.org/3/tutorial/",
                "snippet": "The Python Tutorial",
            },
        ],
        "total_results": 1200,
    }


@pytest.mark.asyncio
async def test_search_web_returns_parsed_results(mock_search_response):
    """Test that search_web correctly parses API response into SearchResult objects."""
    with patch("agent.skills.web_search.httpx.AsyncClient") as mock_client_cls:
        mock_response = MagicMock()
        mock_response.json.return_value = mock_search_response
        mock_response.status_code = 200
        mock_response.raise_for_status = MagicMock()

        mock_client = AsyncMock()
        mock_client.get.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_cls.return_value = mock_client

        results = await search_web("python documentation")

        assert len(results) == 2
        assert isinstance(results[0], SearchResult)
        assert results[0].title == "Python Documentation"
        assert results[0].url == "https://docs.python.org"


@pytest.mark.asyncio
async def test_search_web_handles_empty_results():
    """Test behavior when the API returns zero results."""
    with patch("agent.skills.web_search.httpx.AsyncClient") as mock_client_cls:
        mock_response = MagicMock()
        mock_response.json.return_value = {"results": [], "total_results": 0}
        mock_response.status_code = 200
        mock_response.raise_for_status = MagicMock()

        mock_client = AsyncMock()
        mock_client.get.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_cls.return_value = mock_client

        results = await search_web("xyzzy nonexistent query 12345")

        assert results == []
```

### Testing Input Validation

Each skill should validate its inputs before making external calls. Test that invalid inputs are rejected with clear error messages.

```python
import pytest
from agent.skills.web_search import search_web, InvalidQueryError
from agent.skills.file_reader import read_file, FilePathError
from agent.skills.code_executor import execute_code, UnsafeCodeError


@pytest.mark.asyncio
async def test_search_rejects_empty_query():
    with pytest.raises(InvalidQueryError, match="Query cannot be empty"):
        await search_web("")


@pytest.mark.asyncio
async def test_search_rejects_oversized_query():
    long_query = "a" * 10001
    with pytest.raises(InvalidQueryError, match="exceeds maximum length"):
        await search_web(long_query)


@pytest.mark.asyncio
async def test_file_reader_rejects_path_traversal():
    with pytest.raises(FilePathError, match="Path traversal"):
        await read_file("../../etc/passwd")


@pytest.mark.asyncio
async def test_code_executor_rejects_dangerous_imports():
    with pytest.raises(UnsafeCodeError):
        await execute_code("import subprocess; subprocess.run(['rm', '-rf', '/'])")
```

### Testing Output Format

Agent skills must produce outputs that downstream consumers (other skills or the LLM) can parse. Test the structure rigorously.

```python
from agent.skills.weather import get_weather, WeatherResult


@pytest.mark.asyncio
async def test_weather_output_structure(mock_weather_api):
    result = await get_weather("San Francisco")

    # Verify the output matches the expected schema
    assert isinstance(result, WeatherResult)
    assert isinstance(result.temperature, float)
    assert isinstance(result.unit, str)
    assert result.unit in ("celsius", "fahrenheit")
    assert isinstance(result.description, str)
    assert len(result.description) > 0

    # Verify serialization works (the LLM will see the serialized form)
    serialized = result.to_dict()
    assert "temperature" in serialized
    assert "unit" in serialized
    assert "description" in serialized


@pytest.mark.asyncio
async def test_weather_output_serializable(mock_weather_api):
    """Ensure the output can be JSON-serialized for the LLM context."""
    import json

    result = await get_weather("San Francisco")
    serialized = json.dumps(result.to_dict())
    deserialized = json.loads(serialized)
    assert deserialized["temperature"] == result.temperature
```

### Edge Cases and Error Conditions

Edge cases are where agent skills most commonly break in production. Dedicate significant test coverage to these scenarios.

```python
@pytest.mark.asyncio
async def test_search_handles_api_timeout():
    """Skill should raise a retryable error on timeout."""
    with patch("agent.skills.web_search.httpx.AsyncClient") as mock_client_cls:
        mock_client = AsyncMock()
        mock_client.get.side_effect = httpx.TimeoutException("Connection timed out")
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_cls.return_value = mock_client

        with pytest.raises(RetryableToolError):
            await search_web("test query")


@pytest.mark.asyncio
async def test_search_handles_rate_limit():
    """Skill should raise a retryable error with retry-after on 429."""
    with patch("agent.skills.web_search.httpx.AsyncClient") as mock_client_cls:
        mock_response = MagicMock()
        mock_response.status_code = 429
        mock_response.headers = {"Retry-After": "30"}
        mock_response.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Rate limited", request=MagicMock(), response=mock_response
        )

        mock_client = AsyncMock()
        mock_client.get.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_cls.return_value = mock_client

        with pytest.raises(RetryableToolError) as exc_info:
            await search_web("test query")

        assert exc_info.value.retry_after == 30


@pytest.mark.asyncio
async def test_search_handles_malformed_json():
    """Skill should handle API returning invalid JSON gracefully."""
    with patch("agent.skills.web_search.httpx.AsyncClient") as mock_client_cls:
        mock_response = MagicMock()
        mock_response.json.side_effect = ValueError("Invalid JSON")
        mock_response.text = "<html>Server Error</html>"
        mock_response.status_code = 200

        mock_client = AsyncMock()
        mock_client.get.return_value = mock_response
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client_cls.return_value = mock_client

        with pytest.raises(ToolExecutionError, match="malformed response"):
            await search_web("test query")
```

### The Testing Pyramid for Agents

```
         /  E2E Evaluations  \       5-10% — Full agent on real tasks
        / (LLM + tools + env)  \     Slow (30-120s), non-deterministic
       /________________________\
      /  Integration Tests       \   20-30% — Skill chains, data flow
     / (mocked LLM, real tools)   \  Medium (1-10s), mostly deterministic
    /______________________________\
   /  Unit Tests                    \  60-70% — Individual skills, isolated
  / (mocked everything)              \ Fast (<100ms), fully deterministic
 /____________________________________\
```

## Why It Matters

### Fast Feedback Loops

A full agent evaluation takes 30–120 seconds and costs real API tokens. A unit test takes under 100 milliseconds and costs nothing. When modifying a skill, you want to know within seconds whether basic functionality still works. Unit tests provide that speed.

### Isolating Failures

When an end-to-end agent test fails, the cause could be in any skill, in the LLM's reasoning, in the skill chain logic, or in the environment. When a unit test fails, you know exactly which skill broke and exactly which input triggered the failure. This isolation makes debugging 5–10x faster.

## Key Technical Details

- Aim for 60–70% of agent tests to be unit tests
- Each skill should have at minimum: 2 happy-path tests, 3 input validation tests, 3 error-handling tests, and 2 edge-case tests
- Mock at the HTTP/IO boundary, not at the skill function level — test as much real code as possible
- Unit tests should run in under 100ms each; a full unit test suite in under 10 seconds
- Use `pytest.mark.asyncio` for async skill functions (most agent skills are async)
- Test output serialization explicitly — the LLM sees the serialized form, not the Python object
- Use `pytest --cov` to track coverage; aim for 80%+ line coverage on skill modules

## Common Misconceptions

**"You cannot unit test AI agent components because they are non-deterministic"**: Individual skills are almost entirely deterministic — they are regular functions that call APIs and process results. The non-determinism in agents comes from the LLM's planning and reasoning, which is tested at the integration and E2E layers. The skills themselves are perfectly unit-testable with standard techniques.

**"Mocking external APIs makes tests unrealistic"**: Mocks test your code's behavior, not the external API's behavior. You test "does my code correctly handle a 429 response?" — the mock guarantees you see a 429. You separately verify API compatibility through contract tests or integration tests. Both test types are necessary; neither replaces the other.

## Connections to Other Concepts

- `integration-testing-skill-chains.md` — The next layer up: testing skills working together
- `evaluation-with-test-suites.md` — The top layer: evaluating the full agent on realistic tasks
- `regression-testing-for-agents.md` — Ensuring unit tests are part of CI/CD pipelines
- `error-categories-in-agent-systems.md` — Error types that unit tests should cover
- `retry-strategies-and-backoff.md` — Testing retry behavior with controlled mock failures

## Further Reading

- Osherove, "The Art of Unit Testing" (2013) — Comprehensive guide to unit testing principles applicable to any domain
- Hillard, "Testing Python" (2020) — Python-specific testing practices including pytest patterns and mock strategies
- Fowler, "TestPyramid" (2012) — The original description of the testing pyramid concept
