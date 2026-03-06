# Levels of Linguistic Analysis

**One-Line Summary**: The hierarchy from phonology to pragmatics -- each level adding structure that NLP systems must capture to move from raw sound or text to genuine understanding.

**Prerequisites**: `what-is-nlp.md`

## What Is Levels of Linguistic Analysis?

Think of language as an onion with six distinct layers. At the outermost layer, you hear raw sounds; peel inward and you find patterns in those sounds, then word-building rules, sentence structures, meaning, and finally the subtle dance of context and social convention. Each layer has its own regularities, and understanding language requires peeling through all of them.

Linguists traditionally organize these layers into a hierarchy, from the most concrete physical signals to the most abstract contextual reasoning. NLP systems, whether they realize it or not, must grapple with every level. A speech recognizer handles phonetics and phonology. A tokenizer navigates morphology. A parser tackles syntax. A question-answering system needs semantics. A chatbot that can detect sarcasm must engage with pragmatics. No single level is sufficient on its own -- genuine language understanding requires integrating information across the entire stack.

This hierarchy is not just an academic taxonomy. It directly shapes how NLP systems are designed, which errors they make, and which problems remain hard.

## How It Works

### Level 1: Phonetics and Phonology

**Phonetics** studies the physical properties of speech sounds -- how the vocal tract shapes airflow into distinct acoustic signals. There are roughly 600 consonant sounds and 200 vowel sounds attested across the world's languages. **Phonology** studies the abstract sound patterns that are meaningful within a particular language. English has approximately 44 phonemes (the smallest units that distinguish meaning: /p/ vs. /b/ in "pat" vs. "bat"), while Hawaiian uses only 13.

In NLP, this level is most relevant to automatic speech recognition (see `automatic-speech-recognition.md`) and text-to-speech (see `text-to-speech.md`). Phonological rules explain why "dogs" is pronounced /dɒɡz/ but "cats" is /kats/ -- the voicing of the plural suffix assimilates to the preceding consonant.

### Level 2: Morphology

**Morphology** analyzes how words are built from smaller meaningful units called morphemes. The word "unbreakable" contains three morphemes: "un-" (negation), "break" (root), and "-able" (capable of). Languages vary enormously in morphological complexity: Turkish can express an entire English sentence in a single agglutinated word ("evlerinizden" = "from your houses"), while Mandarin Chinese uses virtually no inflectional morphology at all.

This level maps directly to tokenization strategies (see `morphology.md` for a deep dive and `tokenization-in-nlp.md` for the NLP implications). Subword tokenizers like BPE and WordPiece are essentially learning a data-driven approximation of morphological decomposition.

### Level 3: Syntax

**Syntax** governs how words combine into phrases and sentences according to grammatical rules. "The cat sat on the mat" is syntactically well-formed in English; "Mat the on sat cat the" is not, even though it contains the same words. Syntactic analysis produces tree structures -- either constituency trees (grouping words into nested phrases) or dependency trees (linking words via head-modifier relations).

NLP tasks at this level include part-of-speech tagging (see `part-of-speech-tagging.md`), constituency parsing (see `constituency-parsing.md`), and dependency parsing (see `dependency-parsing.md`). See `syntax-and-grammar.md` for formal grammar frameworks.

### Level 4: Semantics

**Semantics** is the study of meaning. Lexical semantics asks what individual words mean (and how multiple senses relate -- "bank" as financial institution vs. river edge). Compositional semantics asks how word meanings combine: "The dog chased the cat" means something different from "The cat chased the dog," even though they share the same words.

Key NLP applications include word sense disambiguation (see `word-sense-disambiguation.md`), semantic role labeling (see `semantic-role-labeling.md`), and natural language inference (see `natural-language-inference.md`). See `semantics.md` for a thorough treatment.

### Level 5: Pragmatics

**Pragmatics** deals with how context shapes meaning beyond the literal content of words. The sentence "Can you pass the salt?" is syntactically a yes/no question but pragmatically a polite request. Understanding pragmatics requires reasoning about the speaker's intention, shared knowledge, and conversational norms.

NLP systems that ignore pragmatics produce literal, robotic responses. Dialogue systems (see `dialogue-systems.md`) and sentiment analysis (see `sentiment-analysis.md`) must engage with this level. See `pragmatics-and-discourse.md` for speech acts, Gricean maxims, and implicature.

### Level 6: Discourse

**Discourse** analyzes how sentences connect into coherent multi-sentence text. This includes anaphora resolution ("John went to the store. **He** bought milk." -- "he" refers back to "John"), discourse relations (cause, contrast, elaboration), and text structure (topic shifts, narrative arc).

Relevant NLP tasks include coreference resolution (see `coreference-resolution.md`), text summarization (see `text-summarization.md`), and coherent text generation (see `text-generation.md`).

### Mapping Levels to NLP Tasks

| Linguistic Level | Example NLP Tasks |
|---|---|
| Phonetics/Phonology | ASR, TTS, spoken language understanding |
| Morphology | Tokenization, stemming, lemmatization |
| Syntax | POS tagging, parsing, grammar checking |
| Semantics | WSD, SRL, NLI, semantic similarity |
| Pragmatics | Dialogue, sarcasm detection, intent classification |
| Discourse | Coreference, summarization, coherence evaluation |

