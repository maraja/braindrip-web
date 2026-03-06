# The o-Series Evolution: o1 to o4-mini (and Beyond)

**One-Line Summary**: OpenAI's o-series evolved from o1's proof-of-concept in reasoning through o3 and o4-mini, achieving dramatic improvements in capability and cost efficiency across five models in eight months, before its reasoning advances were fully absorbed into the GPT-5 line.

**Prerequisites**: `01-openai-o1.md`

## What Is the o-Series Evolution?

Think of the o-series as the rapid iteration phase after a breakthrough invention. The Wright brothers' first flight at Kitty Hawk proved powered flight was possible; what followed was a rush of refinements that made aircraft faster, more reliable, and eventually practical. o1 proved that trained reasoning worked. The subsequent o-series models refined the approach at a pace that surprised even the AI research community: five distinct models in eight months, each pushing the frontier of what reasoning models could do while simultaneously driving costs down by orders of magnitude.

The o-series also forced a naming rethink at OpenAI. Rather than continuing the GPT numbering (GPT-5 would arrive separately), the "o" prefix designated a new family optimized for deliberate reasoning, signaling that these models operated fundamentally differently from their GPT predecessors. Where GPT models prioritized fast, fluent generation, o-series models prioritized accuracy on hard problems, trading latency for correctness.

The evolution was not just about making models smarter. It was about making reasoning economically viable. o1's $60 per million output tokens was prohibitive for most applications. By April 2025, o4-mini achieved better reasoning at $4.40 per million output tokens, a 93% reduction that brought frontier reasoning within reach of mainstream applications.

## How It Works

**The o-series evolution -- capability up, cost down:**

```
                          Capability ──────────────▶
                    │
  o1-preview        │  ┌────────────┐
  (Sep 2024)        │  │ Text only  │  $15/$60 per M tokens
                    │  │ No tools   │  Limited, research preview
                    │  └────────────┘
                    │
  o1 Full           │  ┌──────────────────┐
  (Dec 2024)        │  │ +Vision +Tools   │  $15/$60 per M tokens
                    │  │ +Structured Out  │  Production ready
                    │  └──────────────────┘
                    │
  o3-mini           │  ┌────────────────────────┐
  (Jan 2025)        │  │ Reasoning effort:      │  $1.10/$4.40 per M tokens
                    │  │ Low | Medium | High    │  93% cheaper than o1!
                    │  └────────────────────────┘
                    │
  o3               │  ┌──────────────────────────────┐
  (Apr 2025)        │  │ 2530 Codeforces Elo         │  Major capability leap
                    │  │ ~70% SWE-bench              │  Interleaved tool use
                    │  │ 88.9% GPQA Diamond          │
                    │  └──────────────────────────────┘
                    │
  o4-mini           │  ┌────────────────────────────────────┐
  (Apr 2025)        │  │ 93.4% AIME | 93.4% GPQA Diamond  │  $1.10/$4.40
                    │  │ Rivals o3 at fraction of cost     │  Best value
                    │  └────────────────────────────────────┘
                    ▼
               Cost per M output tokens: $60 ──▶ $4.40 (93% reduction in 6 months)
```

### o1-preview to o1 Full (September-December 2024)

o1-preview, released September 12, 2024, was deliberately limited: no image input, no tool use, no structured outputs, no streaming. It was a research preview that demonstrated reasoning capability while OpenAI worked on productizing the technology. The model showed extraordinary performance on hard benchmarks but was impractical for production use due to its limitations.

The full o1, released December 5, 2024, filled these gaps with vision support, function calling, structured JSON output, developer messages for system-level instructions, and streaming of the final response. This made o1 practical for real applications rather than just benchmark demonstrations. Performance also improved: o1 scored 83.3% on SWE-bench Verified compared to o1-preview's lower scores, and tool use integration meant o1 could write and execute code as part of its reasoning process.

