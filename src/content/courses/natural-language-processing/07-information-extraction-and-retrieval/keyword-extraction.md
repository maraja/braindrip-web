# Keyword Extraction

**One-Line Summary**: Identifying the most important terms and phrases that characterize a document's content -- from statistical frequency methods to graph-based and embedding-based approaches.

**Prerequisites**: TF-IDF (`03-text-representation/tf-idf.md`), Tokenization (`02-text-preprocessing/tokenization-in-nlp.md`), Word2Vec (`03-text-representation/word2vec.md`).

## What Is Keyword Extraction?

Imagine speed-reading a research paper and jotting down 5-10 phrases that capture its essence -- "transfer learning," "domain adaptation," "BERT fine-tuning." You are doing keyword extraction: distilling a document into its most representative terms. Automated keyword extraction does this at scale, producing concise descriptors for documents without requiring human annotation.

Formally, keyword extraction (or keyphrase extraction) is the task of automatically selecting a small set of terms or phrases from a document that best represent its content. These keyphrases serve as compact document summaries, index terms for retrieval (see `information-retrieval.md`), features for classification (see `05-core-nlp-tasks-analysis/text-classification.md`), and inputs for topic modeling (see `topic-modeling.md`). The task is sometimes distinguished from keyphrase *generation*, where the model produces phrases not explicitly present in the document.

## How It Works

### Statistical Approaches: TF-IDF Based

The simplest keyword extraction method ranks candidate terms by their TF-IDF score (see `03-text-representation/tf-idf.md`). Terms with high term frequency in the target document but low document frequency across the corpus are likely keywords. The process:

1. Tokenize and optionally POS-tag the document.
2. Extract candidate phrases (typically noun phrases or n-grams up to length 3).
3. Score each candidate by its TF-IDF weight.
4. Return the top-k candidates.

This works surprisingly well for single-document extraction but requires a reference corpus for IDF computation. A variant, YAKE! (Yet Another Keyword Extractor, Campos et al., 2020), uses statistical features like term frequency, position, and co-occurrence without requiring a corpus -- making it fully unsupervised and corpus-independent.

### Graph-Based Approaches: TextRank and RAKE

**TextRank** (Mihalcea and Tarau, 2004) applies PageRank to a word co-occurrence graph. The algorithm:
1. Build a graph where nodes are words (typically nouns and adjectives) and edges connect words co-occurring within a window of W words (usually W = 2-5).
2. Run the PageRank algorithm until convergence: `S(v_i) = (1 - d) + d * sum_{v_j in In(v_i)} S(v_j) / |Out(v_j)|`, where d = 0.85 is the damping factor.
3. Rank nodes by their PageRank score.
4. Collapse adjacent high-scoring nodes into multi-word keyphrases.

The intuition: words that co-occur with many other important words are themselves important -- the same principle that makes PageRank work for web pages.

**RAKE** (Rapid Automatic Keyword Extraction, Rose et al., 2010) identifies candidate keywords by splitting text at stopwords and delimiters, then scores each candidate by the ratio of word degree (number of co-occurrences with other content words in the candidate phrase) to word frequency. RAKE is fast, unsupervised, and language-independent -- it requires only a stopword list.

### Embedding-Based Approaches: KeyBERT

**KeyBERT** (Grootendorst, 2020) leverages pre-trained sentence embeddings to find keywords that are semantically closest to the overall document:

1. Encode the full document into a single embedding using a sentence transformer (e.g., all-MiniLM-L6-v2).
2. Extract candidate n-grams (1-3 words) from the document.
3. Encode each candidate into an embedding.
4. Rank candidates by cosine similarity to the document embedding.
5. Optionally apply Maximal Marginal Relevance (MMR) to diversify the keyword set, balancing relevance with dissimilarity to already-selected keywords.

KeyBERT captures semantic meaning that TF-IDF misses -- it understands that "neural network" and "deep learning" are related even if they never co-occur in the document. It also requires no corpus-level statistics.

### Supervised Keyphrase Extraction

Supervised approaches train sequence labeling or classification models on corpora with human-annotated keyphrases:

- **Sequence labeling**: Tag each token as B-KP (beginning of keyphrase), I-KP (inside keyphrase), or O (outside). Fine-tuning BERT for this achieves F1 scores of 40-55% on benchmarks like SemEval-2017 Task 10.
- **Sequence-to-sequence generation**: Models like CatSeq (Yuan et al., 2020) and One2Set (Ye et al., 2021) generate keyphrases (including *absent* keyphrases not in the document) using encoder-decoder architectures. This handles the keyphrase generation variant of the task.

### Evaluation

