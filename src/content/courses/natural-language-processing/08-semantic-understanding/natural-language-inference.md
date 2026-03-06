# Natural Language Inference

**One-Line Summary**: Natural language inference (NLI) classifies the relationship between a premise and hypothesis as entailment, contradiction, or neutral, serving as both a core semantic reasoning benchmark and a versatile tool for zero-shot NLP.

**Prerequisites**: `textual-entailment.md`, `text-classification.md`, `attention-mechanism.md`, `bert.md`, `sentence-embeddings.md`.

## What Is Natural Language Inference?

Imagine you overhear someone say, "All the restaurants on Main Street are closed today." Now consider three follow-up statements: (1) "There is no place to eat on Main Street today" -- this follows logically from what you heard (entailment). (2) "The Italian place on Main Street is serving lunch" -- this directly contradicts the original statement (contradiction). (3) "The restaurants are closed because of a holiday" -- this is plausible but not necessarily true from the original statement alone (neutral). NLI is the task of training machines to make exactly these three-way judgments.

NLI evolved from the textual entailment task (see `textual-entailment.md`), expanding from binary entailment/non-entailment to the more informative three-way classification. The term "natural language inference" became dominant with the release of large-scale datasets -- particularly SNLI and MultiNLI -- that enabled neural approaches requiring hundreds of thousands of training examples. While the underlying reasoning problem is the same, "NLI" typically refers to the modern, three-class, neural-era formulation.

What makes NLI particularly important is its dual role. It is both a **benchmark task** for evaluating semantic understanding and a **general-purpose tool** that can be repurposed for tasks like zero-shot text classification, fact verification, and summarization evaluation. This versatility stems from a key insight: many NLP problems can be reformulated as asking whether one piece of text entails, contradicts, or is neutral with respect to another.

## How It Works

### SNLI: The First Large-Scale NLI Dataset

The Stanford Natural Language Inference corpus (Bowman et al., 2015) was a watershed moment for NLI research. Previous textual entailment datasets contained hundreds to low thousands of examples -- too few for data-hungry neural models. SNLI provided 570,152 human-written premise-hypothesis pairs with three-way labels.

The construction process was carefully designed:

1. **Premises** were drawn from image captions in the Flickr30K dataset, providing grounded, concrete descriptions of real-world scenes.
2. **Hypothesis generation**: Crowd workers on Amazon Mechanical Turk were shown a premise and asked to write one sentence that is definitely true given the premise (entailment), one that is definitely false (contradiction), and one that might be true (neutral).
3. **Validation**: Each pair was labeled by five annotators. Only pairs with at least 3/5 agreement were retained. Gold labels were set by majority vote.

The resulting distribution is approximately balanced: 33.3% entailment, 33.3% contradiction, 33.3% neutral. Inter-annotator agreement is approximately 89% (individual vs. gold) and approximately 98% (majority 5-annotator vote).

### MultiNLI: Broader Coverage

The Multi-Genre Natural Language Inference corpus (Williams et al., 2018) addressed SNLI's domain limitation (only image captions) by drawing premises from ten distinct genres:

- Fiction, government reports, letters, 9/11 reports, travel guides (matched: same genres in dev/test)
- Telephone conversations, Oxford University Press texts, Slate magazine, Verbatim, and face-to-face conversations (mismatched: different genres in dev/test than in training)

MultiNLI contains 432,702 sentence pairs. The matched/mismatched split enables evaluation of both in-domain and cross-domain generalization. Human performance is approximately 89% (matched) and approximately 89% (mismatched), while BERT-large achieves approximately 86.3% (matched) and approximately 85.9% (mismatched).

### Adversarial NLI (ANLI)

Nie et al. (2020) introduced Adversarial NLI to address the saturation of SNLI and MultiNLI benchmarks. ANLI was constructed through an iterative adversarial human-and-model-in-the-loop process:

1. A state-of-the-art model (RoBERTa) is deployed.
2. Crowd workers write hypotheses designed to fool the model while being correctly classifiable by humans.
3. Pairs that fool the model are collected, and a new model is trained on the expanded dataset.
4. The process repeats across three rounds (A1, A2, A3), with each round becoming progressively harder.

ANLI contains 169,654 pairs across three rounds. Performance degrades dramatically: while RoBERTa achieves approximately 91% on SNLI, it achieves only approximately 49% on ANLI Round 3 (A3) -- barely above the 33.3% random baseline. Even GPT-3 achieves only approximately 52% on A3, demonstrating that current models struggle with examples specifically designed to exploit their weaknesses.

### The Hypothesis-Only Bias Problem

