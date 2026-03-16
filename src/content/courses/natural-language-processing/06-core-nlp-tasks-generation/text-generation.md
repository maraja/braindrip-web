# Text Generation

**One-Line Summary**: Producing fluent, coherent text from a language model using decoding strategies that balance quality, diversity, and controllability.

**Prerequisites**: `n-gram-language-models.md`, `recurrent-neural-networks.md`, `attention-mechanism.md`, `gpt-for-nlp-tasks.md`

## What Is Text Generation?

Imagine an improvising jazz musician. Given an opening phrase (a prompt), they must decide which note to play next -- and then the next, and the next. They could always pick the single "safest" note (greedy decoding), plan several bars ahead and choose the best overall sequence (beam search), or introduce controlled randomness for creative variation (sampling). The quality of the performance depends as much on the selection strategy as on the musician's skill.

Text generation is the task of producing natural language text, typically one token at a time, from a language model. The model assigns probabilities to the next token given the preceding context, and the decoding strategy determines how those probabilities are converted into actual output. Text generation underpins machine translation, summarization, dialogue, story writing, code generation, and virtually every application of modern large language models.

## How It Works

### Language Model Decoding Strategies

Given a language model that produces P(x_t | x_{<t}) at each step, the decoding strategy selects which token to emit.

**Greedy Decoding**: Always pick the highest-probability token: x_t = argmax P(x_t | x_{<t}). Fast and deterministic, but often produces repetitive, degenerate text because it never explores alternative continuations.

**Beam Search**: Maintain the top-k (beam width, typically 4--10) partial sequences at each step. At each position, expand all beams, score them, and keep the top-k. Beam search finds higher-probability sequences than greedy decoding but still tends toward generic, repetitive output. Adding a length penalty and n-gram blocking (preventing repeated trigrams) partially mitigates this.

**Pure Sampling**: Draw x_t ~ P(x_t | x_{<t}). This introduces diversity but can produce incoherent text when low-probability tokens are sampled. A temperature parameter T scales the logits before softmax:

```
P(x_t | x_{<t}) = softmax(z_t / T)
```

T < 1 sharpens the distribution (more deterministic); T > 1 flattens it (more random). T = 0 recovers greedy decoding.

**Top-k Sampling** (Fan et al., 2018): Restrict sampling to the k most probable tokens, redistributing probability mass among them. Typical values: k = 40--100. This prevents sampling extremely unlikely tokens while maintaining diversity.

**Top-p / Nucleus Sampling** (Holtzman et al., 2020): Instead of a fixed k, dynamically choose the smallest set of tokens whose cumulative probability exceeds p (typically p = 0.9--0.95). This adapts the candidate set size to the model's confidence: fewer candidates when the model is certain, more when it is uncertain. Nucleus sampling has become the de facto standard for open-ended generation.

### Controllable Generation

Controlling attributes like topic, style, toxicity, or formality without retraining the entire model:

**CTRL** (Keskar et al., 2019): A 1.63B-parameter model trained with control codes (e.g., "Wikipedia", "Reviews", "Horror") prepended to training examples. At generation time, the control code steers the style and content.

**PPLM (Plug and Play Language Models)** (Dathathri et al., 2020): Uses a small attribute classifier on top of a frozen GPT-2. During generation, gradients from the classifier update the hidden states (not the weights) to steer output toward desired attributes, achieving control over sentiment, topic, and toxicity without retraining.

**Instruction Tuning and RLHF**: Modern LLMs (InstructGPT, ChatGPT, Claude) achieve controllability through instruction-following fine-tuning and reinforcement learning from human feedback, enabling users to specify style, format, and constraints via natural language prompts.

### Evaluation Challenges

Text generation is notoriously hard to evaluate automatically because there is no single correct output:

- **Perplexity**: Measures how well the model predicts held-out text. Lower is better, but low perplexity does not guarantee good generation quality.
- **BLEU / ROUGE**: Measure overlap with references but penalize valid, creative alternatives.
- **Human evaluation**: Ratings of fluency, coherence, relevance, and creativity remain the gold standard but are expensive and hard to reproduce.
- **MAUVE** (Pillutla et al., 2021): Measures the gap between the distribution of generated text and human text, combining quality and diversity in a single score.

