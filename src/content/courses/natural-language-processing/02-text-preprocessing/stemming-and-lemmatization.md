# Stemming and Lemmatization

**One-Line Summary**: Reducing words to base forms -- stemming by crude affix removal and lemmatization by linguistically-informed morphological analysis -- to collapse inflectional variants into shared representations.

**Prerequisites**: `morphology.md`, `tokenization-in-nlp.md`, `text-normalization.md`

## What Is Stemming and Lemmatization?

Imagine an index at the back of a textbook. You want to find all pages discussing "running," "runs," "ran," and "runner." A good index groups them under a single entry. Stemming and lemmatization do the same for NLP: they map inflected word forms back to a shared base so that a search for "run" retrieves documents containing any of its variants.

**Stemming** is the fast, approximate approach: it strips suffixes using hand-crafted rules, often producing non-words ("studies" becomes "studi," "arguing" becomes "argu"). Think of it as pruning branches with hedge clippers -- fast but imprecise.

**Lemmatization** is the linguistically precise approach: it uses a dictionary and morphological analysis to return the actual dictionary form ("studies" becomes "study," "better" becomes "good"). Think of it as a botanist carefully identifying each branch before pruning.

Both reduce vocabulary size and improve feature matching, but they differ in speed, accuracy, and appropriateness for different tasks.

## How It Works

### Stemming Algorithms

#### The Porter Stemmer

Martin Porter's 1980 algorithm applies 5 phases of suffix-removal rules conditioned on a measure of the word's "consonant-vowel" pattern. For example:

- Phase 1a: "caresses" -> "caress", "ponies" -> "poni"
- Phase 1b: "agreed" -> "agree", "plastered" -> "plaster"
- Phase 5: "probate" -> "probat", "rate" -> "rate"

The algorithm uses approximately 60 rules. It is deterministic, requires no dictionary, and runs in O(n) time per word. However, it over-stems ("organization" and "organ" both reduce to "organ") and under-stems ("alumnus"/"alumni" are not conflated).

```python
from nltk.stem import PorterStemmer
ps = PorterStemmer()
ps.stem("running")   # "run"
ps.stem("studies")   # "studi"
ps.stem("university") # "univers"
```

#### The Snowball Stemmer (Porter2)

Porter's improved 2001 algorithm fixes several over-stemming errors and extends to 15+ languages. NLTK provides it as `SnowballStemmer`. On English, Snowball produces approximately 3% fewer errors than the original Porter on Paice's test vocabulary of 4,411 words.

```python
from nltk.stem import SnowballStemmer
ss = SnowballStemmer("english")
ss.stem("generously")  # "generous" (Porter gives "gener")
```

#### The Lancaster Stemmer

More aggressive than Porter -- it applies over 120 rules iteratively. "maximum" becomes "maxim," "presumably" becomes "presum." Faster convergence but higher over-stemming rate: approximately 30% of distinct word pairs are incorrectly conflated on the Paice benchmark versus 18% for Porter.

### Lemmatization Approaches

#### WordNet Lemmatizer

Uses the WordNet lexical database to look up base forms. Requires the part-of-speech tag as input for accuracy:

```python
from nltk.stem import WordNetLemmatizer
wnl = WordNetLemmatizer()
wnl.lemmatize("better", pos='a')  # "good"
wnl.lemmatize("ran", pos='v')     # "run"
wnl.lemmatize("mice", pos='n')    # "mouse"
```

Without POS, the default noun lookup may fail: `wnl.lemmatize("better")` returns "better" because there is no noun sense to reduce.

#### spaCy's Lemmatizer

spaCy integrates lemmatization into its processing pipeline, using the predicted POS tag to inform lemma lookup. Since version 3.0, spaCy uses rule-based lemmatization tables augmented with exception lists. It handles irregular forms ("went" to "go") and achieves approximately 95% accuracy on the English Universal Dependencies treebank.

```python
import spacy
nlp = spacy.load("en_core_web_sm")
doc = nlp("The mice were running quickly")
[(tok.text, tok.lemma_) for tok in doc]
# [('The', 'the'), ('mice', 'mouse'), ('were', 'be'),
#  ('running', 'run'), ('quickly', 'quickly')]
```

#### Morphological Analyzers

For morphologically rich languages (Turkish, Finnish, Hungarian), full morphological analyzers like Morfessor (Virpioja et al., 2013) decompose words into morphemes. Turkish "evlerinden" decomposes into "ev+ler+in+den" (from their houses). These tools bridge stemming and lemmatization with subword segmentation.

### Comparison Table

| Property | Stemming | Lemmatization |
|----------|----------|---------------|
| Output | May not be a real word | Always a dictionary word |
| Speed | ~1M words/sec (Porter) | ~100K words/sec (spaCy) |
| Requires POS | No | Yes (for accuracy) |
| Language coverage | 15+ (Snowball) | Depends on dictionary |
| Accuracy | Lower (affix heuristics) | Higher (dictionary lookup) |

