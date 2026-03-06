# Attention Mechanism

**One-Line Summary**: Attention allows a decoder to dynamically focus on different parts of the encoder's output at each generation step, replacing the fixed-size bottleneck vector with a weighted combination of all source representations.

**Prerequisites**: `sequence-to-sequence-models.md`, `recurrent-neural-networks.md`, `long-short-term-memory.md`, softmax function, dot product.

## What Is the Attention Mechanism?

Imagine you are translating a long paragraph from French to English. Instead of reading the entire French paragraph, forming a single mental summary, and then writing the English version from memory (the basic seq2seq approach), you keep the French text open on your desk. For each English word you write, you glance back at the specific French words that are most relevant -- looking at "maison" when writing "house," at "rouge" when writing "red." You are dynamically aligning your attention to different parts of the source as you produce each part of the target. That is exactly what the attention mechanism does.

In the context of `sequence-to-sequence-models.md`, the attention mechanism was introduced by Bahdanau et al. (2014) to solve the bottleneck problem: compressing an entire source sequence into a single fixed-size context vector loses information, especially for long sequences. Instead, attention computes a weighted sum of all encoder hidden states at each decoder time step, where the weights reflect how relevant each source position is to the current decoding step. This produces a dynamic, position-specific context vector that gives the decoder direct access to the full source representation.

The attention mechanism was arguably the single most impactful architectural innovation in modern NLP. It directly led to the Transformer architecture (Vaswani et al., 2017), which uses self-attention to eliminate recurrence entirely and now underpins BERT (`bert.md`), GPT (`gpt-for-nlp-tasks.md`), and virtually all modern language models.

## How It Works

### The General Framework

Given encoder hidden states (h_1, h_2, ..., h_S) and the current decoder state s_t, attention computes:

1. **Alignment scores**: e_{t,j} = score(s_t, h_j) for each source position j.
2. **Attention weights**: alpha_{t,j} = softmax(e_{t,j}) = exp(e_{t,j}) / sum_k exp(e_{t,k}).
3. **Context vector**: c_t = sum_{j=1}^{S} alpha_{t,j} * h_j.
4. **Output**: The context vector c_t is combined with s_t (typically by concatenation) to predict the output token.

The critical design choice is the score function. Two dominant variants emerged:

### Bahdanau Attention (Additive, 2014)

```
score(s_t, h_j) = v_a^T * tanh(W_a * s_t + U_a * h_j)
```

where W_a (d_a x d_s), U_a (d_a x d_h), and v_a (d_a x 1) are learned parameters. The alignment dimension d_a is a hyperparameter, typically set equal to the decoder hidden size. This is called "additive" attention because it computes the score by adding transformed representations.

Bahdanau et al. used a bidirectional GRU encoder (`bidirectional-rnns.md` with `gated-recurrent-units.md`) and a unidirectional GRU decoder. On WMT'14 English-to-French, attention improved BLEU from 26.75 (basic encoder-decoder) to 28.45 -- and more importantly, eliminated the performance degradation on long sentences that plagued the basic seq2seq model.

### Luong Attention (Multiplicative, 2015)

Luong et al. (2015) proposed three simpler scoring functions:

**Dot product** (no additional parameters):
```
score(s_t, h_j) = s_t^T * h_j
```

**General** (bilinear form with learned weight matrix):
```
score(s_t, h_j) = s_t^T * W_a * h_j
```

**Concat** (similar to Bahdanau):
```
score(s_t, h_j) = v_a^T * tanh(W_a * [s_t ; h_j])
```

The dot product is the simplest and most efficient, requiring no additional parameters, but it requires that s_t and h_j have the same dimensionality. The general form relaxes this constraint at the cost of a d_s x d_h parameter matrix. Luong found that the general and dot-product forms outperformed the additive form when the decoder was sufficiently large.

Luong also distinguished between **global attention** (attending to all source positions, as described above) and **local attention** (attending to a window of positions around an estimated alignment point), which reduces computation for very long sequences.

### Attention Weights as Soft Alignment

The attention weight vector alpha_t at decoder step t can be visualized as a heatmap over source positions. These heatmaps reveal interpretable alignment patterns:

- For machine translation, attention weights often follow a roughly monotonic diagonal pattern (source word 1 aligns with target word 1, etc.), with deviations corresponding to word reordering between languages.
- For summarization, attention weights highlight the most salient source sentences.
- For question answering, attention weights concentrate on the passage span containing the answer.

These visualizations were a major selling point of attention, offering a degree of model interpretability rare in neural NLP. However, recent work has questioned whether attention weights truly explain model behavior (Jain and Wallace, 2019).

### Scaled Dot-Product Attention

Vaswani et al. (2017) identified a practical issue with dot-product attention: as the dimensionality d_k grows, the dot products grow in magnitude, pushing softmax into regions with extremely small gradients. Their solution was to scale:

```
Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V
```

This scaled dot-product attention is the building block of the Transformer's multi-head attention. Here Q (queries), K (keys), and V (values) generalize the decoder state and encoder states into a more flexible framework. This formulation decoupled attention from the encoder-decoder context entirely, enabling self-attention where a sequence attends to itself.

## Why It Matters

