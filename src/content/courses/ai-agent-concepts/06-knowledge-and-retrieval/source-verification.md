# Source Verification

**One-Line Summary**: Source verification ensures agent reliability by cross-referencing retrieved information across multiple sources, detecting contradictions, scoring confidence, and providing citations to prevent the propagation of incorrect or outdated facts.

**Prerequisites**: Retrieval-augmented generation, agentic RAG, multi-source retrieval, trust boundaries

## What Is Source Verification?

Imagine a journalist working on an investigative piece. They never publish a claim based on a single source. They cross-reference with independent sources, check for consistency, evaluate source credibility, and note when sources disagree. A story backed by three independent, credible sources is trustworthy; a story from one anonymous tip is flagged as unverified. Source verification gives AI agents this same journalistic rigor.

When an agent retrieves information from external sources -- documents, databases, web pages, APIs -- it inherits all the reliability problems of those sources. Documents may be outdated, contain errors, reflect biases, or even be deliberately manipulated (as in indirect prompt injection). Without verification, the agent simply passes these problems through to the user, potentially with added confidence that makes errors more dangerous.

Source verification is a systematic process of evaluating retrieved information before incorporating it into an answer. This includes checking whether multiple independent sources agree (corroboration), whether the information contradicts known facts or other retrieved data (contradiction detection), whether the source is authoritative for the claim being made (source authority), and assigning an overall confidence score to each fact. The agent can then present verified information with citations, flag uncertain claims, and refuse to assert things it cannot verify.

