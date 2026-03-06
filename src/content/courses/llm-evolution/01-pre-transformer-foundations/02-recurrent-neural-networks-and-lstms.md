# Recurrent Neural Networks and LSTMs

**One-Line Summary**: RNNs processed language one token at a time like reading left to right, and LSTMs solved their crippling memory problem with learned gates — dominating NLP from 2014 to 2017 before the Transformer made their sequential bottleneck obsolete.

**Prerequisites**: `01-word-embeddings-word2vec-and-glove.md`

## What Is a Recurrent Neural Network?

Imagine reading a book one word at a time, keeping a mental summary in your head that you update with each new word. By the time you reach the end of a sentence, your summary reflects everything you've read — but earlier words have faded. That is essentially how a Recurrent Neural Network processes text: it reads one token at a time, maintaining a hidden state that carries forward a compressed representation of everything it has seen so far.

This was a natural fit for language, which is inherently sequential. Feedforward networks had no mechanism for handling variable-length sequences or remembering what came before. RNNs, first formalized by Elman (1990) and further developed through the 1990s, introduced the concept of recurrence: the output at each step depends not only on the current input but also on the hidden state from the previous step. This gave neural networks a form of memory.

However, vanilla RNNs had a devastating flaw. During backpropagation through time (BPTT), gradients had to flow backward through every timestep. For long sequences, these gradients either exploded to infinity or vanished to zero — making it practically impossible to learn dependencies spanning more than 10-20 tokens. A network reading a paragraph could not connect "The doctor who treated the patients in the emergency room" with "was" to learn subject-verb agreement. This was the vanishing gradient problem, formally analyzed by Bengio et al. (1994).

## How It Works

```
  Vanilla RNN: Unrolled Through Time

  x₁        x₂        x₃        x₄        x₅
  │         │         │         │         │
  ▼         ▼         ▼         ▼         ▼
┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐
│  h₁ │──▶│  h₂ │──▶│  h₃ │──▶│  h₄ │──▶│  h₅ │
└─────┘   └─────┘   └─────┘   └─────┘   └─────┘
  │         │         │         │         │
  ▼         ▼         ▼         ▼         ▼
  y₁        y₂        y₃        y₄        y₅

  LSTM Cell: Gated Memory Architecture

  ┌──────────────────────────────────────────┐
  │              LSTM Cell                    │
  │                                          │
  │  C_{t-1} ──[× forget]──[+ input]──▶ C_t │  ← Cell State (conveyor belt)
  │              │            │               │
  │  ┌───────┐  │  ┌───────┐ │  ┌─────────┐ │
  │  │Forget │  │  │ Input │ │  │ Output  │ │
  │  │ Gate  │  │  │ Gate  │ │  │  Gate   │ │
  │  │ f_t   │  │  │ i_t   │ │  │  o_t    │ │
  │  └───┬───┘  │  └───┬───┘ │  └────┬────┘ │
  │      │      │      │     │       │      │
  │  h_{t-1}, x_t ────────────────────────  │
  │                                          │
  └──────────────────────────────────────────┘
```
*Figure: An RNN processes tokens sequentially, passing hidden state h from step to step. The LSTM cell adds a cell state (C) with three gates that control information flow, enabling longer-range memory.*

### Vanilla RNN Architecture

At each timestep t, the RNN computes: h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b), where h_t is the hidden state, x_t is the input (usually a word embedding from `01-word-embeddings-word2vec-and-glove.md`), and W_hh and W_xh are learned weight matrices. The same weights are shared across all timesteps — a form of parameter sharing that made RNNs elegant but constrained. The hidden state h_t serves dual duty: it's both the network's memory and its output representation.

The problem is mathematical. When you chain matrix multiplications through hundreds of timesteps, eigenvalues greater than 1 cause explosion and eigenvalues less than 1 cause vanishing. Gradient clipping could handle explosion, but vanishing gradients had no simple fix. The network effectively had a memory horizon of roughly 10-20 steps.

### LSTMs: Gated Memory (Hochreiter & Schmidhuber, 1997)

The Long Short-Term Memory network, proposed by Sepp Hochreiter and Jurgen Schmidhuber in 1997 but not widely adopted until the deep learning renaissance of 2014+, introduced a separate memory cell and three gates to control information flow:

**Forget gate**: f_t = sigmoid(W_f * [h_{t-1}, x_t] + b_f). Decides what to discard from the cell state. A sigmoid output of 0 means "forget completely," 1 means "remember everything."

**Input gate**: i_t = sigmoid(W_i * [h_{t-1}, x_t] + b_i). Decides what new information to store. Combined with a candidate cell state: C_candidate = tanh(W_c * [h_{t-1}, x_t] + b_c).

**Cell state update**: C_t = f_t * C_{t-1} + i_t * C_candidate. The cell state flows through time with minimal transformation — this is the "highway" that allows gradients to flow unimpeded across many timesteps.

**Output gate**: o_t = sigmoid(W_o * [h_{t-1}, x_t] + b_o). Decides what to output: h_t = o_t * tanh(C_t).

The key insight was the cell state acting as a conveyor belt: information could flow unchanged across many timesteps, with the gates learning when to write, read, and erase. This extended the effective memory from ~10 to hundreds of timesteps.

### GRUs: A Simpler Alternative (Cho et al., 2014)

