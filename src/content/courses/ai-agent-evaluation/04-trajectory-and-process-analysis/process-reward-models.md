# Process Reward Models

**One-Line Summary**: Specialized models trained to score individual steps in an agent's trajectory, enabling automated fine-grained evaluation of reasoning and execution quality.

**Prerequisites**: `trajectory-quality-metrics.md`, `../01-foundations-of-agent-evaluation/outcome-vs-process-evaluation.md`

## What Is Process Reward Models?

Consider a math teacher grading a student's work. An outcome-focused teacher only checks the final answer: right or wrong. A process-focused teacher reads each line of work, marking where the reasoning is sound and where it goes astray. The process-focused teacher can identify that the student understands algebra but makes arithmetic errors, providing far more actionable feedback. Process Reward Models (PRMs) are the AI equivalent of that process-focused teacher.

A Process Reward Model is a learned function that takes an agent's trajectory (or a prefix of it) and assigns a quality score to individual steps. Unlike Outcome Reward Models (ORMs) that evaluate only the final result, PRMs provide step-level supervision, scoring each action, reasoning trace, or decision point independently. This enables credit assignment: determining which specific steps were good and which were problematic.

PRMs emerged from the mathematical reasoning literature, where researchers found that rewarding correct intermediate steps dramatically improved problem-solving over rewarding only correct final answers. The principle generalizes to agent evaluation: by training models to recognize good and bad individual steps, we can build automated trajectory scorers that operate at scale without human annotation of every trajectory.

## How It Works

### Data Collection for PRM Training

Training a PRM requires step-level quality labels. There are three primary approaches to collecting this data:

**Human annotation** is the gold standard. Annotators examine each step in a trajectory and assign a quality label (correct/incorrect, or a 1-5 score). Lightman et al. (2023) collected approximately 800,000 step-level labels across 75,000 solutions to 12,000 math problems. This is expensive but produces the highest-quality training signal. Typical annotation rates are 20-40 steps per annotator-hour for technical domains.

**Automated heuristics** use programmatic rules to approximate step quality. Common heuristics include: did the step move the state closer to the goal (measured by edit distance, test pass rate delta, or task progress indicators)? Did the tool call return a successful response? Did the agent's stated belief match ground truth at that point? Heuristic labels are noisy but cheap, enabling datasets of millions of labeled steps.

**Monte Carlo estimation** is a hybrid approach. From each intermediate step, run multiple rollouts to completion and measure the fraction that succeed. Steps from which most rollouts succeed are likely good steps; steps from which most rollouts fail are likely bad. This provides empirically grounded step-level scores without human annotation, though it requires significant compute (typically 8-64 rollouts per step).

### Training Objectives

PRMs are typically trained with one of two objectives:

**Step-level reward prediction** trains the model to predict the quality score of each individual step. The model takes as input the trajectory up to step t and outputs a scalar score for step t. This is framed as regression (predicting a continuous score) or classification (predicting correct/incorrect). The loss function is:

```
L = Σ_t (PRM(trajectory[1:t]) - label_t)²
```

**Trajectory-level ranking** trains the model to rank complete trajectories by quality. Given a pair of trajectories for the same task, the model should assign higher cumulative step scores to the better trajectory. This uses a Bradley-Terry or pairwise ranking loss and is more robust to noisy step-level labels.

### Architecture Choices

Most PRMs are built on top of pretrained language models. The dominant architecture takes the full trajectory as a token sequence and adds a scalar prediction head after each step boundary token. Step boundaries are marked by special tokens or detected by formatting patterns (e.g., newlines, action delimiters). Common base models range from 7B to 70B parameters, with 7B-13B providing the best cost-performance trade-off for evaluation purposes.

### PRMs vs. ORMs

| Dimension | PRM | ORM |
|-----------|-----|-----|
| Supervision granularity | Per-step | Per-trajectory |
| Credit assignment | Direct | Requires attribution |
| Training data cost | High (step labels) | Low (outcome labels) |
| Evaluation signal density | Dense | Sparse |
| Sensitivity to trajectory length | Scales naturally | Diluted with length |

Empirically, PRMs outperform ORMs for selecting correct solutions via best-of-N sampling. Lightman et al. (2023) showed that PRM-guided selection solved 12.5% more math problems than ORM-guided selection at N=100 samples.

### Application in Agent Evaluation