1. **Solved the information bottleneck**: By giving the decoder direct access to all encoder states, attention eliminated the degradation on long sequences that limited basic seq2seq models. Bahdanau et al. showed stable BLEU scores even for 50+ word sentences.
2. **Enabled interpretable models**: Attention weight visualizations provided the first window into what neural translation models were "looking at," making the black-box somewhat transparent.
3. **Directly led to the Transformer**: The Transformer (Vaswani et al., 2017) replaced recurrence entirely with multi-head self-attention, keeping the attention mechanism as the sole information-routing mechanism. Without attention, there would be no BERT, GPT, or modern LLMs.
4. **General-purpose mechanism**: Attention has been applied far beyond NLP -- to computer vision (image captioning, visual question answering), speech recognition, protein structure prediction (AlphaFold), and graph neural networks.
5. **Improved training dynamics**: Because attention provides a direct gradient path from the loss at each decoder step to every encoder state, it alleviates vanishing gradient issues in long sequences even when using RNNs.

## Key Technical Details

- **Bahdanau et al. (2014) results**: On WMT'14 En-Fr, attention improved BLEU from 26.75 to 28.45 (basic RNNsearch) and to 36.15 with larger vocabulary and longer training, surpassing the previous best phrase-based system (33.30).
- **Luong et al. (2015) results**: On WMT'15 En-De, the best attention variant (global, general scoring) achieved 25.9 BLEU, establishing multiplicative attention as the more efficient standard.
- **Computational cost**: Attention adds O(S * d) computation per decoder step (S = source length, d = hidden dimension). For the full output sequence of length T, total attention cost is O(T * S * d). This is negligible compared to the RNN computation for typical sentence lengths but becomes significant for very long sequences.
- **Memory**: Attention requires storing all S encoder hidden states in memory simultaneously, costing O(S * d) memory. For document-level translation (thousands of tokens), this motivated local attention variants and later sparse attention patterns.
- **Number of additional parameters**: Bahdanau (additive) attention adds approximately 3 * d^2 parameters (for W_a, U_a, v_a). Dot-product attention adds zero parameters. General (bilinear) attention adds d^2 parameters.
- **Attention visualization**: The alpha matrix for a source-target pair has dimensions T x S. For a 30-word source and 35-word target, this is a 35x30 heatmap that can be plotted directly.

## Common Misconceptions

- **"Attention replaces the encoder-decoder architecture."** In the original formulation, attention augments the encoder-decoder -- it does not replace it. The encoder still produces hidden states, and the decoder still generates tokens sequentially. What changed is that the decoder has a richer information source (all encoder states via attention) rather than just the final state. The Transformer later showed that attention can replace recurrence, but the encoder-decoder structure itself persists.

- **"Attention weights are a faithful explanation of model decisions."** Jain and Wallace (2019) demonstrated that attention weights often do not correlate with gradient-based feature importance measures, and that alternative attention distributions can produce identical predictions. Attention weights are a useful diagnostic tool but should not be over-interpreted as causal explanations.

- **"Bahdanau and Luong attention are fundamentally different mechanisms."** They are variations of the same idea -- computing a weighted sum of encoder states based on learned alignment scores. The difference is purely in the score function (additive vs. multiplicative). Both produce attention weights via softmax and context vectors via weighted sum. In practice, they yield similar performance.

- **"Attention is only useful for sequence-to-sequence tasks."** Self-attention (a sequence attending to itself) is equally powerful and is the basis of the Transformer encoder. Self-attention is used for classification, tagging, and any task where a sequence needs to model internal dependencies.

## Connections to Other Concepts

- **`sequence-to-sequence-models.md`**: Attention was invented to solve the bottleneck problem in the basic encoder-decoder framework.
- **`recurrent-neural-networks.md`** and **`long-short-term-memory.md`**: The original attention mechanism augmented RNN/LSTM-based encoder-decoders. Attention provides a direct gradient highway that complements the gating mechanisms in LSTMs.
- **`bidirectional-rnns.md`**: Bahdanau et al. used a bidirectional GRU encoder, so the encoder states attended to were bidirectional representations.
- **`gated-recurrent-units.md`**: Both the Bahdanau encoder and decoder used GRUs, closely tying GRU and attention history.
- **`bert.md`**: BERT uses multi-head self-attention (a descendant of the attention mechanism) as its core architectural component.
- **`gpt-for-nlp-tasks.md`**: GPT uses masked (causal) self-attention, where each position can only attend to previous positions.
- **`machine-translation.md`**: The primary application that motivated attention and where it was first evaluated.
- **`contextual-embeddings.md`**: Attention-based representations are inherently contextual -- each position's representation depends on the full sequence.

## Further Reading

- Bahdanau et al., "Neural Machine Translation by Jointly Learning to Align and Translate" (2014) -- Introduced additive attention for seq2seq, solving the bottleneck problem and launching the attention revolution.
- Luong et al., "Effective Approaches to Attention-based Neural Machine Translation" (2015) -- Proposed multiplicative (dot-product) attention and local attention variants with systematic comparisons.
- Vaswani et al., "Attention Is All You Need" (2017) -- Eliminated recurrence entirely, using scaled dot-product multi-head self-attention to create the Transformer architecture.
- Xu et al., "Show, Attend and Tell" (2015) -- Extended attention to image captioning, demonstrating the mechanism's generality beyond text.
- Jain and Wallace, "Attention is not Explanation" (2019) -- Critical analysis showing that attention weights do not reliably indicate feature importance.
