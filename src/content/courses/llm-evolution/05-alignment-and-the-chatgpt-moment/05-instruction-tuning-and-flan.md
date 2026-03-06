# Instruction Tuning and FLAN

**One-Line Summary**: Google's FLAN showed that fine-tuning language models on diverse NLP tasks phrased as natural-language instructions dramatically improves zero-shot generalization, and scaling to 1,800 tasks produced some of the largest gains in model capability per dollar ever observed.

**Prerequisites**: `01-gpt-3.md`, `01-attention-is-all-you-need.md`

## What Is Instruction Tuning?

Imagine you are training a dog. You could teach it "sit" by physically pushing its hindquarters down every time you say the word — this is task-specific fine-tuning, one command at a time. Or you could teach it dozens of commands with a consistent methodology — voice tone, hand signals, reward timing — until the dog learns not just specific commands but the general concept of "follow human instructions." At that point, it can pick up new commands rapidly because it understands the meta-pattern. Instruction tuning teaches language models this same meta-skill: how to follow instructions in general, not just how to perform specific tasks.

The concept was formalized by Jason Wei and colleagues at Google in the 2021 paper introducing FLAN (Fine-tuned LAnguage Net). The team took a 137B parameter language model and fine-tuned it on over 60 NLP datasets, each rephrased as a natural-language instruction. For example, a sentiment analysis task might become: "Is the following movie review positive or negative? [review text]." A translation task might become: "Translate the following sentence from English to French: [sentence]." The model was then evaluated on held-out tasks it had never seen during fine-tuning.

The results were striking: FLAN dramatically outperformed the base model on zero-shot tasks, and on many tasks it outperformed few-shot GPT-3 despite being the same size. The key insight was that the diversity of instruction formats during training taught the model to generalize the concept of instruction-following itself. This was complementary to RLHF — while RLHF taught models to produce preferred outputs, instruction tuning taught them to understand what was being asked in the first place.

## How It Works

```
  Instruction Tuning: Teaching Models to Follow Instructions

  Before Instruction Tuning:               After Instruction Tuning:
  ┌───────────────────────────┐            ┌───────────────────────────┐
  │ Input: "Is this positive  │            │ Input: "Is this positive  │
  │ or negative? I loved it." │            │ or negative? I loved it." │
  │                           │            │                           │
  │ Output: "I loved it too!" │            │ Output: "positive"        │
  │ (continues the text)      │            │ (follows the instruction) │
  └───────────────────────────┘            └───────────────────────────┘

  FLAN Scaling: More Tasks = Better Generalization
  ┌─────────────────────────────────────────────────────────┐
  │                                                         │
  │  Original FLAN (2021):  62 tasks   ──▶ Strong zero-shot│
  │  Flan-PaLM (2022):     1,836 tasks ──▶ +9.4% avg gain │
  │                                                         │
  │  Tasks include (each with instruction templates):       │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
  │  │   NLI    │ │   QA     │ │  Sent.   │ │ Transl.  │  │
  │  │          │ │          │ │ Analysis │ │          │  │
  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
  │  │  Coref.  │ │  Summ.   │ │   CoT    │ │  ...     │  │
  │  │          │ │          │ │ Reasoning│ │  (1800+) │  │
  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
  │                                                         │
  │  Evaluation: Leave-one-cluster-out                      │
  │  (train on 11 clusters, test on held-out 12th)          │
  └─────────────────────────────────────────────────────────┘

  Alpaca Insight (2023): You can do this for $600
  GPT-3.5 ──▶ 52K synthetic instructions ──▶ fine-tune LLaMA 7B
```
*Figure: Instruction tuning converts diverse NLP tasks into natural-language instruction format, teaching the model the meta-skill of following instructions. Scaling from 62 to 1,836 tasks produced a 9.4% average improvement on PaLM.*

### The Original FLAN (2021)

FLAN was built on top of a 137B parameter LaMDA-PT model (a pre-trained version of the model that became LaMDA). The training data consisted of 62 NLP datasets grouped into 12 task clusters: natural language inference, reading comprehension, closed-book QA, translation, commonsense reasoning, coreference resolution, struct-to-text, sentiment analysis, paraphrase detection, and others. Each dataset was converted into an instruction format using 10 manually-written templates per dataset.

The critical evaluation methodology was leave-one-cluster-out: when evaluating on a task cluster, all datasets from that cluster were excluded from training. This ensured that improvements came from learning to follow instructions in general, not from memorizing specific task formats. FLAN improved over the untuned model on 20 of 25 evaluation datasets, and in many cases the improvement was dramatic — 15-30 percentage points on zero-shot performance.

### Scaling to Flan-PaLM (2022)

In 2022, Hyung Won Chung and colleagues at Google scaled instruction tuning dramatically with the Flan-PaLM collection. They increased the number of tasks from 62 to 1,836, added chain-of-thought reasoning examples, and applied instruction tuning to PaLM (540B parameters). The result, Flan-PaLM, improved over base PaLM by 9.4% on average across held-out benchmarks — a massive gain for a technique that only involved fine-tuning, not architectural changes or additional pre-training.

Key findings from the scaling study:

- **More tasks help**: Performance improved log-linearly with the number of fine-tuning tasks, with no sign of saturation at 1,836 tasks.
- **Chain-of-thought helps**: Including chain-of-thought reasoning examples in 9 of the task clusters improved reasoning performance without hurting other tasks.
- **It scales with model size**: The benefit of instruction tuning grew with model scale — larger models benefited more from the same instruction tuning data.

### Stanford Alpaca: The Budget Version (2023)