## Why It Matters

1. **Vocabulary reduction**: Stemming reduces English vocabulary by approximately 40-60%; lemmatization by approximately 25-35%. This is critical for sparse models like `bag-of-words.md` and `tf-idf.md` where unseen word forms cause zero-count problems.
2. **Recall improvement**: In information retrieval (see `information-retrieval.md`), stemming improves recall by 10-30% on standard TREC collections by matching query terms to their inflected variants in documents.
3. **Feature sparsity**: For small datasets, collapsing "organize," "organized," "organizing," and "organization" into a single feature can prevent overfitting in text classification (see `text-classification.md`).
4. **Interpretability**: Topic models (see `topic-modeling.md`) produce more readable topics when inflected forms are collapsed to lemmas.
5. **Baseline standardization**: Many classic NLP benchmarks assume stemmed or lemmatized input; reproducing results requires the same preprocessing.

## Key Technical Details

- Porter Stemmer has a measured error rate of approximately 5% on the Lovins benchmark (over-stemming + under-stemming combined).
- Lemmatization with correct POS tags achieves 97%+ accuracy on English; without POS, accuracy drops to approximately 88%.
- Stemming is language-dependent: Snowball supports English, French, German, Spanish, Portuguese, Italian, Dutch, Swedish, Norwegian, Danish, Russian, Finnish, Hungarian, Romanian, and Turkish.
- For neural models (BERT, GPT), stemming and lemmatization are typically *not* applied -- the subword tokenizer and contextual embeddings handle morphological variation implicitly (see `contextual-embeddings.md`).
- Krovetz Stemmer (1993) combines a dictionary lookup with light suffix stripping, achieving a middle ground between stemming and lemmatization with approximately 50% fewer errors than Porter.
- On the CLEF multilingual IR benchmarks, Snowball stemming improves mean average precision by 15-25% across European languages.

## Common Misconceptions

**"Stemming and lemmatization are interchangeable."** Stemming is faster but cruder. For a sentiment analysis system, stemming "university" and "universe" to the same stem ("univers") introduces noise. Lemmatization avoids this by returning "university" and "universe" as distinct lemmas.

**"Neural models have made stemming obsolete."** For transformer-based models, yes -- subword tokenization handles morphology. But for TF-IDF classifiers, Elasticsearch indexes, keyword extraction (see `keyword-extraction.md`), and many production systems, stemming remains standard practice.

**"Lemmatization always produces the right base form."** Without context, lemmatizers cannot distinguish "saw" (past tense of "see") from "saw" (the noun). Accurate lemmatization depends on accurate POS tagging (see `part-of-speech-tagging.md`), creating a circular dependency that pipelines resolve by running POS tagging first.

**"More aggressive stemming always helps recall."** Over-stemming conflates unrelated words ("policy" and "police" both stem to "polic" with some aggressive stemmers), reducing precision. The optimal aggressiveness depends on the task: high recall demands (legal search) favor more aggressive stemming; high precision demands (medical NLP) favor lemmatization.

## Connections to Other Concepts

- Both techniques require prior `tokenization-in-nlp.md` -- you must have tokens before you can stem or lemmatize them.
- `text-normalization.md` (case folding) is typically applied before stemming to ensure consistent rule application.
- Lemmatization quality depends on `part-of-speech-tagging.md` for POS-informed dictionary lookup.
- Stemming directly reduces vocabulary for `bag-of-words.md`, `tf-idf.md`, and `n-gram-language-models.md`.
- Morphological analysis connects to `morphology.md` -- lemmatization is essentially applied morphology.
- `stopword-removal.md` is often applied alongside stemming as part of a preprocessing pipeline.
- For morphologically rich languages, the boundary between stemming and tokenization blurs (see `multilingual-nlp.md` and `language-diversity-and-typology.md`).

## Further Reading

- Porter, "An Algorithm for Suffix Stripping," *Program*, 1980 -- the original Porter Stemmer paper, one of the most cited in IR.
- Plisson, Lavrac, and Mladenic, "A Rule Based Approach to Word Lemmatization," *SiKDD*, 2004 -- systematic comparison of rule-based lemmatization strategies.
- Virpioja, Smit, Gr\u00f6nroos, and Kurimo, "Morfessor 2.0: Python Implementation and Extensions for Morfessor Baseline," *Aalto University*, 2013 -- unsupervised morphological segmentation for agglutinative languages.
- Krovetz, "Viewing Morphology as an Inference Process," *SIGIR*, 1993 -- the hybrid stemmer-lemmatizer approach.
- Manning, Raghavan, and Sch\u00fctze, *Introduction to Information Retrieval*, 2008 -- Chapter 2.2 covers stemming and lemmatization with IR evaluation results.
