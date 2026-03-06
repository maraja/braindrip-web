# RLVR

**One-Line Summary**: Reinforcement Learning with Verifiable Rewards uses objectively checkable outcomes -- correct math answers, passing code tests, provable logical validity -- as reward signals, completely bypassing learned reward models and their susceptibility to Goodhart's Law.

**Prerequisites**: RLHF pipeline (`07-rl-for-language-models/rlhf-pipeline.md`), GRPO (`07-rl-for-language-models/grpo.md`), reward modeling (`07-rl-for-language-models/reward-modeling-for-llms.md`), policy gradient methods (`04-policy-gradient-methods/policy-gradient-theorem.md`), reward shaping (`06-advanced-methods/reward-shaping.md`).

## What Is RLVR?

Imagine two ways to train a student for a math exam. In the first approach (RLHF), you hire tutors to read the student's work and give subjective assessments: "This looks like good reasoning," or "I think this answer is probably right." In the second approach (RLVR), you have an answer key. The student solves problems, and you check whether the final answer matches the key. Right or wrong, no ambiguity, no subjective judgment, no possibility of the student learning to impress the tutor without actually solving the problem.

RLVR -- Reinforcement Learning with Verifiable Rewards -- uses the second approach. Instead of training a reward model to approximate human preferences, RLVR defines reward functions that can be *verified* programmatically: checking if a math answer equals the correct value, executing code against test cases, or validating logical proofs. Because the reward is ground truth rather than a learned proxy, RLVR is immune to Goodhart's Law -- the model cannot "hack" a reward that is objectively correct.

## How It Works

### Verifiable Reward Functions

RLVR defines domain-specific reward functions $r(x, y)$ that return binary or graded scores based on objective verification:

**Mathematical reasoning:**

$$r_{\text{math}}(x, y) = \begin{cases} 1 & \text{if } \text{extract\_answer}(y) = \text{ground\_truth}(x) \\ 0 & \text{otherwise} \end{cases}$$

The answer is extracted from the model's response (typically the content after "The answer is" or within a boxed expression) and compared to the known correct answer. Symbolic equivalence checking handles different representations (e.g., $\frac{1}{2} = 0.5$).

**Code generation:**

$$r_{\text{code}}(x, y) = \frac{\text{number of test cases passed}}{\text{total test cases}}$$

The generated code is executed in a sandboxed environment against a predefined test suite. This provides a graded reward signal rather than binary.

**Formal verification:**

$$r_{\text{formal}}(x, y) = \begin{cases} 1 & \text{if proof checker accepts } y \text{ as valid proof of } x \\ 0 & \text{otherwise} \end{cases}$$

Tools like Lean, Isabelle, or Coq provide formal proof verification.

### The RLVR Training Pipeline

The RLVR pipeline is simpler than RLHF because it eliminates the reward model entirely:

1. **Start** with a supervised fine-tuned (SFT) model or even a base pretrained model
2. **Sample** a batch of problems with known correct answers
3. **Generate** responses from $\pi_\theta$ (potentially multiple responses per problem for GRPO)
4. **Verify** each response using the deterministic reward function
5. **Compute advantages** (via GRPO group normalization, PPO value function, or REINFORCE baseline)
6. **Update policy** using the standard policy gradient:

$$\nabla_\theta J(\theta) = \mathbb{E} \left[ \hat{A}(x, y) \nabla_\theta \log \pi_\theta(y|x) \right]$$

7. **Apply KL penalty** to prevent degeneration:

$$\mathcal{J}(\theta) = \mathbb{E}[r_{\text{verify}}(x, y)] - \beta \, D_{\text{KL}}(\pi_\theta \| \pi_{\text{ref}})$$

### Verifiable vs. Learned Rewards

| Property | Learned Reward (RLHF) | Verifiable Reward (RLVR) |
|---|---|---|
| Accuracy | Approximate (~70% agreement) | Exact (ground truth) |
| Goodhart vulnerability | High (reward hacking) | None (cannot fake correctness) |
| Domain scope | General (any text quality) | Narrow (tasks with checkable answers) |
| Reward noise | Systematic bias possible | Zero noise (deterministic) |
| Data requirements | Preference annotations | Problems with ground-truth solutions |
| Cost | $1--$10/comparison (human) or $0.001 (AI) | Near-zero (compute only) |

### The DeepSeek-R1 RLVR Approach

DeepSeek-R1 (2025) demonstrated the power of RLVR at scale. Starting from a base model (DeepSeek-V3-Base), they applied GRPO with verifiable rewards on math and coding problems:

1. **Pure RLVR phase**: Train only with verifiable rewards on math competition problems and coding challenges. No human preference data, no reward models.
2. **Emergent reasoning**: The model spontaneously developed chain-of-thought reasoning, self-verification, and backtracking behaviors -- none of which were present in the training data or explicitly rewarded.
3. **"Aha moment"**: The model learned to re-examine its approach when initial attempts failed, a reasoning pattern that emerged purely from the pressure to produce correct final answers.

The reward for DeepSeek-R1-Zero was remarkably simple:

$$r(x, y) = \begin{cases} 1 & \text{if answer is correct} \\ 0 & \text{if answer is incorrect or cannot be parsed} \end{cases}$$

Plus a format reward encouraging the model to put reasoning in \<think\> tags and the answer in a specific format.

## Why It Matters

