# Recurrent Neural Networks

**One-Line Summary**: RNNs process sequences one element at a time, maintaining a hidden state that accumulates information from previous time steps -- the first neural architecture designed for sequential data like language.

**Prerequisites**: Feedforward neural networks, backpropagation, matrix multiplication, `word2vec.md`, `n-gram-language-models.md`.

## What Is a Recurrent Neural Network?

Imagine reading a book one word at a time while trying to keep a running mental summary in your head. After each word, you update your summary based on what you just read and what you remembered so far. By the end of the sentence, your summary reflects the entire sequence -- but earlier words have become fuzzy, overwritten by more recent information. That is exactly how a vanilla RNN operates.

A Recurrent Neural Network is a class of neural networks where connections between units form a directed cycle through time. Unlike feedforward networks that process a fixed-size input in one pass, RNNs process a sequence of inputs (x_1, x_2, ..., x_T) step by step. At each time step t, the network takes the current input x_t and the previous hidden state h_{t-1}, combines them through learned weight matrices, and produces a new hidden state h_t. This hidden state serves as the network's "memory" of everything it has seen so far.

Formally, the core computation of a vanilla RNN cell is:

```
h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b_h)
y_t = W_hy * h_t + b_y
```

where W_hh, W_xh, and W_hy are weight matrices shared across all time steps (parameter sharing), and tanh is the activation function that squashes values to [-1, 1].

## How It Works

### The Forward Pass Through Time

Given a sequence of T tokens, the RNN "unrolls" into T copies of the same cell, each feeding its hidden state forward:

1. Initialize h_0 (typically a zero vector of dimension d_h).
2. For each time step t = 1 to T:
   - Combine the input embedding x_t (dimension d_x) with the previous hidden state h_{t-1} (dimension d_h).
   - Compute h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b_h).
   - Optionally produce output y_t = W_hy * h_t + b_y (e.g., a probability distribution over the vocabulary for language modeling).

The parameter count is independent of sequence length: W_xh is (d_h x d_x), W_hh is (d_h x d_h), and W_hy is (d_y x d_h). A typical configuration might use d_h = 256 or 512.

### Backpropagation Through Time (BPTT)

Training an RNN requires computing gradients across the entire unrolled computation graph. The loss at time step t depends on all previous hidden states through the chain rule. For a total loss L = sum of L_t over all time steps:

```
dL/dW_hh = sum_{t=1}^{T} sum_{k=1}^{t} (dL_t/dh_t) * (product_{j=k+1}^{t} dh_j/dh_{j-1}) * (dh_k/dW_hh)
```

The critical term is the product of Jacobians dh_j/dh_{j-1}. Each Jacobian involves multiplying by W_hh and the derivative of tanh. When these are chained over many time steps, the product either shrinks exponentially (vanishing gradients) or grows exponentially (exploding gradients).

### The Vanishing and Exploding Gradient Problem

This is the fundamental limitation of vanilla RNNs. Consider the gradient flowing from time step t back to step k. The magnitude scales roughly as ||W_hh||^{t-k}:

- If the largest singular value of W_hh is less than 1, gradients vanish exponentially -- the network cannot learn dependencies beyond roughly 10-20 steps.
- If the largest singular value exceeds 1, gradients explode -- training diverges with NaN losses.

Gradient clipping (capping the gradient norm at a threshold, typically 1.0 or 5.0) addresses exploding gradients but is merely a band-aid. The vanishing gradient problem requires architectural changes like those in `long-short-term-memory.md` and `gated-recurrent-units.md`.

Bengio et al. (1994) formally analyzed this problem, showing that for sequences longer than about 10 time steps, vanilla RNNs effectively cannot learn long-range dependencies.

### Truncated BPTT

In practice, full BPTT over very long sequences is computationally expensive. Truncated BPTT limits backpropagation to a fixed window (e.g., 35 time steps in standard language modeling setups), trading off the ability to learn longer dependencies for computational tractability.

## Why It Matters

1. **First neural sequence model**: RNNs introduced the idea that neural networks could process variable-length sequences, moving NLP beyond fixed-size windows used by `n-gram-language-models.md` and `bag-of-words.md`.
2. **Foundation for modern architectures**: LSTMs, GRUs, bidirectional models, and encoder-decoder architectures all build directly on the RNN framework.
3. **Theoretical importance**: The vanishing gradient problem discovered in RNNs motivated the gating mechanisms in `long-short-term-memory.md` and ultimately the self-attention mechanism in `attention-mechanism.md`.
4. **Still used in constrained settings**: Where model size and latency are critical (edge devices, real-time streaming), small RNNs remain practical choices.
5. **Language modeling baseline**: RNN-based language models (Mikolov et al., 2010) demonstrated that neural approaches could outperform n-gram models, catalyzing the neural NLP revolution.