A critical discovery was that NLI datasets contain significant annotation artifacts. Gururangan et al. (2018) and Poliak et al. (2018) showed that a classifier looking only at the hypothesis (without ever seeing the premise) could achieve approximately 67% accuracy on SNLI and approximately 53% on MultiNLI -- well above the 33.3% random baseline.

The biases are systematic:

- **Negation words** (not, nobody, never) are strongly correlated with contradiction labels.
- **Superlatives and universals** (all, every, most) tend to appear in contradiction hypotheses.
- **Vague or generic language** (something, someone, outside) correlates with entailment.
- **Longer hypotheses** tend to be neutral (workers add details when speculating).

These artifacts mean that high benchmark accuracy may reflect pattern exploitation rather than genuine inference. Addressing this bias has become a major research direction, using adversarial filtering (ANLI), hypothesis-only evaluation as a diagnostic, and debiasing techniques like product-of-experts training.

### Cross-Sentence Attention Models

The architecture that catalyzed neural NLI progress is cross-sentence attention, which computes fine-grained word-level interactions between premise and hypothesis.

**Decomposable Attention Model (Parikh et al., 2016)**: Aligns each word in the hypothesis with relevant words in the premise using attention, then aggregates the aligned representations. Despite its simplicity (no recurrence, no convolution), it achieved 86.8% on SNLI with only 380K parameters. The key equation:

```
e_ij = F(a_i)^T F(b_j)    [attention between premise word i and hypothesis word j]
beta_i = sum_j (exp(e_ij) / sum_k exp(e_ik)) * b_j    [soft-aligned hypothesis words for each premise word]
```

**ESIM (Enhanced Sequential Inference Model)** (Chen et al., 2017): Combines BiLSTM encoding with cross-sentence attention and inference composition, reaching 88.0% on SNLI. ESIM's three-stage architecture (encoding, attention, composition) became a template for subsequent models.

### BERT Fine-Tuning for NLI

BERT (Devlin et al., 2018) simplified NLI architecture dramatically. Instead of designing specialized attention mechanisms, BERT concatenates premise and hypothesis with a [SEP] token and feeds the combined sequence through the pre-trained transformer. The [CLS] token representation is passed through a single classification layer.

BERT-large achieves approximately 91.0% on SNLI and approximately 86.3% on MultiNLI, surpassing all prior specialized architectures. The key insight: the pre-trained transformer's self-attention already captures cross-sentence interactions, making explicit cross-attention architectures redundant when sufficient pre-training is available.

Subsequent models push further:
- **RoBERTa**: ~91.6% on SNLI, ~90.2% on MultiNLI matched
- **DeBERTa-v3-large**: ~91.7% on SNLI, ~90.5% on MultiNLI matched
- **T5-11B**: ~92.2% on SNLI (text-to-text formulation)

### NLI as a General-Purpose Semantic Tool

Perhaps the most impactful application of NLI is **zero-shot text classification** (Yin et al., 2019). The idea is elegant: to classify a text into categories without any task-specific training data, frame each category as a hypothesis and the text as a premise. For example, to classify a news article as "sports," "politics," or "technology":

- Premise: [the article text]
- Hypothesis: "This text is about sports." / "This text is about politics." / "This text is about technology."

The category whose hypothesis receives the highest entailment score is the predicted label. This approach, popularized by models like BART-MNLI and available in Hugging Face's zero-shot classification pipeline, achieves surprisingly competitive results -- often 70-85% accuracy on standard benchmarks without any task-specific training.

Other NLI-based applications include:
- **Fact verification**: Checking if evidence entails or contradicts a claim (FEVER benchmark).
- **Summarization evaluation**: Testing if a summary is entailed by the source document to detect hallucination.
- **Semantic search**: Ranking candidate passages by their entailment score with a query-derived hypothesis.

## Why It Matters

1. **Central benchmark for NLU**: NLI performance is a core indicator of a model's semantic understanding capabilities, included in every major NLU benchmark (GLUE, SuperGLUE).
2. **Zero-shot classification**: NLI enables classifying text into arbitrary categories without labeled training data, dramatically reducing the barrier to deploying classification systems.
3. **Fact-checking and verification**: The entailment/contradiction framework maps directly to verifying claims against evidence, essential for combating misinformation.
4. **Sentence embedding training**: NLI data (specifically SNLI and MultiNLI) is the primary training signal for producing high-quality sentence embeddings like SBERT (see `sentence-embeddings.md`).
5. **Scientific progress tracking**: NLI datasets serve as canaries for bias and robustness issues, with adversarial and diagnostic sets revealing model limitations that aggregate accuracy hides.

## Key Technical Details

