# Knowledge Base Maintenance

**One-Line Summary**: Knowledge base maintenance is the ongoing operational work of keeping agent knowledge stores accurate, current, and performant through updating stale information, deduplication, versioning, incremental indexing, and contradiction resolution.

**Prerequisites**: Retrieval-augmented generation, vector databases, embedding models, document processing pipelines

## What Is Knowledge Base Maintenance?

Imagine a library that never removes outdated books, never catalogs new acquisitions, and never resolves cases where two books say contradictory things. Within a year, the library would be unreliable -- patrons could not trust that the information they found was current or correct. A librarian who only shelves new books without maintaining the existing collection is doing half the job. Knowledge base maintenance is the librarian's other half.

Building a RAG knowledge base is a well-understood one-time activity: collect documents, chunk them, embed them, index them, done. But that is only the beginning. Documents become outdated. New documents arrive that supersede old ones. Duplicate content fragments accumulate, wasting storage and polluting retrieval results. Embedding models improve, making old embeddings suboptimal. Schemas change. Sources disappear. The operational burden of maintaining a knowledge base over time rivals or exceeds the initial build cost.

Knowledge base maintenance encompasses all the processes needed to keep a retrieval system healthy in production: detecting and replacing stale content, resolving contradictions between old and new information, deduplicating near-identical entries, re-indexing when embedding models change, monitoring retrieval quality over time, and handling the inevitable drift between the knowledge base and the real world it represents.

