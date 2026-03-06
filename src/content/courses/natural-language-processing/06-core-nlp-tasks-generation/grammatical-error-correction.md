# Grammatical Error Correction

**One-Line Summary**: Detecting and correcting grammatical, spelling, and usage errors in written text, progressing from rule-based checkers through classifier ensembles to neural sequence-to-sequence and LLM-based approaches.

**Prerequisites**: `sequence-to-sequence-models.md`, `part-of-speech-tagging.md`, `text-classification.md`, `machine-translation.md`

## What Is Grammatical Error Correction?

Imagine a meticulous copy editor reviewing a manuscript. They spot a subject-verb agreement error ("The data shows" should be "The data show" in formal style), fix a preposition choice ("interested on" to "interested in"), correct a spelling mistake, and restructure an awkward sentence. They do this by drawing on their knowledge of grammar rules, their experience reading millions of well-written sentences, and their understanding of what the author intended.

Grammatical error correction (GEC) is the NLP task of automatically detecting and fixing errors in written text -- including grammatical mistakes (agreement, tense, articles), spelling errors, word choice issues (collocations, prepositions), and stylistic problems (awkward phrasing, wordiness). It is a high-impact application serving hundreds of millions of users through tools like Grammarly, Microsoft Editor, and LanguageTool, and is especially valuable for language learners producing text in a second language.

## How It Works

### Rule-Based Approaches

The earliest GEC systems relied on hand-crafted rules encoding grammatical knowledge:

```
Rule: If a singular countable noun follows a verb with no article or determiner, suggest adding "a/an" or "the".
Example: "I bought car" → "I bought a car"
```

Tools like LanguageTool (open-source, 2003--present) maintain thousands of pattern-based rules per language. Rule-based systems are transparent, predictable, and precise for common error patterns but have limited coverage, cannot handle context-dependent errors, and require expert effort to extend. LanguageTool covers 30+ languages with approximately 3,000 rules for English.

### Classifier-Based Approaches

Instead of hand-crafted rules, train separate classifiers for specific error types:

- **Article classifier**: For each noun phrase, predict the correct article (a, an, the, or none) from a set of features (POS tags, head noun, context).
- **Preposition classifier**: For each prepositional slot, predict the correct preposition from a closed set of ~36 common prepositions.
- **Verb form classifier**: Predict the correct verb inflection (tense, number, aspect).

Rozovskaya and Roth (2016) combined classifiers for different error types into a pipeline system. Each classifier operates independently on its error type, and the outputs are combined. These systems achieved strong results on specific error types but struggled with errors requiring broader context and could not handle errors that span multiple words or require rephrasing.

### Seq2Seq Approaches (GEC as Translation)

A breakthrough insight: treat GEC as monolingual translation from "bad English" to "good English."

**Encoder-Decoder GEC**: Encode the erroneous sentence, decode the corrected version. Yuan and Briscoe (2016) first applied attention-based seq2seq to GEC. Junczys-Dowmunt et al. (2018) achieved state-of-the-art results using a Transformer-based seq2seq model, treating GEC identically to MT with techniques like ensembling, right-to-left reranking, and language model fusion.

**Key challenge -- data scarcity**: Parallel GEC data (erroneous + corrected sentences) is far scarcer than MT data. Solutions include:
- **Synthetic data generation**: Corrupt clean text using noise models (random insertion, deletion, substitution based on learner error distributions). Awasthi et al. (2019) showed that pre-training on 10M synthetic error-corrected pairs before fine-tuning on real data improved F0.5 from 56.1 to 59.7 on the BEA-2019 test set.
- **Data augmentation via back-translation**: Train an "error generation" model (correct to erroneous), then use it to create synthetic training pairs.

**GECToR** (Omelianchuk et al., 2020): Instead of full seq2seq generation, GECToR uses a sequence tagging approach -- predicting edit operations (keep, delete, replace, insert) for each token. This is faster than autoregressive generation (10x+ speedup) and achieves competitive results: 65.3 F0.5 on CoNLL-2014 and 72.4 F0.5 on BEA-2019 test.

### Evaluation Metrics

GEC uses specialized metrics because standard NLP metrics do not capture edit-level correctness:

**MaxMatch (M2)** (Dahlmeier and Ng, 2012): Computes the maximum overlap between the system's edits and a set of gold-standard edits, reporting precision, recall, and F-score. The standard metric for CoNLL-2014, using F0.5 (weighting precision over recall, since false corrections are more annoying than missed errors).

**ERRANT** (Bryant et al., 2017): Extracts and categorizes edits automatically, enabling error-type-level evaluation (e.g., "78% precision on article errors, 45% on preposition errors"). This fine-grained analysis guides targeted system improvement.

**GLEU** (Napoles et al., 2015): A variant of BLEU adapted for GEC that rewards correct copies of source tokens (not just n-gram matches with the reference), better handling the fact that most tokens in a GEC output are unchanged from the source.

### LLM-Based Correction

Modern LLMs perform GEC via prompting without task-specific fine-tuning:

```
Prompt: "Correct any grammatical errors in the following text.
         Only fix errors; do not change meaning or style.
         Input: I has went to the store yesterday and buyed some foods.
         Output:"
```

