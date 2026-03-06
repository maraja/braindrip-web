# Regular Expressions for NLP

**One-Line Summary**: Pattern matching as the workhorse of text preprocessing -- defining formal string patterns with a concise syntax to search, extract, validate, and transform text in NLP pipelines.

**Prerequisites**: Basic programming (Python), `text-normalization.md`, `tokenization-in-nlp.md`

## What Is Regular Expressions for NLP?

Imagine you have a warehouse full of letters and you need to find every envelope with a ZIP code on it. You could open each one, or you could use a template -- "five consecutive digits, optionally followed by a dash and four more digits" -- and scan the envelopes mechanically. A regular expression (regex) is that template: a formal pattern language that describes the shape of the strings you want to match.

In NLP, regular expressions are the Swiss Army knife of text preprocessing. They power tokenizers (see `tokenization-in-nlp.md`), drive sentence boundary detectors (see `sentence-segmentation.md`), extract entities from semi-structured text, clean noise (see `text-cleaning-and-noise-removal.md`), and validate input formats. While deep learning has replaced regex for many *classification* tasks, regex remains indispensable for *extraction* and *transformation* tasks where the pattern is known and deterministic.

The formal foundation is finite automata theory: every regular expression corresponds to a deterministic finite automaton (DFA) that can match strings in O(n) time, where n is the string length. This theoretical guarantee makes regex fast and predictable -- when used correctly.

## How It Works

### Basic Syntax

| Pattern | Matches | Example |
|---------|---------|---------|
| `.` | Any single character | `c.t` matches "cat", "cot", "c9t" |
| `^` / `$` | Start / end of string | `^The` matches "The cat" but not "See The" |
| `\d` | Any digit [0-9] | `\d{3}` matches "123" |
| `\w` | Word character [a-zA-Z0-9_] | `\w+` matches "hello_world" |
| `\s` | Whitespace [ \t\n\r\f\v] | `\s+` matches spaces and tabs |
| `\b` | Word boundary | `\bcat\b` matches "cat" but not "category" |

### Character Classes

Square brackets define custom character sets:
- `[aeiou]` -- any vowel
- `[^aeiou]` -- any non-vowel (negation)
- `[a-zA-Z]` -- any letter
- `[0-9.,]` -- digits, periods, commas

### Quantifiers

| Quantifier | Meaning | Greedy/Lazy |
|------------|---------|-------------|
| `*` | 0 or more | Greedy |
| `+` | 1 or more | Greedy |
| `?` | 0 or 1 | Greedy |
| `{n}` | Exactly n | -- |
| `{n,m}` | Between n and m | Greedy |
| `*?`, `+?` | Lazy versions | Lazy |

The greedy vs. lazy distinction matters in NLP: matching `<.*>` on `"<b>bold</b>"` greedily captures `"<b>bold</b>"` (everything between the first `<` and last `>`), while `<.*?>` lazily captures `"<b>"` (the shortest match).

### Groups and Backreferences

Parentheses create capturing groups:

```python
import re
text = "Date: 2024-03-15"
match = re.search(r'(\d{4})-(\d{2})-(\d{2})', text)
year, month, day = match.group(1), match.group(2), match.group(3)
# "2024", "03", "15"
```

Named groups improve readability: `(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})`.

### Lookaheads and Lookbehinds

Zero-width assertions that match a position without consuming characters:

- **Positive lookahead** `(?=...)`: `\d+(?= dollars)` matches "50" in "50 dollars"
- **Negative lookahead** `(?!...)`: `\d+(?! dollars)` matches "50" in "50 euros"
- **Positive lookbehind** `(?<=...)`: `(?<=\$)\d+` matches "50" in "$50"
- **Negative lookbehind** `(?<!...)`: `(?<!\$)\d+` matches "50" in "EUR50"

These are essential for NLP extraction tasks where you need context-sensitive matching without including the context in the result.

### Common NLP Patterns

#### Email Extraction
```python
email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
# Matches: user@example.com, first.last@company.co.uk
```

#### URL Extraction
```python
url_pattern = r'https?://(?:www\.)?[-\w.]+(?:\.\w{2,})+(?:/[^\s]*)?'
# Matches: https://www.example.com/path?q=1
```

#### Phone Number Extraction (US)
```python
phone_pattern = r'(?:\+1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
# Matches: (555) 123-4567, +1-555-123-4567, 5551234567
```

#### Whitespace Normalization
```python
cleaned = re.sub(r'\s+', ' ', text).strip()
# Collapses multiple spaces, tabs, newlines into single space
```

#### Hashtag and Mention Extraction
```python
hashtags = re.findall(r'#(\w+)', tweet)
mentions = re.findall(r'@(\w+)', tweet)
```

### Python's `re` Module

Key functions for NLP work:
- `re.search(pattern, string)` -- first match anywhere in string
- `re.match(pattern, string)` -- match at string start only
- `re.findall(pattern, string)` -- all non-overlapping matches
- `re.sub(pattern, replacement, string)` -- search and replace
- `re.compile(pattern)` -- precompile for repeated use (2-10x faster in loops)

