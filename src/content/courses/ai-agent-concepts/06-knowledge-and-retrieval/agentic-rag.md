# Agentic RAG

**One-Line Summary**: Agentic RAG puts the AI agent in control of retrieval decisions, dynamically choosing when, what, and how to retrieve information rather than blindly fetching documents for every query.

**Prerequisites**: Retrieval-Augmented Generation (RAG) basics, tool use, agent loop architecture, embedding search

## What Is Agentic RAG?

Imagine a skilled research librarian versus a vending machine. A vending machine always dispenses something when you press a button -- it does not think about whether you actually need it. A research librarian, on the other hand, listens to your question, decides whether they already know the answer, figures out which section of the library to check, and may visit multiple sources before synthesizing a response. Agentic RAG is the research librarian approach to retrieval.

In traditional (naive) RAG, every user query triggers the same pipeline: embed the query, search a vector store, stuff the top-k results into the prompt, and generate. This works for straightforward factual lookups but falls apart for complex questions that require multi-step reasoning, questions the model already knows the answer to, or queries that need information from multiple heterogeneous sources.

Agentic RAG wraps retrieval inside an agent loop. The agent treats retrieval as a tool it can invoke selectively. It decides whether retrieval is needed at all, formulates appropriate queries (possibly multiple), evaluates the quality of returned results, and iterates if the results are insufficient. The agent maintains state across retrieval rounds, building up context progressively rather than relying on a single retrieval pass.