The full o1 also introduced refined reasoning controls. Developers could set a max_completion_tokens parameter that governed the total budget (thinking plus response), giving applications control over cost and latency. This was an early version of the "thinking budget" concept that would become central to hybrid models.

### o3-mini: Efficient Reasoning (January 2025)

o3-mini, released January 31, 2025, was a pivotal moment in the o-series evolution. It demonstrated that reasoning capabilities could be compressed into a smaller, faster model without catastrophic quality loss. Most significantly, it introduced configurable "reasoning effort" levels: low, medium, and high. This gave developers explicit control over the depth-cost tradeoff.

At high effort, o3-mini matched or exceeded the full o1 on coding and math tasks while costing roughly one-sixth as much ($1.10 input, $4.40 output per million tokens). At medium effort, it provided strong reasoning at even lower latency. At low effort, it delivered rapid responses suitable for simpler analytical tasks. This three-tier system made reasoning economically viable for production workloads where not every query required deep thinking.

o3-mini also demonstrated strong performance on the AIME 2025 math competition, scoring 87.3% at high effort. On SWE-bench Verified, it achieved competitive results with the full o1 despite being a much smaller model. The message was clear: reasoning capability was not solely a function of model size.

### o3: The Capability Leap (April 2025)

o3, released April 16, 2025, represented the largest single capability jump in the series. It achieved a 2530 Elo rating on Codeforces, placing it at the expert competitive programming level. On SWE-bench Verified, it scored approximately 70%, meaning it could resolve seven out of ten real-world GitHub issues autonomously. GPQA Diamond performance reached 88.9%, approaching human expert levels on PhD-level science questions.

o3 also introduced improved "deliberative alignment," where the model explicitly reasons about OpenAI's model spec safety guidelines during its chain-of-thought. Internal evaluations showed that this deliberative approach significantly reduced the model's tendency to comply with harmful requests compared to instinct-based safety training alone.

Tool use became deeply integrated in o3. Rather than treating tool calls as discrete steps between reasoning, o3 could interleave code execution, web browsing, and API calls within its reasoning flow. It might reason about a problem, write and execute code to test a hypothesis, analyze the output, and continue reasoning, all within a single response. This made o3 the first reasoning model that could genuinely "do work" rather than just "think about work."

### o4-mini: Compact Frontier Reasoning (April 2025)

Released alongside o3 on April 16, 2025, o4-mini was a compact reasoning model that achieved remarkable efficiency. It scored 93.4% on AIME 2025 and 93.4% on GPQA Diamond, rivaling or exceeding the full o3 on several benchmarks. At $1.10 per million input tokens and $4.40 per million output tokens, it represented a 55x cost reduction from the original o1 while delivering superior performance on many reasoning tasks.

o4-mini also introduced native tool use capabilities including code execution, web search, file upload analysis, and image generation within reasoning chains. It supported the same reasoning effort levels as o3-mini (low, medium, high), giving developers fine-grained control over the cost-quality tradeoff.

The model's strong performance on coding tasks made it particularly popular for software engineering applications. Developers reported that o4-mini with high reasoning effort could handle complex debugging, architecture decisions, and code generation tasks that previously required the much more expensive o3.

### o3-pro: Maximum Reliability (June 2025)

o3-pro was a variant of o3 designed to think longer and provide the most reliable, thoroughly reasoned responses. Available as an option in ChatGPT for Pro subscribers, o3-pro allocated significantly more inference compute per query than standard o3, targeting use cases where accuracy was paramount and latency was acceptable. It represented the ceiling of what the o-series reasoning approach could achieve: maximum thinking depth at maximum cost.

o3-pro occupied a specific niche: professionals who needed the highest possible confidence in the model's output for high-stakes decisions, complex analysis, or difficult technical problems. It was not designed for everyday use but for the hardest questions where extra thinking time genuinely improved outcomes.

### Absorption into GPT-5: The End of the Separate o-Series (August-December 2025)

