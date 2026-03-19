# Step 4: Document Loader

One-Line Summary: Load text files from a directory using plain Python and inspect the results — no frameworks needed.

Prerequisites: Project setup and Supabase configured from previous steps

---

## How Document Loading Works

Before we can embed anything, we need to read files and turn them into text. Unlike the framework approach (LlamaIndex, LangChain), we will do this with plain Python. It is simpler, you control every step, and there is no magic to debug.

For this blueprint, we support `.txt` and `.md` files. PDF parsing adds complexity that distracts from the RAG concepts — we will cover it as an extension at the end.

## Add Sample Documents

Create a few test files in your `data/` directory:

```bash
# Create a sample document to test with
cat > data/company-policy.txt << 'EOF'
Company Refund Policy

All purchases are eligible for a full refund within 30 days of the original purchase date. To request a refund, customers must contact support@example.com with their order number and reason for the refund.

Refunds for digital products are processed within 5 business days. Physical product refunds require the item to be returned in its original packaging. Shipping costs for returns are covered by the company for defective items only.

After 30 days, purchases are eligible for store credit only. Store credit does not expire and can be applied to any future purchase. Exchanges are available within 60 days for items of equal or lesser value.
EOF
```

```bash
# Create a second sample document
cat > data/onboarding-guide.txt << 'EOF'
New Employee Onboarding Guide

Welcome to the team! Here is what to expect in your first two weeks.

Week 1: Setup and Orientation
- Day 1: HR orientation, laptop setup, and badge activation
- Day 2: Meet your team, 1:1 with your manager
- Day 3-5: Complete required compliance training modules in the LMS

Week 2: Getting Started
- Shadow a senior team member on their current project
- Set up your development environment following the Engineering Wiki
- Complete your first "good first issue" from the team backlog
- Schedule 1:1s with key stakeholders your manager identifies

Required Tools: Slack, GitHub, Jira, Google Workspace
IT Support: helpdesk@example.com or #it-support on Slack
EOF
```

## Write the Document Loader

```python
# src/ingest.py
# ==========================================
# Document Ingestion — Load text files from data/
# ==========================================

from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"

SUPPORTED_EXTENSIONS = {".txt", ".md"}


def load_documents(directory: Path = DATA_DIR):
    """
    Load all text files from the given directory.
    Returns a list of dicts with 'content' and 'metadata'.
    """
    if not directory.exists():
        raise FileNotFoundError(f"Data directory not found: {directory}")

    documents = []
    for file_path in sorted(directory.iterdir()):
        if file_path.suffix not in SUPPORTED_EXTENSIONS:
            continue

        text = file_path.read_text(encoding="utf-8")
        documents.append({
            "content": text,
            "metadata": {
                "file_name": file_path.name,
                "file_size": file_path.stat().st_size,
                "char_count": len(text),
            },
        })
        print(f"  Loaded: {file_path.name} ({len(text)} chars)")

    print(f"Loaded {len(documents)} document(s) from {directory}")
    return documents


if __name__ == "__main__":
    docs = load_documents()
    for doc in docs:
        print(f"\n--- {doc['metadata']['file_name']} ---")
        print(f"Preview: {doc['content'][:200]}...")
```

## Test the Loader

```bash
python -m src.ingest
```

Expected output:

```
  Loaded: company-policy.txt (651 chars)
  Loaded: onboarding-guide.txt (623 chars)
Loaded 2 document(s) from /path/to/rag-pipeline/data

--- company-policy.txt ---
Preview: Company Refund Policy

All purchases are eligible for a full refund within 30 days...
```

Each document is a simple dictionary with `content` (the full text) and `metadata` (file info). No framework abstractions, no special objects — just Python dicts.

---

[← Set Up Supabase](03-set-up-supabase.md) | [Next: Step 5 - Chunking and Embedding →](05-chunking-and-embedding.md)
