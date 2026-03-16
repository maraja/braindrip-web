# Long Short-Term Memory

**One-Line Summary**: LSTMs introduce a gated cell state that acts as a controlled information highway, solving the vanishing gradient problem that cripples vanilla RNNs on long sequences.

**Prerequisites**: `recurrent-neural-networks.md`, backpropagation, sigmoid and tanh activations, `word2vec.md`.

## What Is Long Short-Term Memory?

Imagine you are taking notes during a long lecture. Unlike just trying to remember everything in your head (a vanilla RNN), you have a notebook (the cell state). At each moment, you decide what to erase from your notes (forget gate), what new information to write down (input gate), and what to read aloud from your notes when someone asks you a question (output gate). The notebook preserves important information across the entire lecture, even if you stop thinking about a topic for thirty minutes -- something your short-term memory alone could never do.

Long Short-Term Memory (LSTM) is a recurrent neural network architecture introduced by Hochreiter and Schmidhuber in 1997, specifically designed to learn long-range dependencies. The key innovation is the cell state C_t -- a separate memory vector that runs through the entire sequence with only linear interactions (additions and element-wise multiplications). Because the cell state avoids repeated multiplication by a weight matrix, gradients can flow backward through hundreds of time steps without vanishing or exploding. Three gating mechanisms (forget, input, and output) learn to control what information enters, persists in, and exits the cell state.

## How It Works

### The Cell State: A Conveyor Belt for Information

The cell state C_t is the defining feature of the LSTM. Think of it as a conveyor belt running through the entire sequence. Information rides along this belt, modified only by additive updates and multiplicative gates -- both linear operations that preserve gradient magnitude. This contrasts sharply with the vanilla RNN in `recurrent-neural-networks.md`, where the hidden state is repeatedly squashed through tanh(W * h), causing gradients to decay exponentially.

### Gate Equations

At each time step t, given input x_t and previous hidden state h_{t-1}:

**Forget gate** -- decides what to discard from the cell state:
```
f_t = sigma(W_f * [h_{t-1}, x_t] + b_f)
```

**Input gate** -- decides what new information to store:
```
i_t = sigma(W_i * [h_{t-1}, x_t] + b_i)
```

**Candidate cell state** -- proposes new values:
```
C_tilde_t = tanh(W_C * [h_{t-1}, x_t] + b_C)
```

**Cell state update** -- the core operation combining forgetting and adding:
```
C_t = f_t * C_t-1 + i_t * C_tilde_t
```

**Output gate** -- decides what part of the cell state to expose:
```
o_t = sigma(W_o * [h_{t-1}, x_t] + b_o)
```

**Hidden state** -- the LSTM's output at this time step:
```
h_t = o_t * tanh(C_t)
```

Here, sigma is the sigmoid function (output in [0, 1]), * denotes element-wise multiplication, and [h_{t-1}, x_t] is the concatenation of the previous hidden state and current input.

### Why the Gates Solve Vanishing Gradients

Consider the gradient of the loss with respect to C_k for some earlier time step k. The cell state update is C_t = f_t * C_{t-1} + i_t * C_tilde_t. The partial derivative dC_t/dC_{t-1} = f_t. Since f_t is a sigmoid output in (0, 1) -- and crucially, can be very close to 1.0 when the forget gate learns to keep information -- the gradient product across T - k steps is:

```
product_{j=k+1}^{T} f_j
```

If the forget gates are near 1.0, this product stays close to 1.0 rather than decaying exponentially. This is the fundamental mechanism that enables LSTMs to learn dependencies spanning 100+ time steps.

### Peephole Connections

A common variant adds "peephole" connections that allow the gates to look at the cell state directly:
```
f_t = sigma(W_f * [h_{t-1}, x_t] + W_pf * C_{t-1} + b_f)
```
Gers et al. (2000) introduced peephole connections, showing they help with tasks requiring precise timing, though they add computational cost and are not universally beneficial.

## Why It Matters

1. **Dominated NLP for a decade**: From roughly 2013 to 2018, LSTMs were the architecture of choice for language modeling, machine translation, named entity recognition, and virtually every sequence task.
2. **Enabled practical sequence-to-sequence models**: The encoder-decoder framework in `sequence-to-sequence-models.md` relied on LSTM encoders and decoders to achieve breakthroughs in machine translation (Sutskever et al., 2014).
3. **Foundation of ELMo**: The contextual embeddings in `contextual-embeddings.md` are produced by a bidirectional LSTM, demonstrating that LSTM representations capture deep linguistic knowledge.
4. **Proved long-range learning is possible**: Before LSTMs, many researchers doubted that gradient-based methods could learn dependencies over hundreds of steps. LSTMs demonstrated otherwise, motivating further architectural innovation.
5. **Still competitive in specific domains**: For time-series forecasting, speech recognition pipelines, and embedded/edge deployments where transformer overhead is prohibitive, LSTMs remain a strong choice.

