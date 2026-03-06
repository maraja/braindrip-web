# Text Cleaning and Noise Removal

**One-Line Summary**: Handling the messy reality of real-world text -- stripping HTML, fixing encoding errors, correcting OCR artifacts, normalizing social media conventions, deduplicating, and detecting language -- before any NLP model can be reliably applied.

**Prerequisites**: `text-normalization.md`, `regular-expressions-for-nlp.md`, `tokenization-in-nlp.md`, basic knowledge of character encoding

## What Is Text Cleaning and Noise Removal?

Imagine trying to read a water-damaged book where some pages are smudged, others are printed in different fonts, and several pages from entirely different books have been bound in by mistake. Before you can study the content, you must identify and repair the damage. Text cleaning is that restoration process for NLP: it transforms raw, noisy text from the real world into a form that downstream models can process reliably.

Unlike `text-normalization.md`, which standardizes *legitimate* surface variation (case, Unicode forms), text cleaning addresses *corruption and noise* -- characters that should not be there at all, or that arrived in the wrong encoding, or that represent non-textual artifacts. Every NLP practitioner has encountered the dreaded "mojibake" -- `Ã©` appearing where `e` should be -- or scraped web pages contaminated with JavaScript remnants and navigation menus.

The rule of thumb is brutal: 80% of NLP project time goes into data preparation, and text cleaning is where most of that time is spent (CrowdFlower, 2016 survey). Getting this wrong poisons everything downstream.

## How It Works

### HTML and Markup Stripping

Web-scraped text contains HTML tags, CSS, JavaScript, and navigation elements that are noise for NLP:

```python
from bs4 import BeautifulSoup

html = "<p>The <b>quick</b> brown fox &amp; friends.</p>"
text = BeautifulSoup(html, 'html.parser').get_text()
# "The quick brown fox & friends."
```

Key considerations:
- **Entity decoding**: `&amp;` to `&`, `&lt;` to `<`, `&#8212;` to em-dash. Use BeautifulSoup or `html.unescape()`.
- **Structural information**: `<p>` tags indicate paragraph breaks; `<h1>` tags indicate section titles. Discarding structure loses useful segmentation cues.
- **Boilerplate removal**: Navigation menus, footers, sidebars. Tools like Trafilatura and jusText extract "main content" from web pages with 90-95% precision, outperforming naive tag stripping.
- **Never use regex for HTML**: HTML is a context-free language with nested structures that regex cannot reliably parse (see `regular-expressions-for-nlp.md`). Use a proper parser.

### Encoding Issues

#### The Problem

Text encoding mismatches produce mojibake: text decoded with the wrong character set. "caf\u00e9" encoded in UTF-8 (bytes `63 61 66 C3 A9`) but decoded as Latin-1 produces "cafÃ©."

#### Common Encodings

| Encoding | Coverage | Byte Width | Notes |
|----------|----------|------------|-------|
| UTF-8 | All Unicode | 1-4 bytes | Web standard (98% of pages) |
| Latin-1 (ISO-8859-1) | Western European | 1 byte | Legacy, common in old databases |
| Windows-1252 | Western European | 1 byte | Microsoft's superset of Latin-1 |
| ASCII | English only | 1 byte | 7-bit, 128 characters |

#### Detection and Repair

The `chardet` library detects encoding with approximately 90% accuracy; `cchardet` (C-based) is 10x faster. The `ftfy` library ("fixes text for you") repairs mojibake:

```python
import ftfy
ftfy.fix_text("The Mona Lisa doesnÃ\x83Â¢t have eyebrows.")
# "The Mona Lisa doesn't have eyebrows."
```

`ftfy` identifies common double-encoding patterns (UTF-8 interpreted as Latin-1 then re-encoded as UTF-8) and reverses them. It fixes approximately 95% of encoding errors in web-scraped English text.

### OCR Error Patterns

Optical Character Recognition introduces systematic errors based on visual glyph similarity:

| Original | OCR Error | Confusion Pair |
|----------|-----------|---------------|
| "rn" | "m" | Character merging |
| "cl" | "d" | Character merging |
| "1" | "l" or "I" | Digit-letter confusion |
| "0" | "O" | Digit-letter confusion |
| "fi" | "fi" (ligature) or "11" | Ligature handling |