- SNLI: 570,152 pairs, three-way labeled, drawn from Flickr30K captions. Inter-annotator agreement approximately 89%.
- MultiNLI: 432,702 pairs from 10 genres with matched/mismatched evaluation splits.
- ANLI: 169,654 adversarially constructed pairs across 3 rounds. Round 3 accuracy: approximately 49% for RoBERTa.
- Hypothesis-only baseline: approximately 67% on SNLI, approximately 53% on MultiNLI (vs. 33.3% random).
- BERT-large: approximately 91.0% on SNLI, approximately 86.3% on MultiNLI matched.
- Decomposable attention: 86.8% on SNLI with 380K parameters (under 0.5% of BERT-base parameters).
- Human performance: approximately 89% individual, approximately 98% majority vote on SNLI.
- XNLI (Conneau et al., 2018) extends MultiNLI to 15 languages, enabling cross-lingual NLI evaluation.

## Common Misconceptions

**"NLI models truly understand language because they achieve ~91% accuracy on SNLI."**
High SNLI accuracy can be partially driven by annotation artifacts rather than genuine inference. The hypothesis-only baseline achieving approximately 67% shows significant exploitable bias. Performance on adversarial sets (ANLI A3 approximately 49%) reveals that robust reasoning remains far from solved.

**"Entailment means paraphrase."**
Entailment is directional: "A dog runs in the park" entails "An animal is outdoors," but these are not paraphrases. Paraphrase implies bidirectional entailment (A entails B and B entails A). Many entailment pairs involve significant information loss or generalization.

**"NLI requires specialized architectures."**
Pre-BERT, researchers designed increasingly complex cross-attention models for NLI. BERT showed that a general-purpose pre-trained encoder with a simple classification head matches or surpasses these specialized architectures. The "architecture" is now in the pre-training, not the task-specific model.

**"Larger NLI datasets always produce better models."**
Data quality matters more than quantity. ANLI's 170K adversarial examples improve robustness more than simply adding another 170K easy examples. Similarly, dataset debiasing (removing artifacts) can improve out-of-distribution generalization even while reducing training set size.

**"The neutral class just means 'not enough information.'"**
Neutral is more nuanced than "unknown." It means the hypothesis is compatible with the premise but not entailed by it. "A man is walking a dog" paired with "The man is walking his dog" is neutral because "his" adds possessive information not present in the premise. The neutral category captures the vast space of plausible but unproven inferences.

## Connections to Other Concepts

- `textual-entailment.md` covers the historical foundation and binary formulation from which NLI evolved.
- `semantic-similarity.md` provides graded, symmetric meaning comparison -- complementary to NLI's categorical, directional judgments.
- `bert.md` and `transfer-learning-in-nlp.md` explain the pre-training paradigm that made high-accuracy NLI possible.
- `sentence-embeddings.md` depends critically on NLI training data (SNLI/MultiNLI) for producing high-quality embeddings via SBERT.
- `commonsense-reasoning.md` covers the world knowledge often required for difficult NLI examples, especially in ANLI.
- `prompt-based-nlp.md` describes the zero-shot classification paradigm that leverages NLI models as general classifiers.
- `negation-and-speculation-detection.md` is directly relevant to contradiction detection, where negation cues are primary signals.
- `bias-in-nlp.md` connects to the annotation artifact problem, where dataset biases encode demographic and linguistic patterns.

## Further Reading

- Bowman, S., Angeli, G., Potts, C., and Manning, C., "A Large Annotated Corpus for Learning Natural Language Inference," 2015 -- SNLI, the dataset that launched neural NLI research.
- Williams, A., Nangia, N., and Bowman, S., "A Broad-Coverage Challenge Corpus for Sentence Understanding through Inference," 2018 -- MultiNLI, extending NLI to multiple genres.
- Nie, Y. et al., "Adversarial NLI: A New Benchmark for Natural Language Understanding," 2020 -- ANLI, revealing the brittleness of high-accuracy NLI models.
- Gururangan, S. et al., "Annotation Artifacts in Natural Language Inference Data," 2018 -- The seminal study exposing hypothesis-only biases in NLI datasets.
- Yin, W., Hay, J., and Roth, D., "Benchmarking Zero-shot Text Classification: Datasets, Evaluation and Entailment Approach," 2019 -- Using NLI for zero-shot classification.
- Parikh, A. et al., "A Decomposable Attention Model for Natural Language Inference," 2016 -- Elegant attention-only model achieving strong NLI results with minimal parameters.
- Conneau, A. et al., "XNLI: Evaluating Cross-lingual Sentence Representations," 2018 -- Extending NLI evaluation to 15 languages.
