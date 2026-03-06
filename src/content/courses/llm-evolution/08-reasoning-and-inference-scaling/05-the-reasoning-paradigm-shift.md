# The Reasoning Paradigm Shift

**One-Line Summary**: AI reasoning evolved in three phases, from chain-of-thought prompting tricks in 2022, through search-based improvements in 2023, to fully trained reasoning via reinforcement learning in 2024, transforming reasoning from a fragile prompt hack into a robust learned capability.

**Prerequisites**: `01-openai-o1.md`, `01-instructgpt-and-rlhf.md`

## What Is the Reasoning Paradigm Shift?

The history of reasoning in large language models is a story of how a surprising discovery became a research program and then an industry. In January 2022, Jason Wei and colleagues at Google discovered that simply adding "Let's think step by step" to a prompt could dramatically improve a model's performance on math and logic problems. This was chain-of-thought prompting, and it felt almost like a magic trick. By 2024, reasoning had evolved from this prompting trick into a core capability that models were explicitly trained to perform, backed by sophisticated reward systems and reinforcement learning. The shift was as significant as the move from hand-crafted features to learned representations a decade earlier.

What changed was not just technique but philosophy. The field went from "models can be coaxed into reasoning" to "models should be trained to reason" to "reasoning should be verified step by step." Each phase built on the last, and the implications for AI safety, capability, and economics were profound. The reasoning paradigm shift is not a single event but a progression, and understanding each phase illuminates why reasoning models of 2025 work the way they do.

## How It Works

**The three phases of AI reasoning -- from prompt trick to trained skill:**

```
Phase 1 (2022-2023)           Phase 2 (2023)              Phase 3 (2024-2025)
Chain-of-Thought              Search + Verification       Trained Reasoning (RL)
Prompting

"Let's think step          Sample N solutions,          RL trains model to
 by step..."               pick best via voting         reason natively

┌────────────────┐        ┌────────────────┐          ┌────────────────┐
│ Prompt hack    │        │ Multiple paths │          │ Learned skill  │
│ Works on big   │        │ Majority vote  │          │ Self-verify    │
│ models only    │        │ Tree search    │          │ Backtrack      │
│ Fragile        │        │ More reliable  │          │ Adapt depth    │
└────────────────┘        └────────────────┘          └────────────────┘

MATH benchmark progression:
  17.9% ──────▶ 56.5% ──────▶ 74.4% ──────▶ 94.8% ──────▶ 97.3%
  (no CoT)      (CoT)         (self-         (o1)          (R1)
                               consistency)

  ░░░░░░░░░░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  2022           2023           2024           2025
```

### Phase 1: Chain-of-Thought Prompting (2022-2023)

Wei et al. (2022) showed that providing a few worked examples with intermediate reasoning steps, or simply appending "Let's think step by step" (Kojima et al., 2022), could unlock latent reasoning abilities in large language models. On the GSM8K math benchmark, chain-of-thought prompting improved PaLM 540B from 17.9% to 56.5% accuracy. The key insight was that reasoning abilities were already present in sufficiently large models; they just needed to be elicited through the right prompt.

The discovery was both exciting and puzzling. Why did merely asking a model to show its work improve the answer so much? The likely explanation is that autoregressive generation, where each token depends on all previous tokens, means that intermediate reasoning steps provide useful "scratch space." The model effectively uses its own output as working memory, allowing it to carry forward intermediate results that would otherwise be lost.

The limitation was fragility. Chain-of-thought depended heavily on prompt formatting, example selection, and model size. Models below roughly 100B parameters showed no benefit, a phenomenon known as the "emergence threshold." The reasoning quality was inconsistent: sometimes brilliant, sometimes confidently wrong. There was no mechanism to verify or improve the reasoning process itself. And the technique was entirely post-hoc: the model had never been trained to reason, so its reasoning chains were a side effect of language modeling, not a deliberate capability.

### Phase 2: Search and Self-Consistency (2023)

The limitations of single-chain reasoning motivated exploration of search-based approaches. Wang et al. (2023) introduced self-consistency: instead of taking the model's first chain-of-thought answer, sample multiple reasoning paths and take a majority vote. This simple technique improved GSM8K accuracy from 56.5% to 74.4% (PaLM 540B) by exploiting the insight that correct reasoning paths are more likely to converge on the same answer than incorrect ones.

