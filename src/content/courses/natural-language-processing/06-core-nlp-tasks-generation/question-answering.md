# Question Answering

**One-Line Summary**: Systems that find or generate answers to natural language questions from given context, retrieved documents, or parametric knowledge.

**Prerequisites**: `text-classification.md`, `attention-mechanism.md`, `contextual-embeddings.md`, `information-retrieval.md`

## What Is Question Answering?

Think of a reference librarian. When you ask a question, the librarian might flip to the right page in an encyclopedia and point to the exact sentence containing the answer (extractive QA). Or the librarian might read several sources, synthesize the information, and explain the answer in their own words (abstractive QA). Or, for a complex question, they might first figure out which books to consult (retrieval), then find the answer in each, and chain the evidence together (multi-hop QA).

Question answering (QA) is the task of automatically providing answers to questions posed in natural language. Unlike information retrieval, which returns documents, QA returns precise answers -- a span of text, a generated sentence, or a structured fact. QA sits at the intersection of language understanding and generation and has been a driving benchmark for NLP progress from the TREC QA track (1999) to modern LLM evaluations.

## How It Works

### Extractive QA (Reading Comprehension)

Given a question and a context passage, extractive QA identifies the answer as a contiguous span within the passage.

**SQuAD-Style Architecture**: The model encodes the question and passage jointly (typically with BERT or similar), then predicts start and end token positions of the answer span:

```
P(start=i) = softmax(W_s * h_i)
P(end=j)   = softmax(W_e * h_j)
Answer span = argmax_{i,j} P(start=i) * P(end=j), where j >= i
```

BERT-large achieved 87.4 F1 on SQuAD 1.1 (Devlin et al., 2019), and subsequent models like ALBERT and DeBERTa pushed this to over 93 F1 -- surpassing the estimated human performance of 91.2 F1.

### Abstractive / Generative QA

Some questions require synthesizing information or producing answers not present verbatim in any passage. Generative QA models (e.g., fine-tuned T5, GPT) produce free-form text answers.

**Seq2Seq QA**: The question and context are concatenated as input; the model generates the answer token by token. This handles yes/no questions, list-type answers, and explanatory answers that extractive spans cannot capture. UnifiedQA (Khashabi et al., 2020) demonstrated that a single T5-based model could handle extractive, abstractive, multiple-choice, and yes/no QA formats.

### Open-Domain QA: Retriever-Reader Architecture

When no passage is provided, the system must first find relevant documents from a large corpus (e.g., all of Wikipedia).

**Classic Pipeline**:
1. **Retriever**: Finds top-k relevant passages. This can be sparse (BM25/TF-IDF) or dense (DPR -- Dense Passage Retrieval by Karpukhin et al., 2020, using dual BERT encoders with FAISS indexing over 21 million passages).
2. **Reader**: Extracts or generates the answer from the retrieved passages.

DrQA (Chen et al., 2017) pioneered this architecture using TF-IDF retrieval + a neural reader, achieving 69.5% exact match on open-domain SQuAD. DPR improved retriever recall from 59.1% (BM25) to 78.4% (top-20) on Natural Questions.

**Retrieval-Augmented Generation (RAG)**: Lewis et al. (2020) combined DPR retrieval with a BART generator, jointly training retriever and reader end-to-end. This approach generates more fluent and complete answers than purely extractive pipelines.

### Knowledge-Base QA (KBQA)

Answers questions by querying structured knowledge bases (e.g., Wikidata, Freebase). The system parses the question into a logical form or SPARQL query:

- "Who directed Inception?" maps to: `?x directedBy Inception` returns "Christopher Nolan"

Semantic parsing approaches (Berant et al., 2013) and more recent approaches using LLMs to generate SPARQL queries have achieved strong results on benchmarks like WebQuestions and ComplexWebQuestions.

### Multi-Hop QA

Some questions require reasoning over multiple pieces of evidence. For example: "What is the capital of the country where the director of Inception was born?" requires identifying the director (Christopher Nolan), his birth country (UK), and its capital (London).

HotpotQA (Yang et al., 2018) provides 113K questions requiring multi-hop reasoning, with sentence-level supporting fact annotations for explainability. Models must retrieve and chain evidence across multiple documents.

### Evolution: IR-Based to Neural Reader to LLM-Based QA

The field has progressed through distinct eras:
1. **IR-based** (1999--2010): Retrieve passages, apply pattern matching or shallow NLP to extract answers.
2. **Neural reader** (2015--2020): End-to-end trained models (BERT-based) dramatically improved reading comprehension.
3. **LLM-based** (2020--present): Large language models (GPT-4, PaLM, Claude) answer questions using parametric knowledge, optionally augmented with retrieval (RAG).

