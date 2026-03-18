# Step 9: Test and Iterate

One-Line Summary: Evaluate your pipeline with real questions, tune chunk size and retrieval parameters, and improve answer quality systematically.

Prerequisites: Running API from Step 8

---

## The Testing Mindset

A RAG pipeline is only as good as the answers it produces. Building it is step one — tuning it is where the real quality comes from. In this step, we will test with a variety of questions, identify failure modes, and adjust parameters.

## Create a Test Script

```python
# test_pipeline.py
# ==========================================
# Evaluate the RAG pipeline with test cases
# ==========================================

import requests
import json
import time

API_URL = "http://localhost:8000"


def query(question: str, top_k: int = 3) -> dict:
    """Send a question to the API and return the response."""
    response = requests.post(
        f"{API_URL}/query",
        json={"question": question, "top_k": top_k},
    )
    response.raise_for_status()
    return response.json()


def run_tests():
    """
    Run a battery of test questions and evaluate the results.
    """
    # ------------------------------------------
    # Test cases: question + what we expect
    # ------------------------------------------
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
            # This question has no answer in our docs — the pipeline
            # should say it does not have enough information
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
        result = query(tc["question"])
        elapsed = time.time() - start

        answer = result["answer"]
        sources = result["sources"]
        source_files = [s["file_name"] for s in sources]

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

        passed = (
            keyword_hits == keyword_total
            and source_match
        )

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

If some tests fail, here are the most impactful knobs to turn:

### 1. Chunk Size

The default 512 tokens works for most documents, but you may need to adjust.

| Chunk Size | Best For | Tradeoff |
|-----------|----------|----------|
| **256** | Short, focused docs (FAQs, policies) | More chunks, more precise retrieval, but loses context |
| **512** | General purpose (default) | Good balance of precision and context |
| **1024** | Long-form docs (reports, manuals) | More context per chunk, but may include noise |

To change it, update `CHUNK_SIZE` in `src/ingest.py` and re-run ingestion:

```bash
# After changing CHUNK_SIZE in src/ingest.py
python -m src.ingest
```

### 2. Top-K (Number of Retrieved Chunks)

```bash
# Test with more context — retrieve 5 chunks instead of 3
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the refund policy?", "top_k": 5}'
```

- **top_k=2**: Faster, cheaper, but might miss relevant information
- **top_k=3**: Good default for most cases
- **top_k=5-7**: Better for complex questions that span multiple sections

### 3. Chunk Overlap

Increasing overlap from 50 to 100 tokens helps when important passages sit at chunk boundaries. The cost is slightly more vectors stored and marginally higher embedding costs.

### 4. System Prompt

The system prompt in `src/query.py` tells Claude how to behave. Adjust it based on your use case:

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
| Answer mixes up information from different docs | Chunks too large, multiple topics per chunk | Reduce chunk size to 256 |
| "I don't have that information" but the doc exists | Embedding miss — question phrased differently than doc text | Try rephrasing, or add metadata filters |
| Slow responses (>10s) | Large chunks sent to Claude | Reduce chunk size or top_k |
| Answer hallucinates details not in docs | System prompt too permissive | Tighten the system prompt to require strict grounding |

After each adjustment, re-run the test script to measure improvement. Tuning RAG is an iterative process — small changes compound.

---

[← API Endpoint](08-api-endpoint.md) | [Next: Step 10 - What's Next →](10-whats-next.md)
