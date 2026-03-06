# ELMo

**One-Line Summary**: ELMo (Embeddings from Language Models) produces deep contextualized word representations by running a two-layer bidirectional LSTM language model, generating different vectors for the same word depending on its surrounding context -- the first major pre-trained model that bridged static word embeddings and modern transformers.

**Prerequisites**: `word2vec.md`, `long-short-term-memory.md`, `bidirectional-rnns.md`, `contextual-embeddings.md`, `n-gram-language-models.md`

## What Is ELMo?

Imagine a dictionary where instead of a single definition per word, the definition changes dynamically depending on the sentence the word appears in. The word "bank" would have one representation in "river bank" and a completely different one in "bank account." Static word embeddings like `word2vec.md` give every occurrence of "bank" the same vector, forcing downstream models to disambiguate on their own. ELMo solves this by reading the entire sentence through a deep bidirectional language model and producing a context-sensitive vector for each word.

ELMo, introduced by Peters et al. (2018) from the Allen Institute for AI, stands for Embeddings from Language Models. It pre-trains a two-layer bidirectional LSTM on a large corpus using a language modeling objective, then extracts the internal representations (from all layers) as features for downstream tasks. Crucially, it learns a task-specific weighted combination of these layer representations, recognizing that different layers capture different types of linguistic information -- lower layers encode syntax, higher layers encode semantics.

ELMo occupies a pivotal position in NLP history: it was the first model to demonstrate that deep pre-trained contextualized representations could substantially improve a wide range of NLP tasks, paving the way for `bert.md` and the transformer revolution.

## How It Works

### Architecture: Character CNN + Bidirectional LSTM

**Character-Level Input.** Unlike Word2Vec or GloVe, which use a fixed vocabulary of whole words, ELMo processes words through a character-level convolutional neural network. Each word is represented as a sequence of characters, processed by CNN filters of widths 1-7, then max-pooled and projected through highway layers to produce a context-independent token embedding. This gives ELMo two critical advantages: (1) it can handle out-of-vocabulary words by composing them from characters, and (2) it captures morphological structure (e.g., "running" and "runner" share the "run" prefix).

**Bidirectional LSTM Layers.** The character-derived token embeddings feed into a two-layer bidirectional LSTM. The forward LSTM reads the sentence left-to-right, predicting each token from its left context. The backward LSTM reads right-to-left, predicting each token from its right context. Importantly, these are two separate LSTMs -- not a single bidirectional model -- trained with independent forward and backward language model objectives:

```
Forward:  P(t_k | t_1, t_2, ..., t_{k-1})
Backward: P(t_k | t_{k+1}, t_{k+2}, ..., t_N)
```

The joint training objective maximizes the sum of the forward and backward log-likelihoods.

**Layer Outputs.** For each token position k, ELMo produces three representations:
1. Layer 0: The character CNN embedding (context-independent).
2. Layer 1: The first LSTM layer output (captures more syntactic information).
3. Layer 2: The second LSTM layer output (captures more semantic information).

At each layer, the forward and backward LSTM hidden states are concatenated, yielding vectors of dimension 2 x 512 = 1,024 for the standard ELMo configuration.

### Task-Specific Layer Weighting

Instead of using only the top-layer representation, ELMo computes a task-specific weighted sum across all layers:

```
ELMo_k = gamma * sum_{j=0}^{2} s_j * h_{k,j}
```

where s_j are softmax-normalized learned weights (one set per task), gamma is a task-specific scalar, and h_{k,j} is the representation at layer j for token k. This is significant because probing experiments show that:
- Layer 0 (character CNN) captures word morphology and surface forms.
- Layer 1 captures syntactic features (POS tags, constituency structure).
- Layer 2 captures semantic features (word sense, semantic roles).

Different tasks benefit from different layer mixtures: POS tagging relies more on Layer 1, while word sense disambiguation relies more on Layer 2.

### Integration with Downstream Tasks

ELMo is used as a feature extractor, not fine-tuned end-to-end (though later work showed fine-tuning can help). The typical integration:

1. Run the pre-trained ELMo model on the input sentence to obtain contextualized vectors.
2. Concatenate ELMo vectors with existing task input embeddings (e.g., GloVe vectors).
3. Feed the concatenated representations into the task-specific model (BiLSTM-CRF for NER, attention networks for QA, etc.).

The ELMo parameters remain frozen; only the layer weights s_j and scalar gamma are learned during task training.

## Why It Matters

