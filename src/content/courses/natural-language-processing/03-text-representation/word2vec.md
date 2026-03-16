# Word2Vec

**One-Line Summary**: Learning dense word vectors from co-occurrence via Skip-gram and CBOW -- the embedding revolution that showed words with similar meanings occupy nearby points in vector space.

**Prerequisites**: Bag of Words (`bag-of-words.md`), N-Gram Language Models (`n-gram-language-models.md`), Semantics (`01-foundations-of-language/semantics.md`).

## What Is Word2Vec?

Imagine that every word in a language lives at a specific address in a city. Words with similar meanings live in the same neighborhood: "king" and "queen" are neighbors, "cat" and "dog" live on the same block, and "running" and "jogging" share a street. Word2Vec is the algorithm that discovers these addresses -- mapping each word to a dense vector of typically 100-300 real numbers such that geometric relationships in this space reflect semantic relationships in language.

The famous example: vec("king") - vec("man") + vec("woman") = vec("queen"). This is not magic -- it is the geometry of a well-trained embedding space where gender, royalty, and other semantic relationships are encoded as consistent vector offsets.

Word2Vec, introduced by Mikolov et al. at Google in 2013, was not the first word embedding method, but it was the first to train efficiently on billions of words, producing embeddings that transferred across tasks. It triggered a paradigm shift in NLP: from sparse, discrete representations to dense, continuous ones.

## How It Works

### The Distributional Hypothesis

Word2Vec operationalizes the distributional hypothesis (Firth, 1957): "You shall know a word by the company it keeps." Words appearing in similar contexts should have similar representations.

### Skip-Gram Architecture

Given a target word, predict the surrounding context words within a window of size c.

For the sentence "the cat sat on the mat" with window size 2, the target word "sat" generates training pairs: (sat, the), (sat, cat), (sat, on), (sat, the).

The model has two matrices:
- **W** (|V| x d): Input embeddings (the word vectors we keep)
- **W'** (d x |V|): Output embeddings (discarded after training)

For target word w_t, the objective maximizes:

```
(1/T) * sum_{t=1}^{T} sum_{-c <= j <= c, j != 0} log P(w_{t+j} | w_t)
```

