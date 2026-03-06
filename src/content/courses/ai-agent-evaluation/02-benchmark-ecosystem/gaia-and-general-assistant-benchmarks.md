# GAIA and General Assistant Benchmarks

**One-Line Summary**: GAIA evaluates AI assistants on real-world questions that require combining tool use, multi-step reasoning, and web browsing -- capabilities that pure language models cannot achieve alone.

**Prerequisites**: `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`, `../01-foundations-of-agent-evaluation/evaluation-dimensions-taxonomy.md`

## What Is GAIA?

Imagine a trivia contest where every question requires not just knowledge but active research: looking up current data, performing calculations, cross-referencing multiple sources, and synthesizing a precise answer. That is GAIA -- a benchmark designed to test whether AI systems can act as genuinely useful general assistants.

GAIA (General AI Assistants), introduced by Mialon et al. at Meta in 2023, contains 466 questions that are deliberately simple for humans (with access to a web browser and basic tools) but extremely challenging for AI systems. A human with a search engine can answer most GAIA questions in a few minutes, yet the best AI agents achieve only about 75% overall accuracy -- and on the hardest questions, barely 61%. This gap between human and AI performance is precisely the point: GAIA was designed to measure tool-augmented reasoning, not raw knowledge.

What makes GAIA distinctive is its evaluation clarity. Unlike open-ended benchmarks where scoring requires judgment, every GAIA answer is a short, unambiguous factual response -- a number, a name, a date -- that can be checked with exact string matching. This eliminates evaluator subjectivity entirely.

## How It Works

### Difficulty Levels

GAIA organizes its 466 questions into three difficulty tiers:

**Level 1 (simple lookup, ~165 questions)**: Requires 1-2 steps, typically a single tool use. Example: "What was the closing price of AAPL on March 15, 2023?" An agent needs to query a financial data source and extract the answer.

**Level 2 (multi-step reasoning, ~187 questions)**: Requires 3-5 steps, combining multiple information sources. Example: "What is the total population of all countries that border the country where the 2024 Nobel Peace Prize winner was born?" This requires identifying the laureate, finding their birth country, listing bordering nations, and summing populations.

**Level 3 (complex planning, ~114 questions)**: Requires 6+ steps, multiple tools, and sophisticated planning. Example: questions that require downloading a file, parsing its contents, performing calculations on the data, cross-referencing results with web information, and synthesizing a final answer.

### Required Capabilities

GAIA questions are designed to require combinations of:

- **Web browsing**: Searching for and extracting information from websites
- **File handling**: Reading PDFs, spreadsheets, images, and audio files
- **Computation**: Performing arithmetic, unit conversions, date calculations
- **Multi-source synthesis**: Combining information from 2-5+ different sources
- **Logical reasoning**: Following chains of inference across retrieved facts

### Evaluation Protocol

The evaluation is refreshingly simple: exact-match on the final answer. Each question has a single canonical answer (or a small set of acceptable variants). The agent's response is normalized (lowercased, whitespace-trimmed, number-formatted) and compared against the gold answer. No partial credit, no LLM-based judging -- just string matching.

### Current Performance (Early 2026)

| Level | Top Agent Score | Human Baseline |
|-------|----------------|----------------|
| Level 1 | ~93% | ~96% |
| Level 2 | ~72% | ~90% |
| Level 3 | ~61% | ~88% |
| Overall | ~75% | ~92% |

The persistent 17-point gap between the best agents and human performance on overall score -- and the 27-point gap on Level 3 -- indicates that complex, multi-step tool-augmented reasoning remains a genuine frontier challenge.

## Why It Matters

1. **Tests the full agent stack**: GAIA requires perception (reading files), action (web browsing), reasoning (multi-step inference), and synthesis (combining results) -- the complete loop an assistant must execute.
2. **Objective evaluation**: Exact-match scoring eliminates the noise and bias of LLM-as-judge evaluation, making GAIA scores directly comparable across systems.
3. **Calibrated difficulty**: The three-level structure provides signal at different capability thresholds, remaining useful even as agents improve.
4. **Human-grounded**: Because humans find these questions straightforward, the benchmark has an intuitive interpretation: "What percentage of easy-for-humans tasks can this agent handle?"
5. **Tool-use discriminator**: Raw LLMs score near zero on GAIA because the questions require accessing external information. This isolates the evaluation to agent systems with tool-use capabilities.

## Key Technical Details

- 466 total questions: 165 Level 1, 187 Level 2, 114 Level 3
- Average human completion time: 3 minutes (Level 1), 8 minutes (Level 2), 17 minutes (Level 3)
- Questions span domains: science, geography, history, finance, entertainment, sports, technology
- Approximately 40% of questions require web search, 25% require file processing, 35% require both
- Attached files include PDFs, Excel spreadsheets, Python scripts, images, and audio recordings
- The test set (300 questions) is held out; only the validation set (166 questions) is publicly available
- Leading approaches use ReAct-style architectures with code execution sandboxes and web browsing tools
- Cost per full GAIA evaluation run: approximately $15-40 depending on the agent architecture

## Common Misconceptions

**"GAIA tests general intelligence."** GAIA tests a specific and narrow capability profile: tool-augmented factual research. It does not evaluate creativity, social reasoning, long-term planning, or many other aspects of general intelligence. The name is aspirational, not descriptive.

**"A 75% GAIA score means the agent handles 75% of real assistant tasks."** GAIA questions are well-defined with unambiguous answers. Real assistant requests are often vague, require clarification, or have no single correct response. GAIA performance is a necessary but not sufficient condition for real-world assistant quality.

**"Level 3 questions are just harder versions of Level 1."** Level 3 questions are qualitatively different: they require the agent to formulate a multi-step plan, manage intermediate state across many tool calls, and recover from dead ends. The cognitive demands are categorically distinct from simple lookup.

**"Exact-match evaluation is too strict."** For GAIA's factual questions, this strictness is a feature. Answers like "42" or "Marie Curie" are either right or wrong. The rare edge cases (equivalent phrasings, rounding differences) are handled by the normalization step and accept lists.

## Connections to Other Concepts

- `tool-use-benchmarks.md` covers benchmarks that focus specifically on the tool-use capabilities GAIA requires
- `swe-bench-deep-dive.md` provides a contrasting approach: domain-specific (coding) versus GAIA's domain-general design
- `benchmark-design-methodology.md` discusses the design principle of human-calibrated difficulty that GAIA exemplifies
- `real-world-vs-synthetic-benchmarks.md` positions GAIA on the spectrum between curated real-world and synthetic tasks
- `../01-foundations-of-agent-evaluation/evaluation-dimensions-taxonomy.md` maps GAIA's evaluation to the broader taxonomy of what to measure
- `../03-automated-evaluation-methods/reference-free-evaluation.md` contrasts with GAIA's reference-dependent exact-match approach

## Further Reading

- "GAIA: A Benchmark for General AI Assistants" -- Mialon et al., 2023
- "Hugging Face Open LLM Leaderboard: GAIA Track" -- Hugging Face, 2024
- "AssistantBench: Can Web Agents Solve Realistic and Time-Consuming Tasks?" -- Yoran et al., 2024
- "Tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains" -- Yao et al., 2024
