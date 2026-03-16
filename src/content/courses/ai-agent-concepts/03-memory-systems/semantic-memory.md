# Semantic Memory

**One-Line Summary**: Semantic memory stores factual knowledge -- entities, relationships, concepts, and structured data -- that agents access and update beyond what is encoded in the LLM's weights, implemented through knowledge graphs, databases, and entity stores.

**Prerequisites**: Memory architecture overview, long-term persistent memory, knowledge graphs basics

## What Is Semantic Memory?

Think of an encyclopedia versus a diary. A diary records specific experiences (episodic memory): "On Tuesday I met Dr. Smith and she told me about her new research on gene therapy." An encyclopedia records factual knowledge abstracted from specific experiences (semantic memory): "Gene therapy is a technique that modifies a person's genes to treat or prevent disease. It was first successfully used in humans in 1990." The encyclopedia entry has no specific episode attached to it; it is general knowledge about the world.

For AI agents, semantic memory is the store of factual knowledge that the agent can access, query, and update during task execution. While LLMs encode vast amounts of factual knowledge in their weights, this knowledge has critical limitations: it is frozen at the training cutoff, it cannot be easily updated, it may contain errors, and it cannot store private or domain-specific facts. Semantic memory provides an external, mutable knowledge store that complements the LLM's parametric knowledge.

```mermaid
flowchart LR
    S1["ledge graph diagram showing entities (Post"]
    S2["connected by typed relationships"]
    S1 --> S2
```

The distinction from episodic memory is important. Episodic memory stores "I searched for X and found Y on Tuesday" (a specific experience). Semantic memory stores "X is Y" (a factual claim, decoupled from any specific experience). In practice, semantic memories often originate from episodic experiences (the agent learns a fact during a task) but are stored in a form that strips away the experiential context and retains only the factual content.

## How It Works

### Knowledge Graphs

The most structured form of semantic memory is a knowledge graph: a network of entities connected by typed relationships.

```
Entities:
  - PostgreSQL (type: Database)
  - MySQL (type: Database)
  - Oracle Corporation (type: Company)

Relationships:
  - PostgreSQL -[licensed_under]-> PostgreSQL License
  - MySQL -[owned_by]-> Oracle Corporation
  - PostgreSQL -[supports]-> JSONB data type
  - MySQL -[supports]-> JSON data type
  - PostgreSQL -[compared_to]-> MySQL (comparison: "PostgreSQL has better
    support for complex queries and advanced data types")
```

Knowledge graphs enable structured queries ("What databases does Oracle own?"), traversal ("What is related to PostgreSQL?"), and inference ("If PostgreSQL supports JSONB and JSONB is a superset of JSON, then PostgreSQL supports JSON").

Implementation options include:
- **Neo4j**: Full-featured graph database with Cypher query language
- **Amazon Neptune**: Managed graph database service
- **NetworkX**: Python library for in-memory graphs (suitable for smaller knowledge bases)
- **RDF/SPARQL**: W3C standard for knowledge representation and querying

### Entity-Relationship Stores

A lighter-weight alternative to full knowledge graphs, entity-relationship stores maintain a flat or semi-structured collection of facts:

```json
{
  "user_preferences": {
    "programming_language": "Python",
    "editor": "VS Code",
    "deployment_target": "AWS",
    "testing_framework": "pytest"
  },
  "project_facts": {
    "database": "PostgreSQL 15",
    "api_framework": "FastAPI",
    "auth_method": "JWT + OAuth2",
    "deployment": "ECS Fargate"
  },
  "domain_knowledge": {
    "max_payload_size": "10MB",
    "rate_limit": "100 requests/minute",
    "sla_target": "99.9% uptime"
  }
}
```

These stores are queried by key lookup rather than graph traversal. They are simpler to implement and maintain but cannot represent complex relationships or enable multi-hop queries.

### Structured Databases as Semantic Memory

For agents that work within specific domains, relational databases serve as semantic memory:

```sql
-- Product catalog as semantic memory
SELECT product_name, price, category, stock_quantity
FROM products
WHERE category = 'electronics' AND stock_quantity > 0;

-- Customer knowledge base
SELECT customer_id, preferred_contact_method, subscription_tier
FROM customers
WHERE customer_id = 'C12345';
```

The agent issues SQL queries to retrieve factual knowledge relevant to the current task. This approach excels when the knowledge domain is well-structured and queryable, but does not handle fuzzy or partial matches well.

### Knowledge Extraction and Updates

Semantic memory requires mechanisms for adding, updating, and correcting facts:

**Extraction from conversations**: When a user says "We use PostgreSQL 15 for our production database," the agent should extract and store: `project.database = "PostgreSQL 15"`.

**Extraction from documents**: When the agent reads documentation, it extracts key facts: "API rate limit is 100 requests per minute per API key."

**Conflict resolution**: When new information contradicts stored facts, the agent must decide which to trust. Common policies: newer information overrides older (recency), information from more authoritative sources overrides less authoritative (trust), or the conflict is flagged for human resolution.

