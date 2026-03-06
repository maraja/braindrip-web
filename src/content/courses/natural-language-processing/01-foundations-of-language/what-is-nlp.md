# What Is NLP

**One-Line Summary**: Natural Language Processing is the interdisciplinary field at the intersection of linguistics, computer science, and artificial intelligence that enables machines to understand, generate, and reason about human language.

**Prerequisites**: None -- this is the entry point for the collection.

## What Is NLP?

Imagine teaching a Martian to understand English. You would not just hand them a dictionary -- you would need to explain grammar, context, sarcasm, cultural references, ambiguity, and the unspoken rules that native speakers absorb over a lifetime. NLP is the engineering discipline that attempts exactly this: giving machines the ability to work with human language in all its messy, context-dependent, ambiguous glory.

More formally, NLP encompasses any computational technique that takes natural language as input, produces natural language as output, or both. This spans a vast range: from a simple regular expression that extracts email addresses to a billion-parameter transformer that writes coherent essays. The field draws on formal linguistics (how language is structured), machine learning (how to learn patterns from data), and cognitive science (how humans process language).

NLP is conventionally divided into two complementary directions. **Natural Language Understanding (NLU)** maps language to structured representations -- converting "Book me a flight to Tokyo next Tuesday" into an intent (book_flight) with slots (destination=Tokyo, date=next_Tuesday). **Natural Language Generation (NLG)** goes the other way, producing fluent language from data or representations -- turning a weather database row into "Expect rain in London tomorrow." Modern systems increasingly blur this boundary, with models like GPT and T5 performing both understanding and generation within a single architecture.

## How It Works

### The Four Paradigm Shifts

NLP's history is a story of four major paradigm shifts, each expanding what machines can do with language.

**1. Rule-Based Systems (1950s--1980s)**

The earliest NLP systems relied on hand-crafted rules. Georgetown-IBM's 1954 experiment translated 60 Russian sentences into English using a 250-word vocabulary and six grammar rules. ELIZA (Weizenbaum, 1966) simulated a Rogerian therapist with simple pattern-matching rules. SHRDLU (Winograd, 1972) understood commands about a block world using a hand-built grammar and semantic interpreter. These systems were brittle: they worked in narrow domains but collapsed when confronted with the open-ended variability of real language.

**2. Statistical NLP (1990s--2010s)**

The IBM statistical machine translation group demonstrated that large parallel corpora and probabilistic models could outperform rule-based systems. Frederick Jelinek's famous quip -- "Every time I fire a linguist, the performance of the speech recognizer goes up" -- captured the shift. Key techniques included Hidden Markov Models for part-of-speech tagging, probabilistic context-free grammars for parsing, and n-gram language models. These methods required significant feature engineering but scaled better than rules.

**3. Neural NLP (2013--2018)**

Word2Vec (Mikolov et al., 2013) showed that neural networks could learn dense vector representations of words capturing semantic relationships. Sequence-to-sequence models with attention (Bahdanau et al., 2014) revolutionized machine translation. Recurrent networks (LSTMs, GRUs) became the workhorse architecture. The key shift: instead of designing features by hand, neural models learned representations directly from data.

**4. Pre-trained Models (2018--present)**

ELMo (Peters et al., 2018) introduced contextualized word representations. BERT (Devlin et al., 2018) demonstrated that pre-training a transformer on massive text corpora followed by task-specific fine-tuning could achieve state-of-the-art results on virtually every NLP benchmark. GPT-3 (Brown et al., 2020) showed that sufficiently large autoregressive models could perform tasks zero-shot via prompting alone. This "pre-train then adapt" paradigm now dominates the field.

### Pipeline vs. End-to-End

Traditional NLP used a **pipeline architecture**: raw text flows through tokenization, POS tagging, parsing, named entity recognition, and finally a task-specific module. Each stage hands structured output to the next. This is modular and interpretable but suffers from error propagation -- a mistake in tokenization cascades through every downstream stage.

Modern systems increasingly adopt **end-to-end learning**: a single model takes raw text as input and produces the desired output directly. A transformer fine-tuned for question answering takes a passage and question as input and outputs an answer span -- no explicit parsing, no hand-designed pipeline. The trade-off is reduced interpretability and a heavier dependence on large training datasets.

### Subfields at a Glance

- **Computational Linguistics**: The scientific study of language using computational methods (corpus linguistics, formal grammars, linguistic annotation).
- **NLU**: Mapping language to meaning -- classification, extraction, inference.
- **NLG**: Producing fluent language -- summarization, translation, dialogue.
- **Speech Processing**: Spoken language -- ASR, TTS, spoken dialogue systems (see `automatic-speech-recognition.md`).
- **Multimodal NLP**: Combining language with vision, audio, or other modalities (see `multimodal-nlp.md`).

