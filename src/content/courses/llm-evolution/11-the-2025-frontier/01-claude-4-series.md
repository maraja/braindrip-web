# Claude 4 Series

**One-Line Summary**: Anthropic's Claude 4 series (2025-2026) pushed the frontier of coding, agentic capability, and alignment -- from Opus 4's autonomous task dominance through Sonnet 4.5's 30-hour sustained focus and Opus 4.5's benchmark-leading efficiency, to the 4.6 generation's agent teams, with Opus 4.6 Thinking reaching #1 on LMArena at 1506 Elo.

**Prerequisites**: `04-claude-3-5-sonnet.md`, `01-instructgpt-and-rlhf.md`, `06-agent-native-models.md`

## What Is the Claude 4 Series?

Imagine a highly capable colleague who not only gives excellent advice but can actually sit down at your computer and do the work -- writing code, navigating applications, testing solutions, and coordinating with other specialists when a task requires multiple skill sets. Now imagine that colleague is also deeply principled, explaining their reasoning transparently and declining to take actions they consider harmful, not because of rigid rules but because they've internalized why those actions are wrong. That's the ambition of the Claude 4 series: intelligence that doesn't just answer questions but acts reliably, reasons transparently, and aligns with human values through understanding rather than constraint.

Anthropic's trajectory from Claude 3 to Claude 4 reflects a philosophical evolution as much as a technical one. Claude 3 (March 2024) established the Haiku/Sonnet/Opus tiering and demonstrated that safety and capability weren't zero-sum. But the 2025 generations dramatically raised the bar on what "capable" meant. The focus shifted from models that converse well to models that work well -- that can autonomously complete complex multi-step tasks, operate computer interfaces, collaborate in teams, and sustain coherent reasoning over enormous context windows.

The Claude 4 series also represents Anthropic's deepening commitment to alignment research as a core product differentiator. While competitors raced to add features and scale parameters, Anthropic invested heavily in making Claude's behavior more predictable, more transparent, and more robustly aligned -- culminating in the January 2026 updated constitution that emphasized reason-based alignment over rule-based constraints.

**Claude 4 Series Timeline and Capability Stack:**

```
Timeline:  May 2025            Sep 2025         Nov 2025          Feb 2026
           ┌────────────────┐  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐
Models:    │ Sonnet 4       │  │ Sonnet 4.5  │  │ Opus 4.5     │  │ Opus 4.6 (Feb 5)    │
           │ Opus 4         │  │             │  │              │  │ Sonnet 4.6 (Feb 17)  │
           └────────────────┘  └─────────────┘  └──────────────┘  └─────────────────────┘

Capability Stack (Claude 4.6):
┌─────────────────────────────────────────────────────────────────────┐
│                     Agent Teams (Multi-Agent)                       │
├─────────────────────────────────────────────────────────────────────┤
│  Computer Use (72.5% OSWorld)  │  Agentic Coding (80.8% SWE-bench) │
├─────────────────────────────────────────────────────────────────────┤
│              1M Token Context Window (Beta)                         │
├─────────────────────────────────────────────────────────────────────┤
│           Reason-Based Alignment (Jan 2026 Constitution)            │
├─────────────────────────────────────────────────────────────────────┤
│        Haiku (Fast)  /  Sonnet (Balanced)  /  Opus (Frontier)       │
└─────────────────────────────────────────────────────────────────────┘
```

## How It Works

### Claude Sonnet 4 and Opus 4 (May 2025)

The Claude 4 generation launched in May 2025 with two models positioned for different use cases:

**Claude Opus 4** was designed as the apex model for complex, autonomous tasks. Its standout capability was sustained agentic performance: the ability to work independently for extended periods -- writing code, running tests, debugging, and iterating -- without losing coherence or making compounding errors. On SWE-bench, the standard benchmark for real-world software engineering tasks, Opus 4 set new records. It could take a GitHub issue, understand the codebase, implement a fix, write tests, and submit a working solution.

**Claude Sonnet 4** targeted the high-volume production tier: fast enough for real-time applications, capable enough for most professional tasks. It achieved 80.2% on SWE-bench Verified -- a score that would have been frontier-leading just months earlier. Sonnet 4 became the workhorse model for coding assistants, customer-facing applications, and enterprise deployments where cost-per-query mattered alongside quality.

### Claude Sonnet 4.5 (September 2025)