Tree-of-thought (Yao et al., 2023) extended this to explicit tree search. Models could explore multiple reasoning branches at each step, evaluate the promise of each branch using the model itself or a separate evaluator, and backtrack from unpromising paths. This introduced deliberate exploration into reasoning, moving beyond the single-pass "hope for the best" approach.

Other Phase 2 techniques included self-refinement (the model critiques and revises its own reasoning), debate (two model instances argue for different answers), and step-by-step verification (checking each reasoning step before proceeding). All of these improved reliability but added computational cost and still depended on reasoning capabilities that were latent in the base model, never explicitly trained.

### Phase 3: Trained Reasoning via RL (2024-2025)

The breakthrough came when OpenAI (o1, September 2024) and DeepSeek (R1, January 2025) trained models to reason using reinforcement learning. Instead of hoping the model would produce good reasoning chains, these models were explicitly rewarded for producing reasoning that led to correct answers. The RL training shaped the model's behavior over millions of steps, teaching it when to reason deeply, when to backtrack, when to try alternative approaches, and when a quick answer suffices.

The results were transformative. o1 scored 94.8% on MATH (vs 56.5% with prompted chain-of-thought just two years earlier). DeepSeek-R1-Zero showed that reasoning behaviors emerged spontaneously from pure RL, without any human-written chain-of-thought examples. The model independently discovered strategies like self-verification, reflection, and compute budgeting. Reasoning was no longer a prompting trick; it was a trained skill. The improvement from Phase 1 to Phase 3 on MATH, from 56.5% to 97.3%, in just two years represented one of the fastest capability improvements in AI history.

### Reward Models: Process vs Outcome

Central to Phase 3 was the distinction between Process Reward Models (PRMs) and Outcome Reward Models (ORMs). ORMs evaluate only whether the final answer is correct, providing a single reward signal at the end. PRMs evaluate each intermediate step, providing dense feedback that guides the model's reasoning throughout the chain.

Lightman et al. (2023) created PRM800K, a dataset of 800,000 step-level human annotations for math reasoning, and showed that PRM-guided best-of-N selection dramatically outperformed ORM-guided selection. The advantage is intuitive: PRMs catch errors early, before they propagate. An ORM might rate a solution positively because the final answer is correct despite flawed intermediate steps (a lucky cancellation of errors). A PRM penalizes each flawed step, encouraging genuinely sound reasoning. The disadvantage is that PRMs require expensive step-level annotations, limiting their application to domains where step correctness can be clearly defined.

### GRPO and Alternative RL Methods

DeepSeek introduced GRPO (Group Relative Policy Optimization) as an alternative to PPO for training reasoning. GRPO eliminates the need for a separate value function model by computing baselines from groups of sampled outputs. For each problem, multiple solutions are generated, and each solution's reward is compared to the group mean. This approach reduces training memory by roughly 50% compared to PPO while achieving comparable or better results.

Other RL approaches explored for reasoning training include Expert Iteration (iteratively improving the model by training on its own best solutions), STaR (Self-Taught Reasoner, which bootstraps reasoning from a small seed set), and RAFT (Reward-rAnked FineTuning, which uses reward models to select the best samples for fine-tuning). The diversity of successful approaches suggests that the key ingredient is not any specific RL algorithm but the combination of verifiable reasoning domains with reward-based training.

## Why It Matters

The reasoning paradigm shift had implications far beyond benchmark scores. For AI safety, transparent reasoning chains enable human oversight. If a model shows its work, auditors can check not just whether the answer is correct but whether the reasoning is sound. Deliberative alignment, where models reason explicitly about their own safety guidelines during their chain-of-thought, became possible only with trained reasoning. This represented a qualitative improvement in our ability to understand and verify AI behavior.

For AI capabilities, the shift meant that certain tasks previously thought to require human-level intelligence, including competition mathematics, PhD-level science, and complex software engineering, became tractable. The jump from 56.5% to 97.3% on math benchmarks in two years was not incremental improvement; it was a qualitative change in what AI could do. Competition results were similarly dramatic: reasoning models achieved expert-level performance on Codeforces and near-gold-medal performance on International Mathematics Olympiad problems.

For AI economics, reasoning created a new cost dimension. Every query could now consume variable amounts of compute depending on its difficulty. This fundamentally changed how AI services are priced and provisioned, introducing per-query cost variability that had not existed in the era of fixed-capability models.