The o-series ultimately proved to be a transitional product line. On August 7, 2025, OpenAI released GPT-5, which unified the GPT and o-series lines into a single model. GPT-5 became the default model in ChatGPT, incorporating the reasoning capabilities pioneered by the o-series directly into the GPT architecture. Users no longer needed to choose between a "fast" GPT model and a "deep reasoning" o-model; GPT-5 could do both, dynamically allocating reasoning compute based on task demands.

This convergence accelerated with GPT-5.2, released December 11, 2025, which shipped in three variants: Instant (fast, direct responses), Thinking (extended reasoning for harder problems), and Pro (maximum reasoning depth). GPT-5.2 Pro scored 93.2% on GPQA Diamond, 100% on AIME 2025, and became the first model to score above 90% on ARC-AGI-1, a benchmark designed to test general fluid intelligence. These results surpassed the best o-series models, confirming that the reasoning capabilities had been successfully integrated and improved within the unified GPT line.

The o-series reasoning paradigm did not disappear; it was absorbed. The techniques for chain-of-thought training, reasoning effort control, and deliberative alignment developed across o1 through o4-mini became standard components of GPT-5 and GPT-5.2. The separate "o" product line was no longer necessary because every frontier GPT model now included reasoning as a core capability rather than an optional add-on.

## Why It Matters

The o-series evolution demonstrated that the reasoning paradigm was not a one-off curiosity but a genuine new scaling axis with rapid improvement potential. Each generation improved along multiple dimensions simultaneously: better reasoning, lower cost, faster inference, and broader tool integration. The speed of iteration, five models in eight months, suggested that OpenAI had found a rich vein of improvements.

The pricing trajectory was especially significant. From $60 per million output tokens (o1) to $4.40 (o4-mini), the cost of frontier reasoning dropped by over 90% in six months. This mirrored the early GPU computing cost curves and suggested that reasoning capabilities would rapidly commoditize, becoming accessible to individual developers and small companies rather than only well-funded enterprises.

The o-series also established reasoning models as a distinct product category. Where GPT-4 and its variants competed on general capability, the o-series competed on reasoning depth and accuracy. This created a two-axis product strategy for OpenAI: GPT for breadth and speed, o-series for depth and accuracy.

The rapid iteration pace also revealed how much headroom existed in the reasoning paradigm. Each generation found new efficiencies in how reasoning compute was used, new ways to train more effective reasoning policies, and new integrations (tool use, vision) that expanded what reasoning could accomplish. The pace of improvement suggested the reasoning paradigm was still in its early, rapid-growth phase rather than approaching saturation.

For the broader market, the o-series normalized the idea that users should expect to pay more for harder questions. Just as cloud computing charges more for GPU instances than CPU instances, AI services began pricing based on the computational intensity of the response. This created new business model possibilities for AI applications serving complex professional domains.

Perhaps the most telling outcome of the o-series was its eventual absorption into GPT-5 and GPT-5.2. The o-series was not a dead end but a proving ground. It demonstrated that reasoning capabilities were too valuable to remain in a separate product line and too fundamental to be optional. By late 2025, the techniques pioneered in the o-series, chain-of-thought reasoning, configurable thinking depth, deliberative alignment, had become standard features of the unified GPT line. The o-series accomplished its mission by making itself unnecessary as a separate product.

## Key Technical Details

