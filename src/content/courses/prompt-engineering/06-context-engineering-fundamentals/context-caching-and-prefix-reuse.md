# Context Caching and Prefix Reuse

**One-Line Summary**: Context caching stores the computed key-value representations of stable prompt prefixes across requests, reducing latency by 30-50% and costs by up to 90% on cached tokens for applications with repetitive context structures.
**Prerequisites**: `what-is-context-engineering.md`, `context-budget-allocation.md`.

## What Is Context Caching and Prefix Reuse?

Think of a highway EZ-Pass toll system. Without EZ-Pass, every car stops at the toll booth, the driver finds their wallet, counts out exact change, and waits for the barrier to lift. With EZ-Pass, the common part of the transaction — identification and payment — is prepaid and cached in the transponder. The car breezes through at full speed, only "processing" the unique part (the specific toll location and time). The repetitive work is done once and reused every time.

Context caching works the same way for LLM inference. When you send a prompt to an LLM, the model processes every token through its transformer layers, computing key-value (KV) attention representations. This computation is the primary source of inference latency and cost. If your prompt has a stable prefix — a system prompt, tool definitions, or fixed instructions that are the same across many requests — caching those computed KV representations eliminates redundant processing.

Major providers now offer this optimization. Anthropic's prompt caching, OpenAI's cached responses, and Google's context caching all store KV computations for prompt prefixes. When a new request shares the same prefix as a previous one, the cached computation is reused, and only the new suffix (the user's query, latest conversation turns) needs fresh processing.

*Recommended visual: A side-by-side diagram showing two request flows: "Without caching" (full prompt processed through all transformer layers, high latency, full cost) versus "With caching" (stable prefix loaded from KV cache in milliseconds, only the variable suffix processed through transformer layers), with latency and cost annotations showing 30-50% latency reduction and up to 90% cost reduction on cached tokens.*
*Source: Adapted from Anthropic, "Prompt Caching" documentation (2024) and Pope et al., "Efficiently Scaling Transformer Inference" (2023)*

*Recommended visual: A prompt structure diagram showing the cache boundary line: everything above the line (system prompt, tool definitions, static examples) is labeled "Cached prefix -- stable across requests, 90% cost discount" in green, and everything below the line (recent conversation turns, current user query) is labeled "Variable suffix -- processed fresh each request, full cost" in orange, with an anti-pattern callout showing "Timestamp in system prompt = cache invalidated every request."*
*Source: Adapted from OpenAI, "Prompt Caching" (2024) and Google, "Context Caching" (2024)*

## How It Works

### How KV Caching Works Internally

When a transformer model processes a token, it generates key and value vectors that represent that token's contribution to the attention mechanism. For a 100K-token system prompt, the model must compute KV pairs for all 100K tokens before it can begin processing the user's query. This prefix processing is computationally expensive — it is where most of the input-side latency comes from.

KV caching stores these computed representations in memory (typically GPU memory). When a new request arrives with the same prefix, the stored KV pairs are loaded directly, skipping the computation entirely. Only the new suffix tokens (everything after the cached prefix) require fresh computation.

The key constraint is that caching is prefix-based: the cached portion must be an exact prefix of the new request. If even one token differs in the prefix, the cache is invalidated from that point forward. This means the stable portion of your prompt must come first, and the variable portion must come last.

### Provider Implementations

**Anthropic**: Supports explicit cache control with `cache_control` markers in the message structure. You designate which message blocks should be cached. Cached tokens are priced at 90% discount (write cost) and subsequent reads at 90% discount. Cache TTL is 5 minutes, extended with each cache hit.

**OpenAI**: Automatic caching for prompts longer than 1,024 tokens. No explicit API changes needed — the system automatically detects shared prefixes and caches them. Cached tokens are billed at 50% of normal input token pricing. Cache TTL varies.

**Google (Gemini)**: Explicit context caching API where you create a cached content resource with a specified TTL. Cached tokens receive significant per-token discounts. Supports longer TTLs (up to hours) for persistent use cases.

### Designing for Cache-Friendly Prompts

To maximize cache hits, structure your prompts with stable content first and variable content last:

```
[SYSTEM PROMPT - identical across all requests]     ← Cached
[TOOL DEFINITIONS - identical across all requests]  ← Cached
[STATIC EXAMPLES - identical across all requests]   ← Cached
[CACHED CONVERSATION HISTORY - changes infrequently] ← Partially cached
[RECENT CONVERSATION TURNS - changes every request] ← Not cached
[CURRENT USER QUERY - unique per request]            ← Not cached
```

The longer the stable prefix, the greater the cache benefit. A 50K-token system prompt + tool definitions that is identical across all requests means 50K tokens are cached and only the variable suffix is processed fresh.

