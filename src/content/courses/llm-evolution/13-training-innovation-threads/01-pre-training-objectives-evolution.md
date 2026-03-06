# Pre-Training Objectives Evolution

**One-Line Summary**: The training objectives used to pre-train language models have evolved from simple next-token prediction into a diverse ecosystem of techniques, each making different tradeoffs between efficiency, bidirectionality, and downstream performance.

**Prerequisites**: `03-bert.md`, `02-gpt-1.md`, `05-t5-text-to-text-framework.md`

## What Is Pre-Training Objective Evolution?

Think of pre-training objectives as the exercises a student does before the real exam. Early language models did one type of exercise — predict the next word. Over time, researchers invented dozens of variations: fill in blanks, reorder sentences, detect swapped words, predict entire missing paragraphs. Each exercise trains a different kind of understanding, and the field has spent seven years discovering which exercises produce the most capable models.

The story of pre-training objectives is the story of how we learned to teach machines language itself. It begins with simple autoregression, branches into a zoo of alternatives, and converges — surprisingly — back toward the original approach, but with crucial refinements.

## How It Works

**Pre-Training Objectives -- How Models Learn From Text:**

```
CLM (GPT, 2018)            MLM (BERT, 2018)          Span Corruption (T5, 2020)
Predict next token         Predict masked tokens      Predict masked spans

 The cat sat on ___        The [M] sat [M] the mat   The <X> on the <Y>
                 ▲              ▲       ▲                   ▲         ▲
          predict "the"   predict    predict          predict    predict
                          "cat"     "on"             "cat sat"  "mat"

 ──────▶ direction        ◀──────▶ bidirectional     ──────▶ seq-to-seq
 Trains on 100% tokens    Trains on ~15% tokens      Trains on ~15% spans
 Used by: GPT, LLaMA,     Used by: BERT, RoBERTa    Used by: T5, UL2
          all modern LLMs

Convergence Timeline:
┌────────────────────────────────────────────────────────────────┐
│ 2018: CLM (GPT-1) vs MLM (BERT) -- competing paradigms       │
│ 2019: MLM dominates NLU benchmarks (RoBERTa, ALBERT)         │
│ 2020: T5 explores span corruption; ELECTRA: 100% token usage │
│ 2021: CLM scales better; GPT-3 demonstrates few-shot power   │
│ 2022: UL2 tries unifying; FIM enables code infilling         │
│ 2023+: CLM wins decisively. All frontier models use CLM.     │
│ 2024: Multi-Token Prediction adds auxiliary objectives        │
└────────────────────────────────────────────────────────────────┘
```

### Causal Language Modeling (CLM) -- The Foundation

GPT-1 (2018) introduced causal language modeling (CLM): given all previous tokens, predict the next one. This is the simplest objective and the one that ultimately won. Every GPT model, every LLaMA, every modern decoder-only model uses CLM.

Its power lies in its simplicity — it requires no data preprocessing beyond tokenization, works on any text corpus in any language, and scales predictably with both data and model size. The entire internet becomes your training set with zero annotation cost.

CLM is inherently unidirectional: the model can only attend to tokens that came before the current position, which mirrors the natural process of generating text left to right. This makes it directly useful for generation tasks — the model literally practices the same task during training that it performs during inference.

The training signal is dense: every token in every training example provides a gradient signal. Compare this to MLM, where only 15% of tokens contribute to learning. This efficiency advantage compounds over trillions of training tokens.

### Masked Language Modeling (MLM) — The Bidirectional Alternative

BERT (2018) introduced masked language modeling: randomly mask 15% of tokens, then predict them from surrounding context in both directions. This bidirectional context gave BERT a massive advantage on understanding tasks like question answering, sentiment analysis, and natural language inference.

But MLM has a fundamental limitation — the model only learns from 15% of tokens per example, making it roughly 6-7x less sample-efficient than CLM. The [MASK] token also creates a train-test mismatch since it never appears during inference. BERT partially addressed this by sometimes replacing masked positions with random tokens or leaving them unchanged, but the mismatch persisted.

### Span Corruption and Replaced Token Detection

T5 (Raffel et al., 2020) generalized masking to span corruption: mask contiguous spans of varying length (mean length 3) and predict the filled content. This proved more efficient than single-token masking because the model must reconstruct coherent multi-token sequences, learning richer dependencies within a single training example.

ELECTRA (Clark et al., 2020) took a radically different approach — replaced token detection. Instead of predicting missing tokens, ELECTRA uses a two-model setup. A small generator model creates plausible replacement tokens for randomly selected positions. The main discriminator model then classifies every token in the sequence as either original or replaced.

This trains on 100% of tokens rather than just the masked 15%, achieving BERT-level performance with only 1/4 the compute. The efficiency gain was dramatic, but ELECTRA required training two models jointly (generator and discriminator), adding implementation complexity that limited its adoption despite its theoretical elegance.

### Specialized Objectives for Specialized Needs

Fill-in-the-Middle (FIM) rearranges documents into a different format: split the text into prefix, middle, and suffix segments, then train the model to predict the missing middle given the prefix and suffix as context. This seemingly simple rearrangement is essential for code models like Codex and StarCoder, enabling code insertion and infilling.

In practice, a developer can write the beginning and end of a function and have the model fill in the implementation logic — a workflow that standard left-to-right generation cannot support.

Prefix LM objectives (UniLM, GLM) allow bidirectional attention over a prefix and autoregressive generation for the rest — a hybrid of encoder and decoder behavior. This combines the advantages of bidirectional understanding for context with autoregressive generation for output.

