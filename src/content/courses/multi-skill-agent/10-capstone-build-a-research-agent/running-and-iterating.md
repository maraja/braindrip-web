# Running and Iterating

**One-Line Summary**: Running a multi-skill agent on real tasks exposes failure modes that only emerge in practice — iterating on the system prompt, error handling, and skill implementations transforms a prototype into a reliable tool.

**Prerequisites**: Project overview and requirements, implementing the skill set, wiring the agent graph

## What Is Running and Iterating?

Building the agent graph is only half the work. The other half — the half that determines whether the agent actually works — is running it on real tasks, observing where it breaks, and systematically fixing the failure modes. This is the engineering equivalent of "the last mile": the gap between a working prototype and a reliable system.

Think of it like training for a marathon. You can study running form, buy the right shoes, and plan your route. But until you actually run, you will not discover that your shoes rub at mile 8, that you underestimated the hill at mile 15, or that your hydration strategy fails in humid weather. Running the agent on real research topics reveals analogous problems: the web search returns irrelevant results for certain queries, the summarizer truncates important details, or the fact checker hallucinates verification of false claims.

Iteration follows a consistent cycle: run the agent on a diverse set of test topics, observe the output and the execution trace, identify the most impactful failure mode, fix it, and run again. Each cycle improves reliability incrementally. Production-quality agents typically require 5-15 iteration cycles before they perform consistently well.

## How It Works

### Running on Example Topics

Start with 3-5 topics that exercise different aspects of the agent:

```python
test_topics = [
    # Broad topic with many sources
    "What are the main approaches to quantum error correction?",
    # Narrow topic requiring precise search
    "How does the RLHF training process for Claude differ from ChatGPT?",
    # Recent topic requiring current information
    "What were the key announcements at the most recent NeurIPS conference?",
    # Controversial topic requiring balanced sources
    "What is the current scientific consensus on the health effects of intermittent fasting?",
    # Technical topic requiring domain expertise
    "How do mixture-of-experts architectures reduce inference cost?",
]

results = []
for topic in test_topics:
    result = app.invoke(
        {"messages": [{"role": "user", "content": f"Research this topic and write a report: {topic}"}]},
        config={"configurable": {"thread_id": f"test-{hash(topic)}"}}
    )
    results.append({
        "topic": topic,
        "messages": result["messages"],
        "report": result.get("report", ""),
        "sources": result.get("sources", []),
        "num_steps": len([m for m in result["messages"] if hasattr(m, "tool_calls")]),
    })
```

### Identifying Common Failure Modes

After running the test suite, categorize failures:

| Failure Mode | Symptom | Frequency | Fix |
|---|---|---|---|
| Shallow search | Only 1-2 sources found | ~30% of runs | Add search retry with query reformulation |
| Hallucinated URLs | read_page fails on non-existent URLs | ~15% | Validate URLs before fetching |
| Context overflow | Agent stops mid-task | ~10% | Add summarization after each source |
| Fact check loops | Agent re-checks the same fact repeatedly | ~10% | Add a "checked facts" set to state |
| Over-long reports | Report exceeds useful length | ~20% | Add word count constraint to write_report prompt |
| Source bias | All sources from same domain | ~15% | Add domain diversity requirement |

### Iterating on the System Prompt

The system prompt is usually the highest-leverage fix. Common improvements:

```python
# Before (vague)
system_prompt = "You are a research agent. Research the topic and write a report."

# After (specific, with constraints)
system_prompt = """You are a research agent that produces well-sourced reports.

RESEARCH PROCESS:
1. Search for the topic using 2-3 different query phrasings
2. Read at least 3 sources from different domains
3. Summarize key findings from each source
4. Cross-reference claims that appear in only one source
5. Write a structured report with sections: Summary, Key Findings, Sources

CONSTRAINTS:
- Never cite a URL you haven't successfully read
- If a search returns no results, rephrase and try again (max 3 attempts)
- Keep the final report under 800 words
- Include at least 3 distinct sources
- Flag any claims you could not verify with [UNVERIFIED]

WHEN TO STOP:
- You have at least 3 verified sources AND a complete report
- OR you have exhausted 3 search attempts without finding sufficient sources
  (in this case, write a partial report noting the limitation)
"""
```

### Adding Error Handling Iteratively

Each failure mode suggests a specific fix:

```python
# Fix: Search retry with query reformulation
def search_node(state):
    query = state["current_query"]
    results = web_search(query)

    if not results or len(results) < 2:
        # Reformulate and retry
        reformulated = llm.invoke(
            f"The search query '{query}' returned few results. "
            f"Generate 2 alternative phrasings."
        )
        for alt_query in parse_alternatives(reformulated.content):
            more_results = web_search(alt_query)
            results.extend(more_results)

    return {"sources": results}

# Fix: URL validation before fetching
def read_node(state):
    url = state["current_url"]
    # Quick HEAD request to validate
    try:
        resp = httpx.head(url, follow_redirects=True, timeout=5)
        if resp.status_code >= 400:
            return {"messages": [f"Skipping {url}: HTTP {resp.status_code}"]}
    except httpx.RequestError:
        return {"messages": [f"Skipping {url}: connection failed"]}

    # Proceed with full read
    content = read_page(url)
    return {"summaries": [content]}
```

### Measuring Improvement

Track metrics across iteration cycles:

```python
def evaluate_run(result):
    report = result.get("report", "")
    sources = result.get("sources", [])
    return {
        "has_report": bool(report),
        "report_length": len(report.split()),
        "source_count": len(sources),
        "unique_domains": len(set(urlparse(s).netloc for s in sources)),
        "has_unverified_claims": "[UNVERIFIED]" in report,
        "step_count": result["num_steps"],
    }

# Compare across iterations
# Iteration 1: 60% completion, avg 2.1 sources
# Iteration 2: 75% completion, avg 2.8 sources (after search retry fix)
# Iteration 3: 85% completion, avg 3.4 sources (after prompt improvements)
# Iteration 4: 90% completion, avg 3.2 sources (after URL validation)
```

## Why It Matters

### Theory vs Practice

Agent architectures that look correct on paper frequently fail in practice. The only way to discover real failure modes is to run the agent on diverse, realistic tasks. A search skill that works perfectly for technology topics might fail completely for medical or legal queries.

### Compound Reliability

Each individual fix may seem small (5-10% improvement), but they compound. Going from 60% to 90% task completion through 4-5 iterations is typical. The key insight is that each failure mode is usually independent, so fixing one does not introduce others.

## Key Technical Details

- **Iteration cycles needed**: 5-15 cycles to go from prototype to production-quality for most agent types.
- **Test suite size**: Start with 5 topics, expand to 20-50 as the agent stabilizes. Diverse topics catch more edge cases than many similar ones.
- **System prompt tuning**: Usually the highest-ROI fix. A well-tuned prompt can improve completion rates by 20-40% alone.
- **Cost per iteration cycle**: Running 5 test topics through a 10-step agent costs roughly $0.50-$2.00 in API fees. Budget $10-$30 for a full iteration phase.
- **Diminishing returns**: The first 3 iterations typically capture 80% of the improvement. Beyond iteration 7-8, improvements are marginal.
- **Human evaluation**: Automated metrics catch structural failures (no report, too few sources). Quality assessment (accuracy, coherence, usefulness) still requires human review for at least a subset of outputs.

## Common Misconceptions

**"If the agent works on one topic, it works on all topics."**
Agent behavior varies dramatically across topics. A research agent that handles technology topics well may struggle with medical topics (different source types), historical topics (fewer recent web results), or controversial topics (conflicting sources). Test across diverse domains.

**"More iterations always help."**
There is a point of diminishing returns, typically around iteration 7-10. Beyond that, improvements are marginal and you risk overfitting to your test set. If the agent consistently achieves 85-90% completion on a diverse test suite, ship it and monitor in production.

**"You should fix all failure modes before deploying."**
Aim for the 80/20 rule: fix the failure modes that affect the most runs. A 90% completion rate with graceful error messages for the other 10% is better than spending weeks chasing rare edge cases.

## Connections to Other Concepts

- `project-overview-and-requirements.md` — The requirements that define what "success" looks like for each test run.
- `implementing-the-skill-set.md` — Individual skills are the units you debug and improve during iteration.
- `wiring-the-agent-graph.md` — The graph structure may need adjustment when you discover missing conditional edges or state transitions.
- `evaluation-with-test-suites.md` — Formal evaluation methodology for measuring iteration progress.
- `self-correction-and-reflection.md` — Adding self-correction is a common iteration improvement.

## Further Reading

- Anthropic, "Building Effective Agents" (2024) — Emphasizes starting simple and iterating, with practical debugging patterns.
- Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023) — Systematic approach to agents learning from their own failures across iterations.
- LangChain Blog, "Evaluating LLM Applications" (2024) — Practical guide to building evaluation harnesses for iterative agent improvement.
- Madaan et al., "Self-Refine: Iterative Refinement with Self-Feedback" (2023) — Research on agents that improve their outputs through self-evaluation and revision.
