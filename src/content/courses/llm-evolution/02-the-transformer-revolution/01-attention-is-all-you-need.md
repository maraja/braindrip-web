# Attention Is All You Need

**One-Line Summary**: Vaswani et al. (2017) introduced the Transformer — a fully parallel architecture based entirely on self-attention that eliminated recurrence, achieved 28.4 BLEU on English-German translation in 3.5 days on 8 GPUs, and became the foundational architecture for every major language model that followed.

**Prerequisites**: `04-attention-mechanism-origins.md`, `07-the-bottlenecks-that-motivated-transformers.md`, `03-sequence-to-sequence-models.md`

## What Is the Transformer?

Imagine a room full of people having a conversation. In the RNN world, each person can only whisper to the person next to them, and messages degrade as they pass down the line. In the Transformer world, every person can directly talk to every other person simultaneously. Each person decides who to listen to most carefully based on what they need to know at that moment. The result is faster, richer, and more accurate communication.

The Transformer was born at Google in 2017, the product of a team split between Google Brain and Google Research. The paper "Attention Is All You Need" made a radical claim in its very title: you don't need recurrence, you don't need convolutions — attention alone is sufficient to model sequences. This was counterintuitive. Recurrence had been the defining feature of sequence models for decades. The sequential processing of RNNs felt natural for language, which humans process left to right (or right to left). Abandoning it seemed like abandoning the inductive bias that made sequence modeling work.

But the bottlenecks were real (`07-the-bottlenecks-that-motivated-transformers.md`). RNNs couldn't parallelize, their gradients vanished over long distances, and they compressed information through fixed-length states. The Transformer addressed all three by replacing recurrence with self-attention — every position in the sequence directly attending to every other position, all at once. The paper's 8 authors (Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin) listed themselves as "equal contributors," a rare acknowledgment of truly collaborative innovation.

## How It Works

![The Transformer architecture diagram showing encoder and decoder stacks with multi-head attention, feed-forward layers, and residual connections](https://jalammar.github.io/images/t/transformer_architecture.png)
*Figure: The original Transformer architecture from Vaswani et al. (2017). The encoder (left) and decoder (right) each consist of stacked layers with multi-head attention, feed-forward networks, and residual connections. (Source: Jay Alammar, "The Illustrated Transformer")*

```
  Scaled Dot-Product Attention

  Input tokens:  [The] [cat] [sat] [on] [the] [mat]
                   │     │     │    │     │     │
                   ▼     ▼     ▼    ▼     ▼     ▼
              ┌─── Q ────┐  ┌─ K ─┐  ┌─ V ─┐
              │  (Query)  │  │(Key)│  │(Val)│
              └─────┬─────┘  └──┬──┘  └──┬──┘
                    │           │        │
                    ▼           ▼        │
              ┌──────────────────┐       │
              │  QK^T / √d_k    │       │    Score every pair
              │  (attention      │       │
              │   scores)        │       │
              └────────┬─────────┘       │
                       ▼                 │
              ┌──────────────┐           │
              │   softmax    │           │
              └────────┬─────┘           │
                       ▼                 ▼
              ┌──────────────────────────────┐
              │  Weighted sum of Values       │
              │  Attention(Q,K,V) = softmax   │
              │    (QK^T/√d_k) · V           │
              └──────────────────────────────┘
```
*Figure: Scaled dot-product attention computes relevance scores between all pairs of positions, then uses those scores to produce a weighted combination of values.*

### Self-Attention: The Core Mechanism

The Transformer's fundamental operation is **scaled dot-product attention**: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V. Each position in the sequence produces three vectors — Query (what am I looking for?), Key (what do I contain?), and Value (what do I provide?) — by multiplying the input by three learned weight matrices. The dot product of Query with all Keys gives attention scores; softmax normalizes them; the scores weight the Values to produce the output.

The scaling factor 1/sqrt(d_k) prevents the dot products from growing too large as dimensionality increases, which would push the softmax into regions with tiny gradients. This detail, building on insights from Luong attention (`04-attention-mechanism-origins.md`), was essential for stable training.

### Multi-Head Attention

Rather than computing a single attention function, the Transformer uses **multi-head attention**: it runs h parallel attention operations (h=8 in the base model), each with its own learned Q, K, V projections of dimension d_k = d_model/h = 64. The outputs are concatenated and linearly projected. Different heads can attend to different positions and learn different types of relationships — one head might capture syntactic dependencies, another semantic similarity, another positional patterns.

### The Encoder-Decoder Architecture

The Transformer retained the encoder-decoder structure from `03-sequence-to-sequence-models.md` but rebuilt it entirely with attention:

**Encoder** (6 identical layers): Each layer has two sub-layers: (1) multi-head self-attention, where every position attends to every other position in the input, and (2) a position-wise feed-forward network (two linear transformations with ReLU: FFN(x) = max(0, xW_1 + b_1)W_2 + b_2, with inner dimension 2048). Residual connections and layer normalization surround each sub-layer.

**Decoder** (6 identical layers): Each layer has three sub-layers: (1) masked multi-head self-attention (masks future positions to preserve autoregressive property), (2) multi-head cross-attention over the encoder output, and (3) a position-wise feed-forward network. The masking ensures that the prediction for position i can only depend on positions less than i.

### Positional Encoding

Without recurrence, the model has no inherent notion of position — it processes all tokens as a set, not a sequence. The solution was to add **positional encodings** to the input embeddings using sinusoidal functions: PE(pos, 2i) = sin(pos / 10000^(2i/d_model)), PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model)). Different dimensions oscillate at different frequencies, creating a unique positional signature for each position. The authors hypothesized (and later work confirmed) that this allows the model to learn relative positions because PE(pos+k) can be expressed as a linear function of PE(pos).

