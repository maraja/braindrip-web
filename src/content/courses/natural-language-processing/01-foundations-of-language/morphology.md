# Morphology

**One-Line Summary**: How words are built from morphemes -- inflection, derivation, and compounding that affect meaning, and whose cross-linguistic variation profoundly shapes tokenization and NLP system design.

**Prerequisites**: `what-is-nlp.md`, `levels-of-linguistic-analysis.md`

## What Is Morphology?

If syntax is the blueprint for building sentences, morphology is the blueprint for building words. Consider the English word "unbelievably": it is not an atomic unit but a construction assembled from four pieces -- "un-" (negation prefix), "believe" (root verb), "-able" (adjective-forming suffix), and "-ly" (adverb-forming suffix). Each piece carries meaning, and the order matters: "believeunlyab" is gibberish.

These minimal meaningful units are called **morphemes**. Morphology is the branch of linguistics that studies how morphemes combine to form words, and how those combinations affect meaning and grammatical function. For NLP, morphology is not an academic curiosity -- it is the level at which the choice of tokenization strategy succeeds or fails, and where languages diverge most dramatically from one another.

A useful analogy: morphemes are to words what atoms are to molecules. Just as chemistry studies how atoms bond into molecules with emergent properties, morphology studies how morphemes bond into words with emergent meanings. And just as different elements have different bonding rules, different languages have radically different morphological systems.

## How It Works

### Types of Morphemes

A **free morpheme** can stand alone as a word ("book," "run," "happy"). A **bound morpheme** must attach to another morpheme ("-s," "-ing," "un-," "-ness"). Bound morphemes are further classified:

- **Prefixes** attach before the root: "un-happy," "re-write," "pre-heat"
- **Suffixes** attach after the root: "happi-ness," "walk-ed," "teach-er"
- **Infixes** insert inside the root (rare in English but common in Tagalog: "sulat" = write, "s-um-ulat" = wrote)
- **Circumfixes** wrap around the root (German: "ge-spiel-t" = played)

### Inflectional vs. Derivational Morphology

**Inflectional morphology** modifies a word to express grammatical features (tense, number, case, gender, person) without changing the word's core meaning or part of speech. English "walk" inflects to "walks," "walked," "walking" -- all are still verbs meaning the act of walking. English is relatively sparse in inflection (about 8 inflectional suffixes). Russian, by contrast, has 6 cases, 3 genders, and 2 numbers for nouns alone, producing dozens of inflectional forms per noun.

**Derivational morphology** creates new words, often changing part of speech. "Happy" (adjective) becomes "happiness" (noun), "unhappy" (adjective), "happily" (adverb). Unlike inflection, derivation can change meaning unpredictably: "flammable" and "inflammable" mean the same thing, not opposites.

The distinction matters for NLP because inflectional variants should typically map to the same lemma during preprocessing (see `stemming-and-lemmatization.md`), while derivational variants may need distinct representations.

### Compounding

**Compounding** joins two or more free morphemes into a new word: "blackbird," "toothbrush," "mother-in-law." German is famous for productive compounding: "Donaudampfschifffahrtsgesellschaftskapitan" (Danube steamship company captain) is a single word. Finnish and Dutch also compound aggressively. Compounding creates challenges for NLP because the resulting words may not appear in any dictionary, and their meaning must be inferred from the parts.

### Morphological Typology

Languages fall along a spectrum of morphological complexity:

**Isolating (analytic) languages** like Mandarin Chinese and Vietnamese use little to no morphology. Each word is typically a single morpheme. Grammatical relationships are expressed through word order and separate function words. "Ta mingtian hui qu" (He tomorrow will go) -- four separate morphemes, no inflection.

**Agglutinative languages** like Turkish, Finnish, and Swahili build words by concatenating clearly segmentable morphemes, each expressing a single grammatical feature. Turkish "evlerinizden" decomposes transparently: ev (house) + ler (plural) + iniz (your) + den (from) = "from your houses." A single Turkish word can encode what takes an entire English phrase.

**Fusional (inflectional) languages** like Russian, Latin, and Arabic express multiple grammatical features in a single morpheme that cannot be cleanly segmented. The Russian suffix "-ov" in "domov" (of houses) simultaneously encodes genitive case and plural number -- you cannot split it into separate case and number morphemes.

**Polysynthetic languages** like Mohawk and Yup'ik can express an entire sentence's worth of meaning in a single word through extensive incorporation of arguments and modifiers. Yup'ik "tuntussuqatarniksaitengqiggtuq" means "He had not yet said again that he was going to hunt reindeer."

### Morphological Analysis in NLP

Computational morphological analysis involves:

1. **Morphological segmentation**: Splitting a word into its constituent morphemes. Morfessor (Creutz and Lagus, 2007) uses unsupervised statistical methods to learn segmentations. BPE and WordPiece tokenization (see `tokenization-in-nlp.md`) can be seen as data-driven approximations of morphological segmentation.

2. **Morphological parsing**: Identifying morpheme boundaries plus the grammatical features each morpheme contributes. Finite-state transducers (Beesley and Karttunen, 2003) implement two-level morphology, mapping between surface forms ("cities") and underlying analyses ("city+N+PL").

3. **Lemmatization**: Reducing inflected forms to their dictionary headword. "Running," "ran," "runs" all map to "run." This requires morphological knowledge, unlike stemming, which uses crude suffix-stripping heuristics (see `stemming-and-lemmatization.md`).

### Implications for Tokenization

