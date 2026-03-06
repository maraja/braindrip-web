# Codex and Code Generation

**One-Line Summary**: OpenAI's Codex, a GPT-3 model fine-tuned on 54 million GitHub repositories, proved that language models could write functional code and launched the AI-assisted programming revolution through GitHub Copilot.

**Prerequisites**: `01-gpt-3.md`, `02-kaplan-scaling-laws.md`

## What Is Codex?

Imagine you hired a junior developer who had read every public repository on GitHub — every function, every comment, every Stack Overflow answer linked in the code. They cannot reason about algorithms from first principles, but they have seen so many patterns that they can autocomplete nearly anything you start typing. That is Codex: not a programmer that thinks, but a pattern engine so vast that the distinction starts to blur.

Published in August 2021 by Mark Chen and colleagues at OpenAI, Codex was a descendant of GPT-3 fine-tuned specifically on code. The base GPT-3 model already showed some ability to generate code — after all, its training data included web pages with code snippets. But its performance was poor: only about 0.5% on OpenAI's new HumanEval benchmark (164 hand-written Python programming problems). Codex, after continued pre-training on 159 GB of Python code from 54 million GitHub repositories, scored 28.8% on HumanEval (the 12B parameter version). The 300M version still scored 13.2%, showing that code capability could be instilled even in smaller models.

The motivation was both scientific and commercial. Scientifically, the question was whether the domain-specific knowledge needed for code generation could be acquired through continued pre-training — a technique now called domain adaptation. Commercially, OpenAI saw an enormous market opportunity: every software developer in the world could benefit from an AI assistant that understood code. Within months of the paper, Codex powered GitHub Copilot, which went on to become the first large-scale, commercially successful AI product built on a language model.

## How It Works

```
  Codex: From Language Model to Code Generator

  ┌─────────────────────────────────────────────────────┐
  │  GPT-3 (pre-trained on web text)                    │
  │  HumanEval: 0.5% pass@1  (nearly useless for code) │
  │                     │                               │
  │            Continued pre-training                   │
  │            on 159GB Python code                     │
  │            (54M GitHub repos)                       │
  │                     │                               │
  │                     ▼                               │
  │  Codex-12B                                          │
  │  HumanEval: 28.8% pass@1  (functional!)            │
  │                     │                               │
  │            Fine-tune on standalone functions         │
  │            (docstring → function body)              │
  │                     │                               │
  │                     ▼                               │
  │  Codex-S                                            │
  │  HumanEval: 37.7% pass@1  (strong!)                │
  └─────────────────────────────────────────────────────┘

  HumanEval Example:
  ┌──────────────────────────────────────────┐
  │ def has_close_elements(numbers, threshold)│
  │     """Check if any two numbers in list  │
  │     are closer than threshold."""         │
  │     # Codex generates: ───────────────── │
  │     for i, n1 in enumerate(numbers):     │
  │         for n2 in numbers[i+1:]:         │
  │             if abs(n1 - n2) < threshold: │
  │                 return True              │
  │     return False                         │
  └──────────────────────────────────────────┘

  pass@k: Generate k solutions, check if ANY passes tests
  pass@1: 28.8%   pass@10: 46.8%   pass@100: 72.3%
```
*Figure: Codex's training pipeline shows domain adaptation via continued pre-training on code. The pass@k metric reveals that Codex often "knows" the answer but struggles with reliability -- generating 100 solutions yields a 72.3% chance of getting a correct one.*

### Training Pipeline

Codex started from a pre-trained GPT-3 checkpoint (specifically the GPT-3 12B variant for the main results) and underwent continued pre-training on code. The training corpus consisted of 159 GB of unique Python files collected from 54 million public GitHub repositories. Files were filtered to exclude very large files, auto-generated code, and exact duplicates. The model was trained using the standard autoregressive language modeling objective — predict the next token — with no special code-specific modifications.

A key technical detail: the tokenizer was GPT-3's standard BPE tokenizer, which was designed for natural language. This meant that common code patterns like whitespace indentation were tokenized inefficiently. Despite this handicap, Codex performed well, suggesting that the model's capacity could overcome tokenizer limitations. Later code models would use tokenizers better adapted for code.

### HumanEval Benchmark

The paper introduced HumanEval, a benchmark of 164 hand-crafted Python programming problems with associated test cases. Each problem includes a function signature and docstring, and the model must generate a correct implementation. The metric, pass@k, measures the probability that at least one of k generated samples passes all test cases. Codex-12B achieved 28.8% pass@1 and 72.3% pass@100 (generating 100 solutions and checking if any is correct). This showed that Codex often "knew" the answer but struggled with reliability — a pattern that would persist across all code generation models.

### From Research to Product: GitHub Copilot

