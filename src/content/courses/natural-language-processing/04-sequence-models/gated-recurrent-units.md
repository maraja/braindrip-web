# Gated Recurrent Units

**One-Line Summary**: GRUs simplify the LSTM gating mechanism by merging the cell state and hidden state into a single vector controlled by two gates, achieving comparable performance with fewer parameters.

**Prerequisites**: `recurrent-neural-networks.md`, `long-short-term-memory.md`, sigmoid and tanh activations.

## What Is a Gated Recurrent Unit?

Imagine you are editing a document with "track changes" enabled. At each revision, you have two decisions: how much of the old text to keep (the update gate) and how much of the old context to consider when writing new text (the reset gate). You do not need a separate notebook and a separate draft -- you work directly on one document. This is the GRU philosophy: one state vector, two control knobs, no separate cell state.

The Gated Recurrent Unit (GRU) was introduced by Cho et al. (2014) as a simpler alternative to the LSTM. Where the LSTM maintains two separate vectors (cell state C_t and hidden state h_t) controlled by three gates, the GRU uses a single hidden state h_t governed by two gates: the **update gate** z_t (analogous to the LSTM's forget and input gates combined) and the **reset gate** r_t (which controls how much of the previous hidden state feeds into the candidate computation). This architectural simplification reduces parameter count by roughly 25% compared to an LSTM of the same hidden dimension while delivering competitive performance on most NLP benchmarks.

## How It Works

### Gate Equations

At each time step t, given input x_t and previous hidden state h_{t-1}:

**Update gate** -- controls how much of the previous state to carry forward:
```
z_t = sigma(W_z * [h_{t-1}, x_t] + b_z)
```

**Reset gate** -- controls how much of the previous state to expose when computing the candidate:
```
r_t = sigma(W_r * [h_{t-1}, x_t] + b_r)
```

**Candidate hidden state** -- new information proposal:
```
h_tilde_t = tanh(W_h * [r_t * h_{t-1}, x_t] + b_h)
```

**Hidden state update** -- interpolation between old and new:
```
h_t = (1 - z_t) * h_{t-1} + z_t * h_tilde_t
```

The update gate z_t acts as a learned interpolation coefficient. When z_t is near 0, the GRU carries the previous hidden state forward unchanged (preserving long-range information). When z_t is near 1, it overwrites with the candidate. This single gate subsumes both the forget and input gates of the LSTM.

### Comparison to LSTM Architecture

| Feature | LSTM | GRU |
|---------|------|-----|
| State vectors | 2 (C_t and h_t) | 1 (h_t only) |
| Gates | 3 (forget, input, output) | 2 (update, reset) |
| Parameters per layer | 4 * d_h * (d_h + d_x + 1) | 3 * d_h * (d_h + d_x + 1) |
| Cell state conveyor belt | Explicit C_t with additive updates | Implicit via linear interpolation |
| Output gating | Separate output gate filters C_t | No output gate; h_t exposed directly |

For d_h = 512 and d_x = 300, an LSTM has approximately 1.66M parameters per layer versus approximately 1.25M for a GRU -- a 25% reduction.

### How GRUs Preserve Long-Range Gradients

The gradient path through the GRU's hidden state update is:

```
dh_t/dh_{t-1} = (1 - z_t) + z_t * (dh_tilde_t / dh_{t-1})
```

The (1 - z_t) term provides a direct linear gradient path, similar to the forget gate in the LSTM. When z_t is near 0 for many time steps, gradients flow almost undiminished backward through time. The GRU thus addresses the vanishing gradient problem described in `recurrent-neural-networks.md` through the same essential mechanism as the LSTM: learned linear shortcut connections.

### The Reset Gate's Role

The reset gate r_t is unique to the GRU and has no direct LSTM counterpart. When r_t approaches 0, the candidate computation ignores the previous hidden state entirely, effectively making the unit behave like a standard feedforward layer reading only x_t. This allows the GRU to "reset" and start fresh -- useful when processing a sequence with sharp topic boundaries or sentence breaks.

## Why It Matters

1. **Efficient alternative to LSTM**: The 25% parameter reduction and slightly faster training (fewer matrix multiplications per step) make GRUs attractive when model size or training time is constrained.
2. **Proved that three gates are not strictly necessary**: The GRU demonstrated that the core benefit of gating -- controlled linear gradient flow -- can be achieved with a simpler mechanism, inspiring further research into minimal recurrent architectures.
3. **Standard component in neural MT**: Cho et al. (2014) introduced the GRU specifically for the encoder-decoder framework that became `sequence-to-sequence-models.md`, and GRU-based models powered early neural machine translation systems.
4. **Competitive benchmark results**: On language modeling, machine translation, and speech recognition, GRUs frequently match LSTM performance, making the choice between them an empirical rather than theoretical question.
5. **Simpler implementation and debugging**: Fewer gates mean fewer hyperparameters to tune (no forget gate bias initialization trick needed) and simpler gradient debugging.

## Key Technical Details

- **Parameter savings**: For a single layer with d_h = 512, d_x = 300, a GRU has approximately 1.25M parameters versus 1.66M for an LSTM -- a 25% reduction. Over 4 stacked layers, this saves roughly 1.6M total parameters.
- **Training speed**: GRUs are approximately 10-20% faster per training step than LSTMs of the same hidden size due to fewer gate computations, though actual speedup depends on hardware and batch size.
- **Empirical results (Chung et al., 2014)**: On polyphonic music modeling, GRUs outperformed LSTMs. On speech signal modeling, the two performed comparably. On language modeling tasks, results were mixed with no consistent winner.
- **Jozefowicz et al. (2015) findings**: In their large-scale evaluation of RNN architectures, GRUs and LSTMs achieved statistically indistinguishable performance on most tasks, with GRUs occasionally winning on smaller datasets and LSTMs on larger ones.
- **Hidden dimensions**: Practitioners often use slightly larger GRU hidden dimensions (e.g., 600 vs. 512) to compensate for the absence of the cell state, while still maintaining fewer total parameters than the equivalent LSTM.
- **No forget gate bias trick**: Unlike LSTMs, GRUs do not require special bias initialization (the Jozefowicz forget-gate-bias-to-1 trick) since the update gate's default behavior naturally interpolates between keeping and overwriting.

## Common Misconceptions

- **"GRUs are strictly worse than LSTMs."** Multiple large-scale empirical studies (Chung et al., 2014; Jozefowicz et al., 2015; Greff et al., 2017) have found no consistent performance difference. The choice is task-dependent, and GRUs sometimes outperform LSTMs, particularly on smaller datasets where the reduced parameter count acts as implicit regularization.

- **"The update gate is just the forget gate renamed."** The update gate simultaneously controls both forgetting and input. In an LSTM, the forget and input gates can operate independently (f_t and i_t can both be high or both be low). In a GRU, forgetting and writing are coupled: a high z_t means "write new info and discard old"; a low z_t means "keep old and ignore new." This constraint is both a simplification and a limitation.

- **"GRUs cannot learn long-range dependencies as well as LSTMs."** There is no theoretical reason why GRUs should be worse at long-range dependencies. Both architectures provide linear gradient shortcuts. In practice, for sequences under 200 tokens, the two perform comparably. For very long sequences (500+), some researchers observe a slight LSTM advantage, possibly due to the separate cell state providing additional capacity.

- **"You should always use GRU to save compute."** The parameter savings are meaningful but modest (25%). If your bottleneck is data loading, GPU memory for embeddings, or attention computation, switching from LSTM to GRU yields negligible speedup. Profile first.

## Connections to Other Concepts

- **`long-short-term-memory.md`**: The GRU's direct predecessor and primary comparison point; the GRU simplifies the three-gate, two-state LSTM design to two gates and one state.
- **`recurrent-neural-networks.md`**: GRUs share the same sequential processing framework as vanilla RNNs but add gating to solve the vanishing gradient problem.
- **`bidirectional-rnns.md`**: Bidirectional GRUs (BiGRUs) are commonly used for sequence labeling tasks as a lighter alternative to BiLSTMs.
- **`sequence-to-sequence-models.md`**: Cho et al. (2014) introduced the GRU within the context of encoder-decoder translation, making it inseparable from seq2seq history.
- **`attention-mechanism.md`**: Bahdanau et al. (2014) used GRU-based encoders and decoders when introducing additive attention for machine translation.
- **`contextual-embeddings.md`**: While ELMo uses LSTMs, some contextual embedding approaches have used GRUs with comparable results.

## Further Reading

- Cho et al., "Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation" (2014) -- The paper that introduced GRUs as part of the encoder-decoder framework.
- Chung et al., "Empirical Evaluation of Gated Recurrent Neural Networks on Sequence Modeling" (2014) -- Direct comparison of GRU, LSTM, and vanilla RNN across multiple tasks.
- Jozefowicz et al., "An Empirical Exploration of Recurrent Network Architectures" (2015) -- Large-scale architecture search over 10,000+ RNN variants showing GRUs and LSTMs are competitive.
- Greff et al., "LSTM: A Search Space Odyssey" (2017) -- Systematic ablation study demonstrating that simplified LSTM variants (including GRU-like designs) often match full LSTM performance.
- Ravanelli et al., "Light Gated Recurrent Units for Speech Recognition" (2018) -- Explores further gate simplification beyond GRUs, showing that even a single gate can sometimes suffice.