## Why It Matters

1. **Scale of language data**: Over 90% of the world's data is unstructured, and the majority is text. NLP is the key to unlocking this information at scale.
2. **Human-computer interaction**: Voice assistants, chatbots, and conversational search all depend on NLP to bridge the gap between human communication and machine computation.
3. **Global communication**: Machine translation makes information accessible across the world's approximately 7,000 languages, though coverage remains heavily skewed toward high-resource languages.
4. **Healthcare and science**: NLP extracts findings from the 1.5 million+ biomedical articles published annually, powers clinical decision support, and accelerates drug discovery through literature mining.
5. **Economic impact**: The NLP market was valued at approximately $29 billion in 2024 and is projected to exceed $150 billion by 2030, driven by enterprise search, content generation, and conversational AI.

## Key Technical Details

- Alan Turing's 1950 paper "Computing Machinery and Intelligence" proposed natural language dialogue as the test for machine intelligence -- the Turing Test.
- The Penn Treebank (Marcus et al., 1993), containing approximately 4.5 million words of annotated Wall Street Journal text, was the de facto benchmark for two decades of parsing research.
- BERT-base has 110 million parameters and was pre-trained on 3.3 billion words (BooksCorpus + English Wikipedia). It raised SQuAD 2.0 F1 from approximately 66% to 83% upon release.
- GPT-3 (175 billion parameters) demonstrated that in-context learning with just a few examples could rival fine-tuned models on many benchmarks without any gradient updates.
- Modern LLMs (GPT-4, Claude, Gemini) operate at hundreds of billions to trillions of parameters and handle multilingual, multimodal inputs -- see the sibling LLM Concepts collection for detailed architecture coverage.

## Common Misconceptions

**"NLP and NLU are the same thing."**
NLU is a subfield of NLP focused specifically on understanding -- mapping language to structured representations. NLP is the broader umbrella that also includes generation, speech processing, and information retrieval.

**"Modern LLMs have solved NLP."**
Large language models have dramatically advanced the state of the art, but many challenges remain: robust reasoning, factual consistency, low-resource languages, domain-specific accuracy, computational cost, and genuine language understanding vs. sophisticated pattern matching. NLP is far from "solved."

**"NLP started with deep learning."**
The field dates to the 1950s. Decades of work in formal linguistics, information retrieval, and statistical methods laid the foundation for today's neural approaches. Many production systems still rely on classical techniques (regex, TF-IDF, rule-based extraction) for speed, interpretability, or simplicity.

**"More data always leads to better NLP."**
Data quality, diversity, and representativeness matter as much as quantity. Models trained on massive but biased corpora inherit and amplify those biases (see `bias-in-nlp.md`). Careful data curation often outperforms brute-force scaling.

## Connections to Other Concepts

- Start with `levels-of-linguistic-analysis.md` for the linguistic hierarchy that NLP systems must capture.
- `ambiguity-in-language.md` explains why NLP is fundamentally hard.
- `text-as-data.md` covers how raw language is transformed into computable representations.
- `tokenization-in-nlp.md` is typically the first step in any NLP pipeline.
- `bag-of-words.md` and `word2vec.md` introduce classical and neural text representations.
- `recurrent-neural-networks.md` and `attention-mechanism.md` cover the architectures that led to transformers.
- `bert.md` and `gpt-for-nlp-tasks.md` detail the pre-trained models driving the current paradigm.
- `transfer-learning-in-nlp.md` explains the pre-train-then-adapt framework.
- The sibling **LLM Concepts** collection covers transformer architecture, scaling laws, and RLHF in depth.

## Further Reading

- Turing, A.M., "Computing Machinery and Intelligence," 1950 -- The foundational paper proposing the imitation game as a test for machine intelligence.
- Jurafsky, D. and Martin, J.H., *Speech and Language Processing*, 3rd edition (draft), 2024 -- The definitive NLP textbook, freely available online, covering classical and neural methods.
- Manning, C.D. and Schutze, H., *Foundations of Statistical Natural Language Processing*, 1999 -- The classic reference for statistical NLP methods that remain relevant today.
- Devlin, J. et al., "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding," 2018 -- The paper that launched the pre-training revolution in NLP.
- Brown, T. et al., "Language Models are Few-Shot Learners," 2020 -- GPT-3 and the demonstration that scale enables in-context learning.
- Weizenbaum, J., "ELIZA -- A Computer Program for the Study of Natural Language Communication," 1966 -- The first chatbot, illustrating both the promise and the limits of pattern matching.
