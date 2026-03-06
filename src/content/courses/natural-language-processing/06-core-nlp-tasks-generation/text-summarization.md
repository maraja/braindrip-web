# Text Summarization

**One-Line Summary**: Condensing documents while preserving key information, using either extractive methods that select important sentences or abstractive methods that generate new condensed text.

**Prerequisites**: `sequence-to-sequence-models.md`, `attention-mechanism.md`, `sentence-embeddings.md`, `text-classification.md`

## What Is Text Summarization?

Imagine you are a newspaper editor with a 2,000-word article and space for only 100 words. You have two strategies: grab a highlighter and pick the three most important sentences verbatim (extractive summarization), or read the entire article, internalize the key points, and write a fresh 100-word paragraph in your own words (abstractive summarization). Both produce shorter text, but the abstractive approach can be more coherent, more concise, and better tailored to the reader -- at the cost of potentially introducing errors.

Text summarization is the NLP task of automatically producing a shorter version of one or more documents that retains the most salient information. It is one of the oldest NLP applications (Luhn, 1958) and one of the hardest generation tasks because it requires understanding, compression, and faithful reproduction of meaning.

## How It Works

### Extractive Summarization

Extractive methods select a subset of sentences (or passages) from the source document to form the summary.

**LEAD-3 Baseline**: Simply take the first three sentences of the document. Remarkably, this outperforms many sophisticated models on news summarization because journalists front-load key information (the "inverted pyramid" style). On CNN/DailyMail, LEAD-3 achieves approximately 40.4 ROUGE-1, which many neural models struggled to beat until 2018.

**TextRank** (Mihalcea and Tarau, 2004): Builds a graph where sentences are nodes and edges are weighted by similarity (e.g., word overlap or embedding cosine). PageRank-style iteration identifies the most central sentences. TextRank is unsupervised and domain-agnostic.

**Neural Extractive Models**: Treat summarization as a binary classification problem -- for each sentence, predict "include" or "exclude." Models like BertSumExt (Liu and Lapata, 2019) encode the document with BERT, add inter-sentence Transformer layers, and achieve 43.25 ROUGE-1 on CNN/DailyMail.

### Abstractive Summarization

Abstractive methods generate novel text, potentially using words and phrases not present in the source.

**Seq2Seq with Attention**: Rush et al. (2015) applied attention-based encoder-decoders to summarization, initially for headline generation. These models can paraphrase and compress but suffer from repetition and factual hallucination.

**Pointer-Generator Networks**: See et al. (2017) combined seq2seq generation with a copy mechanism that can point to and copy words directly from the source. A coverage mechanism penalizes attending to the same positions repeatedly, reducing repetition. This architecture achieved 39.53 ROUGE-1 on CNN/DailyMail.

**Pre-trained Models (BART, T5, Pegasus)**: Fine-tuning large pre-trained encoder-decoders dramatically advanced abstractive summarization. BART (Lewis et al., 2020) achieved 44.16 ROUGE-1 on CNN/DailyMail. Pegasus (Zhang et al., 2020) pre-trained with Gap Sentence Generation (masking and predicting whole sentences) achieved 44.17 ROUGE-1 on CNN/DailyMail and state-of-the-art on 12 diverse benchmarks with as few as 1,000 fine-tuning examples.

### Evaluation: ROUGE Scores

ROUGE (Recall-Oriented Understudy for Gisting Evaluation) by Lin (2004) is the standard automatic metric:

- **ROUGE-N**: N-gram recall between system summary and reference. ROUGE-1 (unigrams) captures content overlap; ROUGE-2 (bigrams) captures fluency.
- **ROUGE-L**: Longest common subsequence, rewarding in-order overlap.

A typical high-performing system on CNN/DailyMail scores ROUGE-1/ROUGE-2/ROUGE-L of approximately 44/21/41.

### Faithfulness and Factual Consistency

A major challenge for abstractive summarization: models generate fluent text that contradicts or fabricates facts not in the source. Kryscinski et al. (2020) found that approximately 30% of summaries from state-of-the-art models contain factual inconsistencies. Approaches to detect and mitigate this include:

- **Entailment-based checking**: Use NLI models to verify that the summary is entailed by the source document.
- **Question-answering consistency**: Generate questions from the summary, answer them using the source, and check agreement (QAFactEval).
- **Constrained decoding**: Restrict generation to facts extractable from the source.