## Why It Matters

1. **Search evolution**: QA transforms search from returning documents to returning direct answers, powering featured snippets and voice assistants.
2. **Enterprise knowledge access**: QA systems over internal documents, FAQs, and databases let employees find information without knowing where to look.
3. **Education**: QA systems can serve as intelligent tutoring assistants, answering student questions over course materials.
4. **Healthcare**: Clinical QA systems help physicians find evidence-based answers from medical literature, potentially improving patient outcomes.
5. **Benchmark for understanding**: QA performance is a key proxy for measuring machine reading comprehension and reasoning capabilities.

## Key Technical Details

- **SQuAD 1.1** (Rajpurkar et al., 2016): 107K extractive QA pairs over Wikipedia paragraphs. **SQuAD 2.0** adds 53K unanswerable questions, requiring models to know when they do not know.
- **Natural Questions** (Kwiatkowski et al., 2019): 307K questions from real Google search queries with long and short answer annotations from full Wikipedia articles.
- **HotpotQA** (Yang et al., 2018): 113K multi-hop questions with sentence-level evidence annotations.
- **TriviaQA** (Joshi et al., 2017): 95K question-answer pairs sourced from trivia enthusiasts, with evidence documents.
- DPR uses 768-dimensional BERT embeddings with FAISS for approximate nearest neighbor search over 21M Wikipedia passages, enabling retrieval in under 100ms.
- Current LLMs achieve 60--80% accuracy on open-domain QA benchmarks without retrieval, but retrieval augmentation can push accuracy to 80--90% while reducing hallucination.
- The "closed-book" vs. "open-book" distinction is critical: closed-book QA tests parametric knowledge; open-book QA tests reading ability.

## Common Misconceptions

- **"Extractive QA is just string matching."** Modern extractive QA requires deep semantic understanding. The answer span may be expressed very differently from the question ("Who founded Microsoft?" -- answer: "Bill Gates and Paul Allen started the company in 1975"). Models must handle paraphrase, inference, and coreference.

- **"If a model scores 93 F1 on SQuAD, it truly understands language."** SQuAD and similar benchmarks test a narrow form of comprehension. Models exploit lexical overlap shortcuts, struggle with adversarial questions, and fail on questions requiring common sense or multi-step reasoning (Jia and Liang, 2017).

- **"LLMs eliminate the need for retrieval."** LLMs hallucinate facts confidently and have knowledge cutoff dates. Retrieval-augmented generation provides grounded, up-to-date answers and allows attribution to sources, which is essential for trust and verifiability.

- **"Multi-hop QA is just doing single-hop QA multiple times."** Multi-hop reasoning requires maintaining intermediate results, resolving coreferences across documents, and handling error propagation -- qualitatively different from single-hop extraction.

## Connections to Other Concepts

- `information-retrieval.md`: The retriever component in open-domain QA uses IR techniques from BM25 to dense retrieval.
- `contextual-embeddings.md`: BERT and similar models provide the representations that power modern extractive QA.
- `text-generation.md`: Generative QA uses the same decoding strategies (beam search, nucleus sampling) covered there.
- `knowledge-graphs-for-nlp.md`: KBQA relies on structured knowledge representations for answering factoid questions.
- `text-classification.md`: Answer type classification and answerability detection (SQuAD 2.0) are classification subtasks.
- `machine-translation.md`: Cross-lingual QA applies MT techniques to answer questions in one language using documents in another.

## Further Reading

- Rajpurkar et al., "SQuAD: 100,000+ Questions for Machine Comprehension of Text" (2016) -- The benchmark that catalyzed modern extractive QA research.
- Chen et al., "Reading Wikipedia to Answer Open-Domain Questions" (2017) -- DrQA, the first neural open-domain QA system combining retrieval and reading.
- Karpukhin et al., "Dense Passage Retrieval for Open-Domain Question Answering" (2020) -- DPR, replacing sparse retrieval with learned dense representations.
- Yang et al., "HotpotQA: A Dataset for Diverse, Explainable Multi-hop Question Answering" (2018) -- Multi-hop QA benchmark with explainability requirements.
- Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (2020) -- RAG, unifying retrieval and generation for open-domain QA.
- Khashabi et al., "UnifiedQA: Crossing Format Boundaries with a Single QA System" (2020) -- A single model handling multiple QA formats.