## Why It Matters

1. **Error diagnosis**: Knowing which linguistic level a system fails at tells you where to focus improvement. A machine translation error might be morphological (wrong verb conjugation), syntactic (scrambled word order), or pragmatic (culturally inappropriate register).
2. **Architecture design**: Classical NLP pipelines explicitly modeled each level as a separate module. Modern end-to-end models implicitly learn all levels simultaneously, but understanding the hierarchy helps interpret what different layers of a neural network are doing -- probing studies show that lower transformer layers capture syntax while upper layers capture semantics (Jawahar et al., 2019).
3. **Cross-linguistic generalization**: Languages differ in how much work each level does. Morphologically rich languages pack more information into word forms, while isolating languages rely more on syntax and pragmatics. NLP systems that assume English-like structure fail on typologically diverse languages (see `language-diversity-and-typology.md`).
4. **Task complexity assessment**: Tasks that require higher linguistic levels are generally harder. Tokenization (morphology) is largely solved; pragmatic reasoning (sarcasm, implicature) remains an open challenge.

## Key Technical Details

- The International Phonetic Alphabet (IPA) provides a standard notation for approximately 800 phonetic symbols covering all attested human speech sounds.
- English has roughly 44 phonemes, but writing uses only 26 letters -- this many-to-many mapping between sounds and spelling is why English text-to-speech and speech-to-text are harder than for orthographically transparent languages like Finnish or Spanish.
- The Penn Treebank tag set uses 36 POS tags (plus 12 punctuation/symbol tags) to capture syntactic categories, while the Universal Dependencies project defines 17 universal POS tags applicable across languages.
- WordNet 3.1 contains approximately 117,000 synsets (sets of synonymous word senses) organized into semantic hierarchies -- a hand-built resource capturing lexical semantics.
- Probing classifiers applied to BERT's 12 layers show that syntactic information (POS tags, dependency relations) peaks around layers 4--7, while semantic information (semantic roles, coreference) concentrates in layers 8--12 (Tenney et al., 2019).

## Common Misconceptions

**"These levels are strictly sequential -- you must fully solve phonology before tackling syntax."**
In reality, humans process multiple levels simultaneously, and information flows both bottom-up and top-down. You use syntactic expectations to resolve phonetic ambiguity ("recognize speech" vs. "wreck a nice beach"). Modern neural models similarly learn all levels jointly rather than in a strict pipeline.

**"Syntax is the hardest level for NLP."**
Syntax was the focus of decades of NLP research, but modern parsers achieve over 96% labeled attachment score on English newswire. Pragmatics and discourse -- reasoning about context, intention, and coherence -- remain far more challenging and less well-benchmarked.

**"Deep learning models do not need linguistic knowledge."**
While neural models learn implicit linguistic representations from data, understanding the linguistic hierarchy helps practitioners diagnose errors, design evaluation metrics, and build more robust systems. Linguistic knowledge also remains essential for low-resource languages where data alone is insufficient.

**"All languages have the same levels."**
All human languages have all six levels, but the relative complexity at each level varies dramatically. Mandarin has minimal morphology but complex tonal phonology. Turkish has extremely rich morphology but relatively free word order that reduces syntactic complexity. This variation is why multilingual NLP is hard (see `multilingual-nlp.md`).

## Connections to Other Concepts

- `what-is-nlp.md` provides the field overview that this hierarchy organizes.
- `morphology.md`, `syntax-and-grammar.md`, `semantics.md`, and `pragmatics-and-discourse.md` each deep-dive into individual levels.
- `ambiguity-in-language.md` shows how ambiguity arises at every level of the hierarchy.
- `tokenization-in-nlp.md` and `stemming-and-lemmatization.md` operate at the morphology level.
- `part-of-speech-tagging.md`, `dependency-parsing.md`, and `constituency-parsing.md` operate at the syntax level.
- `word-sense-disambiguation.md` and `semantic-role-labeling.md` operate at the semantics level.
- `coreference-resolution.md` operates at the discourse level.
- `language-diversity-and-typology.md` covers how different languages distribute complexity across levels.
- The sibling **LLM Concepts** collection discusses how transformer layers implicitly learn these linguistic levels through self-supervised pre-training.

## Further Reading

- Jurafsky, D. and Martin, J.H., *Speech and Language Processing*, 3rd edition (draft), 2024 -- Chapters 2--27 systematically cover NLP techniques at each linguistic level.
- Fromkin, V., Rodman, R., and Hyams, N., *An Introduction to Language*, 11th edition, 2017 -- The standard linguistics textbook covering all six levels for a general audience.
- Tenney, I. et al., "BERT Rediscovers the Classical NLP Pipeline," ACL, 2019 -- Probing study showing that BERT's layers recapitulate the traditional linguistic hierarchy.
- Jawahar, G. et al., "What Does BERT Learn about the Structure of Language?", ACL, 2019 -- Analysis of linguistic knowledge encoded in BERT's attention heads and layers.
- Sapir, E., *Language: An Introduction to the Study of Speech*, 1921 -- A classic text on the structure of language that remains influential in linguistic typology.
