# Cost Optimization

**One-Line Summary**: Agent cost optimization reduces operating expenses through model routing, caching, prompt compression, batching, and token budgets -- turning agents from expensive experiments into economically viable products.

**Prerequisites**: Context window management, agent orchestration, tool use and function calling

## What Is Cost Optimization?

Running an agent is like running a taxi service where the meter ticks for every second of thinking, every mile of tool calls, and every passenger interaction. A single agent task might require 10-50 LLM calls, each consuming thousands of tokens at $3-15 per million tokens. A research agent that reads 20 articles, makes 30 search queries, and synthesizes a report can easily cost $2-5 per run. At 1,000 runs per day, that is $2,000-5,000 daily -- $60,000-150,000 monthly. Cost optimization is the discipline of maintaining agent quality while reducing these costs by 5-20x.

The fundamental tension in agent cost optimization is quality versus cost. The most capable models (Claude Opus, GPT-4o) produce the best results but cost 10-30x more per token than smaller models (Claude Haiku, GPT-4o-mini). Longer, more detailed prompts improve output quality but consume more tokens. More tool calls provide better information but each call costs money and time. The art is finding the minimum viable intelligence for each step -- using expensive models only when the task demands it, compressing prompts without losing critical information, and caching results to avoid redundant work.

*Recommended visual: Cost breakdown pie chart showing typical agent cost composition — LLM inference (60-90%), tool/API calls, retrieval/embedding, infrastructure — with optimization levers annotated at each segment — see [Chen et al., 2023 — FrugalGPT](https://arxiv.org/abs/2305.05176)*

Cost optimization is not a one-time exercise. It requires ongoing measurement, experimentation, and adjustment. What seems like a minor change (adding a few sentences to a system prompt) can increase costs by 20% when multiplied across millions of calls. Conversely, a simple caching strategy can cut costs in half overnight. The teams that succeed at cost optimization instrument everything, measure continuously, and treat cost as a first-class metric alongside quality and latency.

## How It Works

### Model Routing
Model routing assigns each agent step to the cheapest model capable of handling it. A classification step (is this a billing question or a technical question?) does not need GPT-4o -- GPT-4o-mini or Claude Haiku handles it at 1/20th the cost with comparable accuracy. A complex reasoning step (analyze this legal contract) needs the full capability of a frontier model. Implementation: define a routing function that inspects the step type, complexity, and stakes, then selects the model. Common pattern: use a small model for tool argument generation, a medium model for standard reasoning, and a large model for synthesis and final output. Anthropic's model lineup (Haiku at $0.25/M input, Sonnet at $3/M input, Opus at $15/M input) provides a natural routing hierarchy.

### Caching
Agents frequently perform redundant work. If 100 users ask about the same product, the agent should not search the product database 100 times. Caching operates at multiple levels: **API response caching** stores tool outputs keyed by tool name and arguments (TTL: 5-60 minutes depending on data freshness requirements). **Prompt caching** (offered by Claude and GPT APIs) caches the processed representation of prompt prefixes, reducing cost by 90% for repeated prompts with shared prefixes. **Semantic caching** stores LLM responses keyed by embedding similarity of the input -- if a new query is semantically similar to a cached one, return the cached response. **Memoization** caches pure function results (e.g., text extraction from a PDF that never changes).

*Recommended visual: Model routing diagram showing a classifier directing queries to Haiku ($0.25/M), Sonnet ($3/M), or Opus ($15/M) based on task complexity, with cost savings at each tier — see [Anthropic Pricing Documentation](https://docs.anthropic.com/en/docs/about-claude/models)*

### Prompt Compression
Every token in the prompt costs money. Prompt compression reduces token count without sacrificing the information the model needs. Techniques: **Remove redundant instructions** that the model already follows from training. **Use structured formats** (JSON, key-value pairs) instead of verbose natural language for factual context. **Summarize tool outputs** before including them in context -- a 5,000-token API response might contain only 200 tokens of relevant information. **Abbreviate system prompts** after establishing that shorter versions maintain output quality. **LLMLingua and similar tools** use a small model to score token importance and remove low-importance tokens, achieving 2-5x compression with minimal quality loss.

### Batching and Parallelism
When an agent needs to process multiple items (classify 50 emails, extract data from 20 documents), batching is cheaper and faster than sequential processing. OpenAI's Batch API offers 50% cost reduction for non-time-sensitive tasks by processing requests in bulk. Even without provider-level batching, application-level parallelism reduces wall-clock time: dispatch 10 LLM calls simultaneously rather than sequentially, keeping total tokens (and cost) the same but completing 10x faster. Batching also applies to tool calls: fetch 5 web pages simultaneously rather than one at a time.

## Why It Matters

### Economic Viability
Many agent applications are not viable at full price. A customer support agent that costs $3 per interaction cannot compete with a human agent at $5 per interaction when the AI agent only handles 60% of cases successfully. But at $0.30 per interaction (after 10x cost optimization), the economics become compelling. Cost optimization is often the difference between a research prototype and a viable product.

### Scaling Without Bankruptcy
Agent costs scale linearly with usage by default. Double the users, double the cost. Cost optimization creates sublinear scaling: caching means the 1,000th user asking the same question is nearly free. Model routing means 80% of interactions use the cheapest model. Prompt compression means each call uses 3x fewer tokens. These optimizations compound: 3x from caching * 3x from routing * 2x from compression = 18x cost reduction.

### Enabling Complex Agent Tasks
Without cost optimization, developers avoid complex agent architectures (multi-step research, iterative refinement, multi-agent debate) because each additional step adds cost. With optimization, you can afford to let agents iterate, explore, and refine because the per-step cost is manageable. This unlocks higher-quality agent behavior that would be economically impossible at full price.

## Key Technical Details

- **Token budgets** set a maximum token spend per task. The agent tracks cumulative token usage and switches to cheaper strategies (shorter prompts, smaller models, cached results) as it approaches the budget limit.
- **Prompt caching** in Claude's API caches prefix processing: if the first 3,000 tokens of your prompt are identical across calls, they are processed once and cached, reducing input cost by 90% for the cached portion.
- **The Batch API** from OpenAI processes requests at 50% discount with a 24-hour completion window, ideal for non-real-time agent tasks like nightly report generation or batch data processing.
- **Semantic caching** with embedding similarity thresholds (cosine similarity > 0.95) must be validated against your use case -- false cache hits return stale or incorrect results.
- **Model routing accuracy** should be measured: if the router sends 5% of hard tasks to the cheap model, the resulting quality degradation may outweigh the cost savings.
- **Cost dashboards** should track cost per task, cost per step type, cost per model, and cost trends over time. Alert when daily costs exceed 120% of the trailing 7-day average.
- **Streaming** does not reduce token cost (you pay for the same tokens) but reduces time-to-first-token, improving perceived latency without cost impact.
- **Fine-tuned small models** can replace large models for specific, high-volume steps. A fine-tuned GPT-4o-mini for intent classification can match GPT-4o quality at 1/20th the cost.

## Common Misconceptions

- **"Use the cheapest model for everything."** Cheap models fail on complex tasks, causing retries, incorrect results, and user dissatisfaction. The cost of a failed task (wasted tokens + retry cost + user churn) often exceeds the savings from using a cheaper model.
- **"Caching is always safe."** Caching stale data can cause agents to act on outdated information. Cache TTLs must match data freshness requirements. Financial data might need 1-minute TTLs while product descriptions can be cached for hours.
- **"Prompt compression always saves money."** If compression requires an additional LLM call (e.g., using a model to summarize context), the compression cost might exceed the savings, especially for short prompts. Compression pays off for long, frequently-reused prompts.
- **"Cost optimization is a one-time effort."** Model pricing changes (GPT-4o dropped 50% in price in 2024), new caching features launch, usage patterns shift. Cost optimization requires ongoing monitoring and adjustment.
- **"Shorter prompts always cost less overall."** A prompt that is too short may cause the model to produce lower-quality output, requiring retries or human correction. Total cost = prompt cost + retry cost + correction cost.

## Connections to Other Concepts

- `context-window-management.md` -- Context management directly reduces token usage per call, one of the most effective cost optimization techniques
- `agent-orchestration.md` -- The orchestrator implements model routing by selecting different models for different steps in the execution graph
- `error-handling-and-retries.md` -- Retries consume additional tokens; effective error handling reduces the number of retries needed, directly lowering costs
- `logging-tracing-and-debugging.md` -- Cost attribution in traces reveals which steps and models consume the most tokens, guiding optimization priorities
- `agent-deployment.md` -- Deployment configurations include model routing tables, cache policies, and token budgets as cost-critical settings

## Further Reading

- **"Reducing Costs of LLM Applications" (Anthropic Documentation, 2024)** -- Practical guide to prompt caching, model selection, and token optimization for Claude-based applications
- **"The Hidden Costs of LLM Applications" (a16z, 2024)** -- Analysis of real-world LLM application costs with breakdowns by component and optimization strategies
- **Jiang et al., "LLMLingua: Compressing Prompts for Accelerated Inference of Large Language Models" (2023)** -- Technique for 2-5x prompt compression with minimal quality loss using token importance scoring
- **"Model Routing for AI Applications" (Martian, 2024)** -- Architecture patterns for routing requests to different models based on task complexity, with benchmarks on quality-cost tradeoffs
- **Chen et al., "FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance" (2023)** -- Framework combining model cascading, caching, and query optimization to reduce LLM costs by up to 98% with minimal quality loss