## Key Technical Details

- **Parameter sharing**: The same W_hh, W_xh, and W_hy are used at every time step, so the number of parameters is O(d_h^2 + d_h * d_x + d_h * d_y), independent of sequence length.
- **Hidden state dimensions**: Typical values range from 128 to 1024; Mikolov et al. (2010) used d_h = 250 for language modeling with a perplexity of approximately 124 on Penn Treebank.
- **Effective memory**: Vanilla RNNs can practically learn dependencies spanning only 5-20 time steps before gradients vanish below useful signal.
- **Training speed**: RNNs are inherently sequential -- each h_t depends on h_{t-1} -- so they cannot be parallelized across time steps. This makes them significantly slower to train than CNNs or Transformers on modern GPU hardware.
- **Gradient clipping threshold**: Values of 1.0 to 5.0 are standard; Pascanu et al. (2013) recommend clipping the global norm rather than element-wise.
- **Elman vs. Jordan networks**: The standard RNN (Elman, 1990) feeds h_{t-1} to the next step; Jordan networks (1986) instead feed the previous output y_{t-1}. Elman networks became the dominant form.

## Common Misconceptions

- **"RNNs have memory like a computer."** RNN hidden states are fixed-size, continuously overwritten vectors -- more like a lossy running average than addressable storage. They cannot selectively store or retrieve specific past inputs the way `long-short-term-memory.md` cells can.

- **"Deeper RNNs always perform better."** Stacking RNN layers (deep RNNs) can help, but each additional layer compounds the vanishing gradient problem. Without gating, stacking more than 2-3 layers yields diminishing returns or training instability.

- **"The vanishing gradient means gradients become zero."** Vanishing gradients become exponentially small, not exactly zero. The problem is that they become indistinguishable from numerical noise, making it impossible for the optimizer to determine the direction of useful updates for long-range dependencies.

- **"RNNs are obsolete."** While Transformers dominate most NLP benchmarks, RNNs and their gated variants remain relevant for streaming/online settings, resource-constrained deployment, and as components in hybrid architectures. Recent work on state-space models (Mamba, S4) revisits recurrent computation.

## Connections to Other Concepts

- **`long-short-term-memory.md`**: LSTMs solve the vanishing gradient problem by introducing gated cell states -- the direct successor to vanilla RNNs.
- **`gated-recurrent-units.md`**: GRUs offer a simpler gating mechanism than LSTMs, with comparable performance on many tasks.
- **`bidirectional-rnns.md`**: Processes the sequence in both directions, capturing both past and future context using two RNN passes.
- **`sequence-to-sequence-models.md`**: Uses RNNs (typically LSTMs) as the encoder and decoder for tasks like machine translation.
- **`attention-mechanism.md`**: Introduced to overcome the information bottleneck that arises when an RNN encoder must compress an entire sequence into a single vector.
- **`word2vec.md`**: Provides the dense input embeddings x_t that RNNs consume at each time step.
- **`contextual-embeddings.md`**: ELMo uses bidirectional LSTMs (a gated RNN variant) to produce context-dependent word representations.
- **`n-gram-language-models.md`**: The fixed-window predecessors that RNN language models improved upon by conditioning on the entire preceding context.

## Further Reading

- Elman, "Finding Structure in Time" (1990) -- Introduced the simple recurrent network (SRN), establishing the basic RNN architecture.
- Bengio et al., "Learning Long-Term Dependencies with Gradient Descent is Difficult" (1994) -- Formal analysis of the vanishing gradient problem in RNNs.
- Mikolov et al., "Recurrent Neural Network Based Language Model" (2010) -- Demonstrated that RNN language models significantly outperform n-gram baselines.
- Pascanu et al., "On the Difficulty of Training Recurrent Neural Networks" (2013) -- Comprehensive study of gradient flow issues with practical solutions including gradient clipping.
- Goodfellow et al., "Deep Learning," Chapter 10 (2016) -- Thorough textbook treatment of RNNs, BPTT, and sequence modeling fundamentals.
