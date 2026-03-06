# Dependency Parsing

**One-Line Summary**: Dependency parsing recovers the head-modifier relationships between words in a sentence, producing a tree structure that reveals grammatical dependencies without intermediate phrasal nodes.

**Prerequisites**: `syntax-and-grammar.md`, `part-of-speech-tagging.md`, `recurrent-neural-networks.md`, `attention-mechanism.md`

## What Is Dependency Parsing?

Imagine connecting each word in a sentence to the word it most directly depends on with an arrow, like a family tree where every child points to exactly one parent. In "The cat sat on the mat," "cat" depends on "sat" (subject), "the" depends on "cat" (determiner), "on" depends on "sat" (prepositional modifier), "mat" depends on "on" (object of preposition), and "the" depends on "mat" (determiner). The verb "sat" has no parent -- it is the **root** of the dependency tree.

Formally, a dependency parse is a directed tree over the tokens of a sentence, where each edge connects a **head** (governor) to a **dependent** (modifier) and is labeled with a **grammatical relation** (nsubj, dobj, amod, det, etc.). Every token has exactly one head (except the root), and the structure is acyclic. Unlike `constituency-parsing.md`, dependency parsing does not introduce phrasal categories (NP, VP); instead, it directly encodes word-to-word relationships, making it particularly natural for free-word-order languages where constituency boundaries are less clear.

## How It Works

### Dependency Grammar and Universal Dependencies

**Dependency grammar** (Tesniere, 1959) holds that syntactic structure is defined by binary, asymmetric relations between words. The **Universal Dependencies (UD)** project (Nivre et al., 2016) standardizes dependency annotation across 100+ languages with 37 universal relation types (nsubj, obj, iobj, obl, advmod, amod, det, etc.) and language-specific subtypes. UD has become the de facto standard for cross-lingual dependency parsing research.

### Transition-Based Parsing

Transition-based parsers build the dependency tree incrementally using a sequence of actions applied to a **stack** and **buffer** configuration.

**Arc-Standard** system uses three transitions:
- **SHIFT**: Move the front of the buffer onto the stack.
- **LEFT-ARC(r)**: Add an arc from the stack-top to the second element with relation r; remove the second element.
- **RIGHT-ARC(r)**: Add an arc from the second element to the stack-top with relation r; pop the stack-top.

**Arc-Eager** system adds a REDUCE action, enabling the parser to build left arcs before processing all dependents, which improves handling of left-branching structures.

A classifier (originally SVM, now a neural network) predicts the next transition given the current configuration. Chen & Manning (2014) showed that a simple feed-forward neural network over dense embeddings of the stack/buffer tokens achieves competitive accuracy with dramatically faster speed than feature-rich linear models.

### Graph-Based Parsing

Graph-based parsers score all possible arcs independently and find the tree that maximizes the total score.

**Maximum Spanning Tree (MST)** algorithms (Eisner, 1996; McDonald et al., 2005) find the highest-scoring projective or non-projective tree. Eisner's algorithm runs in O(n^3) for projective trees (no crossing arcs); the Chu-Liu-Edmonds algorithm handles non-projective trees in O(n^2).

Graph-based parsers consider global tree structure, avoiding error propagation that plagues greedy transition-based parsers, but are typically slower.

### Neural Dependency Parsers

Modern neural dependency parsers use BiLSTM or transformer encoders to represent each token, then score head-dependent pairs using biaffine attention (Dozat & Manning, 2017). The biaffine parser applies a bilinear transformation:

$$s(i, j) = h_i^T W h_j + U^T h_i + V^T h_j + b$$

where $h_i$ and $h_j$ are the head and dependent representations. This architecture achieves ~96% UAS on PTB English and remains the dominant approach. Transformer-based encoders (replacing BiLSTMs) push accuracy slightly higher.

### Evaluation Metrics

- **UAS (Unlabeled Attachment Score)**: Percentage of tokens assigned the correct head (ignoring the relation label).
- **LAS (Labeled Attachment Score)**: Percentage of tokens with both the correct head and the correct relation label. LAS is always <= UAS.

## Why It Matters