- o1-preview (Sep 12, 2024): text-only, no tools, no streaming; $15/$60 per million tokens
- o1 full (Dec 5, 2024): vision, tool use, structured outputs, streaming; $15/$60 per million tokens
- o3-mini (Jan 31, 2025): reasoning effort levels (low/medium/high); $1.10/$4.40 per million tokens
- o3 (Apr 16, 2025): 2530 Codeforces Elo, ~70% SWE-bench, 88.9% GPQA Diamond
- o4-mini (Apr 16, 2025): 93.4% AIME 2025, 93.4% GPQA Diamond; $1.10/$4.40 per million tokens
- Cost reduction timeline: 93% cheaper (o1 to o4-mini output tokens) in 6 months
- Tool integration: code execution, web browsing, file analysis, image generation
- Deliberative alignment: explicit safety policy reasoning during chain-of-thought
- Naming note: "o2" was skipped to avoid conflict with British telecom company O2
- Context windows: up to 200K tokens input across o3 and o4-mini
- All models use hidden chain-of-thought with optional summaries for users
- o3-mini reasoning effort levels: low, medium, high (configurable per request)
- o3 SWE-bench: ~70% (resolved 7 of 10 real-world GitHub issues)
- Total models in series: 5 distinct releases in 8 months (o1-preview through o4-mini)
- o4-mini tool support: code execution, web search, file upload, image generation
- o3-pro (Jun 2025): extended-thinking variant of o3 for maximum reliability, ChatGPT Pro option
- GPT-5 (Aug 7, 2025): unified GPT and o-series lines, became default in ChatGPT
- GPT-5.2 (Dec 11, 2025): three variants (Instant, Thinking, Pro); absorbed o-series reasoning fully
- GPT-5.2 Pro benchmarks: 93.2% GPQA Diamond, 100% AIME 2025, first model above 90% ARC-AGI-1
- o-series legacy: reasoning techniques integrated into GPT-5/5.2 rather than continuing as separate line

## Common Misconceptions

- **"Each o-series model is just a bigger version of the previous one."** The models vary significantly in architecture and size. o3-mini and o4-mini are deliberately smaller and cheaper while often matching or exceeding their larger counterparts. The improvements came from better training recipes, more efficient reasoning policies, and improved reward models, not just more parameters.

- **"The o-series made GPT-4o obsolete."** GPT-4o remains better suited for tasks that need fast, low-cost responses without deep reasoning. The o-series adds latency (seconds to minutes) and cost for its reasoning capabilities. For simple questions, chat, creative writing, or real-time applications, GPT-4o is often the better choice. OpenAI explicitly positioned the two families as complementary.

- **"o3 skipped o2 for technical reasons."** OpenAI skipped the "o2" name reportedly to avoid trademark conflict with the British telecom company O2. It was a naming decision, not a technical one. There was no "o2" model that was developed and scrapped.

- **"Reasoning effort levels just limit the number of thinking tokens."** While effort levels do affect the length of reasoning chains, they also influence the reasoning strategy itself. At low effort, the model uses more direct, heuristic-based reasoning. At high effort, it employs more systematic exploration, verification, and backtracking. The quality of reasoning changes, not just its quantity.

## Connections to Other Concepts

The o-series built on the foundation established in `01-openai-o1.md` and competed directly with `03-deepseek-r1.md`, which matched o1 at a fraction of the cost. The theoretical underpinning of why inference scaling works is covered in `04-test-time-compute-scaling.md`. Hybrid models that blend reasoning on demand, like Claude 3.7, are discussed in `06-hybrid-thinking-models.md`. The eventual GPT-5 release, which integrated reasoning capabilities into the GPT line, is covered in `02-gpt-5.md`. The broader paradigm shift in how reasoning is trained is chronicled in `05-the-reasoning-paradigm-shift.md`.

## Further Reading

- OpenAI, "OpenAI o3-mini" (2025) — announcement of the cost-efficient reasoning model with effort levels.
- OpenAI, "Introducing OpenAI o3 and o4-mini" (2025) — launch announcement with benchmark details.
- OpenAI, "OpenAI o1 System Card" (2024) — safety evaluation framework used across the series.
- OpenAI, "Deliberative Alignment" (2024) — the safety reasoning approach refined across the o-series.
- Nakano et al., "WebGPT: Browser-Assisted Question-Answering with Human Feedback" (2022) — early work on tool-integrated reasoning that presaged o3's capabilities.
- Snell et al., "Scaling LLM Test-Time Compute Optimally Can be More Effective than Scaling Model Parameters" (2024) — theoretical framework for the inference scaling that the o-series commercialized.
