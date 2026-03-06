# Contextual Embeddings

**One-Line Summary**: Word representations that change based on surrounding context -- the same word gets different vectors in different sentences, resolving polysemy and capturing nuance.

**Prerequisites**: Word2Vec (`word2vec.md`), GloVe (`glove.md`), Recurrent Neural Networks (`04-sequence-models/recurrent-neural-networks.md`), Attention Mechanism (`04-sequence-models/attention-mechanism.md`).

## What Is a Contextual Embedding?

Consider the word "bank." In "I deposited money at the bank," it means a financial institution. In "The boat drifted toward the river bank," it means a shoreline. In "You can bank on it," it is a verb meaning to rely on. Word2Vec and GloVe assign a single vector to "bank" that tries to average across all these meanings -- a compromise that represents none of them well.

Contextual embeddings solve this by producing a *different* vector for "bank" in each sentence. The representation of each word is a function of the entire sentence (or even paragraph) surrounding it. Think of it like a chameleon: the word takes on the color of its environment.

This shift from static to contextual representations, initiated by ELMo in 2018 and perfected by BERT later that year, was arguably the most important advance in NLP since word embeddings themselves. It unlocked dramatic improvements on virtually every NLP benchmark.

## How It Works

### From Static to Contextual

Static embeddings map each word *type* to a fixed vector:
```
embedding("bank") = [0.2, -0.1, 0.8, ...]  (always the same)
```

Contextual embeddings map each word *token* (in context) to a vector:
```
embedding("bank", "river bank")    = [0.3, 0.7, -0.2, ...]
embedding("bank", "bank account")  = [-0.4, 0.1, 0.9, ...]
```

The two vectors for "bank" will be substantially different, reflecting the different meanings.

### ELMo: Bidirectional LSTMs

ELMo (Embeddings from Language Models), introduced by Peters et al. at Allen AI in 2018, was the first major contextual embedding model. Its architecture:

1. **Character-level CNN**: Input words are represented via character convolutions (not word lookup tables), providing robustness to OOV words and capturing morphology.
2. **Two-layer bidirectional LSTM**: A forward LSTM processes the sentence left-to-right; a backward LSTM processes it right-to-left. Each layer produces hidden states that encode different levels of information.
3. **Weighted layer combination**: The final ELMo representation for each word is a learned weighted sum of all LSTM layers plus the character embedding layer:

```
ELMo_k = gamma * sum_{j=0}^{L} s_j * h_{k,j}
```

where h_{k,j} is the hidden state of layer j at position k, s_j are softmax-normalized learned weights, and gamma is a scaling factor.

**Key finding**: Different layers capture different linguistic information. Layer 1 captures syntax (POS tagging, dependency parsing benefit most from layer 1), while layer 2 captures semantics (word sense disambiguation, sentiment benefit from layer 2). This layer-wise specialization became a major area of study.

ELMo was pre-trained on the 1 Billion Word Benchmark (~800M tokens) and used as a *feature* -- concatenated with existing model inputs to improve downstream tasks.

### BERT: Masked Language Modeling with Transformers

BERT (Bidirectional Encoder Representations from Transformers), introduced by Devlin et al. at Google in 2018, replaced LSTMs with the transformer architecture and changed the pre-training objective:

1. **Masked Language Modeling (MLM)**: Randomly mask 15% of input tokens and train the model to predict them from bidirectional context. Unlike ELMo's separate forward and backward LSTMs, BERT's self-attention sees both directions simultaneously.
2. **Next Sentence Prediction (NSP)**: Given two sentences, predict whether the second follows the first in the original text (later shown to be less important than MLM).

BERT produces a contextual embedding for every token. The representation at each layer is computed via multi-head self-attention:

```
Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V
```

where Q, K, V are projections of the input representations. Each token attends to every other token, allowing "bank" to be influenced by "river" or "money" elsewhere in the sentence.

**BERT variants**:
- BERT-base: 12 layers, 768 hidden dimensions, 12 attention heads, 110M parameters.
- BERT-large: 24 layers, 1024 hidden dimensions, 16 attention heads, 340M parameters.

### Layer-Wise Representations

A 12-layer BERT model produces 13 different representations for each token (input embedding + 12 layer outputs). Research has shown:

- **Lower layers (1-4)**: Encode surface-level features -- token identity, position, POS tags.
- **Middle layers (5-8)**: Encode syntactic information -- dependency relations, constituency structure.
- **Upper layers (9-12)**: Encode task-specific and semantic information -- word senses, semantic roles.

This is measured through **probing tasks**: train a simple classifier on the frozen representations from each layer to predict a linguistic property. If the classifier succeeds, the information is encoded in that layer.

### The Shift from Static to Contextual

The transition unfolded rapidly:
- **Pre-2018**: Word2Vec/GloVe embeddings used as input features; task-specific architectures trained from scratch.
- **February 2018**: ELMo shows that contextual features improve every task by 1-5%.
- **October 2018**: BERT shows that fine-tuning a contextual model achieves state-of-the-art on 11 NLP benchmarks simultaneously.
- **Post-2018**: The "pre-train and fine-tune" paradigm becomes the default, with static embeddings relegated to resource-constrained settings.

## Why It Matters