## Why It Matters

1. **Foundation of modern AI assistants**: ChatGPT, Claude, Gemini, and similar systems are fundamentally text generation engines that respond to user prompts.
2. **Creative applications**: Story generation, poetry, screenwriting assistance, and game dialogue all depend on open-ended text generation.
3. **Code generation**: Tools like GitHub Copilot and Cursor use text generation to produce code from natural language descriptions or partial programs.
4. **Scientific writing**: LLM-based generation assists researchers in drafting, editing, and summarizing scientific text.
5. **Accessibility**: Text generation powers tools that help people with disabilities communicate, write, and interact with technology.

## Key Technical Details

- Nucleus sampling (p = 0.9) produces significantly more diverse and human-like text than beam search for open-ended tasks, as shown by Holtzman et al. (2020).
- Repetition penalties (dividing logit scores of previously generated tokens by a factor of 1.0--1.5) are widely used to prevent degenerate repetition loops.
- Typical token generation speeds for modern LLMs range from 30--100 tokens/second on consumer GPUs to 200+ tokens/second on specialized inference hardware.
- Speculative decoding (Leviathan et al., 2023) uses a smaller draft model to propose tokens that the larger model verifies in parallel, achieving 2--3x speedups without quality loss.
- KV-cache optimization is critical for efficient autoregressive generation, storing key-value pairs from previous positions to avoid recomputation.
- Watermarking techniques (Kirchenbauer et al., 2023) embed detectable statistical signatures in generated text to distinguish machine-generated from human-written text.

## Common Misconceptions

- **"Beam search produces the best text."** Beam search maximizes sequence probability, but the highest-probability sequence is often generic and repetitive ("I don't know. I don't know. I don't know."). Human language is not maximum-likelihood -- it is diverse and surprising. For open-ended generation, sampling strategies consistently produce more natural text.

- **"Higher temperature always means more creative output."** Very high temperatures (T > 1.5) produce incoherent, random text. Creativity in generation comes from the interaction between the model's learned knowledge and moderate randomness (T ~ 0.7--1.0), not from pure noise.

- **"Text generation is just next-token prediction."** While the mechanism is next-token prediction, the emergent behavior -- coherent multi-paragraph arguments, consistent character voices, logical reasoning -- involves implicit planning and knowledge that goes far beyond local token statistics.

- **"Perplexity is a sufficient metric for generation quality."** A model with low perplexity on held-out data may still generate repetitive, boring, or factually incorrect text. Perplexity measures prediction quality on human text, not the quality of the model's own generated text.

## Connections to Other Concepts

- `n-gram-language-models.md`: N-gram models were the first language models used for text generation, and the core next-token prediction paradigm remains unchanged.
- `gpt-for-nlp-tasks.md`: GPT models are autoregressive generators, and the GPT architecture is the basis for most modern text generation systems.
- `machine-translation.md`: MT was an early application of neural text generation and drove many decoding innovations (beam search, length penalty).
- `text-summarization.md`: Abstractive summarization is text generation constrained by a source document.
- `dialogue-systems.md`: Open-domain dialogue is conversational text generation with additional requirements for consistency and turn-taking.
- `prompt-based-nlp.md`: Prompt engineering directly controls text generation behavior in modern LLMs.

## Further Reading

- Holtzman et al., "The Curious Case of Neural Text Degeneration" (2020) -- Identified the degeneration problem in maximization-based decoding and proposed nucleus sampling.
- Fan et al., "Hierarchical Neural Story Generation" (2018) -- Introduced top-k sampling for creative text generation.
- Keskar et al., "CTRL: A Conditional Transformer Language Model for Controllable Generation" (2019) -- Control codes enabling style and content steering.
- Dathathri et al., "Plug and Play Language Models" (2020) -- Gradient-based attribute control without retraining.
- Pillutla et al., "MAUVE: Measuring the Gap Between Neural Text and Human Text" (2021) -- A principled metric for evaluating open-ended generation.
- Kirchenbauer et al., "A Watermark for Large Language Models" (2023) -- Statistical watermarking for detecting machine-generated text.