Kyunghyun Cho and colleagues introduced the Gated Recurrent Unit, which merged the forget and input gates into a single "update gate" and combined the cell state and hidden state. GRUs had two gates instead of three, fewer parameters, and trained faster. Performance was generally comparable to LSTMs — sometimes better on smaller datasets, sometimes worse on tasks requiring fine-grained memory control. The NLP community never reached consensus on which was superior, and both were widely used.

### Bidirectional and Deep RNNs

Unidirectional RNNs only see past context. Bidirectional RNNs (Schuster & Paliwal, 1997) run two separate RNNs — one forward, one backward — and concatenate their hidden states, giving each position access to both past and future context. Deep (stacked) RNNs added multiple layers, with each layer's hidden states serving as input to the next. By 2016, 2-4 layer bidirectional LSTMs were the standard architecture for most NLP tasks.

## Why It Matters

### The Dominant Paradigm (2014-2017)

LSTMs powered nearly every state-of-the-art NLP system during this period. Machine translation, sentiment analysis, named entity recognition, question answering, speech recognition — all used LSTM-based architectures. Google deployed LSTMs in Google Translate (2016), Apple used them in Siri, and Amazon in Alexa. They were the workhorse of production NLP.

### Establishing Sequence Modeling as Central to NLP

RNNs formalized the idea that language processing requires maintaining state across a sequence. This sequential processing paradigm was so natural that it took years for the field to consider that parallel processing of entire sequences (as in `01-attention-is-all-you-need.md`) might work at all, let alone work better.

### The Sequential Bottleneck

The very feature that made RNNs intuitive — processing one token at a time — became their fatal limitation. Training could not be parallelized across timesteps: you needed h_{t-1} to compute h_t. On modern GPUs designed for massive parallelism, RNNs left most computational capacity idle. A 500-word document required 500 sequential operations. This bottleneck is explored in depth in `07-the-bottlenecks-that-motivated-transformers.md` and was the primary motivation for the Transformer architecture.

## Key Technical Details

- **Vanilla RNNs**: Elman networks (1990); effective memory of ~10-20 timesteps due to vanishing gradients
- **LSTMs**: Proposed by Hochreiter & Schmidhuber (1997); widely adopted starting ~2014; typically 512-1024 hidden units per layer
- **GRUs**: Cho et al. (2014); 2 gates vs LSTM's 3; ~33% fewer parameters than equivalent LSTM
- **Bidirectional LSTMs**: Standard for NLP by 2015-2016; doubled parameter count but captured both forward and backward context
- **Google Neural Machine Translation (GNMT, 2016)**: 8-layer LSTM, trained on hundreds of billions of words; reduced translation errors by 60% vs phrase-based systems
- **Training**: Typically used SGD or Adam; gradient clipping at 1.0-5.0 to prevent explosion; dropout of 0.2-0.5 for regularization
- **Sequence length**: Practical limit of ~500-1000 tokens even with LSTMs; performance degraded beyond that
- **Era of dominance**: 2014-2017; rapidly displaced by Transformers starting 2018

## Common Misconceptions

- **"LSTMs solved the vanishing gradient problem completely."** LSTMs significantly mitigated it, extending effective memory from ~10 to ~200+ tokens. But they did not eliminate it — very long-range dependencies (thousands of tokens) still degraded. The cell state highway helps, but gates are still computed through recurrence.

- **"RNNs are obsolete and have no modern use."** While Transformers dominate NLP, RNN variants like state-space models (Mamba, 2023) and RWKV have seen renewed interest for their linear-time inference scaling. The core idea of recurrent state has not died — it has been reimagined.

- **"GRUs are strictly worse than LSTMs."** Empirical evidence is mixed. GRUs often match LSTMs on shorter sequences and smaller datasets while training faster. The "LSTM is always better" belief led to GRUs being underused in practice.

- **"Bidirectional LSTMs see the whole sequence at once."** They don't — they still process sequentially in each direction. A bidirectional LSTM is two separate sequential passes, not parallel attention over the full sequence. This is fundamentally different from the self-attention in `01-attention-is-all-you-need.md`.

## Connections to Other Concepts

- Built on top of word embeddings from `01-word-embeddings-word2vec-and-glove.md` as input representations
- Formed the backbone of `03-sequence-to-sequence-models.md` for machine translation
- `04-attention-mechanism-origins.md` was initially designed to augment LSTM-based seq2seq models
- `05-elmo-and-contextual-embeddings.md` used deep bidirectional LSTMs for pre-training
- The limitations of RNNs are cataloged in `07-the-bottlenecks-that-motivated-transformers.md`
- See `llm-concepts/attention-mechanisms.md` for how self-attention replaced recurrence entirely

## Further Reading

- Hochreiter & Schmidhuber, "Long Short-Term Memory" (1997, Neural Computation) — the foundational LSTM paper
- Cho et al., "Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation" (2014, arXiv:1406.1078) — introduced GRUs
- Bengio et al., "Learning Long-Term Dependencies with Gradient Descent is Difficult" (1994, IEEE Trans. Neural Networks) — formalized the vanishing gradient problem
- Greff et al., "LSTM: A Search Space Odyssey" (2017, IEEE Trans. Neural Networks) — systematic comparison of LSTM variants
- Wu et al., "Google's Neural Machine Translation System" (2016, arXiv:1609.08144) — production-scale LSTM deployment
