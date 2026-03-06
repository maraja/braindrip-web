# Word Embeddings: Word2Vec and GloVe

**One-Line Summary**: Word2Vec, GloVe, and FastText gave words numerical meaning by learning dense vector representations from massive text corpora, establishing the distributional foundation for all modern NLP.

**Prerequisites**: None — this is a starting point for the Evolution of LLMs collection.

## What Is a Word Embedding?

Imagine you have a vast library, and instead of organizing books by title or author, you arrange them so that books on similar topics sit physically close together on the shelves. Word embeddings do the same thing for words: they assign each word a position in a high-dimensional space so that words with similar meanings cluster together. The word "king" lives near "queen," "doctor" near "nurse," and "Paris" near "France."

Before embeddings, NLP systems represented words as one-hot vectors — enormous sparse arrays where each word was a unique dimension with no notion of similarity. "Cat" and "kitten" were as distant as "cat" and "plutonium." This made generalization nearly impossible. Models had to learn everything about every word from scratch, and vocabulary sizes in the tens of thousands meant astronomically high-dimensional, mostly empty feature spaces.

The breakthrough came from a deceptively simple idea known as the **distributional hypothesis**: "You shall know a word by the company it keeps" (Firth, 1957). Words that appear in similar contexts tend to have similar meanings. If "dog" and "cat" both frequently appear near "pet," "feed," and "veterinarian," they must be semantically related. Word embeddings operationalize this insight by compressing co-occurrence statistics into dense, low-dimensional vectors.

## How It Works

```
  One-Hot Vectors (Sparse)              Dense Embeddings (Word2Vec/GloVe)
  ┌─────────────────────────┐           ┌─────────────────────────┐
  │ cat   = [1,0,0,0,0,...] │           │ cat   = [0.2, 0.8, ...] │
  │ dog   = [0,1,0,0,0,...] │  ──────▶  │ dog   = [0.3, 0.7, ...] │
  │ king  = [0,0,1,0,0,...] │           │ king  = [0.9, 0.1, ...] │
  │ queen = [0,0,0,1,0,...] │           │ queen = [0.8, 0.2, ...] │
  └─────────────────────────┘           └─────────────────────────┘
   V dimensions (10,000+)                d dimensions (50-300)
   No similarity information             Similar words cluster together

  Vector Arithmetic:
  ┌───────┐     ┌───────┐     ┌───────┐     ┌───────┐
  │ king  │  -  │  man  │  +  │ woman │  ≈  │ queen │
  └───────┘     └───────┘     └───────┘     └───────┘
```
*Figure: Word embeddings compress sparse one-hot vectors into dense representations where semantic relationships are captured as geometric structure.*

### Word2Vec (Mikolov et al., 2013)

Tomas Mikolov and colleagues at Google published two foundational papers in 2013 that introduced Word2Vec with two training architectures. **CBOW (Continuous Bag of Words)** predicts a target word from its surrounding context window — given "the cat ___ on the mat," predict "sat." **Skip-gram** inverts this: given a target word, predict the surrounding context words. Skip-gram proved more effective for rare words and became the dominant variant.

The key training innovation was **negative sampling**: rather than computing a full softmax over the entire vocabulary (computationally prohibitive), the model samples a small number of random "negative" words and learns to distinguish the true context word from these negatives. This reduced training complexity from O(V) to O(k), where k is typically 5-20 negative samples.

Word2Vec trained on Google News (about 100 billion words) produced 300-dimensional vectors for 3 million words/phrases. Training took less than a day on a single machine — revolutionary efficiency.

### GloVe (Pennington et al., 2014)

Jeffrey Pennington and colleagues at Stanford took a different approach with **GloVe (Global Vectors for Word Representation)**. Rather than learning from local context windows like Word2Vec, GloVe explicitly factorizes the global word-word co-occurrence matrix. The key insight was that the ratio of co-occurrence probabilities encodes meaning: P(ice|solid)/P(ice|gas) is large, while P(water|solid)/P(water|gas) is close to 1, capturing that "ice" is more associated with "solid" than "gas."

GloVe's objective function combines the advantages of global matrix factorization methods (like LSA) with local context window methods (like Word2Vec). The model was trained on Common Crawl (840 billion tokens), producing 300-dimensional vectors. GloVe vectors often matched or outperformed Word2Vec on analogy and similarity benchmarks.

### FastText (Bojanowski et al., 2016)

Facebook AI Research extended Word2Vec by representing each word as a bag of character n-grams. The word "where" might be represented by the n-grams "<wh," "whe," "her," "ere," "re>" plus the full word "<where>." Each n-gram gets its own vector, and the word vector is the sum. This allowed FastText to generate vectors for out-of-vocabulary words and handle morphologically rich languages far better than Word2Vec or GloVe. It also improved representations for rare words by sharing subword information.

### The "King - Man + Woman = Queen" Moment

