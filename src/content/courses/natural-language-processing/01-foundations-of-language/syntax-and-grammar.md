# Syntax and Grammar

**One-Line Summary**: Rules governing sentence structure -- phrase structure grammars, dependency relations, constituency trees, and the Chomsky hierarchy that defines the computational complexity of parsing.

**Prerequisites**: `what-is-nlp.md`, `levels-of-linguistic-analysis.md`, `morphology.md`

## What Is Syntax?

If morphology is about building words from parts, syntax is about building sentences from words. Syntax is the invisible scaffolding that turns a bag of words into a structured meaning-bearing utterance. "Dog bites man" and "Man bites dog" contain identical words, but their syntactic structures assign completely different meanings -- who is doing the biting depends entirely on word order and grammatical relations.

Think of syntax as the grammar of Lego construction. Individual bricks (words) snap together according to rules: certain shapes connect only in certain configurations, and the final structure has a hierarchical organization -- walls are made of rows, rows are made of bricks. Similarly, sentences are made of clauses, clauses of phrases, phrases of words, all following language-specific construction rules.

For NLP, syntax is foundational because nearly every task that goes beyond keyword matching requires some understanding of grammatical structure. Information extraction needs to know who did what to whom. Machine translation must rearrange structure across languages. Even sentiment analysis benefits from knowing that "not" modifies "good" in "not very good" but not "movie" in "not a very good movie -- just kidding, it was great."

## How It Works

### Constituency (Phrase Structure) Grammars

**Constituency grammars** model sentences as hierarchical trees of nested phrases. The sentence "The cat sat on the mat" has the structure:

```
         S
       /   \
      NP     VP
     / \    / \
   Det  N  V   PP
   |    |  |  / \
  The  cat sat P  NP
               |  / \
              on Det  N
                 |    |
                the  mat
```

Each non-terminal node (S, NP, VP, PP) represents a phrase type: S = sentence, NP = noun phrase, VP = verb phrase, PP = prepositional phrase. The rules that generate this tree are called **phrase structure rules** or **rewrite rules**:

```
S  -> NP VP
NP -> Det N
VP -> V PP
PP -> P NP
```

This is a **Context-Free Grammar (CFG)**: each rule rewrites a single non-terminal symbol regardless of its context. CFGs are the most widely used formalism for syntactic analysis in NLP. The Penn Treebank uses a CFG-based annotation scheme with approximately 27 non-terminal categories.

**Probabilistic CFGs (PCFGs)** augment each rule with a probability estimated from treebank data. A PCFG can disambiguate between multiple valid parse trees by selecting the most probable one. The CYK algorithm parses a sentence under a CFG in O(n^3 * |G|) time, where n is the sentence length and |G| is the grammar size.

### Dependency Grammars

**Dependency grammars** represent structure as directed links between individual words rather than nested phrases. Each word (except the root) has exactly one **head** (governor), and the link is labeled with a grammatical relation (subject, object, modifier, etc.).

For "The cat sat on the mat":

```
sat (ROOT)
├── cat (nsubj)
│   └── The (det)
└── on (prep)
    └── mat (pobj)
        └── the (det)
```

Here "sat" is the root, "cat" is its nominal subject (nsubj), "on" is a prepositional modifier, and "mat" is the object of the preposition. The Universal Dependencies (UD) project defines 37 universal dependency relations applicable across languages, with treebanks for over 150 languages.

Dependency parsing is often preferred for free-word-order languages (Russian, Turkish, Japanese) where constituency structure is less clearly defined but head-modifier relationships are still regular.

### Constituency vs. Dependency: Trade-offs

| Feature | Constituency | Dependency |
|---------|-------------|------------|
| Represents | Phrase groupings | Word-word relations |
| Nodes | Words + phrase labels | Words only |
| Best for | Fixed word order (English) | Free word order (Russian) |
| Key relation | Dominance (parent contains child) | Head-dependent |
| Standard resource | Penn Treebank (English) | Universal Dependencies (150+ languages) |
| NLP output | Parse tree with phrase labels | Dependency tree with relation labels |

