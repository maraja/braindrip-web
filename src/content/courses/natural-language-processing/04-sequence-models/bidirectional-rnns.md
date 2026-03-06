# Bidirectional RNNs

**One-Line Summary**: Bidirectional RNNs process a sequence in both forward and backward directions, producing representations that capture both past and future context at every time step.

**Prerequisites**: `recurrent-neural-networks.md`, `long-short-term-memory.md`, `gated-recurrent-units.md`.

## What Is a Bidirectional RNN?

Imagine you are solving a crossword puzzle. To figure out the answer for a clue at position 5, you look at the letters you have already filled in to the left (past context) and the letters to the right (future context). A standard left-to-right RNN only sees the leftward letters -- it is solving the crossword blindfolded on one side. A bidirectional RNN runs two separate passes, one left-to-right and one right-to-left, then combines both views. The result: every position in the sequence gets a representation informed by the entire sequence, not just what came before.

More formally, a bidirectional RNN consists of two independent RNN layers (typically LSTMs or GRUs) that process the input sequence in opposite directions. At each time step t, the forward RNN produces a hidden state h_t_forward from (x_1, ..., x_t) and the backward RNN produces h_t_backward from (x_T, ..., x_t). These two states are then concatenated (or summed, or averaged) to form the final representation for position t:

```
h_t = [h_t_forward ; h_t_backward]
```

This architecture was first proposed by Schuster and Paliwal (1997) and became the de facto standard for sequence labeling tasks like named entity recognition (`named-entity-recognition.md`) and part-of-speech tagging (`part-of-speech-tagging.md`).

## How It Works

### Architecture

Given an input sequence (x_1, x_2, ..., x_T):

**Forward pass** (left to right):
```
h_t_forward = RNN_forward(x_t, h_{t-1}_forward)    for t = 1, 2, ..., T
```

**Backward pass** (right to left):
```
h_t_backward = RNN_backward(x_t, h_{t+1}_backward)  for t = T, T-1, ..., 1
```

**Combined representation** at each position:
```
h_t = [h_t_forward ; h_t_backward]
```

The forward and backward RNNs have completely separate parameters. If each uses a hidden dimension of d_h, the concatenated representation has dimension 2 * d_h. The two passes are independent and can be computed in parallel on modern hardware.

### Why Two Directions Matter

Consider the sentence: "The bank by the river was eroding." To determine that "bank" refers to a riverbank (not a financial institution), the word "river" appearing after "bank" is critical. A left-to-right RNN processing "bank" has not yet seen "river." A right-to-left RNN processing "bank" has seen "river" but not "The." Only the bidirectional model has both signals available simultaneously.

This is not merely a theoretical concern. Empirically, bidirectional models consistently outperform unidirectional ones on tasks where the label for a token depends on its surrounding context:

- **NER**: Recognizing that "Washington" is a person name (not a location) often requires seeing the verb that follows it.
- **POS tagging**: Disambiguating "flies" (noun vs. verb) depends on both the preceding subject and the following object.
- **Sentiment analysis**: Negation ("not good") requires seeing both the negator and the negated term.

### Stacking Bidirectional Layers

Deep bidirectional models stack multiple BiRNN layers. The output of layer l (dimension 2 * d_h after concatenation) becomes the input to layer l + 1:

```
Layer 1: h_t^(1) = [h_t_forward^(1) ; h_t_backward^(1)]     (dimension 2*d_h)
Layer 2: h_t^(2) = [h_t_forward^(2) ; h_t_backward^(2)]     (dimension 2*d_h)
...
Layer L: h_t^(L) = [h_t_forward^(L) ; h_t_backward^(L)]     (dimension 2*d_h)
```

ELMo (`contextual-embeddings.md`) uses a 2-layer BiLSTM with d_h = 4096 per direction, producing 8192-dimensional concatenated representations that are then projected down.

### Combining Forward and Backward States

Concatenation is the most common strategy, but alternatives include:

- **Summation**: h_t = h_t_forward + h_t_backward (preserves dimensionality at d_h).
- **Averaging**: h_t = (h_t_forward + h_t_backward) / 2.
- **Learned projection**: h_t = W_p * [h_t_forward ; h_t_backward] (reduces dimension back to d_h).

Concatenation is preferred in practice because it preserves all information from both directions without lossy compression.

## Why It Matters

1. **State-of-the-art for sequence labeling**: Before transformers, BiLSTMs (often with a CRF output layer) were the dominant architecture for NER, POS tagging, and chunking. Huang et al. (2015) established the BiLSTM-CRF as the standard approach.
2. **Foundation of ELMo**: Peters et al. (2018) showed that deep BiLSTM representations capture syntax in lower layers and semantics in upper layers -- a finding that informed later pre-training strategies like BERT (`bert.md`).
3. **Essential for understanding tasks**: Any task where the correct output for a token depends on future context benefits from bidirectional processing. This includes reading comprehension, question answering, and syntactic parsing.
4. **Conceptual precursor to BERT**: BERT's "bidirectionality" through masked language modeling was directly inspired by the success of BiLSTMs, extending the idea from recurrent to transformer architectures.