1. **Proved contextualization is essential**: ELMo demonstrated that the same word needs different representations in different contexts -- a principle now considered fundamental, motivating `bert.md` and all subsequent pre-trained models.
2. **Broad task improvements**: Adding ELMo improved six diverse NLP benchmarks simultaneously: SQuAD (QA), SNLI (textual entailment), SRL (semantic role labeling), coref (coreference resolution), NER, and sentiment -- with relative error reductions of 3-20%.
3. **Layer-wise linguistic structure**: The discovery that different LSTM layers encode different linguistic levels launched an entire subfield of probing and interpretability research.
4. **Bridge architecture**: ELMo connected the static embedding era (`word2vec.md`, `glove.md`) to the fine-tuning era (`bert.md`), showing the community what deep pre-training could achieve and catalyzing the rapid development of transformer-based models.
5. **Practical and accessible**: ELMo was released as an easy-to-use library (AllenNLP), allowing researchers to add contextualized representations to existing models with minimal code changes.

## Key Technical Details

- **Model size**: ~93.6 million parameters (modest compared to BERT-base's 110M).
- **Pre-training data**: 1B Word Benchmark (~800M tokens of news text).
- **Hidden dimensions**: 4,096 LSTM cells per layer, projected down to 512 dimensions; character CNN outputs 512 dimensions; concatenated forward/backward gives 1,024 per layer.
- **Character CNN filters**: 2,048 filters across widths 1-7, with highway layers.
- **Pre-training perplexity**: ~39.7 on the 1B Word Benchmark (averaged forward and backward).
- **Benchmark improvements over baselines**: SQuAD (+4.7% F1), SNLI (+0.7% accuracy), SRL (+3.2% F1), NER (+2.06% F1), Coref (+3.3% F1), SST-5 (+1.0% accuracy).
- **Inference speed**: Slower than static embeddings due to the LSTM forward pass; approximately 10-50x slower than GloVe lookup, but cacheable for fixed datasets.

## Common Misconceptions

**"ELMo is bidirectional in the same way as BERT."** ELMo uses two independently trained unidirectional LSTMs (one forward, one backward) and concatenates their outputs. Each direction can only see context in one direction at each layer. BERT uses a truly bidirectional (masked) self-attention mechanism where every position can attend to every other position simultaneously. This distinction is precisely what motivated Devlin et al. to develop `bert.md`.

**"ELMo replaces word embeddings."** In practice, ELMo vectors are concatenated with existing static embeddings, not used as replacements. Peters et al. found that combining ELMo with GloVe embeddings consistently outperformed using either alone.

**"Only the top layer matters."** The task-specific weighting mechanism is essential. Peters et al. showed that using only the top LSTM layer consistently underperforms the weighted combination, with differences of 0.5-2% across tasks. Lower layers capture complementary syntactic information that top-layer representations lose.

**"ELMo is obsolete."** While BERT-family models have largely superseded ELMo in accuracy, ELMo remains historically important for understanding the progression from static to contextualized embeddings. Its feature-based paradigm also avoids the computational cost of full model fine-tuning, which is relevant in resource-constrained settings.

## Connections to Other Concepts

- `word2vec.md`, `glove.md`, and `fasttext.md` are the static embedding predecessors that ELMo improved upon by adding context sensitivity.
- `contextual-embeddings.md` describes the general concept that ELMo pioneered -- context-dependent word representations.
- `long-short-term-memory.md` and `bidirectional-rnns.md` provide the architectural building blocks that ELMo is built from.
- `bert.md` was directly motivated by ELMo's success but replaced the bidirectional LSTM with a masked transformer encoder for deeper bidirectionality.
- `transfer-learning-in-nlp.md` covers the broader paradigm that ELMo helped establish, particularly the feature-based transfer approach.
- `word-sense-disambiguation.md` is a task where ELMo's contextualized representations have a natural advantage, since different senses receive different vectors.
- `named-entity-recognition.md` and `semantic-role-labeling.md` are among the tasks where ELMo produced the largest improvements.
- In the LLM Concepts collection, `llm-concepts/01-foundational-architecture/encoder-decoder-architecture.md` covers the architectural evolution from recurrent to transformer models.

## Further Reading

- Peters et al., *Deep Contextualized Word Representations*, 2018 -- the original ELMo paper demonstrating contextualized features across six NLP tasks.
- Peters et al., *Dissecting Contextual Word Embeddings: Architecture and Representation*, 2018 -- detailed analysis of what different ELMo layers encode.
- Howard and Ruder, *Universal Language Model Fine-tuning for Text Classification (ULMFiT)*, 2018 -- concurrent work showing that fine-tuning (rather than feature extraction) pre-trained LMs achieves strong results, complementing ELMo's approach.
- Devlin et al., *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*, 2019 -- the successor that replaced ELMo's LSTMs with masked transformers.
- McCann et al., *Learned in Translation: Contextualized Word Vectors (CoVe)*, 2017 -- an earlier approach to contextualized embeddings using machine translation encoders that preceded ELMo.
