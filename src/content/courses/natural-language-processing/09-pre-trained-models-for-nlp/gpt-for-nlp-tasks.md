# GPT for NLP Tasks

**One-Line Summary**: The GPT series -- from GPT-1's generative pre-training with discriminative fine-tuning, through GPT-2's surprising zero-shot abilities, to GPT-3's in-context learning revolution -- demonstrated that autoregressive decoder-only transformers can perform virtually any NLP task through prompting alone, without task-specific fine-tuning.

**Prerequisites**: `attention-mechanism.md`, `transfer-learning-in-nlp.md`, `bert.md`, `text-generation.md`, `n-gram-language-models.md`

## What Is GPT for NLP Tasks?

Imagine a prodigiously well-read author who has consumed millions of books, articles, and web pages. You hand them a few examples of a task -- say, translating English to French -- written on a notecard. Without any special training in translation, they can continue the pattern and produce competent translations simply by recognizing the format and applying their vast knowledge. This is how GPT-3 approaches NLP: by reformulating every task as text completion.

GPT (Generative Pre-trained Transformer), developed by OpenAI, is a family of autoregressive language models built on the decoder-only transformer architecture. Unlike `bert.md`, which is an encoder trained with masked language modeling, GPT models predict the next token given all preceding tokens -- pure left-to-right generation. This seemingly simple difference has profound implications: GPT models can generate arbitrary text, which means any NLP task can be reformulated as "complete this text" via careful prompt design.

The GPT series traces a remarkable trajectory from traditional fine-tuning (GPT-1) through zero-shot task transfer (GPT-2) to few-shot in-context learning at scale (GPT-3), fundamentally reshaping how NLP tasks are approached and setting the stage for instruction-tuned models like ChatGPT and GPT-4.

## How It Works

### GPT-1: Generative Pre-Training + Discriminative Fine-Tuning (2018)

**Pre-training.** GPT-1 used a 12-layer transformer decoder (117M parameters) pre-trained on BooksCorpus (7,000 unpublished books, ~800M tokens) with a standard causal language modeling objective:

```
L_pretrain = -sum_{i} log P(t_i | t_1, ..., t_{i-1}; theta)
```

Each position can only attend to positions to its left (causal masking), enforcing autoregressive generation. For transformer mechanics, see `llm-concepts/01-foundational-architecture/causal-attention.md`.

**Fine-tuning.** For downstream tasks, GPT-1 added a linear output layer on top of the final transformer representation and fine-tuned all parameters. Crucially, it combined the task loss with the language modeling loss as an auxiliary objective:

```
L_finetune = L_task + lambda * L_LM
```

This auxiliary LM loss (lambda = 0.5) improved generalization and accelerated convergence. Different tasks were handled by reformulating inputs with delimiter tokens: for NLI, the premise and hypothesis were concatenated with a special separator; for classification, the text was followed by a linear classifier on the final token.

GPT-1 achieved state-of-the-art on 9 of 12 benchmarks, demonstrating that generative pre-training followed by discriminative fine-tuning was viable, though BERT would surpass it within months.

### GPT-2: Zero-Shot Task Transfer (2019)

GPT-2 scaled to 1.5B parameters (10x GPT-1) and trained on WebText, a curated dataset of 8 million web pages (40GB of text) sourced by following links from Reddit posts with 3+ upvotes.

The key discovery was emergent zero-shot task performance. Without any fine-tuning or task-specific training, GPT-2 could perform tasks when the input was formatted appropriately:

- **Translation**: "Translate English to French: cheese =>" yielded "fromage" with reasonable accuracy.
- **Summarization**: Appending "TL;DR:" to a passage produced coherent summaries.
- **Reading comprehension**: Framing questions after a passage yielded correct answers on 55% of CoQA examples.

GPT-2 achieved a perplexity of 35.8 on WikiText-103 (zero-shot), beating the previous supervised SOTA of 37.5. This was the first clear evidence that language models acquire broad task capabilities simply through scale and diverse training data.