### Training and Results

The base model (65M parameters, d_model=512) was trained on the WMT 2014 English-German dataset (4.5M sentence pairs). The big model (213M parameters, d_model=1024) achieved **28.4 BLEU on EN-DE** and **41.8 BLEU on EN-FR** — surpassing all previous models including ensembles. Training the big model took **3.5 days on 8 P100 GPUs**, compared to weeks for comparable LSTM systems. The model used Adam optimizer with a custom learning rate schedule (warm-up then decay), label smoothing of 0.1, and dropout of 0.1-0.3.

## Why It Matters

### The Foundation of Modern AI

Every major language model since 2017 — GPT-1, BERT, GPT-2, GPT-3, T5, PaLM, LLaMA, Claude — is built on the Transformer architecture. It enabled the scaling revolution: because computation could be parallelized, models could be made dramatically larger and trained on dramatically more data. The Transformer didn't just improve NLP — it became the universal architecture for sequence modeling, adopted for vision (ViT), audio, protein structures (AlphaFold 2), robotics, and more.

### Proving Parallelism Could Replace Recurrence

The Transformer demonstrated that the inductive bias of sequential processing was unnecessary. Self-attention with positional encoding could learn sequential patterns just as well — and the massive parallelism enabled by removing recurrence meant the model could be trained on orders of magnitude more data. This insight — that scale and data can substitute for architectural inductive biases — became a central principle of the scaling era.

### The "Attention Is All You Need" Ethos

The paper's title captured a broader philosophy: simplicity and generality over task-specific engineering. One general mechanism (attention), applied uniformly, outperformed years of specialized architecture design. This ethos — build a simple, general system and scale it — defined the subsequent history of LLMs from `02-gpt-1.md` through GPT-4 and beyond.

## Key Technical Details

- **Paper**: Vaswani et al., "Attention Is All You Need" (Jun 2017, arXiv:1706.03762, NeurIPS 2017)
- **Authors**: 8 researchers at Google Brain / Google Research, all listed as equal contributors
- **Base model**: 6 layers, 8 heads, d_model=512, 65M parameters
- **Big model**: 6 layers, 16 heads, d_model=1024, 213M parameters
- **EN-DE BLEU**: 28.4 (big model), +2.0 over previous SOTA
- **EN-FR BLEU**: 41.8 (big model), outperforming all ensembles at 1/4 the training cost
- **Training**: 3.5 days on 8 P100 GPUs (big model); 12 hours for base model
- **Self-attention complexity**: O(n^2 * d) per layer, where n is sequence length and d is model dimension
- **Citations**: Over 130,000 as of 2025 — one of the most cited papers in all of computer science

## Common Misconceptions

- **"The Transformer was a completely novel invention."** Self-attention existed before (Parikh et al., 2016; Lin et al., 2017). Residual connections came from ResNet (He et al., 2015). Layer normalization from Ba et al. (2016). The Transformer's innovation was the specific combination and the insight that these components together could fully replace recurrence.

- **"Transformers can handle sequences of any length."** Self-attention has O(n^2) memory and compute complexity. The original Transformer was limited to sequences of 512-1024 tokens. Extending context length has been a major research direction, with solutions like FlashAttention, sparse attention, and RoPE-based extrapolation — see `llm-concepts/context-windows-and-attention.md`.

- **"All Transformers use encoder-decoder architecture."** The original Transformer was encoder-decoder, but the most successful LLMs use decoder-only (`02-gpt-1.md`, `04-gpt-2.md`) or encoder-only (`03-bert.md`) variants. See `07-encoder-vs-decoder-vs-encoder-decoder.md` for the full comparison.

- **"Positional encodings are a solved problem."** Sinusoidal positional encodings were the original approach, but they have been largely superseded by learned positional embeddings, relative positional encodings (Shaw et al., 2018), ALiBi (Press et al., 2021), and Rotary Position Embeddings (RoPE, Su et al., 2021). Position representation remains an active research area.

## Connections to Other Concepts

- Directly addressed the bottlenecks cataloged in `07-the-bottlenecks-that-motivated-transformers.md`
- Scaled dot-product attention descended from `04-attention-mechanism-origins.md`
- Replaced the recurrent architectures of `02-recurrent-neural-networks-and-lstms.md`
- The decoder-only variant became `02-gpt-1.md`; the encoder-only variant became `03-bert.md`; encoder-decoder was refined in `05-t5-text-to-text-framework.md`
- The architecture comparison is detailed in `07-encoder-vs-decoder-vs-encoder-decoder.md`
- For deep technical coverage of attention mechanisms, see `llm-concepts/attention-mechanisms.md`
- For positional encoding variants, see `llm-concepts/positional-encodings.md`

## Further Reading

- Vaswani et al., "Attention Is All You Need" (2017, arXiv:1706.03762) — the original Transformer paper
- The Illustrated Transformer by Jay Alammar (2018, blog) — the most accessible visual explanation
- Phuong & Hutter, "Formal Algorithms for Transformers" (2022, arXiv:2207.09238) — mathematically rigorous treatment
- Dosovitskiy et al., "An Image is Worth 16x16 Words" (2020, arXiv:2010.11929) — Transformers applied to vision (ViT)
- Tay et al., "Efficient Transformers: A Survey" (2020, arXiv:2009.06732) — survey of approaches to address the O(n^2) complexity