In March 2023, Stanford researchers demonstrated that instruction tuning could be done cheaply. They used the OpenAI API to generate 52,000 instruction-following examples from GPT-3.5 for approximately $600. These synthetic examples were used to fine-tune LLaMA 7B, producing "Alpaca" — a model that, in informal evaluations, behaved remarkably like a helpful assistant. While not as capable as ChatGPT, Alpaca showed that the instruction-following capability could be distilled from a large model to a small one at minimal cost. This discovery ignited the open-source fine-tuning revolution.

### The Instruction Data Taxonomy

Instruction tuning data can be categorized along several dimensions:

- **Source**: Human-written (FLAN, Super-Natural Instructions) vs. synthetic (Alpaca, Self-Instruct)
- **Format**: Input-output only vs. input-chain-of-thought-output
- **Diversity**: Number of distinct task types (62 in FLAN, 1,836 in Flan-PaLM)
- **Quality**: High-quality curated (FLAN) vs. noisy machine-generated (some Alpaca variants)

Research consistently showed that diversity and quality matter more than raw quantity — a few thousand high-quality, diverse instructions can outperform hundreds of thousands of homogeneous ones.

## Why It Matters

### The Missing Link Between Pre-Training and Usability

Pre-trained language models like GPT-3 and PaLM had enormous capability stored in their weights, but accessing it required careful prompt engineering and few-shot examples. Instruction tuning unlocked this latent capability by teaching models to respond to natural instructions. It was the bridge between raw language modeling and practical assistant behavior — and it was simpler and cheaper than RLHF.

### The +9.4% Free Lunch

Flan-PaLM's 9.4% average improvement over base PaLM was remarkable because it required only fine-tuning — no additional pre-training, no architecture changes, no expensive RL optimization. For a 540B parameter model that cost millions to pre-train, instruction tuning was essentially free by comparison. This made it a no-brainer: every lab adopted instruction tuning as a standard post-training step.

### Enabling the Open-Source Explosion

Alpaca's demonstration that instruction tuning could be done for $600 with synthetic data was the catalyst for the open-source model explosion of 2023. Within weeks, the community produced Vicuna (trained on ShareGPT conversations), WizardLM (evolved instructions for complexity), and dozens of other variants. Instruction tuning democratized the creation of useful AI assistants: you did not need billions of dollars — you needed a base model, some instruction data, and a few GPUs.

## Key Technical Details

- **Original FLAN (2021)**: Wei et al., 137B model, 62 datasets, 12 task clusters
- **Flan-PaLM (2022)**: Chung et al., PaLM 540B, 1,836 tasks, +9.4% avg improvement
- **Stanford Alpaca (2023)**: 52K synthetic instructions from GPT-3.5, $600 API cost, LLaMA 7B
- **Task scaling**: Performance improves log-linearly with number of instruction tasks
- **Chain-of-thought**: Including CoT examples in instruction tuning improves reasoning
- **Model scaling**: Larger models benefit more from instruction tuning
- **Super-Natural Instructions (2022)**: Wang et al., 1,600+ tasks with detailed schemas
- **Self-Instruct (2022)**: Wang et al., model generates its own instruction data

## Common Misconceptions

- **"Instruction tuning and RLHF are the same thing."** Instruction tuning uses supervised learning on instruction-response pairs. RLHF uses reinforcement learning to optimize for human preferences. They address different aspects of model behavior (understanding instructions vs. producing preferred outputs) and are typically used together in modern training pipelines.

- **"Instruction tuning teaches the model new knowledge."** Like RLHF, instruction tuning primarily reorganizes existing knowledge to be accessible through instructions. The model does not learn new facts — it learns a new interface for surfacing what it already knows.

- **"More instruction data is always better."** Research consistently shows that data quality and diversity matter more than quantity. LIMA (Zhou et al., 2023) showed that just 1,000 carefully curated examples could produce strong instruction following, challenging the assumption that scale of instruction data is critical.

- **"Instruction tuning was invented by Google."** The concept of fine-tuning on task descriptions predates FLAN. GPT-3's prompt engineering was a form of in-context instruction following. But FLAN was the first systematic study showing that multi-task instruction tuning produces zero-shot generalization.

## Connections to Other Concepts

- `01-instructgpt-and-rlhf.md` — RLHF builds on instruction tuning; most pipelines do SFT (instruction tuning) first, then RLHF
- `01-gpt-3.md` — GPT-3's in-context learning was an alternative to instruction tuning for task generalization
- `04-palm.md` — Flan-PaLM showed instruction tuning's impact at 540B scale
- `02-the-alpaca-effect.md` — Alpaca applied instruction tuning cheaply with synthetic data, sparking the open-source boom
- `06-synthetic-data-for-training.md` — Self-Instruct and Alpaca pioneered synthetic instruction data generation
- `07-lamda-and-conversational-ai.md` — LaMDA's dialogue fine-tuning was a related but distinct approach
- `03-chinchilla-and-compute-optimal-training.md` — Instruction tuning showed that post-training efficiency matters alongside pre-training efficiency

## Further Reading

- Wei et al., "Finetuned Language Models Are Zero-Shot Learners" (2021) — The original FLAN paper.
- Chung et al., "Scaling Instruction-Finetuned Language Models" (2022) — Flan-PaLM and the scaling study.
- Wang et al., "Self-Instruct: Aligning Language Models with Self-Generated Instructions" (2022) — Model-generated instruction data.
- Taori et al., "Stanford Alpaca: An Instruction-following LLaMA model" (2023) — The $600 instruction tuning demonstration.
- Zhou et al., "LIMA: Less Is More for Alignment" (2023) — Showed 1,000 examples can suffice for instruction following.
