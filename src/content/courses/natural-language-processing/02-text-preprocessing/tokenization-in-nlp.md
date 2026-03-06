# Tokenization in NLP

**One-Line Summary**: Splitting raw text into discrete units -- words and sentences -- using rule-based, statistical, or hybrid methods, with strategies that vary dramatically across languages and domains.

**Prerequisites**: `text-normalization.md`, `morphology.md`, `levels-of-linguistic-analysis.md`, basic regex

## What Is Tokenization?

Imagine receiving a long telegram with no spaces or punctuation: "ARRIVINGTODAYTHREETENMEETMEATSTATION." Before you can understand it, you must figure out where one word ends and the next begins. Tokenization is that process for NLP systems: it segments a continuous character stream into meaningful units (tokens) that serve as the atomic inputs to every downstream model.

Tokenization sounds trivial for English -- "just split on spaces" -- but it is surprisingly complex even in English (what about "don't," "New York," or "$3.50"?) and becomes a genuine research problem in languages that lack whitespace delimiters (Chinese, Japanese, Thai) or have rich agglutination (Turkish, Finnish). This file covers *word-level and sentence-level tokenization* as used in classical NLP pipelines. For subword tokenization (BPE, WordPiece, SentencePiece) as used in large language models, see `contextual-embeddings.md` and the tokenizer discussions in `bert.md` and `gpt-for-nlp-tasks.md`.

## How It Works

### Whitespace Tokenization

The simplest approach: split on spaces and tabs. `"The cat sat".split()` yields `["The", "cat", "sat"]`. This works for clean, space-delimited text but fails on punctuation ("end." becomes a single token), contractions ("don't"), hyphenated compounds ("state-of-the-art"), and multiword expressions ("New York City").

### Rule-Based Tokenization

#### Penn Treebank Style

The Penn Treebank tokenizer (Marcus et al., 1993) applies ordered regular expression rules: separate punctuation from words, expand contractions ("don't" to "do" + "n't"), and split possessives ("John's" to "John" + "'s"). This standard, used by NLTK's `word_tokenize()`, produces tokens aligned with part-of-speech tags (see `part-of-speech-tagging.md`).

#### spaCy's Tokenizer

spaCy uses a rule-based pipeline with three stages: (1) split on whitespace, (2) apply language-specific exception rules (e.g., "don't" splits but "U.S." does not), (3) apply prefix/suffix/infix rules via regex. spaCy processes approximately 1 million tokens per second on a single CPU core, making it suitable for production.

### Statistical and Neural Tokenizers

For languages without clear word boundaries, supervised models learn to segment text. The conditional random field (CRF) approach treats word segmentation as a sequence labeling problem: each character is tagged as "beginning of word" (B) or "continuation" (I).

### Language-Specific Challenges

#### Chinese Word Segmentation

Chinese text has no spaces between words. The string "\u4ed6\u7684\u786e\u5b9e\u8bb0\u4f4f\u4e86" requires a model to decide: is "\u786e\u5b9e" one word or two? The Peking University standard and the Chinese Treebank define different segmentation guidelines, and segmentation accuracy on the SIGHAN Bakeoff benchmarks ranges from 95% to 97% F1 depending on domain. The jieba library uses a dictionary-based approach with HMM fallback. More recent models like THULAC and LTP employ deep learning.

#### Japanese (MeCab, Sudachi)

Japanese mixes three scripts (hiragana, katakana, kanji) with no spaces. MeCab (Kudo, 2006) uses a lattice-based approach with a CRF model trained on the IPADIC dictionary, achieving segmentation accuracy above 99% on news text. Sudachi provides multiple segmentation granularities (short, medium, long) for different use cases.

#### German Compound Words

German forms productive compounds: "Donaudampfschifffahrtsgesellschaft" (Danube steamship company). Compound splitting improves downstream task performance by 1-3 points on machine translation (see `machine-translation.md`) and information retrieval. Tools like CharSplit and the compound splitter in spaCy-de handle this.

#### Arabic Clitics

Arabic attaches prepositions, conjunctions, and pronouns as clitics: "\u0648\u0633\u064a\u0643\u062a\u0628\u0648\u0646\u0647\u0627" encodes "and they will write it." The Stanford Arabic segmenter (Monroe et al., 2014) and MADAMIRA achieve segmentation F1 of 98-99% on newswire. Proper segmentation is essential for Arabic NER and parsing.

### Sentence Tokenization

Sentence tokenization (see `sentence-segmentation.md` for full coverage) splits text into sentences. The challenge is that periods serve triple duty as sentence terminators, abbreviation markers ("Dr."), and decimal points ("3.14"). The Punkt algorithm (Kiss and Strunk, 2006) handles this through unsupervised learning of abbreviation lists.

### Tooling Summary