Fang et al. (2023) showed that GPT-4 achieves 71.1 F0.5 on the CoNLL-2014 test set in a zero-shot setting -- competitive with fine-tuned systems. However, LLMs sometimes over-correct, changing style or meaning beyond what is needed, especially for unconventional but grammatically acceptable constructions.

## Why It Matters

1. **Language learning**: GEC tools provide immediate feedback to the 1.5 billion people learning English worldwide, supplementing human tutors.
2. **Professional writing**: Grammarly serves over 30 million daily active users, correcting errors in emails, documents, and messages across professions.
3. **Accessibility**: GEC helps non-native speakers, people with dyslexia, and others who face challenges with written expression participate more effectively in written communication.
4. **Content quality**: Automated GEC in content management systems reduces editorial workload for publishers processing high volumes of user-generated content.
5. **Downstream NLP**: Correcting grammatical errors in input text can improve downstream NLP task performance, particularly for noisy text from social media, OCR, or speech transcription.

## Key Technical Details

- **CoNLL-2014** (Ng et al., 2014): 1,312 test sentences from NUCLE (NUS Corpus of Learner English) with annotations from 2 annotators. The primary GEC benchmark for years, scored with M2 F0.5. State-of-the-art systems achieve approximately 66--73 F0.5.
- **BEA-2019 Shared Task** (Bryant et al., 2019): Used the Write & Improve + LOCNESS corpus with 4,477 test sentences spanning three proficiency levels (beginner, intermediate, advanced). Provides a more representative evaluation across learner proficiency.
- **NUCLE** (Dahlmeier et al., 2013): 57K sentences from 1,400 essays by Singaporean university students, with error annotations. The primary training resource for early GEC research.
- **Lang-8**: 100K entries from a language learning platform where native speakers correct learner writing. Noisy but large.
- The F0.5 metric (not F1) is standard because precision matters more than recall in GEC -- a false correction (changing correct text to incorrect text) is worse than a missed error.
- Ensembling 4--8 models typically improves F0.5 by 2--4 points over a single model.
- Human performance on CoNLL-2014 is estimated at 72.6 F0.5, and current systems are within the range of human inter-annotator agreement.

## Common Misconceptions

- **"GEC is solved by spell checkers."** Spell checkers handle only one error type (misspellings). GEC encompasses article errors, preposition errors, verb form errors, subject-verb agreement, word order, sentence structure, and more. Spelling errors account for only about 15% of learner errors in English.

- **"A grammar checker should fix every error."** In practice, precision matters more than recall. Users lose trust quickly when a system "corrects" text that was already correct (false positives). This is why the field uses F0.5 rather than F1, weighting precision twice as heavily as recall.

- **"GEC is just translation from bad text to good text."** While the seq2seq framing works well, GEC has unique properties: most of the input is already correct (typically 85--95% of tokens are unchanged), the edits are usually local, and the system must preserve the author's intended meaning and style rather than generating a completely new sentence.

- **"LLMs are perfect grammar checkers."** LLMs sometimes over-correct, rewriting sentences to match their own stylistic preferences rather than making minimal corrections. They can also introduce new errors, especially with less common grammatical constructions or in languages other than English. For production use, LLM outputs still benefit from post-processing and confidence thresholds.

## Connections to Other Concepts

- **`machine-translation.md`**: GEC as monolingual translation directly borrows MT architectures, training techniques, and evaluation methodology.
- **`part-of-speech-tagging.md`**: POS tags provide features for classifier-based GEC and help identify error types (wrong verb form, incorrect article).
- **`text-classification.md`**: Error detection (is this sentence grammatical?) is a binary classification task; error type classification categorizes the specific error.
- **`text-generation.md`**: Seq2seq GEC uses the same decoding strategies; LLM-based GEC uses prompt-based generation.
- **`data-augmentation-for-nlp.md`**: Synthetic error generation is a form of data augmentation critical for GEC training data.
- **`evaluation-metrics-for-nlp.md`**: M2, ERRANT, and GLEU are specialized GEC metrics discussed in the broader evaluation context there.

## Further Reading

- Dahlmeier and Ng, "Better Evaluation for Grammatical Error Correction" (2012) -- Introduced the MaxMatch (M2) scorer, the standard GEC evaluation tool.
- Junczys-Dowmunt et al., "Approaching Neural Grammatical Error Correction as a Low-Resource Machine Translation Task" (2018) -- Applied MT techniques (Transformer, ensembling, LM fusion) to achieve state-of-the-art GEC.
- Bryant et al., "Automatic Annotation and Evaluation of Error Types for Grammatical Error Correction" (2017) -- ERRANT, enabling fine-grained, error-type-specific evaluation.
- Omelianchuk et al., "GECToR -- Grammatical Error Correction: Tag, Not Rewrite" (2020) -- A fast, effective sequence-tagging approach to GEC.
- Awasthi et al., "Parallel Iterative Edit Models for Local Sequence Transduction" (2019) -- Iterative refinement approach with synthetic pre-training for GEC.
- Fang et al., "Is ChatGPT a Good NLG Evaluator? A Preliminary Study" (2023) -- Includes evaluation of LLMs on GEC tasks, demonstrating competitive zero-shot performance.
