# Synthetic Data for Training

**One-Line Summary**: The practice of using language models to generate training data for other (or the same) models became a defining technique of the LLM era, enabling everything from Stanford Alpaca's $600 chatbot to DeepSeek-R1's reasoning breakthroughs.

**Prerequisites**: `01-gpt-3.md`, `01-instructgpt-and-rlhf.md`, `05-instruction-tuning-and-flan.md`

## What Is Synthetic Data for Training?

Imagine a master chess player who teaches by playing games against themselves, annotating each move with explanations, and then giving these annotated games to students. The students learn not from the master's direct instruction but from the master's self-generated examples. Now imagine the students become good enough to generate their own annotated games, which they use to teach the next generation. This recursive, self-improving loop — where AI generates the data that trains AI — is the essence of synthetic data for LLM training.

The idea that models could generate useful training data for themselves or for other models emerged gradually. Early work on data augmentation in NLP used simple techniques like back-translation (translate a sentence to another language and back) to generate additional training examples. But the modern era of synthetic data began with Self-Instruct (Wang et al., December 2022), which showed that a language model could generate its own instruction-following training data by bootstrapping from a small seed set of examples. The model would generate an instruction, generate an input for that instruction, and then generate the output — creating complete training examples from nothing but its own capabilities.

The technique exploded in 2023 when Stanford's Alpaca project demonstrated its practical power: just $600 of GPT-3.5 API calls generated 52,000 instruction-following examples that, when used to fine-tune LLaMA 7B, produced a surprisingly capable chatbot. This single demonstration launched a wave of synthetic data research that has only accelerated since. By 2025, synthetic data was a core component of virtually every frontier model's training pipeline, used for everything from instruction tuning to reasoning enhancement to safety training.

## How It Works

```
  Synthetic Data: The Self-Improvement Loop

  Self-Instruct Bootstrap (Wang et al., 2022):
  ┌──────────────────────────────────────────────────────┐
  │  175 seed tasks (human-written)                      │
  │       │                                              │
  │       ▼                                              │
  │  ┌──────────────────────────────────────────┐        │
  │  │  1. Generate new instruction              │ ◄──┐  │
  │  │  2. Classify task type                    │    │  │
  │  │  3. Generate input for instruction        │    │  │
  │  │  4. Generate output                       │    │  │
  │  │  5. Filter (dedup, quality)               │    │  │
  │  └──────────────────┬───────────────────────┘    │  │
  │                     │                             │  │
  │                     ▼                             │  │
  │              52,000 examples ──────────────────────┘  │
  │              (add to pool, repeat)                    │
  └──────────────────────────────────────────────────────┘

  The Distillation Paradigm (Alpaca, Orca, etc.):
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │  TEACHER MODEL              STUDENT MODEL            │
  │  (GPT-4, large)             (LLaMA 7B, small)       │
  │  ┌──────────┐               ┌──────────┐            │
  │  │Generate  │               │Train on  │            │
  │  │examples, │──synthetic──▶│teacher's │            │
  │  │reasoning │   data        │outputs   │            │
  │  │traces    │               │          │            │
  │  └──────────┘               └──────────┘            │
  │                                                      │
  │  Cost: $600 for 52K examples (Alpaca, 2023)         │
  │  ──▶ Sparked the open-source model revolution       │
  └──────────────────────────────────────────────────────┘

  Evolution of Synthetic Data:
  Self-Instruct (2022) ──▶ Alpaca (2023) ──▶ Orca (2023)
  ──▶ GLAN (2024) ──▶ DeepSeek-R1 (2025, RL-discovered reasoning)
```
*Figure: Synthetic data generation evolved from bootstrapped instruction generation to large-scale teacher-student distillation to RL-discovered reasoning traces. The approach solved the data bottleneck and enabled the open-source model revolution.*

### Self-Instruct: The Bootstrap Approach

