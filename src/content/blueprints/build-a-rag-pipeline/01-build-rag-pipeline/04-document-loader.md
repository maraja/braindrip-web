# Step 4: Document Loader

One-Line Summary: Load PDFs and text files from a directory using LlamaIndex's built-in readers and inspect the resulting document objects.

Prerequisites: Project setup and Qdrant running from previous steps

---

## How Document Loading Works

Before we can embed anything, we need to turn files into text that LlamaIndex can process. LlamaIndex provides `SimpleDirectoryReader`, which automatically detects file types and applies the right parser:

- **.txt files** — read as plain text
- **.pdf files** — parsed page by page using `pypdf` (which we installed earlier)
- **.md files** — read as plain text
- **.docx, .csv, .html** — supported with additional readers

Each file becomes one or more `Document` objects, each carrying the text content and metadata (filename, page number, file type).

## Add Sample Documents

Drop a few files into your `data/` directory for testing. Create a sample text file:

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

If you have real PDFs (handbooks, reports, documentation), drop those into `data/` as well. The more realistic your test data, the better you can evaluate your pipeline.

## Write the Document Loader

Create `src/ingest.py` with the loading logic:

```python
# src/ingest.py
# ==========================================
# Document Ingestion — Load files from the data/ directory
# ==========================================

from pathlib import Path
from llama_index.core import SimpleDirectoryReader

# Path to the documents directory
DATA_DIR = Path(__file__).parent.parent / "data"


def load_documents(directory: Path = DATA_DIR):
    """
    Load all supported documents from the given directory.
    Returns a list of LlamaIndex Document objects.
    """
    if not directory.exists():
        raise FileNotFoundError(f"Data directory not found: {directory}")

    # List files we are about to load
    files = list(directory.iterdir())
    supported = [f for f in files if f.suffix in {".txt", ".pdf", ".md", ".csv"}]
    print(f"Found {len(supported)} supported file(s) in {directory}:")
    for f in supported:
        print(f"  - {f.name} ({f.stat().st_size / 1024:.1f} KB)")

    # SimpleDirectoryReader auto-detects file types
    reader = SimpleDirectoryReader(input_dir=str(directory))
    documents = reader.load_data()

    print(f"\nLoaded {len(documents)} document(s) total.")
    return documents


if __name__ == "__main__":
    # Run this file directly to test document loading
    docs = load_documents()
    for i, doc in enumerate(docs):
        print(f"\n--- Document {i + 1} ---")
        print(f"Metadata: {doc.metadata}")
        print(f"Text preview: {doc.text[:200]}...")
        print(f"Character count: {len(doc.text)}")
```

## Test the Loader

```bash
python -m src.ingest
```

Expected output:

```
Found 2 supported file(s) in /path/to/rag-pipeline/data:
  - company-policy.txt (0.7 KB)
  - onboarding-guide.txt (0.8 KB)

Loaded 2 document(s) total.

--- Document 1 ---
Metadata: {'file_path': '/path/to/data/company-policy.txt', 'file_name': 'company-policy.txt', ...}
Text preview: Company Refund Policy

All purchases are eligible for a full refund within 30 days...
Character count: 651
```

Each `Document` object has two important attributes:

- **`doc.text`** — the full text content of the file (or a single page for PDFs)
- **`doc.metadata`** — a dictionary with `file_name`, `file_path`, `file_type`, and for PDFs, `page_label`

PDFs produce one `Document` per page, so a 20-page PDF yields 20 documents. This is fine — the next step will chunk them into smaller pieces regardless.

---

[← Start Qdrant](03-start-qdrant.md) | [Next: Step 5 - Chunking and Embedding →](05-chunking-and-embedding.md)