## Key Technical Details

- **Parameter count**: A single BiLSTM layer with d_h = 512 per direction and d_x = 300 input has approximately 3.32M parameters (2x the unidirectional LSTM), producing 1024-dimensional outputs.
- **Computational cost**: Two full sequential passes over the sequence. Wall-clock time is approximately 2x a unidirectional model, though the forward and backward passes can run in parallel if memory allows.
- **ELMo configuration**: 2-layer BiLSTM, d_h = 4096 per direction, character CNN inputs, trained on 1B Word Benchmark. The resulting contextual embeddings improved downstream task performance by 1-5 F1 points across the board.
- **BiLSTM-CRF for NER**: Lample et al. (2016) achieved 90.94 F1 on CoNLL-2003 English NER using a BiLSTM-CRF -- the best neural result at the time and competitive until BERT-based models appeared.
- **Typical depth**: 1-3 BiLSTM layers for most tasks; deeper stacks (4+) show diminishing returns and increased training difficulty without residual connections.
- **Sequence length**: Bidirectional models must see the entire sequence before producing any output, introducing a minimum latency equal to the full sequence length. This is acceptable for offline processing but prohibitive for real-time streaming.

## Common Misconceptions

- **"Bidirectional RNNs can be used for language modeling and text generation."** They cannot be used for standard autoregressive generation because generating token t would require knowing tokens t+1, t+2, ..., T -- which have not been generated yet. Bidirectional models are for encoding (understanding) tasks, not decoding (generation) tasks. In `sequence-to-sequence-models.md`, the encoder is typically bidirectional while the decoder must be unidirectional.

- **"The backward pass is just the forward pass with reversed input."** While the sequence is fed in reverse order, the backward RNN has its own separate set of parameters. It is a completely independent model that happens to read the sequence from right to left. The two models are only coupled through the loss function during training.

- **"Bidirectional means the model can attend to any position."** Bidirectional RNNs still process sequentially in each direction. The representation at position t in the forward pass only has information from positions 1 through t. The backward pass only has information from T through t. The combination at position t sees the full sequence, but each component still has the same recency bias and vanishing gradient limitations as a unidirectional RNN. True "attend to any position" requires the `attention-mechanism.md`.

- **"BiLSTMs are always better than unidirectional LSTMs."** For tasks where only past context is available or relevant (e.g., real-time speech recognition, autoregressive language modeling, causal forecasting), unidirectional models are appropriate. Bidirectionality is a benefit only when the full sequence is available at inference time.

## Connections to Other Concepts

- **`recurrent-neural-networks.md`**: BiRNNs are constructed from two vanilla RNNs or gated variants running in opposite directions.
- **`long-short-term-memory.md`**: BiLSTMs are the most common instantiation of bidirectional RNNs, combining LSTM gating with bidirectional processing.
- **`gated-recurrent-units.md`**: BiGRUs offer a lighter-weight alternative to BiLSTMs with comparable performance on many tasks.
- **`sequence-to-sequence-models.md`**: Bidirectional encoders are standard in seq2seq models, while decoders remain unidirectional.
- **`attention-mechanism.md`**: Attention over bidirectional encoder states gives the decoder access to rich, context-aware representations of every input position.
- **`contextual-embeddings.md`**: ELMo is a deep BiLSTM, and the idea of bidirectional context directly influenced BERT's masked language modeling objective.
- **`named-entity-recognition.md`**: BiLSTM-CRF was the dominant NER architecture before transformers, leveraging future context for entity boundary detection.
- **`part-of-speech-tagging.md`**: POS tagging benefits heavily from bidirectional context, since grammatical role depends on surrounding words.

## Further Reading

- Schuster and Paliwal, "Bidirectional Recurrent Neural Networks" (1997) -- The original paper proposing the bidirectional architecture for sequence processing.
- Graves and Schmidhuber, "Framewise Phoneme Classification with Bidirectional LSTM and Other Neural Network Architectures" (2005) -- Applied BiLSTMs to speech recognition, establishing their superiority for frame-level classification.
- Huang et al., "Bidirectional LSTM-CRF Models for Sequence Tagging" (2015) -- Introduced the BiLSTM-CRF architecture that became the standard for NER and POS tagging.
- Lample et al., "Neural Architectures for Named Entity Recognition" (2016) -- BiLSTM-CRF with character embeddings achieving state-of-the-art NER results.
- Peters et al., "Deep Contextualized Word Representations" (2018) -- ELMo: demonstrated that deep BiLSTM representations capture rich linguistic structure.