Released on September 29, 2025, Claude Sonnet 4.5 was the best coding model available at the time of its launch. It achieved 77.2% on SWE-bench Verified -- the highest score on that benchmark when it shipped -- and 61.4% on OSWorld, demonstrating strong computer use capabilities in the balanced-tier model. Beyond raw benchmarks, Sonnet 4.5's defining capability was sustained focus: it could maintain coherent attention on complex tasks for over 30 hours, making it viable for long-running agentic workflows that previously required frequent human re-engagement. This durability made Sonnet 4.5 the go-to model for professional coding assistants and extended autonomous sessions where reliability over time mattered as much as peak performance.

### Claude Opus 4.5 (November 2025)

Released on November 24, 2025, Opus 4.5 reclaimed the top position on SWE-bench Verified with an 80.9% score -- the highest any model had achieved at the time and the #1 overall ranking. Rather than simply scaling up from Sonnet 4.5, Opus 4.5 focused on efficiency: it used up to 65% fewer tokens than Sonnet 4.5 to solve the same problems, meaning faster completions and lower costs for equivalent or better output quality. This combination of frontier-leading accuracy and dramatically improved token efficiency made Opus 4.5 the clear choice for demanding agentic deployments where both performance and cost mattered. It also continued to improve on the failure modes observed in earlier real-world deployments: better handling of ambiguous instructions, improved ability to ask clarifying questions before acting, and more robust error recovery during multi-step coding tasks.

### Claude 4.6 (February 2026)

The most architecturally ambitious generation, Claude 4.6 arrived in two waves and introduced several capabilities that represented qualitative leaps.

**Claude Opus 4.6 (February 5, 2026)** led the generation with 80.8% on SWE-bench Verified and introduced two headline features: agent teams and Claude in PowerPoint. On LMArena (formerly LMSYS Chatbot Arena), Claude Opus 4.6 Thinking reached #1 overall at 1506 Elo, with the non-thinking variant at #2 with 1502 Elo -- the first time a single model family held both top positions simultaneously.

**Claude Sonnet 4.6 (February 17, 2026)** followed twelve days later with broad improvements across computer use, coding, design, knowledge work, and large data processing. It became the default model for both free and Pro users on claude.ai, maintaining the same pricing as Sonnet 4.5 ($3/$15 per million input/output tokens). Sonnet 4.6 represented the new baseline for what users could expect from Claude without paying for Opus-tier access.

**Million-token context (beta)**: Up to 1 million tokens of context, enabling the model to process entire codebases, book-length documents, or extensive conversation histories in a single interaction. This wasn't just a longer window -- it required fundamental improvements in attention efficiency and the model's ability to maintain coherent reasoning across vast inputs.

**Agent teams**: Multi-agent collaboration where multiple Claude instances coordinate on complex tasks. Rather than a single model attempting everything sequentially, agent teams allow parallel work with specialization: one agent handles research, another writes code, a third reviews and tests. The orchestration layer manages handoffs, conflict resolution, and quality assurance across agents.

**Claude in PowerPoint**: The 4.6 generation extended Claude's integration surface to Microsoft PowerPoint, enabling direct assistance with presentation creation and editing within the application.

### Computer Use: From Demonstration to Production

One of Claude's most distinctive capabilities has been computer use -- the ability to interact with desktop interfaces by viewing screenshots, moving the mouse, clicking buttons, and typing. This capability launched with Claude 3.5 Sonnet in October 2024 at a modest 14.9% on OSWorld-Verified, a benchmark for computer-based task completion.

The improvement trajectory was remarkable: by the Claude 4.6 era, performance reached 72.5% on OSWorld-Verified -- approximately a 5x improvement in just 16 months. This transformed computer use from a research demonstration into a practical tool for automating real-world workflows: filling out forms, navigating web applications, transferring data between systems, and performing administrative tasks that previously required human attention.

### Reason-Based Alignment (January 2026 Constitution Update)

Anthropic updated Claude's constitution in January 2026, shifting from primarily rule-based constraints to reason-based alignment. Rather than encoding specific prohibitions ("never help with X"), the updated approach trained Claude to understand the reasoning behind safety guidelines and apply principles flexibly to novel situations. This produced more nuanced, less rigid behavior: Claude could engage thoughtfully with sensitive topics while maintaining strong safety properties, because it understood why certain boundaries exist rather than simply following rules.

## Why It Matters

### Redefining What AI Models Do