1. **Semantic role labeling**: Dependency paths between predicates and arguments are strong features for `semantic-role-labeling.md`.
2. **Relation extraction**: The shortest dependency path between two entities is a powerful feature for `relation-extraction.md`.
3. **Machine translation**: Source-language dependency trees inform reordering models and tree-to-string translation.
4. **Information extraction**: Dependency patterns (e.g., subject-verb-object) enable `open-information-extraction.md`.
5. **Sentiment analysis**: Dependency structure helps determine which modifiers apply to which targets in `aspect-based-sentiment-analysis.md`.
6. **Question answering**: Parsing questions reveals the focus and expected answer type in `question-answering.md`.

## Key Technical Details

- **Penn Treebank (English, Stanford Dependencies)**: SOTA ~96% UAS, ~94.5% LAS (biaffine parser with BERT).
- **Universal Dependencies**: Average ~92% UAS across high-resource languages; drops to ~70--80% for low-resource languages.
- **Biaffine parser (Dozat & Manning, 2017)**: ~95.7% UAS, ~94.1% LAS on PTB with BiLSTM; ~96.3% UAS with BERT.
- **Speed**: Transition-based parsers process ~1,000--2,000 sentences/sec; graph-based biaffine parsers ~200--500 sentences/sec on GPU.
- **Non-projective parsing**: ~10--15% of sentences in languages like Czech and Dutch contain non-projective arcs (crossing dependencies), requiring non-projective algorithms.
- **Long-distance dependencies**: Accuracy drops for arcs spanning >5 tokens; BERT-based representations partially address this.
- **Sentence length effect**: Accuracy decreases roughly 0.3% UAS per additional 10 tokens beyond length 20.

## Common Misconceptions

**"Dependency parsing and constituency parsing are redundant."** They encode complementary information. Dependencies capture head-modifier relations directly, while constituency trees encode hierarchical grouping. Many systems convert between the two (e.g., Stanford typed dependencies are derived from PTB constituency trees), but the representations are not equivalent. See `constituency-parsing.md`.

**"Transition-based parsers are always worse than graph-based ones."** Modern neural transition-based parsers with beam search or global training match graph-based parsers in accuracy while being faster. The accuracy gap has narrowed significantly since the introduction of neural representations.

**"Dependency parsing requires POS tags."** While POS tags were essential features for traditional parsers, neural parsers with contextual embeddings from `bert.md` can achieve near-SOTA accuracy without explicit POS input. However, POS tags still provide a useful inductive bias for low-resource settings.

**"All languages have similar parsing difficulty."** Parsing accuracy varies enormously across languages. Morphologically rich, free-word-order languages (e.g., Finnish, Turkish, Czech) are harder than fixed-order, morphologically simpler languages (e.g., English, Chinese). Non-projective structures add additional complexity.

## Connections to Other Concepts

- Dependency parsing builds on the grammatical foundations of `syntax-and-grammar.md` and uses `part-of-speech-tagging.md` as input.
- It complements `constituency-parsing.md` -- both represent syntactic structure but from different theoretical perspectives.
- Dependency paths are key features for `semantic-role-labeling.md` and `relation-extraction.md`.
- Neural parsers leverage `bidirectional-rnns.md`, `attention-mechanism.md`, and `contextual-embeddings.md`.
- The Universal Dependencies project connects to `multilingual-nlp.md` and `language-diversity-and-typology.md`.
- Dependency structures inform `open-information-extraction.md` and `information-extraction.md`.

## Further Reading

- Nivre, *Dependency Parsing*, 2006 -- the definitive textbook on transition-based dependency parsing.
- McDonald et al., *Non-Projective Dependency Parsing Using Spanning Tree Algorithms*, 2005 -- introduced MST-based graph parsing for non-projective structures.
- Chen & Manning, *A Fast and Accurate Dependency Parser Using Neural Networks*, 2014 -- the breakthrough neural transition-based parser.
- Dozat & Manning, *Deep Biaffine Attention for Neural Dependency Parsing*, 2017 -- introduced the biaffine scoring mechanism that became the dominant architecture.
- de Marneffe et al., *Universal Stanford Dependencies: A Cross-Linguistic Typology*, 2014 -- established the dependency relation inventory adopted by Universal Dependencies.
