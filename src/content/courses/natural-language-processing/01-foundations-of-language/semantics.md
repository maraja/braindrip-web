# Semantics

**One-Line Summary**: The study of meaning -- from word senses to compositional sentence meaning to logical representations, and the distributional hypothesis that reshaped how NLP systems learn what words mean.

**Prerequisites**: `what-is-nlp.md`, `levels-of-linguistic-analysis.md`, `syntax-and-grammar.md`

## What Is Semantics?

Syntax tells you that "Colorless green ideas sleep furiously" is a grammatically perfect English sentence. Semantics tells you it is meaningless. Semantics is the branch of linguistics concerned with meaning -- what words mean, how word meanings combine into phrase and sentence meanings, and how the same string of characters can mean different things in different contexts.

Think of semantics as the "algebra of meaning." Just as algebra has variables (words), operators (grammatical rules), and evaluation rules (interpretation), semantics provides the machinery to compute what a sentence means from its parts. The sentence "The cat is on the mat" is not just a sequence of words in a syntactic tree -- it asserts a spatial relationship between a specific cat and a specific mat in some context. Semantics is the level that captures this.

For NLP, semantics is both the ultimate goal and the hardest challenge. A system that perfectly tokenizes, tags, and parses text but cannot determine what it means has not achieved language understanding. The quest to computationally represent and reason about meaning has driven some of the most important ideas in the field, from hand-built knowledge bases like WordNet to the distributional revolution of word embeddings.

## How It Works

### Lexical Semantics: The Meaning of Words

**Lexical semantics** studies the meanings of individual words and the relationships between them.

**Polysemy and homonymy**: Most common words have multiple senses. "Bank" can mean a financial institution, a river bank, a pool shot, or the act of tilting an aircraft. Polysemous words have related senses (the "head" of a person, a nail, a department, a table); homonymous words have unrelated senses that happen to share a spelling ("bat" the animal vs. "bat" the sports equipment). Word sense disambiguation (see `word-sense-disambiguation.md`) is the NLP task of resolving this ambiguity in context.

**Semantic relations** between words include:
- **Synonymy**: "big" and "large" (same meaning in many contexts)
- **Antonymy**: "hot" and "cold" (opposite meaning)
- **Hypernymy**: "animal" is a hypernym of "dog" (more general)
- **Hyponymy**: "poodle" is a hyponym of "dog" (more specific)
- **Meronymy**: "wheel" is a meronym of "car" (part-whole)

**WordNet** (Miller, 1995) is the most influential lexical database in NLP. It organizes approximately 117,000 synsets (sets of synonymous words) into hierarchical networks linked by hypernymy, meronymy, and other relations. WordNet 3.1 covers English nouns, verbs, adjectives, and adverbs with approximately 207,000 word-sense pairs. While WordNet has been partially superseded by distributional methods, it remains widely used for evaluation, feature engineering, and knowledge-augmented models.

### Compositional Semantics: Meaning from Parts

**Frege's Principle of Compositionality** (1892) states that the meaning of a complex expression is determined by the meanings of its parts and the rules used to combine them. "The dog chased the cat" has a different meaning from "The cat chased the dog" even though they share the same words -- compositionality ensures that grammatical structure (specifically, who is the subject and who is the object) determines who is the chaser and who is the chased.

Compositional semantics has two major traditions:

**Formal (model-theoretic) semantics** represents meanings as logical forms that can be evaluated against a model (a set of entities and relations). "Every student passed the exam" might be represented as: for all x, (student(x) implies passed(x, exam)). This approach, pioneered by Montague (1970), enables precise logical reasoning but requires translating natural language into formal logic -- a task that remains extremely difficult for open-domain text.

**Distributional compositional semantics** attempts to build phrase and sentence meanings by combining word vectors. Simple approaches average word embeddings; more sophisticated methods use tensor products, recursive neural networks, or attention mechanisms to compose meaning hierarchically. This approach scales to open-domain text but lacks the precision of logical forms.