In June 2021, GitHub launched Copilot as a technical preview, powered by a Codex model customized for IDE integration. Copilot provided real-time code suggestions as developers typed, completing functions, generating boilerplate, and even translating comments into code. By February 2023, Copilot had over 1 million paying subscribers. By 2024, GitHub reported that Copilot generated over 40% of code in supported languages for users who had it enabled. This was the first demonstration that an LLM could become an indispensable daily tool for millions of knowledge workers.

### Supervised Fine-Tuning on Standalone Functions

The paper also explored Codex-S, a variant fine-tuned on standalone, correctly-implemented functions. This docstring-to-function training format — where the input is a docstring and the output is a function body — boosted pass@1 from 28.8% to 37.7%. This showed that instruction-style fine-tuning could significantly improve task performance even for code, foreshadowing the instruction-tuning revolution that would follow with InstructGPT and FLAN.

## Why It Matters

### The First Killer App for LLMs

Before Codex, large language models were impressive demos. GPT-3 could write essays and answer trivia, but it did not have a clear, high-value daily use case. Codex, through Copilot, changed this. Software development was the perfect application domain: code is relatively easy to evaluate (it either runs or it doesn't), developers were already accustomed to autocomplete tools, and the economic value of developer productivity is enormous. Copilot proved that LLMs could be practically useful at scale, not just intellectually interesting.

### Domain Specialization via Continued Pre-Training

Codex established the continued pre-training paradigm for domain adaptation. Rather than training a code model from scratch, OpenAI took an existing general-purpose model and specialized it by training further on domain-specific data. This approach preserved the model's general language understanding while adding code expertise. It became the standard approach for specialized models: medical LLMs, legal LLMs, financial LLMs, and scientific LLMs all followed the same recipe.

### Opening the Code Generation Race

Codex sparked a wave of code generation research. DeepMind released AlphaCode (Feb 2022), which could compete at the level of an average participant in Codeforces programming competitions. Salesforce released CodeGen. Meta released InCoder and later Code Llama. Amazon released CodeWhisperer. Google integrated code generation into its models. The AI-assisted coding market that Codex created was projected to reach tens of billions of dollars annually by 2025.

## Key Technical Details

- **Base model**: GPT-3 (12B variant for main results)
- **Training data**: 159 GB of Python code from 54M GitHub repositories
- **HumanEval pass@1**: 28.8% (12B version), 0.5% for base GPT-3
- **HumanEval pass@100**: 72.3% (12B version)
- **Codex-S (fine-tuned on functions)**: 37.7% pass@1
- **Published**: August 2021 by Chen et al. at OpenAI
- **Product**: Powered GitHub Copilot (launched June 2021 preview)
- **Copilot users**: 1M+ paying subscribers by early 2023
- **Languages**: Primarily Python, but functional across many languages

## Common Misconceptions

- **"Codex understands code."** Codex predicts the next token in a code sequence. It has no model of program execution, no understanding of memory allocation or runtime behavior. It succeeds by pattern matching against an enormous corpus of code, which is powerful but fundamentally different from understanding.

- **"Codex was trained only on code."** It started from a pre-trained GPT-3 checkpoint, which was trained on natural language. The natural language capability was essential — it allowed Codex to understand docstrings, comments, and variable names, connecting natural language intent to code patterns.

- **"Copilot copies code from GitHub."** While Copilot's training data came from GitHub, its outputs are generated token by token from the model's learned distribution. It can produce outputs similar to training examples (raising legitimate copyright concerns), but it is not a search engine that retrieves and pastes code snippets.

- **"Code generation replaced developers."** Copilot accelerated developers but did not replace them. The 28.8% pass@1 rate meant that most generated code needed human review and correction. The tool was most valuable for boilerplate, autocomplete, and generating first drafts — augmenting, not replacing, human programmers.

## Connections to Other Concepts

- `01-gpt-3.md` — Codex was built on GPT-3 via continued pre-training
- `04-palm.md` — PaLM showed strong code generation from only 5% code data, a contrasting approach
- `01-instructgpt-and-rlhf.md` — Codex-S's function fine-tuning foreshadowed instruction tuning
- `02-the-alpaca-effect.md` — Demonstrated that fine-tuning a base model for a specific format dramatically improves usability
- `07-gpt-4.md` — GPT-4's code capabilities far exceeded Codex
- `06-synthetic-data-for-training.md` — Later code models used synthetic data to augment training
- `01-llama-1.md` — LLaMA included 4.5% code in training, informed by Codex and PaLM findings

## Further Reading

- Chen et al., "Evaluating Large Language Models Trained on Code" (2021) — The Codex paper.
- Li et al., "Competition-Level Code Generation with AlphaCode" (2022) — DeepMind's approach to competitive programming.
- Nijkamp et al., "CodeGen: An Open Large Language Model for Code" (2022) — Salesforce's open-source alternative.
- Roziere et al., "Code Llama: Open Foundation Models for Code" (2023) — Meta's open-source code model family.