In practice, the two formalisms are largely interconvertible. Head-finding rules can convert constituency trees to dependency trees (and vice versa, with some information loss). Modern neural parsers often achieve strong results in both frameworks.

### The Chomsky Hierarchy

Noam Chomsky's 1956 hierarchy classifies formal grammars by their generative power:

| Type | Grammar | Automaton | Example |
|------|---------|-----------|---------|
| 3 | Regular | Finite-state automaton | a*b (regular expressions) |
| 2 | Context-free | Pushdown automaton | Nested parentheses, most syntax |
| 1 | Context-sensitive | Linear-bounded automaton | Swiss German cross-serial dependencies |
| 0 | Unrestricted | Turing machine | Any computable language |

Natural language is generally modeled with **mildly context-sensitive grammars** -- more powerful than CFGs (to handle phenomena like cross-serial dependencies in Swiss German and Dutch) but far less than fully unrestricted. Formalisms like Tree-Adjoining Grammars (TAGs) and Combinatory Categorial Grammars (CCGs) hit this sweet spot, capturing natural language syntax while remaining efficiently parsable in O(n^6) or better.

### Computational Complexity of Parsing

- **Regular grammars**: O(n) -- linear time via finite automata. Sufficient for morphological patterns but not sentence structure.
- **Context-free grammars**: O(n^3) via CYK or Earley algorithms. This is the standard complexity for constituency parsing.
- **Probabilistic CFGs**: O(n^3 * |G|) for finding the most probable parse (Viterbi variant of CYK).
- **Mildly context-sensitive (TAGs)**: O(n^6) -- polynomial but expensive.
- **Modern neural parsers**: Dependency parsers based on biaffine attention (Dozat and Manning, 2017) run in O(n^2) per sentence (computing all pairwise scores), followed by a maximum spanning tree algorithm in O(n^2) to extract the tree.

### Modern Neural Parsing

Contemporary parsers use neural networks rather than explicit grammars:

1. **Transition-based parsing** (Chen and Manning, 2014): An LSTM or transformer reads the sentence and predicts a sequence of shift/reduce actions to build the tree incrementally. Speed: O(n), accuracy: approximately 94% UAS on English.

2. **Graph-based parsing** (Dozat and Manning, 2017): A biaffine attention mechanism scores all possible head-dependent pairs, then a maximum spanning tree algorithm extracts the optimal dependency tree. Accuracy: approximately 96% UAS on English Penn Treebank.

3. **Constituency parsing** (Kitaev and Klein, 2018): A transformer encoder produces span representations, and a chart decoder finds the highest-scoring tree. Achieves approximately 95.8% F1 on the Penn Treebank.

## Why It Matters

1. **Information extraction**: Knowing that "Google" is the subject and "DeepMind" is the object in "Google acquired DeepMind" requires syntactic analysis -- the same words in "DeepMind acquired Google" yield the opposite extraction (see `relation-extraction.md`).
2. **Machine translation**: Languages differ dramatically in word order (English is SVO, Japanese is SOV, Arabic is VSO). Translation requires restructuring syntax, not just replacing words (see `machine-translation.md`).
3. **Grammar checking**: Detecting subject-verb agreement errors ("The dogs runs") requires syntactic knowledge of what the subject is (see `grammatical-error-correction.md`).
4. **Semantic role labeling**: Identifying who did what to whom builds directly on syntactic parse structure (see `semantic-role-labeling.md`).
5. **Interpretability**: Syntactic parse trees provide human-interpretable structure that explains how a system arrived at its analysis, unlike opaque neural representations.

## Key Technical Details