Wang et al.'s Self-Instruct (2022) established the foundational methodology. Starting from a seed set of 175 manually-written tasks, the process iterates:

1. **Instruction generation**: The model generates new task instructions, prompted by randomly sampled examples from the existing pool.
2. **Classification**: The model classifies each generated instruction as either a classification task or a generation task.
3. **Input generation**: For non-classification tasks, the model generates an appropriate input instance.
4. **Output generation**: The model generates the target output for the instruction-input pair.
5. **Filtering**: Near-duplicate instructions are removed using ROUGE-L similarity, and outputs that are too short, too long, or that begin with common refusal patterns are filtered out.

Applied to GPT-3 (text-davinci-003), Self-Instruct generated 52,000 instruction-output pairs. Fine-tuning GPT-3 on this self-generated data improved its instruction-following ability by 33% on human evaluations, approaching the performance of InstructGPT (which used expensive human-written demonstrations).

### Alpaca and the Distillation Paradigm

Stanford Alpaca (March 2023) adapted Self-Instruct by using GPT-3.5 (a more capable model) to generate training data for LLaMA 7B (a smaller, open-weight model). This created a distillation pipeline: the larger model's instruction-following capabilities were distilled into synthetic data, which was then used to transfer those capabilities to the smaller model. The 52,000 examples cost approximately $600 in API calls and took only a few hours to generate. The resulting model, while imperfect, demonstrated conversation abilities that had previously required months of RLHF training.

### Chain-of-Thought and Reasoning Distillation

A particularly powerful application of synthetic data emerged in reasoning. Rather than just generating instruction-output pairs, researchers used large models to generate step-by-step reasoning traces:

- **Chain-of-thought distillation**: A large model (the "teacher") solves math or reasoning problems step by step. These reasoning traces become training data for a smaller "student" model, teaching it to reason explicitly.
- **STaR (Self-Taught Reasoner)**: Zelikman et al. (2022) showed that a model could improve its own reasoning by generating chain-of-thought explanations, filtering for correct answers, and training on the successful reasoning traces.
- **Orca (2023)**: Microsoft used GPT-4 to generate detailed explanations and reasoning processes, training a 13B model that achieved remarkable reasoning capabilities.

### GLAN and Systematic Generation (2024)

Li et al.'s GLAN (Generalized Instruction Tuning via Synthetic Data, 2024) took a more systematic approach. Rather than generating random instructions, GLAN used a human-designed taxonomy of knowledge domains and skills. For each domain-skill combination, the model generated diverse instructions that exercised that specific capability. This systematic approach produced more balanced and comprehensive training data, addressing the problem of skewed topic distributions in uncurated synthetic data.

### DeepSeek-R1 and RL-Generated Reasoning

DeepSeek-R1 (2025) represented the frontier of synthetic data for reasoning. Rather than distilling reasoning from a teacher model, DeepSeek used reinforcement learning to have the model discover its own reasoning strategies. The model was rewarded for correct answers to math and coding problems, and through RL, it developed chain-of-thought reasoning behaviors autonomously. These RL-generated reasoning traces were then used as synthetic training data for distilling reasoning into smaller models, creating a self-improving cycle where the model's own discoveries became its training data.

## Why It Matters

### Solving the Data Bottleneck

Chinchilla showed that training data was becoming the primary bottleneck for scaling. High-quality human-written text on the internet is finite — estimated at a few trillion tokens for English. Synthetic data offers a way around this ceiling: models can generate effectively unlimited training data. By 2024, estimates suggested that synthetic data comprised a significant fraction (potentially 30-50% or more) of the training data for frontier models. The question shifted from "where do we find more data?" to "how do we generate better synthetic data?"

### Democratizing Model Training

Before synthetic data, creating a competitive language model required either massive web crawls (expensive to collect and clean) or proprietary datasets. Synthetic data generation democratized this: anyone with API access to a capable model could generate instruction data. This was the engine behind the open-source model boom of 2023 — Alpaca, Vicuna, WizardLM, OpenHermes, and hundreds of other models were all trained partly or entirely on synthetic data.

