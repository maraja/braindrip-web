# Word Sense Disambiguation

**One-Line Summary**: Word sense disambiguation (WSD) is the task of determining which meaning of a polysemous word is intended in a given context, resolving one of the oldest and most fundamental ambiguities in natural language processing.

**Prerequisites**: `ambiguity-in-language.md`, `semantics.md`, `contextual-embeddings.md`, `bag-of-words.md`, `text-classification.md`.

## What Is Word Sense Disambiguation?

Consider the word "bank." In "She sat by the river bank," it means the sloping land beside water. In "She deposited money at the bank," it means a financial institution. Humans resolve this effortlessly -- you probably did not even pause. But for a machine processing text as a sequence of tokens, both sentences contain the identical string "bank" with no built-in signal about which meaning applies. WSD is the task of making this distinction computationally.

More formally, given a target word w in a sentence and a predefined inventory of senses S = {s1, s2, ..., sn} for that word, WSD selects the sense si that best fits the context. The sense inventory is typically drawn from a lexical resource such as WordNet, which lists 117,659 synonym sets (synsets) across English. For example, WordNet lists 10 noun senses and 8 verb senses for "bank" -- WSD must select exactly one.

WSD sits at the crossroads of lexical semantics and practical NLP. It is sometimes called an "AI-complete" problem because fully resolving word meaning requires world knowledge, contextual reasoning, and pragmatic inference. Despite this, modern contextual embeddings have made remarkable progress -- though challenges remain in fine-grained sense distinctions.

## How It Works

### Knowledge-Based Approaches

**The Lesk Algorithm (1986)**

The original Lesk algorithm disambiguates a word by comparing dictionary definitions (glosses) of its senses to the glosses of surrounding words. The sense whose gloss shares the most words with neighboring glosses wins. For example, if "bank" appears near "river" and "fish," the gloss for the river-bank sense ("sloping land beside a body of water") will overlap more with the context than the financial sense. Simplified Lesk (Kilgarriff and Rosenzweig, 2000) compares glosses directly to the surrounding sentence text rather than to other glosses, yielding better results with lower complexity.

**WordNet-Based Methods**

WordNet organizes senses into a taxonomy connected by hypernymy, hyponymy, meronymy, and other relations. Methods exploit this structure in several ways:

- **Path similarity**: Senses are preferred when they are taxonomically close to the senses of neighboring words. Shorter paths in the WordNet graph indicate greater semantic relatedness.
- **Information content**: Wu-Palmer and Lin similarity measures weight paths by the information content of the least common subsumer (the most specific shared ancestor in the hierarchy), estimated from corpus frequency data.
- **Structural approaches**: The Lesk-extended algorithm augments glosses with glosses of related synsets (hypernyms, hyponyms), significantly improving overlap-based disambiguation.

### Supervised WSD

Supervised WSD trains classifiers on sense-annotated corpora. The most influential annotated resource is SemCor, containing approximately 226,000 sense-tagged word instances from the Brown Corpus. Features typically include:

- Local context: surrounding words within a window of +/- k tokens
- Part-of-speech tags of the target and context words
- Syntactic relations (e.g., subject-of, object-of)
- Bag-of-words representations of the broader sentence or paragraph

Classifiers range from Naive Bayes and SVMs to neural models. IMS (It Makes Sense), a supervised SVM-based system by Zhong and Ng (2010), was a long-standing strong baseline. Modern neural WSD systems use bidirectional LSTMs or transformers fine-tuned on sense-annotated data, achieving F1 scores above 80% on standard benchmarks.

### Useful Heuristics

**One sense per discourse**: Within a single coherent document, a polysemous word almost always retains the same sense throughout. Gale, Church, and Yarowsky (1992) found this held approximately 98% of the time in their corpus studies. This heuristic allows a system to disambiguate a word once and propagate the sense to all other occurrences in the same document.

**One sense per collocation**: A word's sense is strongly determined by its immediate syntactic context. "Play a role" almost always uses the performance sense of "play," while "play the guitar" uses the musical-instrument sense. Yarowsky (1993) showed collocational features are among the most predictive for WSD.

### Most Frequent Sense Baseline

The most frequent sense (MFS) baseline simply assigns every instance of a word its most common sense according to a reference corpus (typically SemCor). Despite its simplicity, MFS is notoriously difficult to beat -- it achieves approximately 65% F1 on the ALL-WORDS evaluation tasks in SemEval. Many supervised systems only marginally improve upon it, and knowledge-based systems often perform below it. This strong baseline reflects Zipf-like sense distributions: the dominant sense of most polysemous words accounts for the vast majority of occurrences.

### Contextual Embeddings and WSD

The advent of contextual embeddings from models like ELMo, BERT, and subsequent transformers has transformed WSD. Because these models produce different vector representations for the same word in different contexts, they implicitly perform sense disambiguation. Nearest-neighbor approaches that compare a target word's contextual embedding to sense embeddings extracted from glosses or annotated examples achieve state-of-the-art results.

Loureiro and Jorge (2019) showed that BERT-based nearest-neighbor WSD achieved approximately 80% F1 on SemEval all-words tasks. BEM (Bi-Encoder Model by Blevins and Zettlemoyer, 2020) frames WSD as matching context representations against gloss representations, achieving F1 scores above 80% across multiple evaluation datasets. These approaches require no task-specific training data beyond WordNet glosses, effectively reducing WSD to a representation-matching problem.

### Evaluation: Senseval and SemEval

WSD has been systematically evaluated through shared tasks since Senseval-1 (1998). The series evolved into SemEval (Semantic Evaluation), which broadened to cover many semantic tasks. Key WSD evaluations include:

- **Senseval-2 (2001)**: English all-words and lexical sample tasks, establishing standard evaluation frameworks.
- **Senseval-3 (2004)**: Added coarse-grained evaluation, recognizing that many fine-grained WordNet distinctions are difficult even for humans.
- **SemEval-2007, 2013, 2015**: Continued all-words evaluation with evolving sense inventories and multilingual tracks.

The unified evaluation framework by Raganato et al. (2017) standardized benchmarks across five datasets, enabling consistent comparison and revealing that contextual embedding approaches surpass all prior methods.

## Why It Matters

1. **Information retrieval**: A search for "Java" should distinguish the programming language from the island from the coffee -- WSD enables sense-aware retrieval and indexing.
2. **Machine translation**: The correct translation of a polysemous source word depends entirely on its sense. "Bank" translates differently in French depending on whether it refers to a financial institution ("banque") or a river bank ("rive").
3. **Knowledge base construction**: Linking entity mentions to the correct entries in knowledge bases (entity linking) is fundamentally a WSD problem applied to proper nouns and concepts.
4. **Clinical NLP**: Medical terms are highly polysemous -- "discharge" can refer to patient discharge, wound discharge, or electrical discharge. Correct sense identification is critical for clinical information extraction.
5. **Downstream task improvement**: WSD can improve sentiment analysis, question answering, and text summarization by resolving semantic ambiguity early in the pipeline.

## Key Technical Details

- WordNet 3.0 contains approximately 117,659 synsets and 206,941 word-sense pairs across nouns, verbs, adjectives, and adverbs.
- SemCor contains approximately 226,000 manually sense-tagged instances, making it the largest openly available sense-annotated corpus for English.
- The most frequent sense baseline achieves approximately 65% F1 on all-words WSD, making it a deceptively strong competitor.
- Inter-annotator agreement on fine-grained WSD is approximately 72-80%, establishing an effective ceiling for system performance.
- BERT-based WSD achieves approximately 80% F1 on unified all-words benchmarks (Raganato et al., 2017 framework), approaching human agreement levels.
- Coarse-grained WSD (merging related senses) yields F1 scores above 90%, suggesting much of the difficulty lies in fine-grained distinctions.
- The one-sense-per-discourse heuristic holds approximately 98% of the time, and one-sense-per-collocation holds approximately 95% of the time.

## Common Misconceptions

**"WSD is a solved problem because contextual embeddings handle it."**
Contextual embeddings have dramatically improved WSD, but they do not eliminate the problem. Fine-grained sense distinctions, rare senses, and domain-specific meanings remain challenging. Moreover, contextual embeddings perform implicit WSD -- making the disambiguation interpretable and controllable still requires explicit sense assignment.

**"More senses in the inventory means better disambiguation."**
Finer-grained sense inventories actually make WSD harder and less reliable. Many fine-grained WordNet distinctions are difficult even for human annotators to consistently apply. Coarse-grained inventories (e.g., OntoNotes groupings) often yield more practical and reliable disambiguation.

**"WSD requires large sense-annotated training data."**
Knowledge-based and gloss-based approaches using only WordNet definitions (no annotated training examples) now approach the performance of fully supervised systems, thanks to contextual embeddings. BEM and similar models match annotated contexts against sense glosses without requiring SemCor-style training data.

**"Every word needs disambiguation."**
Most word tokens in running text are either monosemous (only one sense) or used in their dominant sense. The genuinely difficult cases -- rare senses, highly polysemous words, domain-shifted meanings -- represent a fraction of all tokens.

## Connections to Other Concepts

- `ambiguity-in-language.md` provides the linguistic foundations of lexical ambiguity that WSD addresses.
- `semantics.md` covers the broader study of meaning from which WSD draws its theoretical grounding.
- `contextual-embeddings.md` explains how models like BERT produce sense-sensitive representations that largely subsume traditional WSD.
- `word2vec.md` and `glove.md` describe static embeddings that conflate all senses into a single vector -- the limitation that WSD explicitly overcomes.
- `named-entity-recognition.md` and `relation-extraction.md` benefit from WSD when entity mentions are ambiguous.
- `knowledge-graphs-for-nlp.md` relies on WSD for entity linking, connecting mentions to the correct knowledge base entries.
- `textual-entailment.md` and `natural-language-inference.md` require correct sense interpretation to judge semantic relationships.
- `semantic-similarity.md` depends on sense-aware comparisons for accurate meaning overlap measurement.

## Further Reading

- Navigli, R., "Word Sense Disambiguation: A Survey," ACM Computing Surveys, 2009 -- The most comprehensive survey of WSD methods, covering knowledge-based, supervised, and unsupervised approaches.
- Lesk, M., "Automatic Sense Disambiguation Using Machine Readable Dictionaries," 1986 -- The foundational knowledge-based algorithm using dictionary gloss overlap.
- Raganato, A., Camacho-Collados, J., and Navigli, R., "Word Sense Disambiguation: A Unified Evaluation Framework and Empirical Comparison," 2017 -- Standardized evaluation across five benchmarks enabling consistent comparison of WSD systems.
- Blevins, T. and Zettlemoyer, L., "Moving Down the Long Tail of Word Sense Disambiguation with Gloss-Informed Bi-Encoders," 2020 -- BERT-based bi-encoder achieving state-of-the-art WSD by matching context to sense glosses.
- Yarowsky, D., "Unsupervised Word Sense Disambiguation Rivaling Supervised Methods," 1995 -- Classic semi-supervised bootstrapping approach exploiting the one-sense-per-discourse and one-sense-per-collocation heuristics.
- Miller, G.A., "WordNet: A Lexical Database for English," Communications of the ACM, 1995 -- The sense inventory underlying most WSD research.
