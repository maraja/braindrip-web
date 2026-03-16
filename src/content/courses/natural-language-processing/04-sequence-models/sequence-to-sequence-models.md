# Sequence-to-Sequence Models

**One-Line Summary**: The encoder-decoder architecture maps variable-length input sequences to variable-length output sequences by compressing the input into a fixed-size context vector, then generating the output one token at a time.

**Prerequisites**: `recurrent-neural-networks.md`, `long-short-term-memory.md`, `word2vec.md`, softmax function, cross-entropy loss.

## What Is a Sequence-to-Sequence Model?

Imagine a simultaneous interpreter at the United Nations. First, they listen to the entire source-language sentence (encoding), distill its meaning into their understanding (the context vector), then produce the equivalent sentence in the target language word by word (decoding). They cannot start translating until they have heard the full thought, and the translated sentence may be a completely different length than the original. This is the sequence-to-sequence (seq2seq) paradigm: encode the entire input, then decode the output.

Formally, a seq2seq model consists of two components:

1. **Encoder**: Reads the input sequence (x_1, x_2, ..., x_S) and produces a fixed-size vector representation c (the context vector), typically the final hidden state of an RNN.
2. **Decoder**: Takes the context vector c and generates the output sequence (y_1, y_2, ..., y_T) one token at a time, conditioning each output on both c and all previously generated tokens.

This architecture was introduced independently by Sutskever et al. (2014) and Cho et al. (2014), and it became the foundation for neural machine translation, summarization, and any task where input and output are sequences of potentially different lengths.

## How It Works

### The Encoder

The encoder processes the source sequence using an RNN (typically a multi-layer LSTM or GRU):

```
h_t = RNN_encoder(x_t, h_{t-1})    for t = 1, 2, ..., S
c = h_S  (or some function of the final hidden states)
```

For LSTMs, the context vector includes both the final hidden state and cell state: c = (h_S, C_S). Sutskever et al. (2014) used a 4-layer LSTM with 1000 units per layer, and critically, they reversed the input sequence -- feeding (x_S, ..., x_2, x_1) instead of (x_1, ..., x_S) -- which improved BLEU scores by up to 5 points by placing the first input words closer to the first output words in the computational graph.

A bidirectional encoder (`bidirectional-rnns.md`) is often preferred because it captures both left and right context for each source position. In this case, the context vector is typically derived from the concatenation of the final forward and backward states.

### The Decoder

The decoder is a separate RNN that generates the output sequence:

```
s_0 = c   (initialize decoder state with context vector)
s_t = RNN_decoder(y_{t-1}, s_{t-1})    for t = 1, 2, ..., T
P(y_t | y_1, ..., y_{t-1}, x) = softmax(W_o * s_t + b_o)
```

At each step, the decoder receives the embedding of the previously generated token y_{t-1} (or the ground truth during training -- see teacher forcing below), updates its hidden state, and produces a probability distribution over the output vocabulary.

Generation continues until the decoder emits a special end-of-sequence (EOS) token or reaches a maximum length.

### Teacher Forcing

During training, there is a choice at each decoder step: feed the model's own previous prediction (free running) or the ground-truth previous token (teacher forcing). Teacher forcing is standard because:

- It provides a stronger training signal (the decoder always sees correct history).
- It avoids compounding errors where one wrong prediction derails the entire output.
- It allows parallel computation of all decoder steps (since all ground-truth inputs are known).

However, teacher forcing creates a train-test mismatch: during inference, the model must use its own predictions, which it has never seen during training. This is called **exposure bias**. Scheduled sampling (Bengio et al., 2015) addresses this by gradually replacing ground-truth inputs with model predictions during training, with a curriculum that increases the model-prediction ratio over time.

### Beam Search Decoding

At inference time, greedily choosing the most probable token at each step often produces suboptimal sequences. Beam search maintains the top-k (beam width) partial hypotheses at each step:

1. Start with the start-of-sequence token.
2. At each step, expand each of the k hypotheses by all vocabulary words.
3. Keep only the top k hypotheses by cumulative log-probability.
4. Continue until all hypotheses have emitted EOS or reached maximum length.
5. Return the hypothesis with the highest length-normalized score.

Typical beam widths are 4-10 for machine translation. Larger beams (20+) rarely improve quality and increase computation linearly. Wu et al. (2016) at Google used beam width 12 with length and coverage penalties for their production NMT system.

### The Bottleneck Problem

The fundamental weakness of the basic seq2seq architecture is that the entire source sequence must be compressed into a single fixed-size vector c. For a 50-word sentence, the encoder's final hidden state of dimension 1000 must capture all syntactic structure, semantic content, and word-level details -- an enormous compression ratio.

This bottleneck manifests as degraded performance on long sequences. Cho et al. (2014) showed that BLEU scores declined sharply for sentences longer than 20 words. This limitation directly motivated the `attention-mechanism.md`, which allows the decoder to access all encoder hidden states rather than just the final one.

## Why It Matters