- The Penn Treebank (Marcus et al., 1993) contains approximately 40,000 parsed sentences from Wall Street Journal articles and remains the primary English benchmark for parsing.
- Universal Dependencies v2.13 (2023) covers 150+ languages with over 300 treebanks totaling approximately 37 million words -- the largest cross-linguistic syntactic resource.
- State-of-the-art English dependency parsing achieves approximately 97% Unlabeled Attachment Score (UAS) and approximately 95.5% Labeled Attachment Score (LAS) on Penn Treebank test data.
- Constituency parsing reaches approximately 95.8% F1 on the Penn Treebank, with transformer-based models closing the gap to human inter-annotator agreement (approximately 97% F1).
- Average English sentence length in web text is approximately 15--20 words; in legal or scientific text, 25--40 words. Parser accuracy degrades on longer sentences due to increased ambiguity and error propagation.
- The number of possible binary parse trees for a sentence of n words is the Catalan number C(n-1), which grows exponentially: C(5) = 14, C(10) = 4,862, C(20) = 1,767,263,190. Efficient parsing algorithms avoid enumerating all possibilities.

## Common Misconceptions

**"Grammar means 'prescriptive grammar' -- rules about what is correct English."**
In NLP and linguistics, "grammar" refers to descriptive grammar: the patterns that native speakers actually use, including colloquial and informal constructions. NLP systems must handle "Who did you talk to?" (descriptively correct, prescriptively questionable) just as well as "To whom did you speak?"

**"Dependency and constituency parsing are competing approaches."**
They are complementary representations of the same underlying structure. Many modern systems produce both, and the Universal Dependencies framework is converging toward a cross-linguistic standard that incorporates insights from both traditions.

**"Neural parsers do not use grammar."**
Neural parsers do not use explicit grammar rules, but they implicitly learn grammatical patterns from annotated treebanks. The training data encodes grammar; the neural network learns to reproduce it. Structural constraints (tree well-formedness, projectivity) are often still enforced algorithmically.

**"Parsing is a solved problem."**
English newswire parsing is near human performance, but accuracy drops significantly on out-of-domain text (social media: approximately 82% UAS), long sentences, garden-path constructions, and morphologically rich languages. Cross-lingual parsing for low-resource languages remains an active research challenge.

## Connections to Other Concepts

- `levels-of-linguistic-analysis.md` positions syntax between morphology and semantics.
- `morphology.md` provides the word-level structure that feeds into syntactic analysis.
- `semantics.md` builds on syntactic structure to derive meaning.
- `ambiguity-in-language.md` covers syntactic ambiguity (PP attachment, coordination) in detail.
- `part-of-speech-tagging.md` is typically a prerequisite step for parsing.
- `dependency-parsing.md` and `constituency-parsing.md` cover the NLP tasks that implement syntactic analysis.
- `semantic-role-labeling.md` uses parse trees to identify predicate-argument structure.
- `text-classification.md` benefits from syntactic features in some settings.
- The sibling **LLM Concepts** collection discusses how attention patterns in transformers capture syntactic dependencies without explicit tree structures.

## Further Reading

- Chomsky, N., "Three Models for the Description of Language," IRE Transactions on Information Theory, 1956 -- The foundational paper introducing the grammar hierarchy.
- Marcus, M. et al., "Building a Large Annotated Corpus of English: The Penn Treebank," Computational Linguistics, 1993 -- The treebank that defined syntactic evaluation for two decades.
- De Marneffe, M.C. et al., "Universal Dependencies," Computational Linguistics, 2021 -- The cross-linguistic dependency annotation framework now covering 150+ languages.
- Dozat, T. and Manning, C.D., "Deep Biaffine Attention for Neural Dependency Parsing," ICLR, 2017 -- The graph-based neural parser that set the modern standard.
- Kitaev, N. and Klein, D., "Constituency Parsing with a Self-Attentive Encoder," ACL, 2018 -- Transformer-based constituency parsing achieving near-human performance.
- Jurafsky, D. and Martin, J.H., *Speech and Language Processing*, 3rd edition (draft), 2024 -- Chapters 17--18 cover constituency and dependency parsing with clear algorithm descriptions.