RLVR represents the cleanest form of RL for language models: the reward signal is exact, the optimization objective is unambiguous, and the results are directly measurable. The DeepSeek-R1 results demonstrated that reasoning capabilities -- long considered to require explicit instruction or chain-of-thought supervision -- can emerge spontaneously from RL optimization against verifiable outcomes. This suggests that for domains with objective evaluation criteria, RLVR is not merely an alternative to RLHF but a fundamentally superior approach.

## Key Technical Details

- **Binary vs. graded rewards**: Binary (correct/incorrect) rewards work well with GRPO because group normalization handles the sparse signal. Within a group of 16--64 samples, some will be correct and others incorrect, creating a natural advantage signal.
- **Answer extraction**: Robust regex-based extraction is critical. Common patterns include "The answer is X", "\\boxed{X}", and structured output formats. Extraction failures should receive reward 0, not a default value.
- **Symbolic equivalence**: Math verification must handle equivalent expressions: $\frac{2}{4} = \frac{1}{2} = 0.5$. Libraries like SymPy provide symbolic comparison.
- **Sandbox execution**: Code execution must be sandboxed with time limits (typically 10--30 seconds per test case), memory limits, and no network access.
- **Reward for format**: DeepSeek-R1 added a small format reward to encourage structured output (reasoning in tags, answer in specified format), preventing format degeneration during RL.
- **Difficulty curriculum**: Starting with easier problems and gradually increasing difficulty improves training stability. If early problems are too hard, the reward signal is too sparse for learning.
- **Pass@k evaluation**: RLVR models are often evaluated with pass@k: generating $k$ solutions and checking if at least one is correct. Pass@1 measures single-shot accuracy; pass@64 measures the model's coverage of the solution space.
- **Training data scale**: DeepSeek-R1 used hundreds of thousands of math problems and coding challenges with ground-truth solutions.

## Common Misconceptions

- **"RLVR only works for math and code."** While math and code are the most natural domains, RLVR applies to any task with programmatically checkable outputs: formal proofs, constraint satisfaction problems, puzzle solving, factual question answering with known answers, and structured data extraction against ground truth.
- **"Binary rewards are too sparse for RL."** Group-based methods like GRPO handle binary rewards well. In a group of 32 responses, even if only 3 are correct, the correct ones get positive advantages and the incorrect ones get negative advantages. The sparsity is at the population level, not the group level.
- **"RLVR replaces RLHF."** RLVR excels for tasks with verifiable outcomes but cannot handle subjective quality judgments (tone, style, helpfulness, harmlessness). The two approaches are complementary. DeepSeek-R1's full pipeline used RLVR for reasoning and RLHF for general alignment.
- **"The model only learns to produce correct answers."** The DeepSeek-R1 results show something far more interesting: the model learns *reasoning strategies* that produce correct answers. Chain-of-thought, backtracking, self-verification, and problem decomposition all emerged without being explicitly rewarded -- they are instrumentally useful for the terminal reward of correctness.
- **"RLVR requires chain-of-thought in the training data."** DeepSeek-R1-Zero was trained from a base model with no chain-of-thought demonstrations. The reasoning emerged entirely from RL with verifiable rewards.

## Connections to Other Concepts

- `grpo.md` -- GRPO is the RL algorithm most commonly paired with RLVR, as its group-relative advantages naturally handle binary verifiable rewards.
- `rlhf-pipeline.md` -- RLVR replaces Stages 2 and 3 (reward model + PPO) with a simpler pipeline using verifiable rewards.
- `reward-modeling-for-llms.md` -- RLVR eliminates the need for learned reward models entirely in domains with verifiable outcomes, avoiding Goodhart's Law.
- `ppo-for-language-models.md` -- PPO can be used with verifiable rewards instead of learned rewards, though GRPO is more common in practice.
- `rlaif-and-constitutional-ai.md` -- Both RLAIF and RLVR reduce dependence on human annotators, but through fundamentally different mechanisms: AI judgment vs. objective verification.
- `06-advanced-methods/reward-shaping.md` -- Verifiable rewards are the ultimate "correctly specified" reward, avoiding the reward misspecification problems that reward shaping attempts to mitigate.
- `06-advanced-methods/curiosity-driven-exploration.md` -- The emergent reasoning behaviors in RLVR models resemble curiosity-driven exploration: the model discovers useful cognitive strategies not because they are directly rewarded but because they instrumentally improve correctness.

## Further Reading

- **DeepSeek-AI (2025), "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning"** -- The landmark paper demonstrating that pure RL with verifiable rewards produces emergent chain-of-thought reasoning, self-verification, and "aha moment" behaviors without any supervised reasoning examples.
- **Lightman et al. (2023), "Let's Verify Step by Step"** -- Explores process-based reward models for math verification, showing that verifying individual reasoning steps (process reward) outperforms verifying only the final answer (outcome reward).
- **Uesato et al. (2022), "Solving Math Word Problems with Process- and Outcome-Based Feedback"** -- Compares outcome-based (RLVR-style) and process-based feedback for mathematical reasoning, finding that outcome verification is surprisingly competitive with more expensive step-level supervision.
- **Cobbe et al. (2021), "Training Verifiers to Solve Math Word Problems"** -- Introduces the GSM8K benchmark and demonstrates training verifiers to select correct solutions from multiple model-generated candidates.
