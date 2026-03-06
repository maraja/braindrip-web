# Alignment Method Evolution

**One-Line Summary**: Alignment methods — techniques for making LLMs follow human intent and values — have evolved from complex multi-stage pipelines (RLHF) to simpler single-stage approaches (DPO) to pure reinforcement learning from verifiable outcomes.

**Prerequisites**: `01-instructgpt-and-rlhf.md`, `04-direct-preference-optimization.md`, `03-constitutional-ai.md`

## What Is Alignment Method Evolution?

A raw pre-trained language model is like a brilliant but uncooperative expert — it has vast knowledge but will ramble, refuse to answer, or produce harmful content unpredictably. Alignment is the process of teaching the model to behave as a helpful, honest, and harmless assistant.

The story of alignment methods is a story of simplification: from a three-stage pipeline requiring teams of human annotators, to elegant mathematical reformulations that need only a list of preferred responses, to fully automated systems where correctness itself is the reward signal. Each generation has made alignment cheaper, more stable, and more accessible.

## How It Works

**Alignment Method Evolution -- The Simplification Arc:**

```
RLHF (2022)                DPO (2023)               Pure RL / GRPO (2025)
4 models in memory          2 models (or 1)           1 model + verifier
━━━━━━━━━━━━━━━━━━━        ━━━━━━━━━━━━━━━           ━━━━━━━━━━━━━━━━━━━

┌──────────┐               ┌──────────┐              ┌──────────┐
│ 1. SFT   │               │ SFT Model│              │   Model  │
│ (demos)  │               └────┬─────┘              └────┬─────┘
└────┬─────┘                    │                         │
     │                    ┌─────▼──────┐            ┌─────▼──────┐
┌────▼─────┐              │ DPO Loss   │            │ Generate   │
│ 2. Reward│              │ (preferred │            │ multiple   │
│  Model   │              │  vs rejected│            │ solutions  │
│ (human   │              │  pairs)    │            └─────┬──────┘
│  prefs)  │              └────────────┘                  │
└────┬─────┘                                        ┌─────▼──────┐
     │                    No reward model!           │ Execute &  │
┌────▼─────┐              No PPO!                   │ Verify     │
│ 3. PPO   │              ~50% less compute         │ (pass/fail)│
│ + KL pen │                                        └─────┬──────┘
│ (4 models│                                              │
│  in mem) │                                        ┌─────▼──────┐
└──────────┘                                        │ GRPO:      │
                                                    │ Reinforce  │
 Expensive, fragile         Simple, stable          │ correct    │
 Frontier labs only         Anyone can do it        │ reasoning  │
                                                    └────────────┘
                                                    No humans needed!

Models required: 4 ──────▶ 2 ──────▶ 1 ──────▶ 0 (auto-verified)
```

### RLHF: The Three-Stage Pipeline (2022)

InstructGPT (Ouyang et al., January 2022) established the RLHF paradigm in three stages.

Stage 1: Supervised Fine-Tuning (SFT) on human-written demonstrations of ideal assistant behavior. Human contractors wrote example responses to prompts, showing the model what a good assistant looks like.

Stage 2: Train a Reward Model on human preference comparisons — given two responses to the same prompt, which is better? The reward model learns to assign a scalar score reflecting human preferences.

Stage 3: Optimize the language model against this reward model using Proximal Policy Optimization (PPO), with a KL divergence penalty to prevent the model from drifting too far from the SFT baseline and exploiting the reward model.

RLHF worked remarkably well — InstructGPT with 1.3B parameters was preferred by human evaluators to the raw 175B GPT-3. But the pipeline was expensive and fragile. Training a reward model required tens of thousands of human comparisons. PPO was notoriously unstable, sensitive to hyperparameters, and required maintaining four models in memory simultaneously (policy, reference, reward, and value networks). Only well-resourced labs could make it work reliably.

### Constitutional AI: Replacing Humans with Principles (2022)

Anthropic's Constitutional AI (Bai et al., December 2022) introduced RLAIF — Reinforcement Learning from AI Feedback. Instead of human annotators judging response quality, the model itself critiques and revises responses based on a written constitution of principles.

The constitution includes rules like "Choose the response that is less harmful," "Choose the response that is more honest," and "Choose the response that best follows the user's instructions." The model generates pairs of responses, then a separate AI judge evaluates them against these principles. This dramatically reduced the need for human labelers while maintaining alignment quality.

Constitutional AI made alignment more transparent and auditable — you could read the explicit rules the model was trained to follow.

### DPO: The Mathematical Simplification (2023)

Direct Preference Optimization (Rafailov et al., May 2023) was a theoretical breakthrough. The authors proved that the reward model in RLHF is mathematically equivalent to a simple closed-form expression involving the policy itself. This meant you could skip the reward model entirely and optimize directly on preference pairs using a straightforward cross-entropy-style loss.

DPO reduced alignment from a four-model pipeline to a single training loop. It was more stable than PPO, used less memory, converged more predictably, and was accessible to any lab that could do supervised fine-tuning. Within months of publication, DPO became the default alignment method for open-source models including Zephyr, Neural Chat, and Tulu 2.

### Beyond DPO: Further Simplifications (2024)

The simplification continued rapidly.

KTO (Ethayarajh et al., January 2024) removed the need for paired preferences entirely — it works with simple thumbs-up/thumbs-down binary feedback on individual responses. This is far easier to collect than paired comparisons, as users naturally provide binary feedback.