*Recommended visual: Pipeline diagram showing retrieved claims being decomposed into atomic facts, each fact cross-referenced against multiple sources, with corroboration/contradiction signals feeding into a confidence score — see [Min et al., 2023 — FActScore](https://arxiv.org/abs/2305.14251)*

## How It Works

### Cross-Reference Checking

The agent retrieves information from multiple independent sources for the same claim. If three different documents state that a company's revenue was $5.2 billion, confidence is high. If one says $5.2B and another says $4.8B, the agent has detected a discrepancy requiring investigation. The key is independence -- multiple copies of the same original source do not count as corroboration. The agent must assess whether sources are truly independent by checking authorship, publication date, and whether one might be derived from another.

### Contradiction Detection

Contradictions can exist between retrieved documents, between retrieved data and the model's parametric knowledge, or between different parts of the same document. The agent systematically compares facts across sources, looking for numerical discrepancies, conflicting dates, incompatible claims, or logical inconsistencies. When contradictions are found, the agent must decide how to handle them: prefer the more recent source, prefer the more authoritative source, present both views to the user, or flag the uncertainty explicitly.

*Recommended visual: Diagram showing the RARR (Researching and Revising) pipeline — LLM generates a claim, search retrieves evidence, evidence is compared against the claim, claim is revised if unsupported — see [Gao et al., 2023 — RARR](https://arxiv.org/abs/2210.08726)*

### Confidence Scoring

Each retrieved fact receives a confidence score based on multiple signals: number of corroborating sources, source authority and credibility, recency of the information, internal consistency, and agreement with the model's parametric knowledge. This score can be a simple high/medium/low rating or a numerical probability. The confidence score determines how the fact is presented -- high-confidence facts are stated directly, medium-confidence facts include hedging language, and low-confidence facts are explicitly flagged or omitted.

### Citation and Attribution

Verification is incomplete without attribution. The agent tracks which sources support which claims and includes citations in its output. This serves two purposes: it allows users to verify claims independently, and it creates accountability for the information chain. Good citation practice includes source name, date, specific section or page, and the URL or identifier for the original source.

## Why It Matters

### Preventing Hallucination Amplification

A retrieval system that surfaces incorrect information can be worse than no retrieval at all. Without retrieval, the model might hallucinate but with detectable hedging. With retrieval of wrong information, the model states the incorrect fact with full confidence, backed by a (wrong) source. Verification catches these cases before they reach the user.

### Building User Trust

Users calibrate their trust in AI systems based on experience. A single confidently-stated wrong answer can destroy trust that took dozens of correct answers to build. By flagging uncertainty, presenting confidence levels, and providing citations, verified responses allow users to make informed decisions about how much to trust each piece of information.

### Regulatory and Compliance Requirements

In regulated industries (healthcare, finance, legal), providing unverified information can have legal consequences. Source verification provides an audit trail showing what information was used, where it came from, and how it was validated. This is increasingly important as AI systems are used for consequential decisions.

## Key Technical Details

- **Source independence heuristic**: Two sources are considered independent if they have different authors, different publication dates, and neither cites the other. The agent can use metadata comparison and text similarity to assess independence.
- **Temporal precedence**: When sources conflict, more recent information generally takes precedence for facts that change over time (prices, personnel, regulations) but not for historical facts. The agent must distinguish between time-sensitive and time-stable claims.
- **Authority scoring**: Sources are rated by authority based on domain (peer-reviewed journals > news articles > blog posts), institutional affiliation, and track record. Authority scores are domain-specific -- a medical journal is authoritative for health claims but not for legal questions.
- **Fact extraction**: Before verification, individual claims must be extracted from retrieved passages. An LLM decomposes passages into atomic facts (single claims that can be independently verified), each of which is then checked against other sources.
- **Verification prompting**: The agent uses structured prompts that explicitly ask: "What sources support this claim? Do any sources contradict it? How confident should we be?" This deliberate prompting produces more careful verification than implicit reasoning.
- **Graceful degradation**: When verification is impossible (single source, no corroboration available), the agent transparently states the limitation rather than presenting unverified information as fact.

## Common Misconceptions

- **"If it's in the knowledge base, it must be correct."** Knowledge bases contain errors, outdated information, and biases. Documents may have been correct when written but are now stale. Treating retrieved information as ground truth is the most common and dangerous assumption in RAG systems.

- **"More sources always means higher confidence."** Multiple sources that trace back to a single origin provide no additional verification. Ten articles all citing the same press release count as one source, not ten. The agent must assess source independence, not just count documents.

- **"The model can accurately judge source credibility."** LLMs have limited ability to assess whether a specific source is authoritative in a specific domain. They can apply general heuristics (peer-reviewed > blog post) but cannot evaluate individual source track records without explicit metadata.

- **"Verification eliminates all errors."** Verification reduces error rates significantly but cannot eliminate them entirely. When all available sources share the same error (a common wrong "fact" that has been widely copied), verification will miss it. Verification is a layer of defense, not a guarantee.

- **"Citation means verification."** Simply citing a source does not mean the claim was verified. The source might be wrong, the agent might have misinterpreted it, or the citation might be to a passage that does not actually support the claim. Citation is necessary but not sufficient for verification.

## Connections to Other Concepts

- `agentic-rag.md` -- Source verification is a critical step in the agentic RAG loop, occurring after retrieval and before synthesis, ensuring the agent only incorporates trustworthy information.
- `trust-boundaries.md` -- Verification policies should align with trust boundaries: information from low-trust sources (web content, user-uploaded documents) requires more rigorous verification than high-trust sources (curated internal databases).
- `dynamic-retrieval-decisions.md` -- Verification results feed back into retrieval decisions. If retrieved information cannot be verified, additional retrieval from different sources may be triggered.
- `knowledge-base-maintenance.md` -- Many verification failures stem from outdated knowledge bases. Proactive maintenance reduces the burden on real-time verification.
- `agent-guardrails.md` -- Output guards can enforce that high-stakes claims include citations and confidence levels, ensuring verification results are communicated to users.

## Further Reading

- **Min et al., 2023** -- "FActScore: Fine-grained Atomic Evaluation of Factual Precision in Long Form Text Generation." Introduces atomic fact decomposition and per-fact verification scoring, the technical foundation for automated source verification.
- **Gao et al., 2023** -- "RARR: Researching and Revising What Language Models Say, Using Language Models." Proposes a retrieve-and-revise pipeline that automatically verifies and corrects LLM-generated claims using search.
- **Chern et al., 2023** -- "FacTool: Factuality Detection in Generative AI." A framework for detecting factual errors in LLM outputs using tool-augmented verification including search, code execution, and knowledge bases.
- **Weller et al., 2024** -- "According to...: Prompting Language Models Improves Quoting from Pre-Training Data." Studies how prompting strategies affect citation accuracy and attribution quality in LLM outputs.
