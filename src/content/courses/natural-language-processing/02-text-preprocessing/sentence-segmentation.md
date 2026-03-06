# Sentence Segmentation

**One-Line Summary**: Detecting sentence boundaries in running text despite the ambiguity of periods, which serve triple duty as sentence terminators, abbreviation markers, and decimal points.

**Prerequisites**: `tokenization-in-nlp.md`, `regular-expressions-for-nlp.md`, `text-normalization.md`

## What Is Sentence Segmentation?

Imagine reading a novel printed without any paragraph breaks or capital letters after periods. You would need to mentally reconstruct where each sentence ends and the next begins, relying on grammar, meaning, and punctuation conventions. Sentence segmentation (also called sentence boundary detection or sentence splitting) automates this reconstruction: given a stream of text, it identifies the positions where one sentence ends and another begins.

This may sound trivial -- "just split on periods" -- but consider: "Dr. Smith earned $3.5M from U.S. operations in Jan. 2024." That single sentence contains six periods, and only the last one marks a sentence boundary. The task is fundamentally a disambiguation problem: given a period (or question mark, or exclamation point), is it a sentence-ending punctuation mark or something else?

Sentence segmentation is a prerequisite for nearly every NLP task that operates at the sentence level: sentiment analysis (see `sentiment-analysis.md`), machine translation (see `machine-translation.md`), parsing (see `dependency-parsing.md`), and sentence embedding (see `sentence-embeddings.md`).

## How It Works

### Rule-Based Approaches

#### Simple Regex Splitting

The baseline approach uses a regular expression to split on sentence-ending punctuation followed by whitespace and a capital letter:

```python
import re
sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
```

This handles clean, formal text but fails on abbreviations ("Dr. Smith"), acronyms ("U.S.A."), ellipses ("Wait... What?"), and sentences that start with lowercase (rare in English, common in German after certain constructions).

#### Abbreviation Lists

More sophisticated rule-based systems maintain a list of known abbreviations (Mr., Mrs., Dr., Prof., Jan., Feb., U.S., etc.) and treat periods following these as non-sentence-ending. NLTK's `sent_tokenize()` uses this approach internally. Maintaining abbreviation lists is labor-intensive: a production system may need 500-1,000 abbreviations, and the list varies by domain (medical abbreviations like "b.i.d." and "q.h." are absent from general lists).

#### Finite-State Transducers

Systems like the Stanford CoreNLP sentence splitter use cascaded finite-state rules that consider:
1. The token containing the period (is it a known abbreviation?)
2. The token following the period (does it start with a capital letter? Is it a number?)
3. The length of the token containing the period (single-letter abbreviations like "I." are common)

These heuristics achieve approximately 95-98% accuracy on clean news text.

### Statistical Approaches

#### The Punkt Algorithm

Punkt (Kiss and Strunk, 2006) is the most widely used unsupervised sentence boundary detector. It learns abbreviation patterns from an unlabeled corpus using three key observations:

1. **Abbreviation detection**: Words that frequently appear with a trailing period and have a strong collocational bond with that period are likely abbreviations. Punkt measures this using a modified log-likelihood ratio.
2. **Sentence-starter detection**: Words that frequently appear after sentence-ending punctuation are likely sentence starters.
3. **Orthographic heuristics**: If the word after a period begins with a capital letter and is not a known proper noun, the period is more likely sentence-ending.

Punkt is implemented in NLTK's `PunktSentenceTokenizer` and achieves 98.0-99.5% accuracy across 11 languages without requiring labeled training data. It is the default behind `nltk.sent_tokenize()`.

```python
import nltk
text = "Dr. Smith went to Washington. He arrived at 3 p.m. The meeting started."
nltk.sent_tokenize(text)
# ['Dr. Smith went to Washington.', 'He arrived at 3 p.m.', 'The meeting started.']
```

#### Supervised Models

When labeled data is available, supervised classifiers treat each period as a candidate boundary and extract features:
- Is the preceding token an abbreviation?
- Is the following token capitalized?
- Token length, character composition
- Part-of-speech tag of surrounding tokens (if available from `part-of-speech-tagging.md`)

Logistic regression or CRF models trained on these features achieve 99%+ accuracy on in-domain text (Palmer and Hearst, 1997).

### Neural Approaches

Recent work applies character-level or token-level neural models. The Ersatz system (Wicks and Post, 2021) uses a transformer-based model that achieves state-of-the-art accuracy on multilingual sentence segmentation, particularly excelling on languages without clear punctuation conventions. On the OPUS-100 benchmark, Ersatz outperforms Punkt by 1-3% absolute F1 on low-resource languages.

### Handling Specific Challenges

| Challenge | Example | Strategy |
|-----------|---------|----------|
| Abbreviations | "Dr. Smith" | Abbreviation list / Punkt |
| Acronyms | "The U.S.A. is large." | Acronym detection rules |
| Decimal numbers | "It cost $3.50." | Number pattern regex |
| Ellipsis | "Wait... What?" | Collapse consecutive periods |
| Quoted speech | 'She said "Stop." He ran.' | Quote-aware rules |
| URLs/emails | "Visit example.com. Then..." | URL pre-detection |
| Lists | "1. First item. 2. Second." | Enumeration patterns |