1. **Unified framework for structured prediction**: Seq2seq provided a single architecture for machine translation, summarization, dialogue, and any task requiring sequence transduction -- replacing task-specific pipelines with end-to-end learning.
2. **Neural machine translation breakthrough**: Sutskever et al. (2014) achieved a BLEU score of 34.8 on WMT English-to-French, competitive with the best phrase-based statistical MT systems, using a simple LSTM encoder-decoder without any linguistic features.
3. **Foundation for attention and transformers**: The encoder-decoder structure persists in the `attention-mechanism.md` and in transformer architectures like T5 (`t5-and-text-to-text.md`). The bottleneck problem motivated attention, which in turn led to the Transformer.
4. **Enabled end-to-end speech recognition**: Listen, Attend and Spell (Chan et al., 2016) applied seq2seq with attention to speech, replacing the traditional HMM-DNN pipeline.
5. **Teacher forcing became standard practice**: The training technique introduced for seq2seq models is now used in virtually all autoregressive generation models, including GPT (`gpt-for-nlp-tasks.md`).

## Key Technical Details

- **Sutskever et al. (2014) architecture**: 4-layer LSTM, 1000 hidden units, 1000-dimensional word embeddings, 160K source vocabulary, 80K target vocabulary, 384M parameters total. Trained on 12M sentence pairs (WMT English-French) using 8 GPUs for 10 days.
- **Input reversal trick**: Reversing the source sequence improved BLEU from 30.6 to 33.3 (+2.7 points) on English-to-French, likely because it shortens the average gradient path between corresponding input-output pairs.
- **BLEU scores (pre-attention)**: Sutskever et al. achieved 34.8 BLEU (with ensembles of 5 models and beam search) on WMT'14 En-Fr, competitive with the best statistical MT system (37.0 BLEU).
- **Beam search width**: Widths of 2-10 are standard; beyond 10, gains are marginal. Length normalization (dividing log-probability by sequence length raised to a power alpha, typically 0.6-0.7) is essential to avoid favoring short outputs.
- **Vocabulary size**: A key limitation of early seq2seq models -- large vocabularies (50K-100K) were computationally expensive at the softmax. This motivated subword tokenization methods like BPE (`tokenization-in-nlp.md`).
- **Sequence length degradation**: Performance drops significantly for source sentences beyond 20-30 tokens in the basic encoder-decoder without attention.

## Common Misconceptions

- **"The context vector captures all the information in the source sequence."** For short sequences (under 15 tokens), this is roughly true. For longer sequences, critical information is inevitably lost. Cho et al. (2014) demonstrated systematic degradation on longer inputs, which is precisely why `attention-mechanism.md` was invented -- to bypass this bottleneck entirely.

- **"Teacher forcing is cheating."** Teacher forcing is not cheating -- it is an efficient training strategy that provides the model with the correct conditioning context. The exposure bias it introduces is a real issue, but in practice, beam search at inference time and techniques like scheduled sampling effectively mitigate it. Nearly all autoregressive models use teacher forcing.

- **"Seq2seq models are obsolete."** The encoder-decoder architecture is alive and well in Transformer-based models. T5, BART, and mBART are all seq2seq models -- they simply replace the LSTM encoder and decoder with Transformer blocks. The paradigm endures; only the recurrent implementation is less common.

- **"Beam search always finds the best output."** Beam search is an approximate search algorithm. With beam width k, it explores only a tiny fraction of the exponentially large output space (V^T for vocabulary V and length T). It can and does miss better hypotheses. Exact search is intractable for any practical vocabulary size.

## Connections to Other Concepts

- `recurrent-neural-networks.md`: The encoder and decoder are both RNNs; the seq2seq framework is the primary application of RNNs to transduction tasks.
- `long-short-term-memory.md`: Stacked LSTMs are the standard RNN cell used in seq2seq encoders and decoders.
- `gated-recurrent-units.md`: Cho et al. (2014) used GRUs in their original encoder-decoder paper.
- `bidirectional-rnns.md`: Bidirectional encoders are standard in seq2seq because they capture full source context.
- `attention-mechanism.md`: Introduced to solve the fixed-size context vector bottleneck, attention augments the seq2seq framework by letting the decoder query all encoder states.
- `machine-translation.md`: Seq2seq was the architecture that launched neural machine translation, replacing phrase-based statistical MT.
- `text-summarization.md`: Abstractive summarization is a seq2seq task -- encode the document, decode a summary.
- `t5-and-text-to-text.md`: T5 is a modern seq2seq model using transformers, treating every NLP task as text-to-text.

## Further Reading

- Sutskever et al., "Sequence to Sequence Learning with Neural Networks" (2014) -- The landmark paper demonstrating that LSTM encoder-decoders can achieve competitive machine translation without any linguistic features.
- Cho et al., "Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation" (2014) -- Introduced the encoder-decoder framework and GRU simultaneously.
- Bahdanau et al., "Neural Machine Translation by Jointly Learning to Align and Translate" (2014) -- Added attention to the seq2seq framework, solving the bottleneck problem.
- Bengio et al., "Scheduled Sampling for Sequence Prediction with Recurrent Neural Networks" (2015) -- Proposed curriculum learning to address exposure bias from teacher forcing.
- Wu et al., "Google's Neural Machine Translation System" (2016) -- The production-scale GNMT system with 8-layer LSTM encoder-decoder, attention, beam search refinements, and wordpiece tokenization.