Multi-Token Prediction (MTP, Meta, 2024) predicts N future tokens simultaneously using N separate prediction heads. This improves both training quality (the model must consider longer-range dependencies) and enables speculative decoding at inference time, where the additional prediction heads propose candidate tokens that can be verified in parallel.

### Unification Attempts and Auxiliary Objectives

UL2 (Tay et al., 2022) proposed a unified framework mixing multiple denoising objectives with special mode tokens: [R] for regular denoising (like T5), [S] for sequential denoising (like CLM), and [X] for extreme denoising (very long spans). The model learns to switch between objective styles based on the mode token, combining the strengths of each.

BERT's Next Sentence Prediction (NSP) — predicting whether two sentences are consecutive — was found unnecessary by RoBERTa (Liu et al., 2019), which showed that removing NSP actually improved performance. ALBERT (Lan et al., 2019) replaced NSP with Sentence Order Prediction (SOP), which requires the model to distinguish correctly ordered from swapped sentence pairs. SOP proved more useful because it requires understanding discourse coherence rather than just topic similarity.

## Why It Matters

The evolution of pre-training objectives reveals a fundamental tension in language model design. Bidirectional objectives (MLM, span corruption) produce better representations for understanding tasks, but autoregressive objectives (CLM) are superior for generation and scale more cleanly.

The field ultimately converged on CLM for large models because generation capability became the primary goal, and because CLM's simplicity enables scaling to trillions of tokens without complex preprocessing pipelines.

The impact of this convergence is profound: the entire modern LLM ecosystem — from GPT-4 to LLaMA to DeepSeek — is built on the same basic objective that GPT-1 used in 2018. What changed is the scale, data quality, and post-training methods layered on top.

This convergence had practical consequences for the industry. The dominance of CLM meant that encoder-only models (BERT, RoBERTa) and encoder-decoder models (T5, BART) were gradually sidelined for the largest training runs. By 2024, virtually every frontier model used a decoder-only architecture with causal language modeling. The billions of dollars invested in scaling encoder-decoder architectures at Google (T5, PaLM 2) ultimately gave way to decoder-only designs (Gemini).

The trend going forward is clear: from simple single-objective training toward sophisticated multi-objective approaches (UL2, MTP) that combine the benefits of multiple paradigms. But simplicity retains its appeal — CLM remains dominant precisely because it is easy to implement, easy to scale, and surprisingly hard to beat.

## Key Technical Details

- **CLM**: Used by GPT series, LLaMA, Mistral, DeepSeek. Trains on 100% of tokens autoregressively.
- **MLM**: BERT (2018), RoBERTa (2019). Masks 15% of tokens, bidirectional. Dominated NLU benchmarks 2018-2020.
- **Span Corruption**: T5 (2020). Mean span length 3, corrupts 15% of tokens. More efficient than MLM.
- **ELECTRA**: 2020. Replaced token detection on 100% of tokens. BERT-level results with 25% compute.
- **FIM**: Used by Codex (2021), StarCoder (2023), Code Llama (2023). Critical for code infilling.
- **MTP**: Meta (2024). Predicts 4 future tokens simultaneously. Used in DeepSeek V3 (2024).
- **UL2**: Google (2022). Mixed denoising objectives with mode tokens. Unified pre-training framework.
- **NSP**: BERT (2018), dropped by RoBERTa (2019). Found to hurt performance on some tasks.
- **SOP**: ALBERT (2019). Sentence order prediction. More useful signal than NSP.

## Common Misconceptions

- **"MLM is strictly better than CLM because it is bidirectional."** Bidirectionality helps understanding tasks, but CLM scales better, generates fluently, and dominates at large scale. The most capable models all use CLM. The encoder-decoder architecture that MLM enabled has largely been superseded by decoder-only models.

- **"Pre-training objectives are a solved problem."** Active research continues. Multi-token prediction, UL2-style mixing, and objective-aware training remain areas of innovation. The optimal objective may depend on the intended downstream use — code models benefit from FIM, while general-purpose models may benefit from MTP.

- **"The pre-training objective determines model quality."** At sufficient scale, architecture, data quality, and training compute often matter more than the specific objective. CLM's simplicity is a feature, not a limitation. The massive success of the GPT series proves that the simplest objective, at sufficient scale, can produce extraordinary capability.

## Connections to Other Concepts

The pre-training objective story begins with `02-gpt-1.md` (CLM) and `03-bert.md` (MLM), with `05-t5-text-to-text-framework.md` introducing span corruption. `01-roberta.md` showed that NSP was unnecessary, while `05-electra.md` demonstrated efficient alternatives. Fill-in-the-Middle became critical for `05-codex-and-code-generation.md`, and Multi-Token Prediction appears in `02-deepseek-v3.md`. For the post-training objectives that build on pre-training, see `03-alignment-method-evolution.md` and `04-instruction-tuning-evolution.md`.

## Further Reading

- Radford et al., "Improving Language Understanding by Generative Pre-Training" (2018) — introduced CLM for pre-training.
- Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers" (2019) — introduced MLM and NSP.
- Clark et al., "ELECTRA: Pre-training Text Encoders as Discriminators" (2020) — replaced token detection.
- Raffel et al., "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer" (2020) — span corruption in T5.
- Liu et al., "RoBERTa: A Robustly Optimized BERT Pretraining Approach" (2019) — showed NSP is unnecessary.
- Tay et al., "UL2: Unifying Language Learning Paradigms" (2022) — mixed objective framework.
- Bavarian et al., "Efficient Training of Language Models to Fill in the Middle" (2022) — FIM for code models.
- Gloeckle et al., "Better & Faster Large Language Models via Multi-token Prediction" (2024) — MTP from Meta.
