# Step 9: Run Locally

One-Line Summary: Build the CLI entry point, run the complete pipeline on a real job posting, and inspect the output.

Prerequisites: Complete graph from Step 8

---

## Build the Entry Point

Create `main.py` — the command-line interface for your agent team:

```python
# main.py
# ==========================================
# CLI entry point for the job application agent
# ==========================================
# Usage:
#   python main.py --job job_posting.txt --resume resume.md
#   python main.py --job-text "paste job posting here" --resume resume.md

import argparse
import sys
import time
from graph import app
from utils import load_file


def main():
    parser = argparse.ArgumentParser(
        description="AI-powered job application assistant"
    )
    parser.add_argument(
        "--job",
        help="Path to a text file containing the job posting",
    )
    parser.add_argument(
        "--job-text",
        help="Job posting text (paste directly)",
    )
    parser.add_argument(
        "--resume",
        required=True,
        help="Path to your resume (Markdown format)",
    )
    args = parser.parse_args()

    # Load the job posting
    if args.job:
        job_posting = load_file(args.job)
    elif args.job_text:
        job_posting = args.job_text
    else:
        print("Error: Provide either --job (file path) or --job-text (raw text)")
        sys.exit(1)

    # Load the resume
    resume = load_file(args.resume)

    # Run the pipeline
    print("\n🔍 Job Application Agent")
    print("=" * 50)

    start = time.time()

    print("\n[1/4] Analyzing job posting...")
    result = app.invoke({
        "job_posting": job_posting,
        "resume": resume,
    })

    elapsed = time.time() - start

    # Print summary
    print("\n" + "=" * 50)
    print("📋 Summary")
    print("=" * 50)
    print(f"Company:  {result.get('company_name', 'Unknown')}")
    print(f"Role:     {result.get('job_title', 'Unknown')}")
    print(f"Review:   {'✅ PASSED' if result.get('review_passed') else '⚠️  NEEDS WORK'}")
    print(f"Time:     {elapsed:.1f}s")
    print(f"\n📁 Output files saved to ./output/")
    print("   - tailored_resume.md")
    print("   - cover_letter.md")
    print("   - review.md")


if __name__ == "__main__":
    main()
```

## Create a Test Job Posting

Save a realistic job posting to test with:

```markdown
<!-- job_posting.txt -->
Senior Backend Engineer — Notion

About Notion:
Notion is the connected workspace where better, faster work happens.
We believe everyone should be able to organize their work and life —
and that tools should adapt to people, not the other way around.

About the Role:
We are looking for a Senior Backend Engineer to work on our core
infrastructure team. You will build and maintain the systems that
power Notion's real-time collaboration features, serving millions
of users worldwide.

What You'll Do:
- Design and implement scalable backend services in Python and Go
- Build real-time collaboration infrastructure (CRDTs, WebSockets)
- Optimize database performance for high-throughput workloads
- Work with PostgreSQL, Redis, and Kafka at scale
- Contribute to system architecture decisions
- Mentor engineers and review code

What We're Looking For:
- 5+ years of backend engineering experience
- Strong proficiency in Python (Go experience is a plus)
- Experience building real-time or collaborative systems
- Deep knowledge of PostgreSQL and distributed databases
- Experience with message queues (Kafka, RabbitMQ)
- Familiarity with Docker, Kubernetes, and cloud infrastructure (AWS)
- Excellent written and verbal communication skills
- B.S. or M.S. in Computer Science (or equivalent experience)

Nice to Have:
- Experience with CRDTs or operational transform
- Contributions to open-source projects
- Experience at a high-growth startup

Compensation: $190k-$250k + equity
Location: San Francisco (hybrid) or Remote (US)
```

Save this as `job_posting.txt` in your project root.

## Run the Pipeline

```bash
python main.py --job job_posting.txt --resume sample_resume.md
```

You should see output like:

```
🔍 Job Application Agent
==================================================

[1/4] Analyzing job posting...
  Saved: output/tailored_resume.md
  Saved: output/cover_letter.md
  Saved: output/review.md

==================================================
📋 Summary
==================================================
Company:  Notion
Role:     Senior Backend Engineer
Review:   ✅ PASSED
Time:     28.3s

📁 Output files saved to ./output/
   - tailored_resume.md
   - cover_letter.md
   - review.md
```

## Inspect the Output

Open each file and check the quality:

```bash
# View the tailored resume
cat output/tailored_resume.md

# View the cover letter
cat output/cover_letter.md

# View the review
cat output/review.md
```

### What to Look For

**In the tailored resume:**
- Keywords from the job posting woven into bullet points (Python, PostgreSQL, Redis, Kafka)
- Experience reframed for backend/infrastructure focus
- Relevant skills listed first

**In the cover letter:**
- Specific mention of Notion (not generic)
- 2-3 experience examples mapped to job requirements
- Reference to Notion's culture or values
- Under 400 words

**In the review:**
- Numeric scores for each quality dimension
- Specific strengths and improvement suggestions
- PASS or NEEDS_REVISION verdict

## Adding Streaming Output

For a better user experience, you can add progress callbacks. Update `main.py` to show which agent is running:

```python
# Alternative: Run with step-by-step output using stream
def run_with_streaming(job_posting: str, resume: str):
    """Run the pipeline with visible progress for each step."""
    agent_names = {
        "analyze": "[1/4] Analyzing job posting",
        "tailor": "[2/4] Tailoring resume",
        "writer": "[2/4] Writing cover letter",
        "review": "[3/4] Reviewing application",
        "save": "[4/4] Saving outputs",
    }

    for event in app.stream(
        {"job_posting": job_posting, "resume": resume},
        stream_mode="updates",
    ):
        for node_name in event:
            label = agent_names.get(node_name, node_name)
            print(f"{label}... done")
```

The `stream()` method yields events as each node completes, so you can show real-time progress.

## Your Final Project Structure

```
job-application-agent/
├── agents/
│   ├── __init__.py
│   ├── analyzer.py       ✅ Job Analyzer
│   ├── tailor.py         ✅ Resume Tailor
│   ├── writer.py         ✅ Cover Letter Writer
│   └── reviewer.py       ✅ Application Reviewer
├── output/
│   ├── tailored_resume.md  ✅ Generated
│   ├── cover_letter.md     ✅ Generated
│   └── review.md           ✅ Generated
├── state.py              ✅ Shared state definition
├── graph.py              ✅ LangGraph workflow
├── utils.py              ✅ Configuration and helpers
├── main.py               ✅ CLI entry point
├── sample_resume.md      ✅ Test resume
├── job_posting.txt       ✅ Test job posting
├── .env                  ✅ API key
└── requirements.txt      ✅ Dependencies
```

---

**Reference:** [LangGraph Streaming](https://langchain-ai.github.io/langgraph/concepts/streaming/) · [LangGraph How-To Guides](https://langchain-ai.github.io/langgraph/how-tos/)

[← Wire the Graph](08-wire-the-graph.md) | [Next: Step 10 - What's Next →](10-whats-next.md)