The most famous demonstration of word embedding quality was vector arithmetic: vec("king") - vec("man") + vec("woman") approximates vec("queen"). This showed that embeddings captured abstract relational concepts — gender, tense, geography — as consistent directions in vector space. "Paris" - "France" + "Italy" approximated "Rome." These analogies weren't hand-coded; they emerged from distributional statistics alone.

## Why It Matters

### The First Representation Revolution

Word embeddings were the first successful method for learning general-purpose word representations from unlabeled text. Before them, feature engineering for NLP was manual and task-specific. After them, every NLP pipeline started with a pre-trained embedding layer. This was the earliest form of transfer learning in NLP — a concept that would later culminate in full model pre-training with `05-elmo-and-contextual-embeddings.md` and `06-ulmfit-and-transfer-learning.md`.

### Democratization of NLP

Pre-trained Word2Vec and GloVe vectors were released freely. Any researcher or developer could download 300-dimensional vectors and immediately use them as features. This dramatically lowered the barrier to building NLP systems and accelerated research across the entire field. The tradition of releasing pre-trained models publicly traces directly back to this moment.

### The Limitation That Drove Progress

Word embeddings assigned a single static vector per word regardless of context. "Bank" had one vector whether it meant a financial institution or a river bank. This polysemy problem was a fundamental limitation that directly motivated the development of contextual embeddings in `05-elmo-and-contextual-embeddings.md` and eventually full contextual models like `03-bert.md`.

## Key Technical Details

- **Word2Vec**: Published January and October 2013 by Mikolov et al. at Google; 300-dimensional vectors; trained on 100B words from Google News
- **GloVe**: Published 2014 by Pennington et al. at Stanford; trained on Common Crawl (840B tokens), Wikipedia (6B tokens), and other corpora
- **FastText**: Published 2016 by Bojanowski et al. at Facebook AI Research; used character n-grams of length 3-6
- **Dimensionality**: 50, 100, 200, and 300 dimensions were standard; 300 became the de facto default
- **Vocabulary size**: Word2Vec released with 3M words/phrases; GloVe with 2.2M words (840B token version)
- **Training time**: Word2Vec trained in less than a day on one machine; GloVe's 840B model took several days
- **Analogy accuracy**: Word2Vec achieved ~60-75% on the Google analogy dataset; GloVe was competitive on semantic analogies and slightly better on syntactic ones
- **Impact**: By 2017, nearly every competitive NLP system used pre-trained word embeddings as input features

## Common Misconceptions

- **"Word2Vec uses a neural network, so it's deep learning."** Word2Vec is actually a shallow, two-layer network. Its power comes from the training objective and scale, not depth. This is why it trained so efficiently.

- **"GloVe is fundamentally different from Word2Vec."** Levy and Goldberg (2014) showed that Word2Vec's Skip-gram with negative sampling implicitly factorizes a shifted PMI matrix — making it mathematically similar to GloVe's explicit matrix factorization. The approaches converge more than they diverge.

- **"Word embeddings understand meaning."** Embeddings capture distributional similarity, not true semantic understanding. They reflect biases in training data (e.g., gender stereotypes) and cannot distinguish between co-occurrence and causation. The word "not" has an embedding close to the words it frequently negates, not to the concept of negation.

- **"Word embeddings are obsolete."** While contextual models like BERT have replaced static embeddings for most tasks, the conceptual framework of distributed representations remains foundational. Modern LLMs still learn token embeddings as their first layer — they've just made them context-dependent.

## Connections to Other Concepts

- Contextual embeddings (`05-elmo-and-contextual-embeddings.md`) directly addressed the polysemy limitation of static word vectors
- The pre-training paradigm pioneered here was scaled up by `06-ulmfit-and-transfer-learning.md` and later by `02-gpt-1.md` and `03-bert.md`
- The Transformer's input layer (`01-attention-is-all-you-need.md`) still begins with token embeddings — learned vectors in the same tradition
- For deeper coverage of embedding mechanisms in modern models, see `llm-concepts/embeddings-and-tokenization.md`
- `07-the-bottlenecks-that-motivated-transformers.md` covers the broader limitations of this era's approaches

## Further Reading

- Mikolov et al., "Efficient Estimation of Word Representations in Vector Space" (2013, arXiv:1301.3781) — the original Word2Vec paper introducing CBOW and Skip-gram
- Pennington et al., "GloVe: Global Vectors for Word Representation" (2014, EMNLP) — introduced GloVe and the co-occurrence ratio insight
- Bojanowski et al., "Enriching Word Vectors with Subword Information" (2017, TACL, arXiv:1607.04606) — FastText's character n-gram approach
- Levy & Goldberg, "Neural Word Embedding as Implicit Matrix Factorization" (2014, NeurIPS) — showed the mathematical connection between Word2Vec and matrix factorization
- Mikolov et al., "Distributed Representations of Words and Phrases and their Compositionality" (2013, arXiv:1310.4546) — introduced negative sampling and phrase-level embeddings