### The Self-Improvement Trajectory

The most profound implication of synthetic data is recursive self-improvement. A model generates data that trains a better model, which generates better data, which trains an even better model. This loop, while currently bounded by the capability of the teacher model and the difficulty of quality filtering, points toward a future where AI systems can improve without additional human input. The trajectory from Self-Instruct through STaR through DeepSeek-R1 shows this loop tightening with each generation.

## Key Technical Details

- **Self-Instruct (Wang et al., Dec 2022)**: 175 seed tasks -> 52K generated examples, 33% improvement on GPT-3
- **Stanford Alpaca (Mar 2023)**: $600 of GPT-3.5 API calls -> 52K examples -> fine-tuned LLaMA 7B
- **Vicuna (Mar 2023)**: Trained on ~70K ShareGPT conversations (user-generated, model-output data)
- **Orca (Microsoft, 2023)**: GPT-4-generated reasoning traces for 13B model training
- **GLAN (2024)**: Taxonomy-guided systematic instruction generation
- **DeepSeek-R1 (2025)**: RL-discovered reasoning traces used as synthetic training data
- **Estimated fraction of synthetic data in frontier training (2024-2025)**: 30-50%+
- **Key quality filters**: Correctness verification, deduplication, diversity scoring, difficulty calibration

## Common Misconceptions

- **"Synthetic data is lower quality than human data."** It depends entirely on the generation process. Carefully filtered synthetic data from capable models can exceed the average quality of scraped web text. The key is quality filtering, not the source.

- **"Training on synthetic data leads to model collapse."** Shumailov et al. (2023) showed that iteratively training on self-generated data without fresh data can degrade quality. But this applies to naive recursive training — carefully curated synthetic data mixed with real data does not cause collapse.

- **"Synthetic data is just copying the teacher model."** Synthetic data generation involves the teacher model producing novel outputs (new instructions, new reasoning traces, new examples) that it was not explicitly trained on. The diversity of synthetic data often exceeds what any single training example from the teacher could provide.

- **"You can replace all human data with synthetic data."** Current evidence suggests that human data provides signal that synthetic data does not fully replicate, particularly for nuanced judgment, cultural context, and edge cases. The best results come from mixing human and synthetic data.

## Connections to Other Concepts

- `05-instruction-tuning-and-flan.md` — Instruction tuning is the primary consumer of synthetic instruction data
- `02-the-alpaca-effect.md` — Alpaca was the breakthrough application of synthetic data for open-source models
- `03-constitutional-ai.md` — Constitutional AI's self-critique pipeline generates synthetic safety data
- `04-direct-preference-optimization.md` — DPO can train on AI-generated preference data (synthetic preferences)
- `03-chinchilla-and-compute-optimal-training.md` — Chinchilla's data hunger motivated synthetic data research
- `01-instructgpt-and-rlhf.md` — RLHF requires preference data; synthetic preferences reduce human labeling needs
- `07-gpt-4.md` — GPT-4 is widely used as a teacher model for generating synthetic training data

## Further Reading

- Wang et al., "Self-Instruct: Aligning Language Models with Self-Generated Instructions" (2022) — The foundational synthetic instruction data paper.
- Taori et al., "Stanford Alpaca" (2023) — The $600 demonstration that launched the open-source boom.
- Mukherjee et al., "Orca: Progressive Learning from Complex Explanation Traces of GPT-4" (2023) — Reasoning distillation via synthetic data.
- Shumailov et al., "The Curse of Recursion: Training on Generated Data Makes Models Forget" (2023) — The model collapse risk.
- Li et al., "Synthetic Data (Almost) from Scratch: Generalized Instruction Tuning for Language Models" (2024) — Taxonomy-guided synthetic data generation.