*Recommended visual: Lifecycle diagram showing the knowledge base maintenance cycle — ingest → index → monitor → detect staleness → refresh/deduplicate/re-index → validate — with feedback arrows showing continuous operation — see [Izacard et al., 2022 — Atlas](https://arxiv.org/abs/2208.03299)*

## How It Works

### Staleness Detection and Content Refresh

Content goes stale at different rates. API documentation may change with every release (weekly). Company policies might update quarterly. Historical facts never change. An effective maintenance system tags content with expected refresh intervals and source URLs, then periodically checks sources for updates. Change detection compares the current source document with the indexed version -- if significant changes are found, the old chunks are replaced with new ones. Automated crawlers or webhook integrations with source systems trigger updates when content changes at the source.

### Deduplication

Over time, the same information enters the knowledge base through multiple paths: a policy document is indexed from the wiki and also from an email attachment; the same FAQ appears in three different help center pages. Deduplication identifies and consolidates these duplicates. Near-duplicate detection uses techniques like MinHash, SimHash, or embedding similarity to find content pairs above a similarity threshold (typically 0.90-0.95). When duplicates are found, the system keeps the most authoritative or recent version and removes or merges the others.

*Recommended visual: Before/after comparison showing a knowledge base with duplicate and stale entries being cleaned through deduplication and refresh processes, with retrieval quality metrics improving — see [Petroni et al., 2021 — KILT Benchmark](https://arxiv.org/abs/2009.02252)*

### Versioning and Temporal Management

Some applications need to maintain multiple versions of the same content. A legal agent must know that regulation X applied before 2024 but regulation Y applies after. Version management tracks content evolution, associates versions with time ranges, and enables the agent to retrieve the version appropriate to the query context. This requires temporal metadata (effective_from, effective_until) on each content chunk and retrieval filters that consider the relevant time period.

### Incremental Indexing

When new content arrives or existing content is updated, the entire corpus does not need to be re-indexed. Incremental indexing adds, updates, or deletes individual chunks without rebuilding the full index. This is operationally critical for large knowledge bases (millions of chunks) where full re-indexing takes hours. Most vector databases support upsert operations (insert or update) and deletions, enabling incremental maintenance. However, some index structures (like HNSW graphs) can degrade in quality after many incremental updates, requiring periodic full rebuilds.

## Why It Matters

### Preventing Knowledge Rot

A knowledge base built once and never maintained degrades predictably. After six months, a meaningful percentage of content is outdated. After a year, the system may be actively harmful, confidently providing information that was correct 12 months ago but is now wrong. Knowledge rot is insidious because it happens gradually -- the system appears to work while accuracy silently declines.

### Retrieval Quality Preservation

Duplicate and near-duplicate content fragments pollute retrieval results. When the top-5 retrieved chunks are three variations of the same paragraph plus two irrelevant results, the agent gets less diverse information than intended. Deduplication and quality-based pruning ensure the retrieval budget is spent on genuinely different, high-quality information.

### Operational Cost Management

Unmaintained knowledge bases grow indefinitely, increasing storage costs, slowing queries, and consuming more embedding computation. A knowledge base with 30% duplicate and 20% stale content is paying 50% more than necessary for storage and query latency. Regular maintenance keeps operational costs proportional to the actual useful content.

## Key Technical Details

- **Source freshness tracking**: Each chunk stores its source URL, last-checked timestamp, expected update frequency, and content hash. A background process periodically fetches sources and compares hashes to detect changes.
- **Embedding model migration**: When upgrading to a better embedding model, all existing embeddings become incompatible with new query embeddings. Migration requires re-embedding the entire corpus -- a potentially expensive operation for large knowledge bases. Blue-green deployment (maintaining two indexes during migration) avoids downtime.
- **Contradiction resolution strategies**: When new content contradicts old content on the same topic, the system can (a) always prefer the newer version, (b) flag contradictions for human review, (c) keep both versions with temporal metadata, or (d) apply domain-specific rules (e.g., peer-reviewed sources override blog posts).
- **Chunk-level metadata**: Every chunk carries metadata including: source document, chunk position, creation date, last verified date, source authority score, and content hash. This metadata enables targeted maintenance operations (e.g., "refresh all chunks from source X").
- **Quality monitoring**: Track retrieval quality metrics over time: average relevance score of top-k results, percentage of queries with no relevant results, user feedback on answer quality. Degradation in these metrics signals maintenance needs.
- **Automated testing**: A test suite of known question-answer pairs validates that the knowledge base produces correct retrievals. Run these tests after every maintenance operation (content update, deduplication, re-indexing) to catch regressions.
- **Garbage collection**: Chunks whose source documents no longer exist, chunks that have never been retrieved in production, and chunks below a quality threshold are candidates for removal. Periodic garbage collection keeps the index lean.

## Common Misconceptions

- **"Build it once and forget it."** This is the most dangerous misconception. RAG knowledge bases require ongoing maintenance proportional to the rate of change in the underlying domain. Neglecting maintenance guarantees degradation.

- **"Just add new content, don't remove old content."** Keeping outdated content alongside current content creates contradictions and pollution. The system may retrieve the old (wrong) version instead of the new (correct) one, especially if the old version has more chunks or better keyword matches.

- **"Deduplication is optional."** In practice, duplication rates of 10-30% are common in enterprise knowledge bases that ingest from multiple sources. This directly impacts retrieval quality by wasting slots in the top-k results on redundant information.

- **"Embedding model upgrades are seamless."** Changing embedding models requires re-embedding the entire corpus because embeddings from different models exist in incompatible vector spaces. This is a major operational event, not a configuration change.

- **"Automated maintenance eliminates human oversight."** Automated systems handle routine updates, but edge cases -- conflicting authoritative sources, subtle semantic changes, domain-specific judgment calls -- require human review. The best systems automate the routine and escalate the complex.

## Connections to Other Concepts

- `source-verification.md` -- Maintenance reduces the verification burden by ensuring the knowledge base contains current, deduplicated, high-quality content. Poorly maintained knowledge bases require more aggressive runtime verification.
- `document-understanding.md` -- When document understanding pipelines improve, previously processed documents may benefit from re-processing, adding to the maintenance workload.
- `hybrid-search-strategies.md` -- Maintenance must be synchronized across all retrieval indexes (vector, keyword, structured) to prevent inconsistencies where content exists in one index but not another.
- `agentic-rag.md` -- The quality of the knowledge base directly determines the ceiling for agentic RAG performance. No amount of agent sophistication compensates for a stale or polluted knowledge base.
- `reliability-and-reproducibility.md` -- Knowledge base changes can cause retrieval regressions, making maintenance operations a source of non-determinism that must be tested for.

## Further Reading

- **Petroni et al., 2021** -- "KILT: A Benchmark for Knowledge Intensive Language Tasks." Establishes benchmarks for knowledge-intensive tasks that implicitly require well-maintained knowledge sources.
- **Kandpal et al., 2023** -- "Large Language Models Struggle to Learn Long-Tail Knowledge." Demonstrates the importance of maintaining knowledge bases for long-tail facts that LLMs cannot reliably recall from parametric memory.
- **Izacard et al., 2022** -- "Atlas: Few-shot Learning with Retrieval Augmented Language Models." Shows that retrieval index quality is a critical variable in RAG performance, motivating systematic maintenance.
- **Shi et al., 2024** -- "Detecting Pretraining Data from Large Language Models." Relevant to understanding which knowledge is in the model versus needs retrieval, informing what to maintain in the knowledge base.