ORPO (Hong et al., March 2024) combined SFT and preference optimization into a single training step by adding an odds ratio penalty to the standard cross-entropy loss. This eliminated the need for a separate alignment stage entirely.

SimPO (Meng et al., May 2024) eliminated the reference model from DPO by using the average log probability of the generated response as an implicit reward signal, further reducing memory requirements.

### Pure RL for Reasoning (2025)

DeepSeek R1 (January 2025) introduced a paradigm shift: Group Relative Policy Optimization (GRPO) using verifiable rewards. For math problems, the reward is binary — did the model get the correct answer? For code, the reward comes from execution — does it pass the test cases? No human preferences needed, no reward model needed, no paired comparisons needed.

The model generates multiple solutions to a problem, receives binary correctness feedback, and reinforces the reasoning patterns that led to correct answers. This pure RL approach produced emergent reasoning behaviors — chain-of-thought, self-verification, backtracking, and error correction arose naturally from reward optimization without being explicitly trained.

### Process vs. Outcome Supervision

An important distinction runs through alignment research: should you reward each reasoning step (process supervision) or only the final answer (outcome supervision)?

Process reward models (PRMs) provide feedback at every step of a reasoning chain, catching errors early. Outcome reward models (ORMs) only evaluate the final result. PRMs produce more reliable reasoning but require expensive step-level annotations. ORMs are simpler but may reward models that reach correct answers through flawed logic.

## Why It Matters

The evolution of alignment methods democratized the ability to create helpful, safe AI assistants. RLHF was the exclusive domain of frontier labs with large annotation teams and deep RL expertise. DPO put alignment within reach of any machine learning practitioner. Pure RL from verifiable outcomes automated alignment for domains with objective correctness criteria.

The arc from complex to simple is not just about cost — it reflects deeper understanding. RLHF worked but nobody fully understood why. DPO showed that the same objective could be expressed in closed form. Pure RL from verifiable rewards showed that for certain domains, human preferences are unnecessary — correctness is sufficient.

The challenge remains: alignment methods that work well for helpfulness may not work for safety. A model can be aligned to be extremely helpful while still being manipulable, sycophantic, or deceptive in edge cases. Safety alignment requires techniques beyond preference optimization.

## Key Technical Details

- **InstructGPT RLHF** (Jan 2022): 40 contractors, ~37K training prompts, PPO with KL penalty. Cost: months of annotation.
- **Constitutional AI** (Dec 2022): 16 constitutional principles, self-critique then RLAIF. Used for Claude.
- **DPO** (May 2023): Single-stage, closed-form loss. ~50% less compute than RLHF. Default for open models by late 2023.
- **KTO** (Jan 2024): Binary feedback only (good/bad). No paired preferences required.
- **ORPO** (Mar 2024): Combined SFT + alignment in one step. Odds ratio penalty term.
- **SimPO** (May 2024): Reference-free DPO variant. Average log probability as implicit reward.
- **GRPO** (Jan 2025): DeepSeek R1. Group-based policy optimization with verifiable rewards. No reward model.
- **Iterative/Online DPO**: Generate new responses with current policy, collect preferences, realign. Self-improving loop.
- **The simplification arc**: 4 models (RLHF) to 2 models (DPO) to 1 model (SimPO/ORPO) to 0 models (GRPO with verifiable rewards).

## Common Misconceptions

- **"RLHF is still the best alignment method."** For most practical purposes, DPO and its variants achieve comparable alignment quality with far less complexity. RLHF's advantage appears mainly at the frontier of very large models with complex safety requirements.

- **"Alignment is a solved problem."** Current methods align well for helpfulness but struggle with subtle safety properties. Models can be aligned to be helpful while still being manipulable, sycophantic, or deceptive in edge cases. Robust safety alignment remains an open research problem.

- **"DPO completely replaces RLHF."** Frontier labs (OpenAI, Anthropic, Google) still use RLHF variants for their most capable models. DPO dominates in the open-source ecosystem where simplicity and reproducibility matter most. The methods are complementary, not mutually exclusive.

## Connections to Other Concepts

The alignment journey starts with `01-instructgpt-and-rlhf.md` and continues through `04-direct-preference-optimization.md` and `03-constitutional-ai.md`. Pure RL alignment powers `03-deepseek-r1.md` and connects to `05-the-reasoning-paradigm-shift.md`. Synthetic preference data generation links to `06-the-synthetic-data-revolution.md`. The instruction tuning that precedes alignment is covered in `04-instruction-tuning-evolution.md`. For the post-training recipe combining these methods, see Tulu 3 in `04-instruction-tuning-evolution.md`.

## Further Reading

- Ouyang et al., "Training Language Models to Follow Instructions with Human Feedback" (2022) — InstructGPT/RLHF.
- Bai et al., "Constitutional AI: Harmlessness from AI Feedback" (2022) — Anthropic's RLAIF approach.
- Rafailov et al., "Direct Preference Optimization: Your Language Model Is Secretly a Reward Model" (2023) — DPO.
- Ethayarajh et al., "KTO: Model Alignment as Prospect Theoretic Optimization" (2024) — binary feedback alignment.
- Hong et al., "ORPO: Monolithic Preference Optimization without Reference Model" (2024) — combined SFT+alignment.
- Meng et al., "SimPO: Simple Preference Optimization with a Reference-Free Reward" (2024) — simplified DPO.
- DeepSeek-AI, "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning" (2025) — GRPO.
- Lightman et al., "Let's Verify Step by Step" (2023) — process reward models for math reasoning.