In the agent evaluation context, PRMs serve as automated trajectory scorers that approximate the metrics defined in `trajectory-quality-metrics.md`. A trained PRM can:

- Score each step in a trajectory, creating a step-quality profile
- Identify the specific steps where quality degrades
- Rank multiple agent trajectories for the same task without human review
- Provide dense training signal for agent improvement via reinforcement learning

The evaluation pipeline is: (1) run the agent on evaluation tasks, (2) collect trajectories, (3) score each step with the PRM, (4) aggregate step scores into trajectory-level metrics, (5) analyze patterns across tasks and agent configurations.

## Why It Matters

1. **Scalable process evaluation**: Human trajectory annotation costs $15-50 per trajectory. A trained PRM evaluates thousands of trajectories per minute at negligible marginal cost, making process evaluation feasible at scale.
2. **Dense credit assignment**: ORMs provide one bit of feedback per trajectory. PRMs provide feedback at every step, making it dramatically easier to identify where agents struggle and why.
3. **Better selection via search**: When agents generate multiple candidate trajectories, PRM-guided selection consistently outperforms ORM-guided selection, because step-level scores better predict trajectory quality than outcome-only estimates.
4. **Training signal for improvement**: PRMs provide the dense reward signal needed for reinforcement learning-based agent improvement, overcoming the sparse reward problem that plagues outcome-only optimization.

## Key Technical Details

- PRM training typically requires 10,000-100,000 step-labeled trajectories for reasonable performance; below 5,000, overfitting is severe
- Monte Carlo estimation for step labels requires 16-64 rollouts per step for stable estimates; fewer rollouts produce high-variance labels
- PRM agreement with human step-level judgments: 78-85% for math reasoning, 65-75% for code generation, 60-70% for open-ended agent tasks
- Step-level calibration is critical: PRMs should output probabilities that reflect true step correctness rates. Uncalibrated PRMs produce misleading aggregate scores
- Training on a mixture of human labels and Monte Carlo estimates (typically 20% human, 80% MC) outperforms either source alone
- PRM inference adds 10-30% overhead to evaluation time compared to outcome-only evaluation, but this is orders of magnitude cheaper than human annotation
- Domain transfer is limited: a PRM trained on math trajectories performs poorly on coding trajectories. Domain-specific training data is currently necessary

## Common Misconceptions

**"PRMs can perfectly identify good and bad steps."** Current PRMs achieve 78-85% accuracy on step-level judgments in well-studied domains like math. In more complex agent domains, accuracy drops to 60-70%. They are useful approximations, not ground truth.

**"PRMs eliminate the need for human evaluation."** PRMs complement human evaluation by scaling it. The initial training data still requires human annotation, and PRM outputs should be periodically validated against human judgments to detect drift or systematic errors.

**"A single PRM works across all agent tasks."** PRMs are domain-sensitive. The features that indicate a good step in mathematical reasoning (logical validity) differ from those in web navigation (progress toward target page) or code generation (syntactic and semantic correctness). Multi-domain PRMs exist but underperform domain-specific ones by 10-15%.

**"Step-level rewards are straightforward to define."** What constitutes a "good step" is often ambiguous. An exploratory action that seems wasteful may gather information critical for later steps. Defining and consistently labeling step quality is one of the hardest challenges in PRM development.

## Connections to Other Concepts

- `trajectory-quality-metrics.md` defines the metrics that PRMs aim to approximate automatically
- `error-recovery-evaluation.md` can use PRMs to score recovery steps, distinguishing effective recovery from flailing
- `planning-quality-assessment.md` benefits from PRMs that specialize in scoring planning steps vs. execution steps
- `specification-gaming-detection.md` can leverage PRM anomalies (high outcome score but low step scores) as a gaming signal
- `../ai-agent-concepts/08-evaluation-and-testing/trajectory-evaluation.md` provides the broader framework within which PRMs operate

## Further Reading

- "Let's Verify Step by Step" -- Lightman et al., 2023
- "Solving Math Word Problems with Process- and Outcome-Based Feedback" -- Uesato et al., 2022
- "Math-Shepherd: Verify and Reinforce LLMs Step-by-step without Human Annotations" -- Wang et al., 2024
- "Generative Verifiers: Reward Modeling as Next-Token Prediction" -- Hosseini et al., 2024
- "OmegaPRM: Improve Mathematical Reasoning in Language Models by Automated Process Supervision" -- Luo et al., 2024
