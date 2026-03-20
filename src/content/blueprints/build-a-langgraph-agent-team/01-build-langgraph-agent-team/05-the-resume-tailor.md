# Step 5: The Resume Tailor

One-Line Summary: Build the Resume Tailor agent that rewrites a user's resume to match the specific job requirements, skills, and keywords identified by the Job Analyzer.

Prerequisites: Job Analyzer from Step 4

---

## The Resume Tailor's Job

Given the Job Analyzer's output and the user's original resume, the Resume Tailor:

1. Identifies which of the user's experiences match the job requirements
2. Rewrites bullet points to emphasize relevant skills
3. Adds keywords that will pass ATS (Applicant Tracking System) filters
4. Reorders sections to lead with the strongest matches
5. Keeps the resume honest — enhances framing, never fabricates

This agent is the most nuanced. It needs to understand both what the employer wants and what the candidate offers, then bridge the gap.

## Build the Agent

```python
# agents/tailor.py
# ==========================================
# Resume Tailor — rewrites resume for the target role
# ==========================================

from state import JobApplicationState
from utils import get_llm


TAILOR_PROMPT = """You are an expert resume writer and career coach with deep
knowledge of ATS (Applicant Tracking System) optimization. Your task is to
rewrite a candidate's resume to maximize their chances for a specific role.

## Job Analysis
Company: {company_name}
Title: {job_title}

Requirements:
{requirements}

Key Skills to Emphasize: {key_skills}

## Original Resume
{resume}

## Your Instructions

Rewrite the resume following these rules:

1. **Match keywords**: Incorporate the key skills naturally into experience
   bullet points. ATS systems scan for exact keyword matches.

2. **Reframe experience**: Rewrite bullet points to emphasize aspects that
   are most relevant to this specific role. Use the same terminology as
   the job posting.

3. **Quantify impact**: Where possible, add or preserve metrics
   (percentages, numbers, dollar amounts).

4. **Reorder strategically**: Put the most relevant experience and skills
   first. Lead with strength.

5. **Keep it honest**: Enhance framing and emphasis, but never fabricate
   experience, skills, or achievements the candidate does not have.

6. **Format as Markdown**: Use clean, professional Markdown formatting.

Output ONLY the rewritten resume in Markdown format. No commentary or
explanation — just the resume."""


def tailor_resume(state: JobApplicationState) -> dict:
    """Rewrite the resume to match the job requirements."""
    llm = get_llm()

    prompt = TAILOR_PROMPT.format(
        company_name=state.get("company_name", "Unknown"),
        job_title=state.get("job_title", "Unknown"),
        requirements=state.get("requirements", ""),
        key_skills=state.get("key_skills", ""),
        resume=state["resume"],
    )

    response = llm.invoke(prompt)
    return {"tailored_resume": response.content}
```

## Why This Prompt Structure Works

The prompt has three sections, each serving a specific purpose:

1. **Job Analysis section** — gives the LLM full context about what the employer wants. This comes from the Job Analyzer's output (state fields).

2. **Original Resume section** — the raw material the LLM has to work with. It cannot invent experience that is not here.

3. **Instructions section** — numbered rules that constrain behavior. The "keep it honest" rule is especially important — without it, LLMs tend to embellish.

> **Why numbered rules?** LLMs follow numbered instructions more reliably than prose paragraphs. Each rule is a clear, testable constraint.

## Test the Resume Tailor

```python
# test_tailor.py
# ==========================================
# Test the Resume Tailor with mock analyzer output
# ==========================================

from agents.tailor import tailor_resume
from utils import load_file

# Load the sample resume
resume = load_file("sample_resume.md")

# Mock state — pretend the Job Analyzer already ran
mock_state = {
    "resume": resume,
    "company_name": "DataFlow Inc.",
    "job_title": "Senior Python Developer",
    "requirements": """
    - 5+ years Python experience
    - Strong FastAPI or Django experience
    - Distributed systems and message queues (Kafka, RabbitMQ)
    - PostgreSQL and Redis
    - Docker and Kubernetes
    - CI/CD pipelines
    - Strong communication, ability to work independently
    """,
    "key_skills": "Python, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, Kafka, CI/CD",
    "job_posting": "",
}

result = tailor_resume(mock_state)
print(result["tailored_resume"])
```

```bash
python test_tailor.py
```

Compare the output to `sample_resume.md`. You should see:

- **Reframed bullet points** that use the job posting's terminology
- **Keywords woven in** (FastAPI, PostgreSQL, Docker, etc.)
- **Reordered sections** with the most relevant experience first
- **No fabricated experience** — same achievements, better framing

Clean up:

```bash
rm test_tailor.py
```

## What Good Tailoring Looks Like

Here is an example of how the agent might reframe a bullet point:

**Before (generic):**
> Built REST APIs serving 50k daily active users using Python and FastAPI

**After (targeted for the DataFlow posting):**
> Designed and built high-throughput REST APIs with Python and FastAPI serving 50k+ DAU, integrating PostgreSQL for persistent storage and Redis for caching — directly applicable to DataFlow's data pipeline architecture

The second version:
- Adds the keywords `PostgreSQL` and `Redis` (from the job requirements)
- Connects the experience to the target company ("directly applicable to DataFlow's...")
- Keeps the same factual claim (50k DAU, Python, FastAPI)

---

[← The Job Analyzer](04-the-job-analyzer.md) | [Next: Step 6 - The Cover Letter Writer →](06-the-cover-letter-writer.md)