Keyword extraction is evaluated against human-annotated gold keyphrases:
- **Exact match**: Precision, recall, and F1 computed on exact string matches between predicted and gold keyphrases (after stemming). F1@5 and F1@10 are standard metrics.
- **Partial matching**: Accounts for near-matches (e.g., "neural machine translation" vs. "machine translation") using token-level overlap or embedding similarity.
- **Typical scores**: On the Inspec benchmark, unsupervised methods achieve F1@10 of 25-35%; supervised neural models reach 40-55%. On SemEval-2017 Task 10, best systems achieve ~45% F1.

## Why It Matters

1. **Document indexing and search**: Keywords serve as metadata for document retrieval, enabling faceted search and tag-based browsing (see `information-retrieval.md`).
2. **Text summarization support**: Extracted keywords provide a skeleton for summarization systems (see `06-core-nlp-tasks-generation/text-summarization.md`).
3. **Content recommendation**: Matching documents by shared keywords powers recommendation engines.
4. **Scientific literature navigation**: Keyphrases on research papers enable researchers to quickly assess relevance and discover related work.
5. **SEO and content strategy**: Identifying high-value keywords informs search engine optimization and editorial decisions.

## Key Technical Details

- **TextRank convergence**: Typically converges in 20-30 iterations with damping factor d = 0.85 and co-occurrence window W = 2.
- **YAKE! performance**: Achieves F1@10 of 18-22% on the Inspec dataset without any corpus dependency -- competitive with TF-IDF methods that require reference corpora.
- **KeyBERT with MMR**: Setting the diversity parameter lambda = 0.5-0.7 balances relevance and diversity, typically producing more informative keyword sets than pure cosine ranking.
- **Candidate generation**: Restricting candidates to noun phrases (using POS tag patterns like `(ADJ)*(NOUN)+`) reduces the candidate set by 60-80% and improves precision.
- **Absent keyphrases**: In the SemEval-2010 benchmark, approximately 38% of gold keyphrases do not appear in the source document, motivating generative approaches.

## Common Misconceptions

**"The most frequent words are the best keywords."** High-frequency words are often generic (the, and, is) or domain-common terms that appear in every document. Good keywords are *discriminative* -- they distinguish this document from others. This is why TF-IDF and its variants outperform raw frequency.

**"Keyword extraction and topic modeling are the same thing."** Keyword extraction identifies terms describing *individual documents*, while topic modeling (see `topic-modeling.md`) discovers latent themes across a *corpus*. A keyword might be "BERT fine-tuning," while a topic is a distribution over many related words like {model, training, fine-tune, parameters, loss}.

**"Unsupervised methods are always worse than supervised ones."** On in-domain data with abundant training annotations, supervised models win. But unsupervised methods generalize better across domains -- a TextRank model for news articles works just as well on scientific papers, while a supervised model trained on news may fail on scientific text.

**"More keywords are always better."** Precision typically drops sharply after the top 5-10 keywords. Extracting 20+ keywords dilutes the set with marginally relevant terms.

## Connections to Other Concepts

- `03-text-representation/tf-idf.md`: The statistical backbone of frequency-based keyword extraction.
- `topic-modeling.md`: Topic models discover corpus-level themes; keywords describe individual documents. The two are complementary.
- `information-retrieval.md`: Keywords serve as index terms and query expansions in retrieval systems.
- `06-core-nlp-tasks-generation/text-summarization.md`: Keywords provide a compressed representation of document content, related to extractive summarization.
- `03-text-representation/sentence-embeddings.md`: KeyBERT relies on sentence-level embeddings to compute semantic similarity.
- `03-text-representation/contextual-embeddings.md`: Modern embedding-based keyword extractors use contextual representations for richer semantic matching.
- `05-core-nlp-tasks-analysis/text-classification.md`: Extracted keywords can serve as features for document classification.

## Further Reading

- Mihalcea and Tarau, "TextRank: Bringing Order into Texts," 2004 -- The foundational paper applying PageRank to keyword and sentence extraction.
- Rose et al., "Automatic Keyword Extraction from Individual Documents," 2010 -- Introduced RAKE, the fast unsupervised keyword extraction algorithm.
- Campos et al., "YAKE! Keyword Extraction from Single Documents Using Multiple Local Features," 2020 -- Corpus-independent unsupervised keyword extraction using statistical features.
- Grootendorst, "KeyBERT: Minimal Keyword Extraction with BERT," 2020 -- Embedding-based keyword extraction leveraging pre-trained transformers.
- Meng et al., "Deep Keyphrase Generation," 2017 -- CopyRNN, the first neural model for generating both present and absent keyphrases from documents.
