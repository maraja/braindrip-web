# Sequence-to-Sequence Models

**One-Line Summary**: The Seq2Seq framework (Sutskever et al., 2014) established the encoder-decoder paradigm for mapping variable-length inputs to variable-length outputs, achieving breakthrough machine translation results while revealing the fixed-length bottleneck that would drive the invention of attention.

**Prerequisites**: `02-recurrent-neural-networks-and-lstms.md`

## What Is a Sequence-to-Sequence Model?

Imagine a human interpreter at the United Nations. She listens to an entire French speech, builds a mental representation of its meaning, and then produces an English translation. She doesn't translate word-by-word — she absorbs the whole input first, then generates the output. Sequence-to-sequence models work the same way: an encoder reads the entire input and compresses it into a fixed-length vector, then a decoder generates the output sequence from that vector, one token at a time.

Before Seq2Seq, machine translation relied on phrase-based statistical methods that aligned source and target phrases using handcrafted features and complex pipelines. These systems (like Moses) required separate language models, translation models, and reordering models. They worked reasonably well for similar language pairs but struggled with long-range reordering and languages with very different structures.

The idea of using neural networks for end-to-end sequence transduction had been explored, but the key challenge was handling variable-length inputs and outputs. You can't use a standard feedforward network when the input is 12 words and the output is 15 — the dimensions don't match. Seq2Seq solved this elegantly by using the encoder's final hidden state as a fixed-dimensional bridge between sequences of any length.

## How It Works

```
  Seq2Seq Encoder-Decoder Architecture

  Source: "Je suis étudiant"          Target: "I am a student"

  ENCODER                              DECODER
  ┌─────┐  ┌─────┐  ┌─────┐          ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
  │  Je │─▶│suis │─▶│étud.│─── c ──▶│ <s> │─▶│  I  │─▶│ am  │─▶│  a  │─▶ ...
  └─────┘  └─────┘  └─────┘   │      └─────┘  └─────┘  └─────┘  └─────┘
                               │         │        │        │        │
                          Fixed-length   ▼        ▼        ▼        ▼
                          context       "I"     "am"     "a"    "student"
                          vector

  ◄──── Reads entire input ────►  ◄── Generates one token at a time ──►

  THE BOTTLENECK PROBLEM:
  ┌───────────────────────────┐
  │  Entire sentence meaning  │ ← Single fixed-size vector (e.g., 1000-dim)
  │  compressed into one      │    Must encode everything about the input
  │  vector c                 │    Information loss for long sentences
  └───────────────────────────┘
```
*Figure: The encoder reads the input sequence into a fixed-length context vector, which the decoder uses to generate the output. This fixed-length bottleneck degrades performance on long sentences.*

### The Encoder-Decoder Architecture

Ilya Sutskever, Oriol Vinyals, and Quoc V. Le at Google published "Sequence to Sequence Learning with Neural Networks" in December 2014 (NeurIPS). The architecture was strikingly simple:

**Encoder**: A multi-layer LSTM reads the input sequence one token at a time and produces a final hidden state — a single vector (typically 1000 dimensions) that must encode everything about the input sentence. Crucially, Sutskever found that reversing the input sequence improved performance significantly (from 30.6 to 33.3 BLEU), because it shortened the average distance between corresponding words in source and target, making optimization easier for the LSTM.

**Decoder**: A separate multi-layer LSTM, initialized with the encoder's final hidden state, generates the output sequence one token at a time. At each step, it takes the previous generated token (or a start token) and produces a probability distribution over the vocabulary for the next token. Generation continues until the model produces an end-of-sequence token.

### Training with Teacher Forcing

During training, instead of feeding the decoder its own (potentially wrong) predictions, the model uses **teacher forcing**: the ground-truth previous token is fed at each step. This stabilizes training and speeds convergence, but creates a train-test mismatch — at inference time, the model must use its own predictions, and errors can compound. Scheduled sampling (Bengio et al., 2015) later addressed this by gradually mixing in model predictions during training.

### Beam Search Decoding

Greedy decoding (always picking the highest-probability token) often produces suboptimal translations. Beam search maintains the top-k (typically k=5-12) partial hypotheses at each step, expanding each by one token and keeping the best overall candidates. Sutskever used a beam of size 2, which added ~1 BLEU point over greedy decoding. Later work showed beams of 5-10 were near-optimal, with diminishing returns beyond that.

### The Results That Shocked the Field

The Seq2Seq model achieved 34.81 BLEU on WMT'14 English-to-French translation using an ensemble of 5 LSTMs (4 layers, 1000 hidden units each, 384M parameters total). This was close to the state-of-the-art phrase-based system (33.30 BLEU for a single model without ensembling). A neural network with no linguistic features, no alignment model, and no phrase tables was matching systems that had been engineered for over a decade. When used to rescore the phrase-based system's outputs, it achieved 36.5 BLEU — a new state of the art.