Post-OCR correction approaches:
1. **Dictionary-based**: Flag tokens not in a dictionary and suggest nearest edit-distance matches.
2. **Statistical**: N-gram language models (see `n-gram-language-models.md`) score candidate corrections by context probability.
3. **Neural**: Sequence-to-sequence models trained on OCR error-correction pairs achieve 85-92% error correction accuracy on historical documents (Rigaud et al., 2019).

Modern OCR engines (Tesseract 5, Google Cloud Vision) achieve 95-99% character accuracy on clean documents but drop to 80-90% on degraded historical texts.

### Social Media Normalization

Social media text violates nearly every assumption of standard NLP:

#### Hashtags
Split `#MakeAmericaGreatAgain` into "Make America Great Again" using camelCase detection or a word segmentation model. The `wordsegment` library handles this with approximately 90% accuracy.

#### @Mentions
Replace `@username` with a placeholder token (`<USER>`) or remove entirely, depending on the task. For social network analysis, mentions are features; for text classification, they are noise.

#### Emoji and Emoticons
Options:
- **Remove**: Simplest; loses sentiment signal.
- **Replace with description**: Convert to text using the `emoji` library. The "thumbs up" emoji becomes `:thumbs_up:` or "thumbs up," preserving sentiment (Felbo et al., 2017 showed emoji are strong sentiment predictors).
- **Keep**: Some models (e.g., DeepMoji) use emoji directly as features.

#### Abbreviations and Slang
"u" to "you," "2morrow" to "tomorrow," "lol" to "laughing out loud." Lexicon-based normalization handles common cases; neural models (see Chrupala, 2014 in `text-normalization.md` references) handle novel abbreviations.

#### Elongation
"sooooo gooood" to "so good" via regex: `re.sub(r'(.)\1{2,}', r'\1\1', text)` (collapse 3+ repeated characters to 2). The extra character preserves emphasis information.

### Deduplication

Duplicate documents inflate training data and bias models. Three levels:

1. **Exact deduplication**: Hash each document (MD5, SHA-256) and remove identical hashes. Fast (O(n)) but misses near-duplicates.
2. **Near-deduplication**: MinHash with Locality-Sensitive Hashing (LSH) identifies documents with high Jaccard similarity. The C4 dataset used this to remove 60% of Common Crawl web pages (Raffel et al., 2020).
3. **Passage-level deduplication**: Detect repeated paragraphs across documents. Important for web-scraped corpora where boilerplate text (disclaimers, cookie notices) appears across millions of pages.

### Language Detection

Multilingual corpora require language identification before language-specific processing. Libraries:

- **langdetect** (Python): Port of Google's language detection library, supports 55 languages, >99% accuracy on texts longer than 50 characters.
- **fastText lid.176.bin**: Facebook's language identifier supporting 176 languages, >97% accuracy on short texts (even 10-20 characters).
- **CLD3**: Google Chrome's Compact Language Detector, neural-network-based, handles code-mixed text.

Language detection should run early in the pipeline, before language-specific tokenization (see `tokenization-in-nlp.md`) or stopword removal (see `stopword-removal.md`).

## Why It Matters

1. **Garbage in, garbage out**: Neural models are not immune to noise. BERT's performance drops 2-5% when trained on text with 5% character-level noise (Belinkov and Bisk, 2018). Cleaning data is cheaper than training larger models.
2. **Encoding errors cause silent failures**: A misencoded character can split a single word into multiple tokens, corrupting tokenization (see `tokenization-in-nlp.md`), POS tagging (see `part-of-speech-tagging.md`), and all downstream tasks.
3. **Deduplication prevents data leakage**: Near-duplicate documents appearing in both training and test sets inflate evaluation metrics. The original GPT-2 test set had 1-6% contamination from training data (Radford et al., 2019).
4. **Domain adaptation**: Cleaning strategies must match the domain. Removing emoji from a social media sentiment dataset destroys signal; keeping HTML in a news corpus introduces noise.
5. **Cost efficiency**: Clean data reduces model training time and allows smaller models to achieve the same performance as larger models on dirty data.