where P(w_o | w_i) = softmax(v'_{w_o} . v_{w_i}) and v, v' are the input and output vectors.

### CBOW (Continuous Bag of Words) Architecture

The reverse of Skip-gram: given the context words, predict the target word. CBOW averages the context word vectors and predicts the center word. It is faster to train (roughly 2-3x) but slightly less effective for rare words.

### Negative Sampling

Computing the full softmax over |V| words (often 100,000+) at every training step is prohibitively expensive. Negative sampling approximates this by training the model to distinguish the true context word from k randomly sampled "negative" words:

```
log sigma(v'_{w_o} . v_{w_i}) + sum_{k} E_{w_k ~ P_n(w)} [log sigma(-v'_{w_k} . v_{w_i})]
```

where sigma is the sigmoid function and P_n(w) is the noise distribution, typically the unigram distribution raised to the 3/4 power. Mikolov et al. found k = 5-20 negative samples works well for small datasets; k = 2-5 suffices for large corpora.

### Training Details

- **Embedding dimension**: 100-300 is standard. The original paper used 300 for Google News vectors.
- **Window size**: 5-10 for Skip-gram (larger windows capture broader topical similarity; smaller windows capture syntactic similarity).
- **Subsampling**: Frequent words like "the" are randomly discarded during training with probability proportional to their frequency. The threshold is typically 10^-5.
- **Training corpus**: The original Google News vectors were trained on ~100 billion words.
- **Training time**: The original implementation processed roughly 1 billion words per hour on a single machine using optimized C code.

## Why It Matters

1. **The 2013 revolution**: Word2Vec made it practical to represent words as dense vectors, replacing the sparse, high-dimensional representations that had dominated NLP for decades.
2. **Transfer learning precursor**: Pre-trained Word2Vec embeddings could be downloaded and used as initialization for downstream tasks, previewing the transfer learning paradigm that BERT and GPT would later perfect.
3. **Analogy reasoning**: The linear algebraic relationships (king - man + woman = queen) demonstrated that word embeddings capture relational knowledge, not just similarity.
4. **Downstream task improvements**: Initializing neural models with Word2Vec embeddings instead of random vectors improved performance on virtually every NLP task by 2-10% in the mid-2010s.
5. **Beyond NLP**: The Skip-gram idea generalized to graphs (DeepWalk, Node2Vec), products (Prod2Vec), and code (Code2Vec), demonstrating the power of learning embeddings from co-occurrence.

## Key Technical Details

- **Vocabulary size**: The pre-trained Google News vectors contain 3 million words/phrases, each as a 300-dimensional vector.
- **Analogy task accuracy**: On the original word analogy benchmark (19,544 questions), Word2Vec Skip-gram achieved ~65% accuracy on semantic analogies and ~70% on syntactic analogies.
- **Embedding dimensions**: Diminishing returns above 300 dimensions. Increasing from 100 to 300 typically yields 5-10% improvement on analogy tasks; 300 to 600 yields only 1-2%.
- **Phrase detection**: The original implementation used a simple bigram collocation method to detect phrases like "New_York" and "ice_cream," training embeddings for these multi-word expressions.
- **Comparison to count-based methods**: Levy and Goldberg (2014) showed that Skip-gram with negative sampling implicitly factorizes a word-context PMI matrix shifted by log(k), bridging the gap between prediction-based and count-based methods.

## Common Misconceptions

- **"Word2Vec understands word meaning."** Word2Vec captures distributional similarity, not meaning. It places "good" and "bad" near each other because they appear in similar syntactic contexts ("that was ___"), despite being antonyms. It encodes co-occurrence statistics, not semantics in the philosophical sense.

- **"The king-queen analogy always works perfectly."** The analogy task has a success rate of about 65-75%, not 100%. Many analogies fail, especially for less frequent words or abstract relationships. The famous king-queen example works because gender is a prominent, consistent axis in the training data.

- **"Larger corpora always produce better embeddings."** Corpus domain matters more than size for downstream tasks. Word2Vec trained on 1 billion words of biomedical text outperforms Google News vectors (100 billion words) on biomedical NLP tasks.

- **"Word2Vec is a deep learning model."** Word2Vec uses a shallow neural network with a single hidden layer. Its power comes from the training objective and scale, not network depth.

## Connections to Other Concepts

- `bag-of-words.md`: Word2Vec addresses BoW's inability to capture semantic similarity -- "happy" and "joyful" are orthogonal in BoW but neighbors in Word2Vec space.
- `glove.md`: An alternative approach that explicitly factorizes the co-occurrence matrix rather than using prediction. Produces comparable embeddings with different trade-offs.
- `fasttext.md`: Extends Word2Vec with character n-grams to handle morphology and out-of-vocabulary words.
- `contextual-embeddings.md`: Word2Vec assigns one vector per word type. Contextual models like ELMo and BERT assign different vectors per word *token*, resolving polysemy.
- `sentence-embeddings.md`: Averaging Word2Vec vectors is the simplest approach to sentence representation.
- `12-evaluation-and-ethics/bias-in-nlp.md`: Word2Vec embeddings infamously encode societal biases (man:programmer :: woman:homemaker), sparking important research on debiasing.
- `08-semantic-understanding/semantic-similarity.md`: Cosine similarity between Word2Vec vectors is a standard measure of word-level semantic similarity.

## Further Reading

- Mikolov et al., "Efficient Estimation of Word Representations in Vector Space" (2013) -- The original Word2Vec paper introducing CBOW and Skip-gram.
- Mikolov et al., "Distributed Representations of Words and Phrases and their Compositionality" (2013) -- Introduces negative sampling and phrase detection.
- Levy and Goldberg, "Neural Word Embedding as Implicit Matrix Factorization" (2014) -- Shows that Skip-gram with negative sampling implicitly factorizes a PMI matrix, connecting neural and count-based methods.
- Bolukbasi et al., "Man is to Computer Programmer as Woman is to Homemaker? Debiasing Word Embeddings" (2016) -- Reveals and addresses gender bias in Word2Vec embeddings.
