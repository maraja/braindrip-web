# Convolutional Models for Text

**One-Line Summary**: CNNs applied to NLP use 1D convolutions over word embeddings to detect local n-gram patterns, offering parallelizable computation and strong performance for text classification, though with a limited receptive field compared to recurrent models.

**Prerequisites**: `word2vec.md`, `recurrent-neural-networks.md`, convolutional neural networks (image domain basics), max pooling.

## What Is a Convolutional Model for Text?

Imagine you are scanning a restaurant review with a highlighter, looking for opinion phrases. You run a small window (say, 3 words wide) across the text, highlighting patterns like "not very good," "absolutely delicious," or "terrible service." You have several highlighters of different widths -- one for 2-word patterns, one for 3-word patterns, one for 5-word patterns -- each detecting features at a different granularity. After scanning, you pick the most intense highlight from each color to summarize the review. This is essentially what a text CNN does: slide multiple filters of different sizes across the text, detect local patterns (n-grams), and pool the strongest activations into a fixed-size representation.

Convolutional models for text apply 1D convolutions to sequences of word embeddings. Unlike image CNNs that slide 2D filters over pixel grids, text CNNs slide 1D filters along the sequence dimension, where each "pixel" is an entire word embedding vector. The filters learn to detect meaningful local patterns -- from simple bigrams like "not good" to complex trigrams like "state of the art." Max-over-time pooling then extracts the most prominent activation for each filter, producing a fixed-size vector regardless of input length.

## How It Works

### 1D Convolution Over Word Embeddings

Given an input sentence represented as a matrix X of shape (n x d), where n is the number of tokens and d is the embedding dimension (e.g., 300 for `word2vec.md` or `glove.md`):

A 1D convolutional filter of width w is a weight matrix W_f of shape (w x d). It slides across the sequence, computing a feature at each position i:

```
c_i = f(W_f * X[i:i+w] + b)
```

where X[i:i+w] is the concatenation (or matrix slice) of w consecutive word embeddings, f is an activation function (typically ReLU), and b is a bias. This produces a feature map c = [c_1, c_2, ..., c_{n-w+1}] of length (n - w + 1).

### Multiple Filter Sizes for N-gram Detection

The key insight of Kim (2014) is to use multiple filter widths simultaneously. Common configurations:

- **Width 2**: Detects bigram patterns (e.g., "very good," "not bad").
- **Width 3**: Detects trigram patterns (e.g., "waste of time," "highly recommend it").
- **Width 4**: Detects 4-gram patterns (e.g., "out of this world").
- **Width 5**: Detects 5-gram patterns (e.g., "not as good as expected").

For each width, multiple filters (e.g., 100 per width) learn different patterns. With filter widths {3, 4, 5} and 100 filters each, the model has 300 feature maps total.

### Max-Over-Time Pooling

After computing all feature maps, max-over-time pooling selects the maximum value from each feature map:

```
c_hat = max(c) = max(c_1, c_2, ..., c_{n-w+1})
```

This captures the single strongest activation for each filter, regardless of where it occurred in the sequence. The result is a fixed-size vector (one scalar per filter) that can be fed to a fully connected classifier.

Max-over-time pooling is what makes the CNN output length-independent: whether the input has 10 or 1000 tokens, each filter contributes exactly one value.

### The Kim (2014) Architecture

The CNN for sentence classification (Kim, 2014) is deceptively simple:

1. **Input**: Sentence represented as a (n x d) embedding matrix, where d = 300 (Word2Vec or GloVe).
2. **Convolution**: Filter widths {3, 4, 5}, 100 filters per width.
3. **Activation**: ReLU.
4. **Pooling**: Max-over-time pooling, producing a 300-dimensional vector.
5. **Dropout**: Rate of 0.5 on the pooled representation.
6. **Output**: Fully connected layer + softmax for classification.

