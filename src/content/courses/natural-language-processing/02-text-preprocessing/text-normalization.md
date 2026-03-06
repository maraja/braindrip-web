# Text Normalization

**One-Line Summary**: Standardizing text through case folding, unicode normalization, accent removal, and format unification so that superficially different strings map to a single canonical form before downstream processing.

**Prerequisites**: Unicode basics, character encoding (UTF-8), `text-as-data.md`, `levels-of-linguistic-analysis.md`

## What Is Text Normalization?

Imagine a library where the same book is filed under three different spellings of its author's name -- "Tolkien," "TOLKIEN," and "tolkien." A librarian who normalizes the catalog ensures every card points to the same shelf. Text normalization is that librarian for NLP pipelines: it rewrites surface-level variation so that downstream models see one consistent representation instead of many accidental variants.

More precisely, text normalization is a family of transformations applied to raw text before any statistical or neural processing. These transformations include case folding ("Apple" to "apple"), Unicode canonical equivalence resolution, accent and diacritics removal, whitespace standardization, number and date format unification, and abbreviation expansion. The goal is to reduce vocabulary size and surface-form noise without destroying meaningful distinctions.

The technical challenge is knowing *when* normalization helps and when it silently deletes information your model needs.

## How It Works

### Case Folding

Case folding maps all characters to a single case -- typically lowercase. In Python, `str.lower()` handles ASCII, while `str.casefold()` follows the Unicode Case Folding specification (Section 3.13 of the Unicode Standard), which collapses locale-sensitive cases such as the German sharp-s: `"Stra\u00dfe".casefold()` yields `"strasse"`.

**When case folding destroys information**: Named Entity Recognition (NER) relies on capitalization as a strong feature. Lowering "Apple" erases the distinction between the company and the fruit. Information retrieval systems like Lucene apply case folding at index time but preserve the original for display, a pragmatic middle ground.

### Unicode Normalization

Unicode allows the same visual character to have multiple code-point representations. The letter "e" (U+00E9) can also be expressed as "e" + combining acute accent (U+0065 U+0301). The Unicode Standard defines four normalization forms:

- **NFC** (Canonical Decomposition, then Canonical Composition): Composes characters into the fewest code points. Most common for NLP.
- **NFD** (Canonical Decomposition): Decomposes into base + combining characters. Useful when you need to strip accents.
- **NFKC** (Compatibility Decomposition, then Composition): Collapses compatibility variants -- the ligature "fi" (U+FB01) becomes "fi."
- **NFKD** (Compatibility Decomposition): The most aggressive form; decomposes everything.

In Python: `unicodedata.normalize('NFC', text)`. A 2018 study at Google found that applying NFC normalization reduced vocabulary size by 2-5% on multilingual corpora without measurable accuracy loss on downstream tasks.

### Accent and Diacritics Removal

After NFD decomposition, stripping characters in Unicode category "Mn" (Mark, Nonspacing) removes accents: "resume" from "r\u00e9sum\u00e9". This is useful for fuzzy matching and search but destructive for languages where diacritics are phonemically contrastive (Turkish "i" vs. "\u0131", Hungarian "o" vs. "\u00f6").

### Number and Date Standardization

Mapping numeric expressions to canonical tokens reduces sparsity. Common strategies include replacing all digits with a placeholder (`<NUM>`), normalizing date formats ("March 3rd, 2024" and "03/03/2024" to "2024-03-03"), and expanding currency symbols ("$5M" to "5000000 dollars"). The Stanford NER system uses a digit-collapsing feature that improved F1 by approximately 0.5 points on CoNLL-2003.

### Whitespace and Punctuation Cleanup

Collapsing multiple spaces, converting non-breaking spaces (U+00A0) to standard spaces, and normalizing dash variants (em-dash, en-dash, hyphen-minus) to a single character eliminates silent tokenization failures.

## Why It Matters