The Claude 4 series represents a fundamental shift from "AI that answers questions" to "AI that does work." The combination of sustained agentic performance, computer use, and multi-agent collaboration means Claude can take on entire workflows, not just individual queries. This changes the economic calculus of AI adoption: instead of augmenting human workers on specific subtasks, Claude can autonomously handle complete tasks, with human oversight at the strategic level.

### The Alignment Differentiator

In a market where capability benchmarks converge (GPT-5, Gemini 2.5, and Claude 4 all achieve similar scores on standard benchmarks), alignment quality becomes a key differentiator. Anthropic's investment in reason-based alignment, transparent chain-of-thought, and predictable behavior makes Claude the preferred choice for high-stakes applications where trust and reliability matter more than raw benchmark scores -- healthcare, legal, finance, and safety-critical systems.

### The Million-Token Frontier

The 1M context window (in beta with Claude 4.6) opens entirely new use cases. Developers can provide an entire codebase as context. Analysts can process hundreds of pages of financial filings in a single query. Researchers can synthesize information from dozens of papers simultaneously. This isn't just more context -- it's a qualitative change in what problems an LLM can address.

## Key Technical Details

- Claude Sonnet 4 (May 2025): 80.2% SWE-bench Verified, optimized for production workloads
- Claude Opus 4 (May 2025): designed for complex agentic tasks, sustained autonomous coding
- Claude Sonnet 4.5 (September 29, 2025): 77.2% SWE-bench Verified (best at launch), 61.4% OSWorld, 30+ hour sustained focus on complex tasks
- Claude Opus 4.5 (November 24, 2025): 80.9% SWE-bench Verified (#1 overall at launch), up to 65% fewer tokens than Sonnet 4.5 for equivalent tasks
- Claude Opus 4.6 (February 5, 2026): 80.8% SWE-bench Verified, agent teams, Claude in PowerPoint, up to 1M context (beta)
- Claude Sonnet 4.6 (February 17, 2026): improved computer use, coding, design, knowledge work, large data processing; $3/$15 per million tokens (same as Sonnet 4.5); default model for free and Pro users
- LMArena rankings (February 2026): Opus 4.6 Thinking #1 at 1506 Elo, Opus 4.6 #2 at 1502 Elo
- Computer use: 72.5% OSWorld-Verified, up from 14.9% at launch (~5x improvement in 16 months)
- January 2026 constitution update: shift from rule-based to reason-based alignment
- Haiku/Sonnet/Opus tiering maintained across generations for cost-capability flexibility

## Common Misconceptions

- **"Claude 4 is just a bigger model."** The improvements are as much about training methodology, alignment techniques, and agentic scaffolding as about scale. Computer use, agent teams, and reason-based alignment represent qualitatively new capabilities, not just larger parameter counts.

- **"Computer use means Claude takes over your computer."** Computer use operates within explicit user authorization and sandboxed environments. Claude requests permission, operates within defined boundaries, and can be stopped at any point. It's a tool, not an autonomous agent with unconstrained access.

- **"Alignment makes Claude less capable."** The reason-based alignment approach actually makes Claude more capable in practice, because it can engage thoughtfully with nuanced requests rather than refusing them categorically. Better alignment produces better, more useful responses.

- **"Agent teams are just running multiple API calls."** Agent teams involve genuine coordination: shared context, task decomposition, parallel execution, conflict resolution, and quality assurance. It's closer to a managed team than a batch of independent queries.

## Connections to Other Concepts

The Claude 4 series' agentic capabilities are analyzed in `06-agent-native-models.md`. Its SWE-bench performance participates in the broader frontier competition with `02-gpt-5.md` and `03-gemini-2-and-beyond.md`. The alignment approach connects to `01-instructgpt-and-rlhf.md` and constitutional AI principles. Computer use capabilities interface with the tool use paradigm explored in `06-agent-native-models.md`. Claude's competitive position is part of the dynamics examined in `07-open-vs-closed-the-narrowing-gap.md`.

## Further Reading

- Anthropic, "Claude Opus 4 and Sonnet 4 System Card" (2025) -- detailed capability and safety documentation
- Anthropic, "Claude's Updated Constitution" (2026) -- the shift to reason-based alignment
- Anthropic, "Computer Use Documentation" (2024-2026) -- the evolution of desktop interaction capabilities
- Jimenez et al., "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" (2024) -- the benchmark used to evaluate coding capability
- Xie et al., "OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments" (2024) -- the computer use benchmark