This architecture, with only about 300K-400K parameters (excluding embeddings), achieved results competitive with much larger models on benchmarks like SST-2 (88.1% accuracy), MR (81.5%), and TREC (93.6%).

Kim tested four embedding variants:
- **CNN-rand**: Random initialization (weakest).
- **CNN-static**: Pre-trained Word2Vec, frozen (strong baseline).
- **CNN-non-static**: Pre-trained Word2Vec, fine-tuned (best on most tasks).
- **CNN-multichannel**: Both static and non-static channels.

### Dilated (Atrous) Convolutions for Longer Range

Standard convolutions have a receptive field limited to the filter width. To capture longer-range dependencies without increasing filter size or depth linearly, dilated convolutions introduce gaps between filter elements:

- **Dilation 1**: Standard convolution, receptive field = w.
- **Dilation 2**: Skip every other position, effective receptive field = 2w - 1.
- **Dilation 4**: Skip every 3 positions, effective receptive field = 4w - 3.

Stacking dilated convolutions with exponentially increasing dilation rates (1, 2, 4, 8, ...) creates a receptive field that grows exponentially with depth, covering long sequences with logarithmic depth.

**ByteNet** (Kalchbrenner et al., 2017) used dilated convolutions for machine translation, achieving linear-time O(n) computation (vs. O(n^2) for attention) while capturing dependencies across the full source and target sequences.

**ConvS2S** (Gehring et al., 2017) used stacked convolutions with gated linear units (GLU) for seq2seq translation, achieving 40.51 BLEU on WMT'14 En-Fr -- surpassing the best LSTM-based attention models -- while training 9.3x faster than the equivalent recurrent model.

## Why It Matters

1. **Parallelizable computation**: Unlike RNNs, which must process tokens sequentially, all CNN filter applications across all positions can be computed simultaneously on a GPU. This gives CNNs a significant training speed advantage -- ConvS2S trained 9.3x faster than a comparable recurrent model (Gehring et al., 2017).
2. **Strong text classification baseline**: Kim (2014) showed that a simple CNN can match or beat sophisticated models on sentiment analysis and question classification, establishing CNNs as a viable alternative to RNNs for classification tasks.
3. **Local pattern detection**: CNNs naturally capture n-gram-like features without explicit feature engineering, learning which local patterns are discriminative for the task. This connects to the traditional n-gram features in `bag-of-words.md` and `n-gram-language-models.md` but with learned, continuous representations.
4. **Bridge to modern architectures**: Dilated convolutions demonstrated that non-recurrent architectures could handle sequence transduction, paving the way for the Transformer's fully non-recurrent design.
5. **Character-level models**: CNNs applied at the character level (dos Santos and Zadrozny, 2014; Zhang et al., 2015) can capture morphological patterns without tokenization, useful for morphologically rich languages and complementing `fasttext.md` approaches.

## Key Technical Details

- **Kim (2014) performance**: SST-2 binary sentiment: 88.1% accuracy. MR (movie reviews): 81.5%. TREC question classification: 93.6%. Subjectivity: 93.4%. All with a model of approximately 400K parameters.
- **ConvS2S (Gehring et al., 2017)**: 40.51 BLEU on WMT'14 En-Fr (vs. 38.95 for GNMT with attention). Trained in 1.5 days on 8 GPUs vs. 14 days for the RNN baseline.
- **Filter dimensions**: For 300-dimensional embeddings and filter width 3, each filter has 3 * 300 = 900 parameters plus bias. With 100 filters per width and 3 widths, the convolutional layers have approximately 270K parameters.
- **Receptive field**: A k-layer CNN with filter width w has a receptive field of k * (w - 1) + 1. For w = 3 and k = 5 layers, this covers 11 tokens. With dilated convolutions (dilation 1, 2, 4, 8, 16), the same 5 layers cover 2^5 = 32 tokens.
- **Comparison to RNNs on classification**: CNNs often match or exceed LSTMs on sentence-level classification but underperform on tasks requiring long-range dependencies (e.g., document-level sentiment, coreference resolution).
- **Computational complexity**: O(k * n * d^2) for k layers, n positions, d dimensions -- compared to O(n * d^2) for an RNN (but sequential) and O(n^2 * d) for self-attention.