*Recommended visual: Architecture diagram showing the agentic RAG loop — agent receives query, decides whether to retrieve, selects retrieval tools, evaluates results, and iterates — see [Gao et al., 2024 — RAG Survey](https://arxiv.org/abs/2312.10997)*

## How It Works

### The Retrieval Decision Layer

Before any retrieval happens, the agent evaluates whether retrieval is necessary. This decision considers several factors: Is the question about factual, verifiable information? Is the information likely within the model's training data? Does the question reference recent events or domain-specific data? A question like "What is the capital of France?" needs no retrieval, while "What were our Q3 revenue numbers?" clearly does. The agent uses a combination of self-assessed confidence and query classification to make this call.

### Iterative Retrieval Loops

When retrieval is warranted, agentic RAG does not stop at one round. The agent retrieves initial results, evaluates their relevance and completeness, and decides whether to continue. If the first retrieval returns tangential results, the agent reformulates its query. If partial information is found, the agent identifies what is missing and issues targeted follow-up queries. This loop typically runs 1-4 iterations, with diminishing returns beyond that.

*Recommended visual: Flowchart comparing naive RAG (single linear pipeline) vs agentic RAG (iterative loop with decision points and multiple retrieval rounds) — see [Asai et al., 2024 — Self-RAG](https://arxiv.org/abs/2310.11511)*

### Multi-Source Orchestration

Real-world knowledge is scattered across multiple systems: vector stores, relational databases, APIs, knowledge graphs, and web search. The agentic RAG controller selects the appropriate source for each sub-question. A question about a customer might hit the CRM database, while a question about industry trends might trigger web search. The agent manages these heterogeneous sources through a unified tool interface, each source exposed as a distinct retrieval tool.

### Result Synthesis and Verification

After gathering information from potentially multiple rounds and sources, the agent synthesizes the results. This involves resolving contradictions between sources, weighing source reliability, and identifying gaps. The agent may flag low-confidence answers or indicate when retrieved information is insufficient to fully answer the question, rather than hallucinating to fill gaps.

## Why It Matters

### Accuracy Over Naive RAG

Naive RAG retrieves blindly, often stuffing the context window with irrelevant documents that can actually degrade generation quality. Agentic RAG improves precision by retrieving only when needed and refining queries iteratively. Studies show that iterative retrieval can improve answer accuracy by 15-30% on complex, multi-hop questions compared to single-pass RAG.

### Cost Efficiency

Not every query needs retrieval. By skipping retrieval for questions the model can answer from parametric knowledge, agentic RAG reduces unnecessary embedding computations, vector store queries, and token consumption from stuffing retrieved documents into prompts. For high-volume applications, this translates to meaningful cost savings.

### Handling Complex Queries

Many real-world questions are not single-hop lookups. "Compare our pricing strategy to competitors and suggest improvements" requires multiple retrievals, possibly from different sources, with reasoning between retrieval steps. Only an agentic approach can decompose this into sub-questions, retrieve for each, and synthesize coherently.

## Key Technical Details

- **Retrieval-as-tool pattern**: Retrieval is exposed as one or more tools (e.g., `search_docs`, `query_database`, `web_search`) that the agent invokes through the standard tool-calling interface.
- **Adaptive retrieval budgets**: The agent has a configurable maximum number of retrieval rounds (typically 1-5) to prevent infinite retrieval loops while allowing iterative refinement.
- **Relevance scoring**: After each retrieval, the agent (or a dedicated re-ranker) scores results for relevance, filtering out noise before including results in the generation context.
- **Query routing**: Different query types are routed to different retrieval backends -- semantic search for conceptual questions, keyword search for exact matches, SQL for structured data queries.
- **Context window management**: As multiple retrieval rounds accumulate documents, the agent must manage context window limits by summarizing, pruning, or prioritizing the most relevant passages.
- **Retrieval metadata**: The agent tracks which sources contributed to each part of its answer, enabling citation and attribution in the final response.
- **Fallback strategies**: When all retrieval attempts fail, the agent can gracefully degrade by acknowledging the limitation rather than generating unsupported claims.

## Common Misconceptions

- **"Agentic RAG is just RAG with more steps."** The fundamental difference is agency: the system makes dynamic decisions about whether, when, and how to retrieve, rather than following a fixed pipeline. The decision-making intelligence is the core innovation, not just iteration.

- **"You always need retrieval for factual questions."** Large language models have extensive parametric knowledge. Retrieving for well-known facts wastes resources and can introduce noise. The skill is knowing when retrieval adds value versus when the model's own knowledge suffices.

- **"More retrieval rounds always improve quality."** Beyond 2-3 rounds, retrieval often returns diminishing or redundant information. Over-retrieval can flood the context window with noise, actually degrading response quality. The agent must know when to stop.

- **"Agentic RAG replaces traditional RAG."** For simple, high-volume question-answering over a single document corpus, traditional RAG is faster, cheaper, and perfectly adequate. Agentic RAG is warranted for complex, multi-source, or reasoning-heavy tasks.

## Connections to Other Concepts

- `dynamic-retrieval-decisions.md` -- The decision of when to retrieve is the foundational capability that agentic RAG builds upon, covering confidence-based triggers and retrieval budgets.
- `query-reformulation.md` -- When initial retrieval fails, the agent uses query reformulation techniques (expansion, decomposition, HyDE) to improve subsequent retrieval rounds.
- `hybrid-search-strategies.md` -- Agentic RAG leverages hybrid search to route queries to the most appropriate retrieval backend (semantic, keyword, or structured).
- `source-verification.md` -- After retrieval, verifying the reliability and consistency of retrieved information is critical for trustworthy responses.
- `knowledge-graph-navigation.md` -- For multi-hop reasoning, agentic RAG may traverse knowledge graphs rather than relying solely on vector search.

## Further Reading

- **Lewis et al., 2020** -- "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." The foundational RAG paper that established the retrieve-then-generate paradigm agentic RAG extends.
- **Yao et al., 2023** -- "ReAct: Synergizing Reasoning and Acting in Language Models." Demonstrates the reasoning-action loop pattern that underlies agentic retrieval decisions.
- **Jiang et al., 2023** -- "Active Retrieval Augmented Generation." Introduces FLARE, which actively decides when and what to retrieve during generation based on model confidence.
- **Asai et al., 2024** -- "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection." Trains models to decide when to retrieve and to critique their own retrieved information.
- **Gao et al., 2024** -- "Retrieval-Augmented Generation for Large Language Models: A Survey." Comprehensive survey covering the evolution from naive RAG to agentic RAG architectures.