| Tool | Language | Speed (tokens/sec) | Approach |
|------|----------|-------------------|----------|
| NLTK `word_tokenize` | Python | ~100K | Regex (PTB rules) |
| spaCy | Python | ~1M | Rule-based pipeline |
| MeCab | C++/Python | ~2M | CRF + dictionary |
| jieba | Python | ~400K | Dictionary + HMM |
| Stanford Tokenizer | Java | ~500K | Rule-based + ML |

## Why It Matters

1. **Every NLP pipeline begins with tokenization**: A tokenization error propagates through POS tagging, parsing, NER, and all downstream tasks. An incorrectly merged token cannot be recovered later.
2. **Vocabulary definition**: The tokenizer defines what a "word" is, which directly determines vocabulary size for `bag-of-words.md` and `tf-idf.md` models.
3. **Alignment with annotations**: Training data annotations (see `data-annotation-and-labeling.md`) assume a specific tokenization. Mismatches between the tokenizer used for annotation and the tokenizer used at training time cause label misalignment.
4. **Cross-lingual portability**: A system that works on English may fail entirely on Chinese or Thai without language-appropriate tokenization (see `multilingual-nlp.md`).
5. **Reproducibility**: Different tokenizers on the same text produce different token counts, affecting metrics like BLEU (see `evaluation-metrics-for-nlp.md`) that count token-level n-gram matches.

## Key Technical Details

- English whitespace tokenization produces roughly 1.2 tokens per whitespace-delimited word (due to punctuation splitting).
- Penn Treebank tokenization on the Wall Street Journal corpus averages approximately 23.5 tokens per sentence.
- Chinese word segmentation state-of-the-art on the PKU benchmark (SIGHAN 2005) is 96.5% F1; on CTB it reaches 97.6% F1.
- spaCy's tokenizer handles over 60 languages with language-specific rules, achieving near-perfect agreement with gold standard tokenizations on most European languages.
- Tokenization inconsistencies between training and inference can cause 2-5% accuracy drops on classification tasks.
- MeCab processes Japanese text at approximately 2 million morphemes per second, making it one of the fastest morphological analyzers available.

## Common Misconceptions

**"Tokenization is a solved problem."** For English news text, perhaps. But tokenization accuracy drops significantly on code-mixed text (e.g., Hindi-English), social media (see `text-cleaning-and-noise-removal.md`), and historical documents. Even for English, "Ph.D." and "e.g." remain tricky edge cases.

**"Subword tokenization (BPE) replaces word tokenization."** Subword tokenization is the standard for transformer models, but many NLP applications -- keyword extraction (see `keyword-extraction.md`), concordance analysis, readability scoring, and linguistic annotation -- still require word-level tokens.

**"More tokens means better granularity."** Over-splitting loses semantic units. Splitting "ice cream" into "ice" and "cream" makes it harder for a bag-of-words model to capture the compound meaning. Multiword expression handling is an active research area.

**"One tokenizer fits all languages."** Languages have fundamentally different word boundary conventions. A single regex-based tokenizer will fail on Chinese, Thai, or Vietnamese (which uses spaces between syllables, not words).

## Connections to Other Concepts

- Tokenization requires prior `text-normalization.md` -- unnormalized Unicode causes tokenizers to produce spurious tokens.
- Token boundaries define the units for `stopword-removal.md` and `stemming-and-lemmatization.md`.
- `sentence-segmentation.md` is a specialized form of tokenization at the sentence level.
- `regular-expressions-for-nlp.md` provides the pattern-matching engine underlying most rule-based tokenizers.
- Tokenization choices directly affect feature extraction for `bag-of-words.md`, `tf-idf.md`, and `n-gram-language-models.md`.
- For languages with complex morphology, tokenization interacts with `morphology.md` -- the line between tokenization and morphological analysis blurs.
- `data-annotation-and-labeling.md` schemes (BIO tags, dependency annotations) are defined over tokens, making tokenization a foundational commitment.

## Further Reading

- Marcus, Santorini, and Marcinkiewicz, "Building a Large Annotated Corpus of English: The Penn Treebank," *Computational Linguistics*, 1993 -- defines the tokenization standard used across English NLP for three decades.
- Kudo, "MeCab: Yet Another Part-of-Speech and Morphological Analyzer," 2006 -- the lattice-based CRF approach to Japanese tokenization.
- Chang, Galley, and Manning, "Optimizing Chinese Word Segmentation for Machine Translation Performance," *WMT*, 2008 -- demonstrates how segmentation granularity affects downstream MT.
- Kiss and Strunk, "Unsupervised Multilingual Sentence Boundary Detection," *Computational Linguistics*, 2006 -- the Punkt algorithm for sentence tokenization.
- Monroe, Green, and Manning, "Word Segmentation of Informal Arabic with Domain Adaptation," *ACL*, 2014 -- handling Arabic clitic segmentation across domains.
