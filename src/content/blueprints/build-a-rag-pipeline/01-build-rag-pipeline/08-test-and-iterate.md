# Step 8: Test and Iterate

One-Line Summary: Evaluate your pipeline with real questions, tune chunk size and retrieval parameters, and improve answer quality systematically.

Prerequisites: Working query engine from Step 7

---

## The Testing Mindset

A RAG pipeline is only as good as the answers it produces. Building it is step one — tuning it is where the real quality comes from. In this step, we test with a variety of questions, identify failure modes, and adjust parameters.

## Create a Test Script

```python
# test_pipeline.py
# ==========================================
# Evaluate the RAG pipeline with test cases
# ==========================================

import time
from src.query import ask

def run_tests():
    """Run test questions and evaluate the results."""
    test_cases = [
        {
            "question": "What is the refund policy for digital products?",
            "expected_keywords": ["5 business days", "digital"],
            "expected_source": "company-policy.txt",
        },
        {
            "question": "What happens on day 1 of onboarding?",
            "expected_keywords": ["HR orientation", "laptop", "badge"],
            "expected_source": "onboarding-guide.txt",
        },
        {
            "question": "How do I get a store credit?",
            "expected_keywords": ["30 days", "store credit"],
            "expected_source": "company-policy.txt",
        },
        {
            "question": "What tools do new employees need?",
            "expected_keywords": ["Slack", "GitHub", "Jira"],
            "expected_source": "onboarding-guide.txt",
        },
        {
            # This question has no answer in our docs
            "question": "What is the company's vacation policy?",
            "expected_keywords": [],
            "expected_source": None,
        },
    ]

    results = []
    for i, tc in enumerate(test_cases):
        print(f"\n{'=' * 60}")
        print(f"Test {i + 1}: {tc['question']}")
        print(f"{'=' * 60}")

        start = time.time()
        result = ask(tc["question"])
        elapsed = time.time() - start

        answer = result["answer"]
        source_files = [s["file"] for s in result["sources"]]

        # Check if expected keywords appear in the answer
        keyword_hits = sum(
            1 for kw in tc["expected_keywords"]
            if kw.lower() in answer.lower()
        )
        keyword_total = len(tc["expected_keywords"])

        # Check if the expected source was retrieved
        source_match = (
            tc["expected_source"] in source_files
            if tc["expected_source"]
            else True
        )

        passed = keyword_hits == keyword_total and source_match

        print(f"Answer: {answer[:300]}...")
        print(f"Sources: {source_files}")
        print(f"Keywords: {keyword_hits}/{keyword_total}")
        print(f"Source match: {'yes' if source_match else 'NO'}")
        print(f"Latency: {elapsed:.2f}s")
        print(f"Result: {'PASS' if passed else 'FAIL'}")

        results.append(passed)

    # Summary
    print(f"\n{'=' * 60}")
    print(f"Results: {sum(results)}/{len(results)} passed")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    run_tests()
```

Run the tests:

```bash
python test_pipeline.py
```

## Tuning Parameters

If some tests fail, here are the most impactful knobs to turn.

### 1. Chunk Size

Edit `CHUNK_SIZE` in `src/config.py`:

| Chunk Size | Best For | Tradeoff |
|-----------|----------|----------|
| **250** | Short, focused docs (FAQs, policies) | More precise retrieval, but loses context |
| **500** | General purpose (default) | Good balance of precision and context |
| **1000** | Long-form docs (reports, manuals) | More context per chunk, but may include noise |

After changing chunk size, re-run ingestion:

```bash
python -m src.ingest
```

### 2. Top-K (Number of Retrieved Chunks)

Edit `TOP_K` in `src/config.py`:

- **top_k=2**: Faster, cheaper, but might miss relevant information
- **top_k=3**: Good default for most cases
- **top_k=5-7**: Better for complex questions spanning multiple sections

### 3. Chunk Overlap

Increasing `CHUNK_OVERLAP` from 50 to 100 characters helps when important passages sit at chunk boundaries.

### 4. System Prompt

The system prompt in `src/query.py` guides how Claude answers. Adjust it:

```python
# For strict factual answers (no speculation):
system_prompt = (
    "Answer ONLY based on the provided document excerpts. "
    "If the answer is not in the documents, say: "
    "'I could not find this information in the available documents.' "
    "Never speculate or use outside knowledge."
)

# For more conversational answers:
system_prompt = (
    "You are a helpful company assistant. Answer questions based on "
    "the provided documents. Be conversational but accurate. "
    "If you are not sure, say so."
)
```

## Common Failure Modes

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Answer is generic, does not cite docs | Wrong chunks retrieved | Increase top_k, try smaller chunk size |
| Answer mixes up info from different docs | Chunks too large | Reduce chunk size to 250 |
| "I don't have that information" but doc exists | Question phrased differently than doc text | Try rephrasing, or try larger chunks |
| Slow responses (>10s) | Large chunks sent to Claude | Reduce chunk size or top_k |
| Hallucinated details not in docs | System prompt too permissive | Tighten the system prompt |

After each adjustment, re-run ingestion and then the test script to measure improvement.

---

[← Query Engine](07-query-engine.md) | [Next: Step 9 - What's Next →](09-whats-next.md)