## Why It Matters

1. **Upstream dependency**: Sentence boundaries define the input units for sentence-level tasks: `sentiment-analysis.md`, `text-classification.md`, `natural-language-inference.md`, and `sentence-embeddings.md` all require sentence-segmented input.
2. **Translation quality**: Machine translation systems (see `machine-translation.md`) process text sentence by sentence. A segmentation error that merges two sentences forces the model to translate an unnaturally long input, degrading quality.
3. **Parsing correctness**: Syntactic parsers (see `dependency-parsing.md`, `constituency-parsing.md`) assume single-sentence input. Feeding two concatenated sentences produces meaningless parse trees.
4. **Evaluation metrics**: BLEU score (see `evaluation-metrics-for-nlp.md`) is computed at the sentence level. Different segmentations of the same text produce different BLEU scores, confounding evaluation.
5. **Document structure**: Sentence count per paragraph is a feature in readability scoring, text complexity analysis, and document classification.

## Key Technical Details

- Punkt achieves 99.46% accuracy on the Wall Street Journal section of the Penn Treebank (English news).
- On social media text (tweets, Reddit posts), sentence segmentation accuracy drops to 85-92% due to informal punctuation and missing capitalization.
- The average English sentence in news text contains approximately 20-25 words; in academic text, approximately 25-30 words; in social media, approximately 10-15 words.
- Multilingual Punkt models are available for English, Czech, Danish, Dutch, Estonian, Finnish, French, German, Greek, Italian, Norwegian, Polish, Portuguese, Slovene, Spanish, Swedish, and Turkish.
- spaCy's sentence segmenter uses the dependency parse to determine sentence boundaries (sentences are subtrees of the ROOT token), achieving high accuracy but requiring a full dependency parse as input.
- For Chinese and Japanese, sentence segmentation is relatively straightforward because these languages use unambiguous sentence-ending markers (\u3002 for Chinese/Japanese period, \uff01, \uff1f), though informal text still poses challenges.

## Common Misconceptions

**"Splitting on periods is good enough."** In a sample of 1,000 English news sentences, approximately 15% contain at least one non-sentence-ending period (abbreviations, initials, decimals). Naive splitting would produce approximately 15% erroneous boundaries.

**"Sentence segmentation only matters for formal text."** Social media analysis, dialogue systems (see `dialogue-systems.md`), and chatbot logs all require sentence segmentation, often on text with minimal or unconventional punctuation. These are the hardest cases.

**"Question marks and exclamation points are unambiguous."** In most contexts they are, but consider: "What?!" (two punctuation marks, one boundary) and "Did she really say 'What?'?" (nested question mark). Also, Spanish uses inverted question marks ("\u00bfC\u00f3mo?"), adding language-specific complexity.

**"Neural models always outperform rules."** For well-punctuated text in high-resource languages, Punkt and rule-based systems achieve 99%+ accuracy with zero training data. Neural models shine on low-resource languages and noisy text where rules are insufficient.

## Connections to Other Concepts

- Sentence segmentation builds on `tokenization-in-nlp.md` -- you need token boundaries before you can detect sentence boundaries.
- `regular-expressions-for-nlp.md` provides the pattern-matching machinery for rule-based sentence splitters.
- `text-normalization.md` (punctuation normalization) feeds into segmentation -- inconsistent punctuation causes boundary detection errors.
- `text-cleaning-and-noise-removal.md` should precede segmentation: HTML tags, encoding artifacts, and OCR errors all create spurious periods.
- Sentence-level NLP tasks -- `sentiment-analysis.md`, `machine-translation.md`, `natural-language-inference.md` -- depend on correct segmentation.
- spaCy's dependency-parse-based segmentation connects to `dependency-parsing.md`.
- `data-annotation-and-labeling.md` for sentence-level tasks requires pre-segmented text, making segmentation a foundational annotation step.

## Further Reading

- Kiss and Strunk, "Unsupervised Multilingual Sentence Boundary Detection," *Computational Linguistics*, 2006 -- the Punkt algorithm, the most widely deployed unsupervised sentence segmenter.
- Palmer and Hearst, "Adaptive Multilingual Sentence Boundary Disambiguation," *Computational Linguistics*, 1997 -- the SATZ system using neural networks and decision trees for sentence boundary detection.
- Wicks and Post, "A Unified Approach to Sentence Segmentation of Punctuated Text in Many Languages," *ACL*, 2021 -- the Ersatz neural segmenter achieving state-of-the-art multilingual results.
- Read, Dridan, Oepen, and Solberg, "Sentence Boundary Detection: A Long Solved Problem?" *COLING*, 2012 -- revisiting sentence segmentation across domains and revealing persistent challenges.
- Jurafsky and Martin, *Speech and Language Processing*, 3rd edition (draft), 2024 -- Chapter 2 covers sentence segmentation with worked examples and error analysis.