1. **Vocabulary reduction**: Normalizing case alone can shrink a vocabulary by 30-50% in English, directly improving coverage for frequency-based models like TF-IDF (see `tf-idf.md`).
2. **Feature consistency**: Models relying on exact string matching -- dictionaries, gazetteers, rule-based systems -- fail when the same entity appears in different surface forms.
3. **Cross-document alignment**: Deduplication, entity linking, and coreference (see `coreference-resolution.md`) depend on recognizing that "U.S.A.", "USA", and "United States" are the same entity.
4. **Downstream recall**: Search engines that normalize queries and documents together see 10-15% recall improvements on multilingual benchmarks.
5. **Pipeline robustness**: Inconsistent normalization between training and inference is a silent source of accuracy degradation that is difficult to debug.

## Key Technical Details

- NFC normalization passes are idempotent: applying NFC twice yields the same result as once.
- Python's `str.lower()` is locale-unaware. For Turkish text, a locale-aware lowering is required ("I" should map to "\u0131", not "i").
- The Unicode Standard (Version 15.1) defines 149,878 characters; normalization must handle the full space.
- Case folding reduces English vocabulary on the Brown Corpus from approximately 49,800 unique forms to approximately 40,100 (roughly 20% reduction).
- NFKC normalization can silently merge semantically distinct symbols: the micro sign (\u00b5, U+00B5) merges with Greek mu (\u03bc, U+03BC).
- Aggressive normalization can reduce F1 on NER tasks by 1-3 points due to loss of case and punctuation features (Mayhew et al., 2019).

## Common Misconceptions

**"Always lowercase everything."** Case is a powerful feature for tasks like NER, POS tagging (see `part-of-speech-tagging.md`), and sentence boundary detection (see `sentence-segmentation.md`). The decision should be task-dependent: lowercase for topic classification, preserve case for entity extraction.

**"Unicode normalization is only for non-English text."** English text from web scrapes routinely contains curly quotes (U+201C/U+201D), non-breaking spaces, and ligatures from PDF extraction. NFC normalization catches these.

**"Normalization is a one-time preprocessing step."** In production systems, normalization must be applied identically at training and inference time. A mismatch -- for example, normalizing training data but not user queries -- creates a silent distribution shift.

**"Removing accents is harmless."** In French, "ou" (or) vs. "o\u00f9" (where) are different words. In Turkish, removing the dot from "\u0130" conflates two phonemes. Accent removal should be language-conditional.

## Connections to Other Concepts

- Text normalization feeds directly into `tokenization-in-nlp.md` -- inconsistent normalization causes tokenizers to produce different outputs for the same logical input.
- Case folding interacts with `stopword-removal.md` -- stopword lists typically assume lowercased input.
- Unicode normalization is critical for `text-cleaning-and-noise-removal.md`, especially when processing web-scraped or OCR'd text.
- Normalization choices affect vocabulary size in `bag-of-words.md` and `tf-idf.md` representations.
- In multilingual settings (see `multilingual-nlp.md`), normalization must respect language-specific conventions or risk introducing errors.
- `regular-expressions-for-nlp.md` patterns often assume normalized input; unnormalized text causes regex misses.

## Further Reading

- Unicode Consortium, *The Unicode Standard, Version 15.1*, 2023 -- the authoritative reference for normalization forms (Chapter 3, Section 3.11).
- Manning, Raghavan, and Sch\u00fctze, *Introduction to Information Retrieval*, 2008 -- Chapter 2 covers tokenization and normalization for IR with practical examples.
- Mayhew, Tsygankova, and Roth, "ner and pos when nothing is capitalized," *EMNLP*, 2019 -- quantifies the impact of case information loss on sequence labeling tasks.
- Sproat and Jaitly, "RNN Approaches to Text Normalization: A Challenge," *Interspeech*, 2016 -- framing text normalization (especially for TTS) as a sequence-to-sequence problem.
- Chrupa\u0142a, "Normalizing tweets with edit scripts and recurrent neural embeddings," *ACL*, 2014 -- neural approach to social media text normalization.