**Anti-patterns to avoid**:
- Putting timestamps or request IDs in the system prompt (invalidates cache on every request).
- Randomizing example order (changes the prefix).
- Including user-specific data before the stable content (makes the prefix user-specific, reducing cache hit rates).

### Cache TTL Considerations

Cache entries expire after a time-to-live (TTL) period. Understanding TTL behavior is important for design:

- **Short TTLs (Anthropic: 5 minutes)**: Caches benefit consecutive requests from the same user session or high-traffic endpoints where many requests hit the same prefix within minutes. Low-traffic applications may see few cache hits.
- **Longer TTLs (Google: configurable hours)**: Better for applications with stable contexts used across many users over extended periods. Higher memory cost on the provider side.
- **Traffic-dependent effectiveness**: Caching benefits increase with request volume. An application serving 1 request per minute benefits less than one serving 100 requests per second, because the cache is more likely to be warm for high-traffic applications.

## Why It Matters

### Latency Reduction

Processing a 50K-token prefix takes significant time — potentially 5-15 seconds depending on the model and hardware. Caching eliminates this processing, reducing time-to-first-token by 30-50% for long prefixes. For interactive applications where perceived speed matters, this is transformative.

### Cost Reduction

Cached tokens are discounted 50-90% depending on the provider. For applications with large, stable system prompts — enterprise assistants with extensive tool definitions, RAG systems with static knowledge, agents with comprehensive instructions — caching reduces input token costs by 40-80% of the total bill.

### Enabling Richer System Prompts

Without caching, large system prompts carry a steep per-request cost. A 20K-token system prompt processed fresh on every request is expensive. With caching, that same 20K-token prompt is processed once and reused, making the amortized cost negligible. This removes the pressure to minimize system prompt length, enabling richer instructions, more examples, and comprehensive tool definitions.

## Key Technical Details

- **Anthropic's prompt caching provides up to 90% cost reduction** on cached tokens, with a 5-minute TTL extended by cache hits.
- **OpenAI's automatic caching activates for prompts over 1,024 tokens**, providing 50% cost reduction on cached tokens.
- **Caching is prefix-based**: any change in the prefix invalidates the cache from the point of change forward. Design for stable prefixes.
- **Latency reduction from caching is 30-50%** for typical long-prefix applications, with larger benefits for longer prefixes.
- **Cache warmup** (the first request that populates the cache) is slightly more expensive due to the write operation. Subsequent requests benefit from reads.
- **Cache hit rate** is the key metric: track (cached_token_reads / total_prefix_tokens) to measure effectiveness. Target >80% for high-traffic applications.
- **Minimum cacheable prefix length** varies by provider — Anthropic requires at least 1,024 tokens (Claude Haiku) or 2,048 tokens (larger Claude models) for caching to activate.
- **Multi-turn conversations** benefit from caching when the system prompt + early conversation history is stable and only recent turns change.

## Common Misconceptions

- **"Caching requires code changes."** OpenAI's caching is automatic — no code changes needed. Anthropic and Google require explicit cache control, but the implementation is minimal (adding cache markers to existing message structures).
- **"Caching helps all applications equally."** Applications with long, stable prefixes and high request volumes benefit most. Short-prompt, low-traffic applications see minimal benefit because caches expire before they are reused.
- **"I should cache as much as possible."** Only cache content that is genuinely stable across requests. Caching content that changes frequently (like conversation history) causes constant cache invalidation, which is wasteful.
- **"Caching affects output quality."** Caching is mathematically equivalent to recomputation — the KV pairs are identical whether computed fresh or loaded from cache. Output quality is unchanged.
- **"Cache TTL is too short to be useful."** For applications with consistent traffic (multiple requests per minute), a 5-minute TTL is sufficient. Each cache hit extends the TTL, so active conversations maintain warm caches indefinitely.

## Connections to Other Concepts

- `what-is-context-engineering.md` — Caching is an optimization layer within the context engineering discipline.
- `context-budget-allocation.md` — Stable system prompt zones are the primary candidates for caching, motivating their placement at the beginning of the context.
- `context-assembly-patterns.md` — Assembly patterns that maintain stable prefixes enable caching; patterns that vary the prefix disable it.
- `long-context-design-patterns.md` — Long contexts benefit most from caching because prefix processing is the dominant latency contributor.
- `context-compression-techniques.md` — Compression reduces the variable suffix, increasing the proportion of context that is cacheable.

## Further Reading

- Anthropic, "Prompt Caching" documentation (2024) — Official documentation for Anthropic's explicit cache control mechanism and pricing.
- OpenAI, "Prompt Caching" documentation (2024) — Guide to OpenAI's automatic prefix caching system.
- Google, "Context Caching" documentation (2024) — Google's context caching API with configurable TTLs for Gemini models.
- Pope et al., "Efficiently Scaling Transformer Inference" (2023) — Technical foundations of KV caching optimizations for transformer inference at scale.