## Why It Matters

1. **Preprocessing backbone**: Most tokenizers, sentence splitters, and text cleaners are built on regular expressions. Understanding regex is understanding the machinery under `tokenization-in-nlp.md` and `sentence-segmentation.md`.
2. **Data extraction**: Extracting structured fields (dates, prices, phone numbers, email addresses) from unstructured text is a regex task before it is an NER task (see `named-entity-recognition.md`).
3. **Validation and filtering**: Regex filters remove or flag malformed data during `text-cleaning-and-noise-removal.md` -- stripping HTML tags, removing URLs, masking PII.
4. **Speed**: A compiled regex runs in O(n) time (for DFA-compatible patterns), processing millions of characters per second -- orders of magnitude faster than neural models for deterministic patterns.
5. **Reproducibility**: Regex rules are deterministic and interpretable, making them auditable for compliance-sensitive domains (medical, legal, financial).

## Key Technical Details

- Python's `re` module uses a backtracking NFA engine, which means pathological patterns like `(a+)+b` on input "aaaaaaaaaaac" can exhibit exponential worst-case time (catastrophic backtracking). The `regex` third-party module and RE2 (Google) use DFA-based engines that guarantee linear time.
- Precompiling with `re.compile()` avoids re-parsing the pattern on each call, reducing overhead by 2-10x in tight loops.
- The `re.UNICODE` flag (default in Python 3) makes `\w`, `\d`, and `\b` Unicode-aware: `\w` matches Arabic, Chinese, and Cyrillic characters, not just ASCII.
- The `re.VERBOSE` (`re.X`) flag allows whitespace and comments in patterns, essential for maintaining complex NLP regex.
- Named entity patterns in production systems (e.g., the Stanford TokensRegex framework) extend standard regex with token-level matching over annotated sequences.
- On a modern CPU, a compiled Python regex processes approximately 10-50 million characters per second for simple patterns.

## Common Misconceptions

**"Regex can parse HTML."** Regular expressions describe regular languages (Type 3 in the Chomsky hierarchy). HTML is a context-free language (Type 2) with nested structures (`<div><div></div></div>`) that regex fundamentally cannot handle. Use a proper HTML parser (BeautifulSoup, lxml) for HTML stripping -- see `text-cleaning-and-noise-removal.md`.

**"More complex regex means better matching."** Complex patterns are harder to maintain, debug, and test. In NLP pipelines, a cascade of simple patterns is almost always preferable to a single monolithic regex. The spaCy tokenizer, for example, uses separate prefix, suffix, and infix rule sets rather than one unified pattern.

**"Regex is obsolete because of neural NER."** Neural models excel at recognizing entities in context but are overkill for deterministic patterns. Extracting US Social Security numbers (`\d{3}-\d{2}-\d{4}`), ISO dates, or email addresses is a regex task. Many production NER systems use regex as a first pass before neural models (see `named-entity-recognition.md`).

**"The `.*` pattern is fine for most matching."** Greedy `.*` can match far more than intended, especially across line boundaries. Always consider anchors, lazy quantifiers (`.*?`), and negated character classes (`[^<]*` instead of `.*` inside tags) to constrain matching.

## Connections to Other Concepts

- Regex powers the rule-based components of `tokenization-in-nlp.md` (Penn Treebank tokenizer, spaCy's prefix/suffix rules).
- `sentence-segmentation.md` relies on regex for initial period disambiguation rules.
- `text-cleaning-and-noise-removal.md` uses regex extensively for HTML stripping, URL removal, and encoding cleanup.
- `text-normalization.md` applies regex for whitespace normalization, number formatting, and punctuation standardization.
- Pattern-based extraction is a lightweight alternative to `named-entity-recognition.md` for structured entities.
- The formal connection to automata theory links regex to `syntax-and-grammar.md` -- regex defines regular grammars, the simplest level of the Chomsky hierarchy.
- `data-annotation-and-labeling.md` workflows use regex for pre-annotation (automatic labeling of obvious patterns before human review).

## Further Reading

- Friedl, *Mastering Regular Expressions*, 3rd edition, O'Reilly, 2006 -- the definitive reference covering regex engines, optimization, and real-world patterns.
- Jurafsky and Martin, *Speech and Language Processing*, 3rd edition (draft), 2024 -- Chapter 2 covers regex for NLP with worked examples.
- Cox, "Regular Expression Matching Can Be Simple and Fast," 2007 -- explains why NFA backtracking engines can be pathologically slow and how DFA engines avoid this.
- Chang and Manning, "TokensRegex: Defining Cascaded Regular Expressions over Tokens," *Stanford Technical Report*, 2014 -- extending regex to operate over annotated token sequences.
- Goyvaerts and Levithan, *Regular Expressions Cookbook*, 2nd edition, O'Reilly, 2012 -- practical NLP-relevant patterns for emails, URLs, dates, and more.
