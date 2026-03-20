# Step 4: The Job Analyzer

One-Line Summary: Build the first agent node — the Job Analyzer — that takes a raw job posting and extracts structured requirements, skills, and company information.

Prerequisites: LangGraph fundamentals from Step 3

---

## Define the Shared State

Before building any agent, we need the state that will flow through the entire graph. Create `state.py`:

```python
# state.py
# ==========================================
# Shared state for the job application pipeline
# ==========================================
# Every node in the graph reads from and writes to this state.
# Each field represents one stage of the pipeline's output.

from typing import TypedDict


class JobApplicationState(TypedDict, total=False):
    # --- Inputs ---
    job_posting: str            # Raw job posting text
    resume: str                 # User's original resume (Markdown)

    # --- Job Analyzer output ---
    company_name: str           # Extracted company name
    job_title: str              # Extracted job title
    requirements: str           # Structured requirements and qualifications
    key_skills: str             # Comma-separated list of required skills
    culture_notes: str          # Notes about company culture and values

    # --- Resume Tailor output ---
    tailored_resume: str        # Rewritten resume targeting this role

    # --- Cover Letter Writer output ---
    cover_letter: str           # Targeted cover letter

    # --- Application Reviewer output ---
    review: str                 # Quality review with scores and suggestions
    review_passed: bool         # Whether the application meets quality bar
```

`total=False` means fields are optional — not every field is present at the start. The Job Analyzer populates the first group, the Resume Tailor populates the next, and so on.

## The Job Analyzer's Role

The Job Analyzer is the first node in the pipeline. Its job:

1. Read the raw job posting
2. Extract the company name and job title
3. Identify required skills, qualifications, and experience
4. Note anything about company culture or values
5. Structure everything so the downstream agents can use it

This is the foundation — every other agent depends on the Analyzer's output.

## Build the Agent

```python
# agents/analyzer.py
# ==========================================
# Job Analyzer — extracts structured info from job postings
# ==========================================

from state import JobApplicationState
from utils import get_llm


ANALYZER_PROMPT = """You are an expert job posting analyst. Your task is to
extract structured information from a job posting.

Analyze the following job posting and extract:

1. **Company Name**: The hiring company
2. **Job Title**: The exact role title
3. **Requirements**: A structured list of:
   - Required years of experience
   - Required technical skills
   - Required soft skills
   - Required education or certifications
   - Nice-to-have qualifications
4. **Key Skills**: A comma-separated list of the most important technical
   skills mentioned (these will be used to tailor a resume)
5. **Culture Notes**: Any hints about company culture, values, work style,
   or what kind of person would thrive in this role

Format your response exactly like this:

COMPANY: [company name]
TITLE: [job title]

REQUIREMENTS:
[structured bullet list]

KEY SKILLS: [skill1, skill2, skill3, ...]

CULTURE NOTES:
[observations about culture and values]

---

Job Posting:
{job_posting}"""


def analyze_job(state: JobApplicationState) -> dict:
    """Extract structured information from the job posting."""
    llm = get_llm()

    prompt = ANALYZER_PROMPT.format(job_posting=state["job_posting"])
    response = llm.invoke(prompt)
    content = response.content

    # Parse the structured response
    result = {
        "requirements": content,  # Full analysis for downstream agents
        "key_skills": "",
        "company_name": "",
        "job_title": "",
        "culture_notes": "",
    }

    # Extract individual fields from the formatted response
    for line in content.split("\n"):
        line = line.strip()
        if line.startswith("COMPANY:"):
            result["company_name"] = line.replace("COMPANY:", "").strip()
        elif line.startswith("TITLE:"):
            result["job_title"] = line.replace("TITLE:", "").strip()
        elif line.startswith("KEY SKILLS:"):
            result["key_skills"] = line.replace("KEY SKILLS:", "").strip()

    # Extract culture notes (everything after "CULTURE NOTES:")
    if "CULTURE NOTES:" in content:
        result["culture_notes"] = content.split("CULTURE NOTES:")[-1].strip()

    return result
```

## How the Prompt Works

The prompt is highly structured for a reason. By asking the LLM to format its response with clear labels (`COMPANY:`, `TITLE:`, `KEY SKILLS:`), we can reliably parse the output into separate state fields.

This is a practical pattern for multi-agent systems: **use structured prompts to produce parseable output** that downstream nodes can consume.

## Test the Analyzer

```python
# test_analyzer.py
# ==========================================
# Test the Job Analyzer in isolation
# ==========================================

from agents.analyzer import analyze_job

# A realistic job posting for testing
test_posting = """
Senior Python Developer — DataFlow Inc.

About Us:
DataFlow is a fast-growing data infrastructure startup backed by top-tier VCs.
We value ownership, clear communication, and shipping fast. Our team is remote-first
and we believe in async collaboration.

The Role:
We are looking for a Senior Python Developer to join our platform team.
You will design and build the core data pipeline services that power our product.

Requirements:
- 5+ years of professional Python experience
- Strong experience with FastAPI or Django
- Experience with distributed systems and message queues (Kafka, RabbitMQ)
- Proficiency in PostgreSQL and Redis
- Familiarity with Docker and Kubernetes
- Experience with CI/CD pipelines
- Strong communication skills and ability to work independently

Nice to Have:
- Experience with Apache Spark or Flink
- Contributions to open-source projects
- Experience mentoring junior developers

Benefits:
- Competitive salary ($180k-$220k)
- Remote-first culture
- Equity package
- Unlimited PTO
"""

result = analyze_job({"job_posting": test_posting, "resume": ""})

print(f"Company: {result['company_name']}")
print(f"Title: {result['job_title']}")
print(f"Key Skills: {result['key_skills']}")
print(f"\nFull Analysis:\n{result['requirements']}")
```

```bash
python test_analyzer.py
```

You should see the company name, job title, and a structured breakdown of requirements. Verify that:

- The company name and title are correctly extracted
- Key skills are comma-separated
- Requirements are organized into categories

Clean up:

```bash
rm test_analyzer.py
```

## Key Design Decisions

| Decision | Why |
|----------|-----|
| **Structured prompt format** | Makes parsing reliable — downstream agents need specific fields |
| **Full analysis in `requirements`** | The Resume Tailor and Cover Letter Writer get the complete picture |
| **Separate `key_skills` field** | The Resume Tailor uses this to match keywords for ATS optimization |
| **`culture_notes` extraction** | The Cover Letter Writer uses this to match tone and values |

---

**Reference:** [LangGraph State Management](https://langchain-ai.github.io/langgraph/concepts/low_level/#state) · [LangChain Chat Models](https://python.langchain.com/docs/integrations/chat/)

[← LangGraph Fundamentals](03-langgraph-fundamentals.md) | [Next: Step 5 - The Resume Tailor →](05-the-resume-tailor.md)