### Distributional Semantics: Meaning from Context

The **distributional hypothesis**, crystallized in J.R. Firth's 1957 dictum "You shall know a word by the company it keeps," is arguably the most impactful idea in modern NLP. It states that words with similar meanings tend to occur in similar linguistic contexts. "Dog" and "cat" appear near words like "pet," "fur," "vet," and "food"; "algebra" and "calculus" appear near "equation," "theorem," and "variable."

This insight leads directly to distributional semantic models:

1. **Count-based models**: Build a word-context co-occurrence matrix from a corpus, then apply dimensionality reduction (SVD/PCA). Latent Semantic Analysis (Deerwester et al., 1990) pioneered this approach, reducing a term-document matrix to approximately 300 dimensions and discovering that documents about "car" and "automobile" cluster together.

2. **Prediction-based models**: Train a neural network to predict a word from its context (CBOW) or context from a word (Skip-gram). Word2Vec (Mikolov et al., 2013) showed that the resulting 300-dimensional vectors capture remarkable semantic regularities: vec("king") - vec("man") + vec("woman") is close to vec("queen"). See `word2vec.md` for a deep dive.

3. **Contextualized models**: ELMo, BERT, and GPT produce word representations that change based on the surrounding sentence. The word "bank" gets different vectors in "river bank" and "bank account." This overcomes the fundamental limitation of static embeddings, where each word type has a single vector regardless of context. See `contextual-embeddings.md`.

### Semantic Representations in NLP

Modern NLP uses several types of semantic representation:

- **Predicate-argument structure**: Who did what to whom. Semantic Role Labeling (see `semantic-role-labeling.md`) identifies agents, patients, instruments, and other roles.
- **Abstract Meaning Representation (AMR)**: A graph-based formalism representing sentence meaning as a rooted, directed, acyclic graph. "The boy wants to go" becomes: (w / want-01 :ARG0 (b / boy) :ARG1 (g / go-02 :ARG0 b)).
- **Semantic triples**: (subject, predicate, object) tuples for knowledge graphs. "Marie Curie won the Nobel Prize" becomes (Marie_Curie, won, Nobel_Prize). See `knowledge-graphs-for-nlp.md`.
- **Natural language inference labels**: Whether one sentence entails, contradicts, or is neutral toward another. See `natural-language-inference.md`.

## Why It Matters

1. **Search and retrieval**: A user searching for "automobile recalls" should find documents about "car safety defects." Semantic representations bridge the vocabulary gap (see `information-retrieval.md` and `semantic-similarity.md`).
2. **Question answering**: Answering "Who founded Microsoft?" from a passage saying "Bill Gates and Paul Allen established Microsoft in 1975" requires understanding that "founded" and "established" are semantically equivalent (see `question-answering.md`).
3. **Machine translation**: "Esprit" in French can mean "spirit," "mind," or "wit" depending on context. Correct translation requires semantic disambiguation (see `machine-translation.md`).
4. **Text entailment and reasoning**: Determining that "All dogs are mammals" and "Fido is a dog" entails "Fido is a mammal" requires compositional semantic reasoning (see `textual-entailment.md`).
5. **Knowledge extraction**: Converting unstructured text into structured knowledge graphs requires identifying entities, their properties, and the semantic relationships between them (see `relation-extraction.md`).

## Key Technical Details

