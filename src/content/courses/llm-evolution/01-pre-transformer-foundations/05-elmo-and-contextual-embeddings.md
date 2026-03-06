# ELMo and Contextual Embeddings

**One-Line Summary**: ELMo (Peters et al., 2018) demonstrated that deep bidirectional LSTMs pre-trained on language modeling could generate context-dependent word representations, breaking the static embedding paradigm and pioneering the pre-train-then-fine-tune approach.

**Prerequisites**: `01-word-embeddings-word2vec-and-glove.md`, `02-recurrent-neural-networks-and-lstms.md`

## What Is ELMo?

Imagine you look up the word "bank" in a dictionary. You'll find multiple definitions: a financial institution, the side of a river, a pool shot. A static word embedding gives you one vector for "bank" — an average that doesn't capture any particular meaning well. Now imagine a reader who, upon encountering "bank" in a sentence, instantly knows which meaning is intended based on the surrounding words. ELMo is that reader: it produces a different vector for "bank" in "I deposited money at the bank" than in "the river bank was covered in wildflowers."

Before ELMo, the standard approach was to use frozen, pre-trained word embeddings (Word2Vec, GloVe) as input features. These embeddings were context-independent — the same vector regardless of surrounding text. Researchers at the Allen Institute for Artificial Intelligence (AI2) recognized that the internal representations of a pre-trained language model naturally capture context. If you train a deep LSTM to predict the next word, its hidden states at each position must encode information about what word makes sense in that context — and that information is inherently contextual.

The key insight was deceptively simple: rather than just using a language model to generate text, use its internal states as features for downstream tasks. ELMo — Embeddings from Language Models — did exactly this, and the results were transformative. Six NLP tasks saw significant improvements simply by replacing static embeddings with ELMo vectors. The era of contextual representations had begun.

## How It Works

```
  Static vs. Contextual Embeddings

  Static (Word2Vec/GloVe):
  "bank" ──▶ [0.3, 0.7, 0.1, ...]   ← Same vector always

  Contextual (ELMo):
  "I went to the bank to deposit money" ──▶ bank = [0.8, 0.2, 0.4, ...]  (financial)
  "The river bank was flooded"          ──▶ bank = [0.1, 0.9, 0.3, ...]  (geographic)

  ELMo Architecture: Bidirectional LSTM Language Model

  Forward  LM:   The ──▶ cat ──▶ sat ──▶ on ──▶ the ──▶ mat ──▶
  Backward LM:   ◀── The ◀── cat ◀── sat ◀── on ◀── the ◀── mat

  Layer 0 (char CNN):  [context-free]     ─┐
  Layer 1 (biLSTM 1):  [syntax-focused]    ├──▶ ELMo = γ · Σ(sⱼ · hⱼ)
  Layer 2 (biLSTM 2):  [semantics-focused] ─┘    (task-specific weighted sum)
```
*Figure: ELMo produces different embeddings for the same word depending on context, using a bidirectional LSTM whose layers specialize in syntax (Layer 1) and semantics (Layer 2).*

### Architecture: Deep Bidirectional Language Model

ELMo uses a two-layer bidirectional LSTM trained as a language model. The forward LSTM predicts the next token given the left context; the backward LSTM predicts the previous token given the right context. Critically, both directions are trained independently — they don't see each other's predictions. This is different from a single bidirectional LSTM; it's two separate language models running in opposite directions.

The model has three layers of representation for each token:
1. **Layer 0**: A context-independent character-level CNN embedding (2048 character n-gram filters, followed by two highway layers). This handles out-of-vocabulary words and morphology.
2. **Layer 1**: The first biLSTM layer's hidden states. Research showed this layer primarily captures syntax — part-of-speech tagging, syntactic dependencies.
3. **Layer 2**: The second biLSTM layer's hidden states. This layer captures semantics — word sense disambiguation, sentiment, semantic roles.

### The Linear Combination Trick

ELMo's representation for each token is a **task-specific learned linear combination** of all three layers: ELMo_k = gamma * sum(s_j * h_j), where s_j are softmax-normalized layer weights learned during fine-tuning, and gamma is a task-specific scaling factor. Different tasks learn different weightings — syntactic tasks weight Layer 1 more heavily, semantic tasks weight Layer 2. This simple mechanism allowed a single pre-trained model to adapt to diverse downstream tasks.

### Pre-training Details

The model was pre-trained on the 1 Billion Word Benchmark (approximately 800M tokens of news text). Each LSTM layer had 4096 hidden units projected down to 512 dimensions. The total model had approximately 93.6 million parameters. Pre-training took about 2 weeks on 3 GPUs. The perplexity achieved was 39.7, state-of-the-art for single-model language models at the time.

### Integration with Downstream Tasks