## Why It Matters

1. **Information overload**: Summarization helps users process the exponentially growing volume of text -- news, scientific papers, legal documents, medical records.
2. **Downstream NLP**: Summaries serve as inputs to other tasks such as question answering, search snippets, and report generation.
3. **Accessibility**: Summaries make long documents accessible to time-constrained readers, non-native speakers, and people with cognitive disabilities.
4. **Business intelligence**: Automatic summarization of earnings calls, customer reviews, and internal reports saves thousands of analyst hours.

## Key Technical Details

- **CNN/DailyMail** (Hermann et al., 2015; Nallapati et al., 2016): ~300K news articles with multi-sentence summaries. The most widely used benchmark, though its summaries are relatively extractive.
- **XSum** (Narayan et al., 2018): ~227K BBC articles with single-sentence abstractive summaries, requiring more aggressive compression and abstraction.
- **SAMSum** (Gliwa et al., 2019): 16K dialogue summarization examples for conversational summarization.
- Extractive oracle (selecting sentences to maximize ROUGE) typically scores ROUGE-1 around 55 on CNN/DailyMail, indicating a ceiling for extractive methods.
- Modern LLMs (GPT-4, Claude) produce summaries that human evaluators often prefer over fine-tuned models, but automatic ROUGE scores may not reflect this preference due to stylistic differences from reference summaries.
- Multi-document summarization (e.g., Multi-News dataset) aggregates information across multiple source documents, requiring cross-document coreference and redundancy handling.

## Common Misconceptions

- **"Extractive summarization is obsolete."** Extractive methods remain valuable because they guarantee faithfulness -- every sentence comes directly from the source. In high-stakes domains like law and medicine, this property is critical. Many production systems use extractive-then-abstractive pipelines.

- **"Higher ROUGE means better summaries."** ROUGE measures lexical overlap with reference summaries and correlates only moderately with human judgments of quality. A system can achieve high ROUGE by copying long extractive fragments while producing an incoherent summary. Conversely, a well-written abstractive summary using different phrasing may score lower.

- **"Summarization just removes less important sentences."** Abstractive summarization involves paraphrasing, fusion (combining information from multiple sentences), compression, and generalization -- all requiring deep language understanding, not just filtering.

- **"LEAD-3 is a trivial baseline."** LEAD-3 exploits a genuine structural property of news writing and remains competitive on news benchmarks. Many papers that claimed to "beat LEAD-3" only did so by small margins, highlighting how hard the task is.

## Connections to Other Concepts

- **`machine-translation.md`**: Summarization and MT share the encoder-decoder paradigm, beam search decoding, and copy/attention mechanisms.
- **`text-generation.md`**: Summarization is a constrained form of text generation where the output must be faithful to the source.
- **`sentence-embeddings.md`**: Sentence representations drive extractive selection methods like TextRank and neural sentence scoring.
- **`text-classification.md`**: Extractive summarization can be framed as binary sentence classification (include/exclude).
- **`natural-language-inference.md`**: NLI models are used to check factual consistency between source documents and generated summaries.
- **`evaluation-metrics-for-nlp.md`**: ROUGE, BERTScore, and other metrics used for summarization evaluation are covered there.

## Further Reading

- Mihalcea and Tarau, "TextRank: Bringing Order into Texts" (2004) -- Graph-based unsupervised extractive summarization that remains a strong baseline.
- See et al., "Get To The Point: Summarization with Pointer-Generator Networks" (2017) -- Introduced copy mechanism and coverage for abstractive summarization.
- Liu and Lapata, "Text Summarization with Pretrained Encoders" (2019) -- BertSum, combining BERT with extractive and abstractive summarization.
- Lewis et al., "BART: Denoising Sequence-to-Sequence Pre-training" (2020) -- Pre-trained model achieving strong summarization via denoising objectives.
- Zhang et al., "Pegasus: Pre-training with Extracted Gap-Sentences for Abstractive Summarization" (2020) -- Summarization-specific pre-training achieving state-of-the-art across 12 benchmarks.
- Kryscinski et al., "Evaluating the Factual Consistency of Abstractive Text Summarization" (2020) -- Identified the factual consistency problem and proposed an evaluation framework.