## Key Technical Details

- Chain-of-thought (2022): GSM8K PaLM 540B: 17.9% (standard) to 56.5% (CoT)
- Self-consistency (2023): GSM8K PaLM 540B: 56.5% (single CoT) to 74.4% (self-consistency)
- o1 (Sep 2024): MATH: 94.8%, GPQA Diamond: 78.0%
- DeepSeek-R1 (Jan 2025): MATH-500: 97.3%, AIME 2024: 79.8% (pass@1)
- PRM800K: 800,000 step-level human labels across 75,000 math solutions
- GRPO reduces training memory by ~50% vs PPO (no separate critic model)
- Reasoning tokens: o1 and R1 generate 1,000-10,000+ thinking tokens per response
- Phase 1 emergence threshold: chain-of-thought benefits appear only above ~100B parameters
- Phase 3 distillation: reasoning capabilities transfer to models as small as 1.5B
- Verified reasoning domains: math, coding, formal logic, science (ground truth available)
- Unverified domains: open-ended writing, ethics, strategy (verification much harder)
- MATH improvement: 56.5% to 97.3% in 24 months (Phase 1 to Phase 3)
- GSM8K improvement: 17.9% (no CoT) to 56.5% (CoT) to 97%+ (trained reasoning)
- Codeforces (competitive programming): o3 achieved 2530 Elo, expert human level
- Cost of reasoning: o1 charges $60/M output tokens vs GPT-4o's $10/M
- Deliberative alignment: models reasoning about safety policies during chain-of-thought
- Key open question: how to verify reasoning in domains without ground truth answers

## Common Misconceptions

- **"Chain-of-thought prompting is obsolete now that we have trained reasoning."** Chain-of-thought prompting remains useful for models that have not been trained with RL for reasoning. It is also a valuable technique for eliciting reasoning in specific formats, for pedagogical purposes, or when using models through APIs that do not support reasoning mode. Trained reasoning is superior on hard problems, but prompting is not dead.

- **"Trained reasoning models always produce correct reasoning."** These models are much better at reasoning, but they can still produce plausible-sounding but incorrect chains of thought. The improvement is in reliability and depth, not infallibility. Process reward models help but do not eliminate errors, especially in domains without clear verification criteria.

- **"Reasoning only matters for math and coding."** While verified reasoning domains (math, coding, formal logic) have seen the largest measurable gains, reasoning training also improves performance on open-ended tasks. Models that reason about safety policies, consider multiple perspectives, plan multi-step responses, and synthesize information from multiple sources all benefit from trained reasoning capabilities.

- **"The three phases are sequential and non-overlapping."** In practice, all three approaches continue to coexist. Chain-of-thought prompting is still used with non-reasoning models. Search-based methods are still applied on top of trained reasoning models. The phases describe the frontier of research, not the complete abandonment of earlier techniques.

## Connections to Other Concepts

The initial o1 model that launched Phase 3 is covered in `01-openai-o1.md`. DeepSeek's open-source approach to trained reasoning is detailed in `03-deepseek-r1.md`. The theoretical framework for inference compute scaling is in `04-test-time-compute-scaling.md`. The RLHF training methodology that Phase 3 reasoning builds upon is discussed in `01-instructgpt-and-rlhf.md`. Hybrid models that make reasoning optional are covered in `06-hybrid-thinking-models.md`. The evolution of alignment methods, including deliberative alignment, is tracked in `03-alignment-method-evolution.md`.

## Further Reading

- Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (2022) — the paper that started Phase 1.
- Kojima et al., "Large Language Models are Zero-Shot Reasoners" (2022) — "Let's think step by step."
- Wang et al., "Self-Consistency Improves Chain of Thought Reasoning in Language Models" (2023) — Phase 2's key technique.
- Yao et al., "Tree of Thoughts: Deliberate Problem Solving with Large Language Models" (2023) — tree search over reasoning.
- Lightman et al., "Let's Verify Step by Step" (2023) — process reward models and PRM800K.
- DeepSeek-AI, "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning" (2025) — emergent reasoning from pure RL.
- Zelikman et al., "STaR: Bootstrapping Reasoning With Reasoning" (2022) — self-improving reasoning.
- OpenAI, "Learning to Reason with LLMs" (2024) — the o1 announcement and reasoning paradigm.