## Key Technical Details

- UTF-8 is the encoding of 98.2% of all web pages as of 2024 (W3Techs). Assuming UTF-8 is a reasonable default, but legacy databases often use Latin-1 or Windows-1252.
- The `ftfy` library fixes encoding errors in approximately 0.1ms per string, making it feasible for billion-document corpora.
- Trafilatura extracts main content from web pages with 93% precision and 91% recall on the CleanEval benchmark, versus 78% precision for naive tag stripping.
- MinHash-based deduplication with 128 hash functions and a Jaccard threshold of 0.8 identifies near-duplicates in the C4 corpus in approximately 3 hours on 96 CPUs.
- Language detection accuracy drops below 90% for texts shorter than 10 characters and for closely related languages (Norwegian Bokm\u00e5l vs. Danish, Croatian vs. Serbian).
- Social media text has approximately 40% higher out-of-vocabulary (OOV) rate compared to news text when using standard NLP vocabularies.

## Common Misconceptions

**"BeautifulSoup removes all HTML noise."** BeautifulSoup strips tags but not boilerplate (navigation, footers, ads). Dedicated content extractors like Trafilatura, Newspaper3k, or Readability handle this.

**"UTF-8 is backward-compatible with Latin-1."** It is not. UTF-8 is backward-compatible with *ASCII* (7-bit). Latin-1 bytes above 127 are valid but different characters in UTF-8. This misunderstanding is the root cause of most mojibake.

**"Clean data means removing everything non-alphabetic."** Aggressive cleaning loses punctuation (needed for `sentence-segmentation.md`), numbers (needed for numerical reasoning), and special characters (needed for domain-specific tasks like chemical formulas or code).

**"OCR errors are random."** OCR errors are highly systematic: certain character pairs are consistently confused (rn/m, cl/d, 1/l). Exploiting these patterns with targeted correction rules is far more effective than generic spell-checking.

**"Once data is cleaned, it stays clean."** Data pipelines must re-apply cleaning when new data arrives. Web content changes, encoding standards drift, and social media conventions evolve. Cleaning is a continuous process, not a one-time step.

## Connections to Other Concepts

- Text cleaning is the first step before `text-normalization.md` -- you must fix encoding errors before normalizing Unicode forms.
- `regular-expressions-for-nlp.md` provides the pattern-matching tools for most cleaning operations (URL removal, whitespace normalization, elongation reduction).
- Cleaning feeds into `tokenization-in-nlp.md` -- HTML artifacts and encoding errors cause tokenization failures.
- Language detection determines which `stopword-removal.md` list and `stemming-and-lemmatization.md` model to apply.
- Deduplication is essential for training data quality in `transfer-learning-in-nlp.md` and pre-trained models (see `bert.md`, `gpt-for-nlp-tasks.md`).
- Social media normalization connects to `data-augmentation-for-nlp.md` -- cleaned social media text can serve as augmentation data for formal-text models.
- OCR correction relates to `grammatical-error-correction.md` -- both involve sequence-level error correction.

## Further Reading

- Raffel, Shazeer, Roberts, et al., "Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer," *JMLR*, 2020 -- describes the C4 dataset cleaning pipeline (deduplication, language filtering, content extraction) at scale.
- Belinkov and Bisk, "Synthetic and Natural Noise Both Break Neural Machine Translation," *ICLR*, 2018 -- quantifies the impact of character-level noise on neural NLP models.
- Barbaresi, "Trafilatura: A Web Scraping Library and Command-Line Tool for Text Discovery and Extraction," *ACL Demo*, 2021 -- state-of-the-art web content extraction.
- Speer, "ftfy: Fixes Text For You," 2019 -- the standard library for automatic encoding error repair.
- Felbo, Mislove, S\u00f8gaard, Rahwan, and Lehmann, "Using Millions of Emoji Occurrences to Learn Any-Domain Representations for Detecting Sentiment, Emotion and Sarcasm," *EMNLP*, 2017 -- demonstrating emoji as sentiment features.