A tokenizer that splits text on whitespace works reasonably well for isolating languages like Chinese (once word segmentation is handled) and moderately well for English. It fails catastrophically for agglutinative languages where a single whitespace-delimited token may encode a full clause.

Subword tokenization methods -- BPE (Sennrich et al., 2016), WordPiece (Schuster and Nakajima, 2012), and SentencePiece (Kudo and Richardson, 2018) -- address this by learning a vocabulary of variable-length subword units from data. These methods organically discover morpheme-like units: BPE trained on English typically learns "un," "ing," "tion," and "ment" as frequent subword pieces. This is not coincidence -- frequent subword units in text tend to correspond to productive morphemes.

## Why It Matters

1. **Vocabulary management**: Morphologically rich languages can generate millions of distinct word forms. Without morphological decomposition or subword tokenization, vocabulary sizes explode, leading to sparse representations and poor generalization.
2. **Out-of-vocabulary handling**: A word-level model encountering "unforgettability" for the first time has no representation for it. A morphology-aware system can compose meaning from "un-," "forget," "-able," and "-ity" (see `fasttext.md` for subword embeddings).
3. **Cross-lingual transfer**: Morphological awareness improves transfer learning across related languages that share morphological processes. A model that learns Spanish verb conjugation patterns can partially transfer to Portuguese (see `cross-lingual-transfer.md`).
4. **Machine translation quality**: Generating correct morphological forms in the target language is essential for fluent translation, especially into morphologically rich languages like Finnish or Turkish (see `machine-translation.md`).
5. **Information retrieval**: Query "running shoes" should match documents mentioning "run shoes," "runner's shoes," etc. Morphological normalization improves recall (see `information-retrieval.md`).

## Key Technical Details

- English has approximately 8 inflectional affixes (-s, -es, -ed, -en, -ing, -er, -est, -'s) compared to Turkish's 100+ suffixes and Finnish's approximately 200 suffixes.
- Morfessor 2.0 achieves F1 scores of approximately 65--85% on morphological segmentation across languages, with performance varying significantly by morphological type.
- The Morphological Reinflection shared task (SIGMORPHON) benchmarks systems on generating inflected forms from lemmas: best systems achieve over 95% accuracy on high-resource languages but drop to approximately 50--70% on low-resource, morphologically complex languages.
- BPE with a vocabulary of 32,000 subword tokens is a common default in modern NLP systems. GPT-2 uses a vocabulary of 50,257 BPE tokens; BERT uses 30,522 WordPiece tokens.
- The Universal Morphology (UniMorph) dataset covers over 165 languages with unified morphological feature schemas.

## Common Misconceptions

**"English has simple morphology, so morphology does not matter for NLP."**
English morphology is simpler than Turkish or Finnish but is far from trivial. English has irregular verbs ("go/went/gone"), productive derivation ("un-friend-ly"), and compounding ("snowboard"). More importantly, approximately 80% of the world's languages are morphologically richer than English, so English-centric NLP that ignores morphology fails globally.

**"Subword tokenization solves the morphology problem."**
BPE and WordPiece capture frequent morphological patterns but are not true morphological analyzers. They are driven by corpus frequency, not linguistic structure, so they may split words at non-morphemic boundaries ("unhappy" might tokenize as "un" + "happy" or "unh" + "appy" depending on the training corpus). They also struggle with rare morphological processes.

**"Agglutinative languages are harder for NLP than fusional ones."**
Agglutinative languages have many morphemes per word but each morpheme boundary is clean and predictable. Fusional languages have fewer morphemes per word but the boundaries are ambiguous and a single morpheme encodes multiple features. Both present distinct challenges; neither is categorically harder.

**"Morphological analysis requires hand-built rules."**
While early computational morphology relied on hand-crafted finite-state transducers, modern approaches (Morfessor, neural seq2seq models, character-level transformers) learn morphological patterns from data with minimal supervision.

## Connections to Other Concepts

- `levels-of-linguistic-analysis.md` places morphology in the broader linguistic hierarchy.
- `tokenization-in-nlp.md` covers the NLP systems that must handle morphological complexity in practice.
- `stemming-and-lemmatization.md` describes the preprocessing techniques that collapse morphological variation.
- `fasttext.md` shows how subword (character n-gram) embeddings handle morphological variation at the representation level.
- `syntax-and-grammar.md` covers the next level up -- how morphologically complete words combine into sentences.
- `language-diversity-and-typology.md` provides the cross-linguistic perspective on morphological variation.
- `multilingual-nlp.md` and `multilingual-transformers.md` address how modern models handle morphological diversity across languages.
- The sibling **LLM Concepts** collection covers BPE tokenization and vocabulary design in the context of large language model training.

## Further Reading

- Haspelmath, M. and Sims, A., *Understanding Morphology*, 2nd edition, 2010 -- The standard linguistics textbook on morphological theory and cross-linguistic variation.
- Creutz, M. and Lagus, K., "Unsupervised Models for Morpheme Segmentation and Morphology Learning," ACM TSLP, 2007 -- The Morfessor algorithm for unsupervised morphological segmentation.
- Sennrich, R. et al., "Neural Machine Translation of Rare Words with Subword Units," ACL, 2016 -- The BPE paper that became the standard tokenization method for neural NLP.
- Beesley, K. and Karttunen, L., *Finite State Morphology*, 2003 -- The definitive reference on finite-state approaches to computational morphology.
- Vylomova, E. et al., "SIGMORPHON 2020 Shared Task on Morphological Reinflection," 2020 -- Benchmarking morphological generation across 90 languages.