1. **Polysemy resolution**: Contextual embeddings naturally handle words with multiple meanings, a problem that plagued static embeddings and required explicit word sense disambiguation.
2. **State-of-the-art across NLP**: The shift to contextual embeddings produced improvements of 5-15% on tasks like question answering (SQuAD), natural language inference (MNLI), and named entity recognition (CoNLL-2003).
3. **Transfer learning for NLP**: Contextual models pre-trained on large unlabeled corpora transfer to downstream tasks with limited labeled data, democratizing access to high-quality NLP.
4. **Rich linguistic representations**: The layer-wise structure encodes syntax and semantics at different depths, providing a window into what neural networks learn about language.
5. **Foundation for modern NLP**: GPT, T5, RoBERTa, and every major language model since 2018 produces contextual embeddings. Understanding this concept is prerequisite to understanding the entire modern NLP stack.

## Key Technical Details

- **ELMo improvements**: Adding ELMo features improved SQuAD by 4.7% (F1), SNLI by 1.0%, SRL by 3.2%, NER by 2.1%, and SST-5 by 1.0% over previous state-of-the-art (2018).
- **BERT improvements**: BERT-large pushed SQuAD 2.0 F1 from 66.3% to 83.1%, MNLI accuracy from 80.6% to 86.7%, and CoNLL-2003 NER F1 from 92.0% to 92.8%.
- **Context window**: ELMo processes one sentence at a time. BERT-base handles 512 tokens. Longformer extends to 4,096 tokens. Modern models handle 8,192-128,000+ tokens.
- **Embedding dimensionality**: ELMo produces 1024-dimensional vectors (512 forward + 512 backward). BERT-base produces 768-dimensional vectors. BERT-large produces 1024-dimensional vectors.
- **Anisotropy problem**: Contextual embeddings tend to occupy a narrow cone in vector space (high anisotropy), making raw cosine similarity unreliable without normalization or fine-tuning (see `sentence-embeddings.md` for solutions).
- **Computational cost**: BERT-base inference requires ~22 GFLOPs per 512-token input. ELMo requires ~14 GFLOPs. For comparison, a GloVe lookup requires essentially zero computation.

## Common Misconceptions

- **"Contextual embeddings make static embeddings useless."** Static embeddings (Word2Vec, GloVe, FastText) remain valuable for resource-constrained environments (mobile, edge devices), as features in ensemble models, for fast nearest-neighbor lookup in vocabulary-scale applications, and as initialization for contextual models. BERT itself initializes from WordPiece embeddings.

- **"BERT's [CLS] token is a good sentence representation."** The [CLS] token was trained for next sentence prediction, not sentence similarity. It performs poorly on semantic textual similarity tasks without fine-tuning. See `sentence-embeddings.md` for proper sentence-level representations.

- **"Deeper layers are always better for downstream tasks."** The optimal layer depends on the task. POS tagging peaks at layers 1-3 in BERT; semantic tasks peak at layers 8-11. Using a weighted combination of all layers (as ELMo does by default) is often the safest choice.

- **"Contextual embeddings solve polysemy completely."** While contextual models produce different vectors for different senses of a word, they do not explicitly enumerate senses. The vectors may not align cleanly with dictionary senses, and rare senses may be poorly represented due to their scarcity in training data.

## Connections to Other Concepts

- **Word2Vec** (`word2vec.md`) / **GloVe** (`glove.md`) / **FastText** (`fasttext.md`): The static embedding methods that contextual embeddings supersede. Understanding what these methods cannot do (resolve polysemy, capture context) motivates contextual embeddings.
- **Sentence Embeddings** (`sentence-embeddings.md`): Converting contextual token-level embeddings into sentence-level representations requires pooling strategies or fine-tuning (SBERT).
- **Document Embeddings** (`document-embeddings.md`): Longformer and BigBird extend contextual embeddings to long documents.
- **ELMo** (`09-pre-trained-models-for-nlp/elmo.md`): The first major contextual embedding model, using bidirectional LSTMs.
- **BERT** (`09-pre-trained-models-for-nlp/bert.md`): The transformer-based contextual model that established the pre-train-and-fine-tune paradigm.
- **Transfer Learning in NLP** (`09-pre-trained-models-for-nlp/transfer-learning-in-nlp.md`): Contextual embeddings are the vehicle through which transfer learning transformed NLP.
- **Word Sense Disambiguation** (`08-semantic-understanding/word-sense-disambiguation.md`): Contextual embeddings implicitly perform WSD by producing sense-specific vectors.
- **Attention Mechanism** (`04-sequence-models/attention-mechanism.md`): Self-attention in transformers is the mechanism that allows each token to incorporate information from all other tokens, producing context-dependent representations.
- **Long Short-Term Memory** (`04-sequence-models/long-short-term-memory.md`): ELMo's architecture relies on bidirectional LSTMs to process context.

## Further Reading

- Peters et al., "Deep Contextualized Word Representations" (2018) -- The ELMo paper that launched the contextual embedding era.
- Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding" (2019) -- Introduced BERT and the masked language modeling pre-training objective.
- Ethayarajh, "How Contextual are Contextualized Word Representations?" (2019) -- Quantifies how much word representations change across contexts and reveals the anisotropy problem.
- Tenney et al., "BERT Rediscovers the Classical NLP Pipeline" (2019) -- Probing study showing that BERT's layers recapitulate the traditional NLP processing hierarchy.
- Rogers et al., "A Primer in BERTology: What We Know About How BERT Works" (2020) -- Comprehensive survey of what probing studies have revealed about BERT's representations.