## Why It Matters

### Establishing the Encoder-Decoder Paradigm

Seq2Seq established a pattern that would echo through the entire history of LLMs: encode an input into a representation, then decode that representation into an output. This same paradigm reappears in the Transformer's encoder-decoder architecture (`01-attention-is-all-you-need.md`), in T5's text-to-text framework (`05-t5-text-to-text-framework.md`), and conceptually in every prompt-to-response interaction with a modern LLM.

### Proving End-to-End Learning Could Work

Before Seq2Seq, complex NLP tasks required pipelines of specialized components. Seq2Seq demonstrated that a single neural network trained end-to-end could learn the entire mapping from input to output without handcrafted features. This end-to-end philosophy — let the model learn everything from data — became the dominant approach in AI research and directly motivated scaling up to larger models and datasets.

### Revealing the Fixed-Length Bottleneck

The encoder's final hidden state had to compress an entire sentence (or paragraph) into a single vector. For short sentences, this worked well. For long sentences, critical information was inevitably lost. Performance degraded sharply for sentences longer than ~20 words. This concrete failure mode was the direct motivation for `04-attention-mechanism-origins.md` — if the decoder could look back at all encoder states rather than relying on one compressed vector, long-sequence performance should improve. And it did, dramatically.

## Key Technical Details

- **Paper**: Sutskever, Vinyals, Le, "Sequence to Sequence Learning with Neural Networks" (2014, NeurIPS, arXiv:1409.3215)
- **Architecture**: 4-layer LSTM encoder + 4-layer LSTM decoder, 1000 hidden units per layer
- **Parameters**: ~384M for the ensemble of 5 models
- **Training data**: WMT'14 English-French, 12M sentence pairs (348M French words, 304M English words)
- **BLEU scores**: 34.81 (ensemble), 36.5 (rescoring phrase-based system) on English-to-French
- **Vocabulary**: Fixed 80K most frequent words for source and target; rare words mapped to UNK token
- **Training**: 10 days on 8 GPUs; gradient clipping at 5.0; batches of 128 sentences sorted by length
- **Key trick**: Reversing source sentence improved BLEU by ~3 points
- **Contemporaneous work**: Cho et al. (2014) published a similar encoder-decoder model with GRUs at nearly the same time

## Common Misconceptions

- **"Seq2Seq was only for machine translation."** While MT was the flagship application, the architecture was quickly applied to summarization, dialogue systems, image captioning (with a CNN encoder), speech recognition, and code generation. The framework is general-purpose.

- **"The decoder generates all tokens independently."** The decoder is autoregressive — each token is conditioned on all previously generated tokens (through the hidden state). This sequential dependency is what makes beam search necessary and generation inherently serial.

- **"Seq2Seq models understood language."** They learned statistical patterns of translation from parallel corpora. They had no explicit representations of syntax, semantics, or world knowledge. Errors were often linguistically nonsensical — repeating phrases, dropping negations, hallucinating content that wasn't in the source.

- **"Attention replaced Seq2Seq."** Attention augmented Seq2Seq — it didn't replace the encoder-decoder structure. Bahdanau attention (see `04-attention-mechanism-origins.md`) was added to Seq2Seq, keeping the same overall framework but allowing the decoder to attend to all encoder positions rather than just the final state.

## Connections to Other Concepts

- Built directly on LSTMs from `02-recurrent-neural-networks-and-lstms.md`
- The fixed-length bottleneck problem motivated `04-attention-mechanism-origins.md`
- The encoder-decoder paradigm was refined in `01-attention-is-all-you-need.md` and `05-t5-text-to-text-framework.md`
- The encoder-decoder vs decoder-only debate is discussed in `07-encoder-vs-decoder-vs-encoder-decoder.md`
- Sequential generation bottlenecks are covered in `07-the-bottlenecks-that-motivated-transformers.md`
- See `llm-concepts/autoregressive-generation.md` for how modern LLMs still generate text token-by-token

## Further Reading

- Sutskever, Vinyals, Le, "Sequence to Sequence Learning with Neural Networks" (2014, arXiv:1409.3215) — the foundational Seq2Seq paper
- Cho et al., "Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation" (2014, arXiv:1406.1078) — contemporaneous encoder-decoder model with GRUs
- Bahdanau, Cho, Bengio, "Neural Machine Translation by Jointly Learning to Align and Translate" (2014, arXiv:1409.0473) — added attention to Seq2Seq
- Bengio et al., "Scheduled Sampling for Sequence Prediction with Recurrent Neural Networks" (2015, arXiv:1506.03099) — addressed the teacher forcing mismatch
- Jean et al., "On Using Very Large Target Vocabulary for Neural Machine Translation" (2015, arXiv:1412.2007) — tackled the vocabulary limitation