## Key Technical Details

- **Parameter count**: An LSTM layer with input dimension d_x and hidden dimension d_h has 4 * (d_h * (d_h + d_x) + d_h) parameters (four gate/candidate sets, each with weights and biases). For d_h = 512 and d_x = 300, that is roughly 1.66 million parameters per layer.
- **Typical hidden sizes**: 256 to 1024 units; Google's Neural Machine Translation system (GNMT, 2016) used 1024-unit LSTMs with 8 layers.
- **Forget gate bias initialization**: Jozefowicz et al. (2015) showed that initializing the forget gate bias to 1.0 or 2.0 significantly improves performance, ensuring the network defaults to remembering rather than forgetting at the start of training.
- **Dropout for LSTMs**: Standard dropout between layers works, but Gal and Ghahramani (2016) showed that applying the same dropout mask across time steps (variational dropout) is more principled and effective, with typical rates of 0.2-0.5.
- **Training cost**: A 2-layer LSTM with d_h = 512 on Penn Treebank achieves perplexity around 60-65 and trains in roughly 1-2 hours on a single GPU (2018 hardware).
- **Sequence length**: LSTMs can effectively learn dependencies over 100-200 time steps, compared to 10-20 for vanilla RNNs -- a 10x improvement, though still limited compared to Transformers.

## Common Misconceptions

- **"The cell state is the same as the hidden state."** They are distinct vectors. The cell state C_t is the long-term memory that flows through the sequence with linear updates. The hidden state h_t is the short-term output derived from the cell state via the output gate and tanh. Only h_t is typically passed to downstream layers or used for predictions.

- **"LSTMs completely solve the vanishing gradient problem."** LSTMs dramatically mitigate it but do not eliminate it entirely. For very long sequences (1000+ tokens), even LSTM gradients can degrade. The `attention-mechanism.md` was introduced partly because LSTMs still struggled to compress very long sequences into a single vector.

- **"More gates always mean better performance."** The `gated-recurrent-units.md` (GRU) uses only two gates instead of three, yet achieves comparable performance on many tasks with fewer parameters. Greff et al. (2017) performed a systematic ablation study showing that no single gate variant consistently outperforms others across all tasks.

- **"LSTMs are obsolete since transformers arrived."** Transformers have largely replaced LSTMs on benchmarks, but LSTMs have lower memory requirements for long sequences at inference time (O(1) vs. O(n^2) for self-attention) and process streaming data naturally. They remain practical for real-time applications and resource-constrained environments.

## Connections to Other Concepts

- `recurrent-neural-networks.md`: LSTMs are a gated variant of vanilla RNNs, inheriting the sequential processing framework while solving the vanishing gradient problem.
- `gated-recurrent-units.md`: A simplified alternative to LSTMs that merges the cell state and hidden state into one vector and uses two gates instead of three.
- `bidirectional-rnns.md`: Bidirectional LSTMs (BiLSTMs) are the most common instantiation of bidirectional processing, standard for tasks like NER and POS tagging.
- `sequence-to-sequence-models.md`: The original seq2seq papers used stacked LSTMs for both encoding and decoding.
- `attention-mechanism.md`: Attention was introduced to augment LSTM-based encoder-decoders, letting the decoder access all encoder hidden states instead of just the final one.
- `contextual-embeddings.md`: ELMo (Peters et al., 2018) generates contextualized word vectors using a two-layer bidirectional LSTM.
- `sentence-embeddings.md`: LSTM-based encoders are a common method for producing fixed-size sentence representations.

## Further Reading

- Hochreiter and Schmidhuber, "Long Short-Term Memory" (1997) -- The original paper introducing the LSTM architecture with gated cell states.
- Gers et al., "Learning to Forget: Continual Prediction with LSTM" (2000) -- Added the forget gate (absent in the original) and peephole connections.
- Graves, "Generating Sequences With Recurrent Neural Networks" (2013) -- Demonstrated LSTM power for handwriting generation and prediction with deep stacked architectures.
- Jozefowicz et al., "An Empirical Exploration of Recurrent Network Architectures" (2015) -- Systematic evaluation of LSTM variants, showing forget gate bias initialization matters most.
- Greff et al., "LSTM: A Search Space Odyssey" (2017) -- Comprehensive ablation study of LSTM components across multiple tasks and datasets.