Using ELMo was straightforward: compute ELMo vectors for each token in the input, concatenate them with existing task-specific embeddings (usually GloVe), and feed the combined representation into the task-specific model. No architectural changes were needed to the downstream model — ELMo was a drop-in replacement/augmentation for static embeddings. This simplicity was key to rapid adoption.

## Why It Matters

### Breaking the Static Embedding Paradigm

ELMo demonstrated that contextual representations were strictly superior to static ones. On the SQuAD question answering benchmark, swapping GloVe for ELMo improved F1 from 81.1 to 85.8. On sentiment analysis (SST-5), accuracy jumped from 51.4 to 54.7. On named entity recognition (CoNLL 2003), F1 went from 90.15 to 92.22. Every task benefited, with an average improvement of 2-3 points — an enormous gain from simply changing the input representation.

### Discovering Layer Specialization

The finding that different layers of a language model encode different types of linguistic information was profound. It suggested that deep language models learn a hierarchy of language structure — from syntax to semantics — analogous to how deep CNNs learn a hierarchy of visual features from edges to objects. This insight directly informed the development of `03-bert.md` and subsequent models.

### Establishing Pre-train Then Fine-tune

While `06-ulmfit-and-transfer-learning.md` (published around the same time) more formally established the transfer learning framework for NLP, ELMo powerfully demonstrated that representations learned from unsupervised language modeling transfer to supervised tasks. The community recognized that training on massive unlabeled text could provide a universal initialization — a paradigm that `02-gpt-1.md` and `03-bert.md` would turbocharge months later.

## Key Technical Details

- **Paper**: Peters et al., "Deep contextualized word representations" (Feb 2018, NAACL 2018, arXiv:1802.05365)
- **Organization**: Allen Institute for AI (AI2), with collaborators from UW
- **Architecture**: 2-layer bidirectional LSTM with character-level CNN input; ~93.6M parameters
- **Pre-training data**: 1 Billion Word Benchmark (~800M tokens of news text)
- **Pre-training time**: ~2 weeks on 3 NVIDIA GTX 1080 GPUs
- **Improvements over baselines**: +4.7 F1 on SQuAD, +3.3% on SST-5, +2.1 F1 on NER, +8.2% on SNLI — gains across all 6 evaluated tasks
- **Layer specialization**: Layer 1 optimal for POS tagging (syntax); Layer 2 optimal for word sense disambiguation (semantics)
- **Context window**: Effectively the entire input sequence (limited by LSTM's practical memory, roughly 200-500 tokens)
- **Citations**: Over 7,000; the paper won the NAACL 2018 Best Paper Award

## Common Misconceptions

- **"ELMo is a transformer-based model."** ELMo uses bidirectional LSTMs, not Transformers. It was published in February 2018, eight months after the Transformer paper, but did not adopt the Transformer architecture. It represents the pinnacle of LSTM-based pre-training.

- **"ELMo generates a single embedding per word."** ELMo generates a different embedding for every occurrence of a word based on its full sentential context. That is its defining innovation over `01-word-embeddings-word2vec-and-glove.md`.

- **"ELMo is truly bidirectional."** ELMo trains two independent unidirectional LSTMs (forward and backward) and concatenates their representations. Neither direction has access to the other's information. This is different from BERT's masked language modeling, which conditions on both left and right context simultaneously. This distinction was a key argument in the `03-bert.md` paper.

- **"ELMo was quickly obsoleted by BERT."** ELMo's influence was enormous despite its short time in the spotlight. The ideas of contextual embeddings, layer specialization, and pre-train-then-fine-tune all flowed directly into BERT's design. ELMo proved the concept; BERT scaled it.

## Connections to Other Concepts

- Extended the word embedding paradigm from `01-word-embeddings-word2vec-and-glove.md` by making representations context-dependent
- Built on deep bidirectional LSTMs from `02-recurrent-neural-networks-and-lstms.md`
- Published contemporaneously with `06-ulmfit-and-transfer-learning.md`; together they established the pre-training paradigm
- Directly inspired `03-bert.md`, which adopted the idea of deep bidirectional pre-training but replaced LSTMs with Transformers and concatenated LMs with masked LMs
- `02-gpt-1.md` took the alternative approach: unidirectional pre-training with a Transformer decoder
- See `llm-concepts/embeddings-and-tokenization.md` for how modern models handle contextual representations

## Further Reading

- Peters et al., "Deep contextualized word representations" (2018, arXiv:1802.05365) — the original ELMo paper
- Peters et al., "Dissecting Contextual Word Embeddings: Architecture and Representation" (2018, arXiv:1808.08949) — deeper analysis of what ELMo layers learn
- Ethayarajh, "How Contextual are Contextualized Word Representations?" (2019, arXiv:1909.00512) — measured the degree of contextualization across ELMo, BERT, and GPT-2
- McCann et al., "Learned in Translation: Contextualized Word Vectors" (2017, arXiv:1708.00107) — CoVe, a predecessor using encoder representations from MT