## Common Misconceptions

- **"CNNs cannot capture any long-range dependencies."** While a single convolutional layer is limited to its filter width, stacking layers increases the receptive field linearly (or exponentially with dilated convolutions). Deep CNNs can and do capture dependencies spanning 50+ tokens. The limitation is that information must pass through multiple layers to travel long distances, introducing hierarchical information loss.

- **"CNNs are strictly inferior to RNNs for NLP."** For sentence-level classification, CNNs are often equal or superior to RNNs while being faster to train. The RNN advantage emerges primarily for tasks requiring token-level predictions over long sequences (language modeling, machine translation without dilated convolutions). The comparison is task-dependent, not categorical.

- **"Max-over-time pooling loses positional information."** This is partially true -- max pooling discards exactly where a pattern was detected. For classification, position is often irrelevant ("terrible" is negative whether it appears at the beginning or end). For tasks requiring positional information (NER, parsing), alternative pooling strategies or no pooling (using the full feature maps) are used instead.

- **"Text CNNs are just image CNNs applied to text."** While the convolution operation is the same, text CNNs differ in key ways: (1) filters span the full embedding dimension (each filter slides only along the sequence axis, not both axes), (2) max-over-time pooling replaces spatial pooling, and (3) there is no stride or padding convention borrowed from images. The architectural choices are specific to the 1D sequential structure of text.

## Connections to Other Concepts

- `recurrent-neural-networks.md`: CNNs and RNNs offer complementary approaches to sequence processing -- CNNs are parallel but locally limited, RNNs are sequential but theoretically unlimited in range. Many hybrid architectures combine both.
- `long-short-term-memory.md`: LSTMs were the primary comparison point for text CNNs; ConvS2S outperformed LSTM-based seq2seq models on machine translation while training much faster.
- `attention-mechanism.md`: ConvS2S combined convolutions with multi-step attention. The Transformer later replaced convolutions entirely with self-attention, achieving both parallelism and global range.
- `word2vec.md`: and **`glove.md`**: Pre-trained embeddings are the standard input to text CNNs, and Kim (2014) showed that fine-tuning these embeddings on the task further improves performance.
- `fasttext.md`: FastText's character n-gram approach is conceptually similar to character-level CNNs -- both capture subword patterns through local feature detection.
- `n-gram-language-models.md`: CNN filters of width w are essentially learned, continuous n-gram detectors, connecting to the traditional n-gram approach but with distributed representations.
- `text-classification.md`: Text CNNs remain a strong baseline for classification tasks, offering competitive accuracy with minimal hyperparameter tuning.
- `sentence-embeddings.md`: The pooled output of a text CNN is a fixed-size sentence representation that can be used for downstream tasks.

## Further Reading

- Kim, "Convolutional Neural Networks for Sentence Classification" (2014) -- The foundational paper establishing simple CNNs as effective text classifiers with pre-trained embeddings.
- Kalchbrenner et al., "Neural Machine Translation in Linear Time" (2017) -- ByteNet: introduced dilated causal convolutions for sequence-to-sequence modeling with O(n) complexity.
- Gehring et al., "Convolutional Sequence to Sequence Learning" (2017) -- ConvS2S: demonstrated that fully convolutional architectures with attention outperform RNN-based seq2seq models.
- Zhang et al., "Character-level Convolutional Networks for Text Classification" (2015) -- Showed that character-level CNNs can learn text representations from scratch without word embeddings.
- Dauphin et al., "Language Modeling with Gated Convolutional Networks" (2017) -- Gated convolutional language models competitive with LSTMs, demonstrating CNN viability for generative tasks.