**Deprecation and expiry**: Some facts have limited validity. Software versions, pricing, API specifications, and organizational information change over time. Semantic memories should include timestamps and confidence scores to enable staleness detection.

## Why It Matters

### Supplements LLM Parametric Knowledge

LLMs encode general knowledge in their weights, but this knowledge is static (frozen at training cutoff), probabilistic (sometimes wrong), and non-specific (does not include private or domain-specific facts). Semantic memory provides a complementary knowledge layer that is updatable, verifiable, and customizable to the specific user and domain.

### Enables Consistent Factual Recall

Without explicit semantic memory, agents may give inconsistent answers about the same fact across different sessions or even within the same conversation. A semantic memory store provides a single source of truth: "The project uses PostgreSQL 15" is stored once and retrieved consistently every time it is relevant.

### Supports Domain-Specific Expertise

A general-purpose LLM may have limited knowledge about a specific company's products, internal tools, or domain terminology. Semantic memory allows the agent to accumulate domain-specific knowledge that makes it increasingly expert in the user's particular context.

## Key Technical Details

- **Knowledge graph size**: Most agent semantic memory stores contain hundreds to thousands of entities and relationships. This is manageable in-memory (NetworkX) for small stores or in a dedicated graph database for larger stores
- **Entity extraction cost**: Extracting entities and relationships from natural language text costs one LLM call per passage (~200-500 tokens). Automated extraction is 70-85% accurate; critical facts should be user-confirmed
- **Update frequency**: Semantic memory should be updated immediately when the agent learns new facts (within the session) and reconciled periodically (across sessions) to resolve conflicts and remove stale entries
- **Query patterns**: Most agent semantic memory queries are simple key lookups ("What database does this project use?") or one-hop traversals ("What tools are related to the user's preferred framework?"). Complex multi-hop queries are rare in practice
- **Hybrid retrieval**: Combining structured queries (exact fact lookup) with vector search (semantic similarity) provides the best coverage. Use structured queries when you know what you are looking for, vector search when exploring
- **Storage overhead**: A knowledge graph with 10,000 entities and 50,000 relationships requires approximately 10-50MB of storage. Well within the capacity of any database
- **Consistency checking**: Periodically run consistency checks on the knowledge graph: identify contradictions, orphaned entities, and stale facts. This maintenance is analogous to database integrity checks

## Common Misconceptions

- **"The LLM's weights are sufficient semantic memory."** LLM parametric knowledge is frozen, sometimes incorrect, and generic. It does not know about your specific project, your user's preferences, or facts that emerged after training. External semantic memory is necessary for all of these.

- **"Semantic memory and episodic memory are the same thing."** They store fundamentally different types of information. Episodic memory stores experiences (task traces, interaction histories). Semantic memory stores facts (entities, relationships, properties). The two are complementary and serve different retrieval needs.

- **"Knowledge graphs are too complex for agent memory."** While full-scale knowledge graph engineering is complex, lightweight entity-relationship stores (implemented as JSON files or simple key-value databases) provide most of the benefit with minimal complexity. Scale the implementation to the need.

- **"Semantic memory should store everything the agent learns."** Semantic memory should store stable, reusable facts, not transient observations or task-specific intermediate results. Being selective about what enters semantic memory keeps the store clean and retrieval efficient.

## Connections to Other Concepts

- `memory-architecture-overview.md` — Semantic memory is the factual-knowledge layer of long-term memory, complementing episodic memory (experiences) in the overall architecture
- `episodic-memory.md` — Episodic memories consolidate into semantic memories over time: repeated experiences become general facts. The two memory types have different schemas but may share the same storage infrastructure
- `long-term-persistent-memory.md` — Semantic memory is implemented on top of long-term persistent storage. Vector stores handle fuzzy retrieval; structured databases handle exact queries
- `memory-retrieval-strategies.md` — Retrieving semantic facts uses different strategies than retrieving episodes: exact match (key lookup) is preferred when available, with semantic similarity as a fallback
- `conversation-management.md` — Semantic memory informs conversation management: knowing the user's domain, preferences, and context helps the agent maintain coherent dialogue

## Further Reading

- Ji, S., Pan, S., Cambria, E., et al. (2022). "A Survey on Knowledge Graphs: Representation, Acquisition, and Applications." Comprehensive overview of knowledge graph technology that provides the foundation for structured semantic memory.
- Baek, J., Aji, A., Saffari, A. (2023). "Knowledge-Augmented Language Model Prompting for Zero-Shot Knowledge Graph Question Answering." Demonstrates how LLMs can query and reason over knowledge graphs as semantic memory.
- Park, J., O'Brien, J., Cai, C., et al. (2023). "Generative Agents: Interactive Simulacra of Human Behavior." Implements semantic memory alongside episodic and procedural memory for comprehensive agent cognition.
- Modarressi, A., Imani, A., Fayyaz, M., et al. (2023). "RET-LLM: Towards a General Read-Write Memory for Large Language Models." Proposes a read-write memory mechanism for LLMs that functions as updatable semantic memory.