### GPT-3: In-Context Learning Revolution (2020)

GPT-3 scaled to 175B parameters and trained on a filtered blend of Common Crawl, WebText2, Books1, Books2, and Wikipedia (~300B tokens). Its most transformative contribution was **in-context learning** -- the ability to perform tasks from just a few examples provided in the prompt, with no gradient updates:

**Zero-shot**: Task description only. "Translate English to French: cheese =>"
**One-shot**: One example + the test input.
**Few-shot**: 2-64 examples + the test input.

On SuperGLUE, GPT-3 few-shot (32 examples) scored 71.8 -- not matching fine-tuned BERT-large (82.1) but remarkable for requiring no training. On translation (WMT'14 En-Fr), few-shot GPT-3 reached 32.6 BLEU, competitive with early supervised neural MT systems.

The mechanism behind in-context learning remains debated: it may involve implicit gradient descent in the forward pass (Akyurek et al., 2022), task identification from pre-training (Xie et al., 2022), or induction head circuits (Olsson et al., 2022).

### Prompt-Based Task Reformulation

GPT's approach requires reformulating every NLP task as text generation:

| NLP Task | Prompt Format |
|----------|--------------|
| Sentiment | "Review: [text]. Sentiment: " |
| NLI | "Premise: [P]. Hypothesis: [H]. Relationship: " |
| QA | "[Context]. Q: [question]. A: " |
| NER | "[text]. List all person names: " |
| Summarization | "[text] TL;DR: " |

This reformulation connects directly to `prompt-based-nlp.md`, which explores systematic approaches to prompt design.

### Decoder-Only vs. Encoder-Only: The Paradigm Debate

The GPT (decoder-only) vs. BERT (encoder-only) debate centers on a fundamental trade-off:

- **BERT/Encoder**: Bidirectional attention gives richer representations for understanding tasks (classification, NER, QA), but cannot generate text natively.
- **GPT/Decoder**: Unidirectional attention is optimal for generation, and tasks can be reformulated as generation problems, but it wastes capacity on causal masking for pure understanding tasks.
- **T5/Encoder-Decoder**: Combines both, using full bidirectional encoding + autoregressive decoding (see `t5-and-text-to-text.md`).

In practice, the debate has been largely settled by scale: at sufficient size (100B+ parameters), decoder-only models perform understanding tasks comparably to encoder models, while retaining generation capabilities. This is why the GPT lineage led to modern LLMs.

## Why It Matters

1. **Unified NLP interface**: GPT showed that prompting can replace task-specific architectures and fine-tuning, collapsing hundreds of NLP tasks into a single text-completion interface.
2. **Reduced data requirements for new tasks**: Few-shot in-context learning eliminates the need for large labeled datasets, enabling rapid prototyping of NLP solutions.
3. **Foundation for instruction-tuned models**: GPT-3 was the basis for InstructGPT, ChatGPT, and GPT-4, whose instruction-following capabilities are built on in-context learning plus RLHF (see `llm-concepts/05-alignment-and-post-training/dpo.md`).
4. **Democratized access to NLP**: API-based access to GPT-3 allowed developers without ML expertise to build NLP applications through prompt engineering (see `prompt-based-nlp.md`).
5. **Scaling laws validation**: GPT-3 provided strong evidence for neural scaling laws -- performance improves predictably with model size, data, and compute.

## Key Technical Details

- **GPT-1**: 12 layers, 768 hidden, 12 heads, 117M parameters, trained on BooksCorpus (~800M tokens).
- **GPT-2**: 48 layers, 1600 hidden, 25 heads, 1.5B parameters, trained on WebText (~40GB).
- **GPT-3**: 96 layers, 12288 hidden, 96 heads, 175B parameters, trained on ~300B tokens (filtered Common Crawl + books + Wikipedia).
- **GPT-3 training cost**: Estimated $4.6M (in 2020 cloud compute prices), ~3,640 petaflop-days.
- **In-context learning examples**: GPT-3 few-shot (32 examples) on SuperGLUE: 71.8 (vs. fine-tuned BERT-large: 82.1, fine-tuned T5-11B: 89.3).
- **Translation**: GPT-3 few-shot on WMT'14 En-Fr: 32.6 BLEU; supervised SOTA at the time: ~45 BLEU.
- **Zero-shot story generation**: GPT-2 produced coherent multi-paragraph text that was difficult for humans to distinguish from human writing.
- **Context window**: GPT-3 uses 2,048 tokens; this limits the number of few-shot examples that can fit in the prompt.

## Common Misconceptions

**"GPT cannot do NLU tasks, only generation."** GPT performs understanding tasks by reformulating them as generation. GPT-3 few-shot on COPA (causal reasoning) achieves 92% accuracy, and fine-tuned GPT-1 matched BERT on many GLUE tasks. The encoder vs. decoder distinction matters less than model scale and training data quality.

**"Few-shot learning means the model learns from the examples."** In-context learning does not involve gradient updates. The examples activate patterns already learned during pre-training. The model is not "learning" from few-shot examples in the traditional sense -- it is recognizing the task format and applying existing knowledge. This is fundamentally different from few-shot fine-tuning.

**"GPT-3 is always better than fine-tuned BERT."** For specific tasks with sufficient labeled data, a fine-tuned BERT-large (340M parameters) often outperforms GPT-3 few-shot (175B parameters). Fine-tuned GPT-3 is typically best, but few-shot GPT-3 trades accuracy for flexibility and zero training cost.

**"GPT models only work for English."** While GPT-2 was English-focused, GPT-3's training data included multilingual text, enabling reasonable zero-shot performance on non-English tasks. However, performance degrades significantly for lower-resource languages compared to dedicated multilingual models (see `cross-lingual-transfer.md`).

## Connections to Other Concepts

- `bert.md` is GPT's encoder-only counterpart, representing the opposite design choice (bidirectional encoding vs. autoregressive decoding).
- `transfer-learning-in-nlp.md` provides the theoretical framework for understanding why pre-training + adaptation works.
- `t5-and-text-to-text.md` unified the encoder-only and decoder-only approaches under an encoder-decoder text-to-text framework.
- `prompt-based-nlp.md` formalizes the task reformulation techniques that GPT's success catalyzed.
- `text-generation.md` covers decoding strategies (top-k, nucleus sampling) critical for GPT's generation quality.
- `text-classification.md` and `sentiment-analysis.md` can be performed via GPT prompting as an alternative to fine-tuning.
- `elmo.md` represents the earlier feature-based approach that GPT-1 helped displace with its fine-tuning paradigm.
- In the LLM Concepts collection, `llm-concepts/01-foundational-architecture/causal-attention.md` details the left-to-right attention mechanism GPT uses, and `llm-concepts/07-inference-and-deployment/sampling-strategies.md` covers the decoding methods for GPT generation.

## Further Reading

- Radford et al., *Improving Language Understanding by Generative Pre-Training (GPT-1)*, 2018 -- introduced generative pre-training + discriminative fine-tuning for NLP.
- Radford et al., *Language Models are Unsupervised Multitask Learners (GPT-2)*, 2019 -- demonstrated zero-shot task transfer from a large language model.
- Brown et al., *Language Models are Few-Shot Learners (GPT-3)*, 2020 -- established in-context learning and few-shot prompting as a viable paradigm for NLP.
- Xie et al., *An Explanation of In-context Learning as Implicit Bayesian Inference*, 2022 -- provides a theoretical framework for understanding in-context learning.
- Kaplan et al., *Scaling Laws for Neural Language Models*, 2020 -- empirical scaling laws that motivated GPT-3's massive scale and predict performance from compute.