- WordNet 3.1 contains approximately 117,000 synsets covering approximately 155,000 words. The average polysemy of English nouns in WordNet is approximately 1.24 senses, but the 1,000 most frequent nouns average approximately 3.5 senses.
- Word2Vec trained on 100 billion words from Google News produces 300-dimensional vectors that achieve approximately 74% accuracy on the word analogy task (Mikolov et al., 2013).
- GloVe vectors trained on 840 billion tokens of Common Crawl text achieve approximately 75% accuracy on the same analogy task while also performing well on word similarity benchmarks (r = 0.82 on WordSim-353). See `glove.md`.
- BERT large achieves approximately 86% F1 on SQuAD 2.0, demonstrating strong compositional semantic understanding for reading comprehension.
- AMR parsing accuracy currently reaches approximately 84% Smatch F1, still well below human agreement of approximately 90%.
- The SNLI dataset (Bowman et al., 2015) contains approximately 570,000 sentence pairs annotated with entailment, contradiction, or neutral labels -- the primary benchmark for natural language inference.

## Common Misconceptions

**"Distributional semantics captures the full meaning of words."**
Distributional vectors capture associative and relational similarity but miss aspects of meaning that require grounding: they cannot distinguish "above" from "below" from co-occurrence patterns alone, and they lack the embodied understanding that connects "red" to an actual perceptual experience. This is the "grounding problem" (Bender and Koller, 2020).

**"WordNet is obsolete in the age of embeddings."**
WordNet's explicit relational structure (hypernymy, meronymy) provides knowledge that is complementary to distributional information. Many state-of-the-art WSD systems combine distributional features with WordNet's graph structure, and WordNet remains the standard evaluation resource for lexical semantics tasks.

**"Formal semantics and distributional semantics are incompatible."**
There is active research on combining the scalability of distributional methods with the precision of formal logic. Neural-symbolic approaches, programs that generate logical forms from natural language, and embedding-based knowledge graph reasoning all bridge these traditions.

**"If two words have similar embeddings, they are synonyms."**
Distributional similarity captures many types of relatedness, not just synonymy. "Hot" and "cold" have similar embeddings because they appear in similar contexts ("the weather is ___"), but they are antonyms. "Doctor" and "hospital" are similar because they co-occur, not because they mean the same thing. See `word2vec.md` for a deeper discussion.

## Connections to Other Concepts

- `levels-of-linguistic-analysis.md` positions semantics between syntax and pragmatics.
- `syntax-and-grammar.md` provides the structural foundation for compositional semantics.
- `pragmatics-and-discourse.md` covers meaning that goes beyond literal semantics (implicature, speech acts).
- `ambiguity-in-language.md` covers semantic ambiguity (scope ambiguity, metaphor).
- `word-sense-disambiguation.md` addresses the core lexical semantics task.
- `word2vec.md`, `glove.md`, and `contextual-embeddings.md` implement distributional semantics computationally.
- `semantic-similarity.md` and `natural-language-inference.md` evaluate compositional semantic understanding.
- `semantic-role-labeling.md` extracts predicate-argument structure from text.
- `knowledge-graphs-for-nlp.md` covers structured semantic representations.
- The sibling **LLM Concepts** collection explores how large-scale pre-training captures semantic knowledge and whether this constitutes "understanding."

## Further Reading

- Firth, J.R., "A Synopsis of Linguistic Theory, 1930--1955," Studies in Linguistic Analysis, 1957 -- The source of the distributional hypothesis that underlies modern word embeddings.
- Miller, G.A., "WordNet: A Lexical Database for English," Communications of the ACM, 1995 -- The foundational paper introducing WordNet, still the most widely used lexical resource in NLP.
- Mikolov, T. et al., "Efficient Estimation of Word Representations in Vector Space," ICLR Workshop, 2013 -- Word2Vec and the birth of the neural word embedding revolution.
- Montague, R., "Universal Grammar," Theoria, 1970 -- The foundational work in formal semantics showing that natural language can be given a precise logical interpretation.
- Bowman, S. et al., "A Large Annotated Corpus for Learning Natural Language Inference," EMNLP, 2015 -- SNLI, the dataset that catalyzed research in compositional semantic reasoning.
- Bender, E.M. and Koller, A., "Climbing Towards NLU: On Meaning, Form, and Understanding in the Age of Data," ACL, 2020 -- A critical analysis of what distributional models actually learn about meaning.
