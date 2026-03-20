# Step 7: The Application Reviewer

One-Line Summary: Build the Application Reviewer agent that checks the tailored resume and cover letter for quality, consistency, and completeness — then decides if revisions are needed.

Prerequisites: Cover Letter Writer from Step 6

---

## The Reviewer's Job

The Application Reviewer is the quality gate. It receives everything — the job requirements, the tailored resume, and the cover letter — and checks for:

1. **Keyword coverage** — are the key skills from the job posting present in the resume?
2. **Consistency** — do the resume and cover letter tell the same story?
3. **Gaps** — are there requirements the candidate does not address?
4. **Quality** — is the writing clear, professional, and free of errors?
5. **Honesty** — does anything look fabricated or exaggerated?

The Reviewer outputs a structured review with a pass/fail decision. If it fails, the graph can loop back to the agents that need to revise their work.

## Build the Agent

```python
# agents/reviewer.py
# ==========================================
# Application Reviewer — quality gate for the pipeline
# ==========================================

from state import JobApplicationState
from utils import get_llm


REVIEWER_PROMPT = """You are a senior hiring manager and career coach reviewing
a job application package. Your job is to evaluate the quality, consistency,
and completeness of the application materials.

## Job Requirements
Company: {company_name}
Title: {job_title}

Key Skills Required: {key_skills}

Full Requirements:
{requirements}

## Tailored Resume
{tailored_resume}

## Cover Letter
{cover_letter}

## Your Review Criteria

Score each category from 1-5 and provide specific feedback:

1. **Keyword Match (1-5)**: Do the resume and cover letter include the
   key skills from the job posting? List any missing keywords.

2. **Relevance (1-5)**: Is the experience framed in terms relevant to
   this specific role? Or does it read like a generic resume?

3. **Consistency (1-5)**: Do the resume and cover letter tell a coherent
   story? Are there contradictions or mismatches?

4. **Conciseness (1-5)**: Is the writing tight and professional? Or is
   it verbose and padded?

5. **Authenticity (1-5)**: Does the application sound genuine? Flag
   anything that seems fabricated or exaggerated.

## Output Format

SCORES:
- Keyword Match: [1-5]
- Relevance: [1-5]
- Consistency: [1-5]
- Conciseness: [1-5]
- Authenticity: [1-5]
- Overall: [1-5]

STRENGTHS:
[What works well — be specific]

IMPROVEMENTS:
[What should be changed — be specific and actionable]

VERDICT: [PASS or NEEDS_REVISION]

A PASS requires an overall score of 4 or higher. Be honest but constructive."""


def review_application(state: JobApplicationState) -> dict:
    """Review the complete application package."""
    llm = get_llm()

    prompt = REVIEWER_PROMPT.format(
        company_name=state.get("company_name", "Unknown"),
        job_title=state.get("job_title", "Unknown"),
        key_skills=state.get("key_skills", ""),
        requirements=state.get("requirements", ""),
        tailored_resume=state.get("tailored_resume", "No resume provided"),
        cover_letter=state.get("cover_letter", "No cover letter provided"),
    )

    response = llm.invoke(prompt)
    content = response.content

    # Parse the verdict
    review_passed = "VERDICT: PASS" in content.upper()

    return {
        "review": content,
        "review_passed": review_passed,
    }
```

## The Review as a Routing Decision

The `review_passed` field serves double duty. It is both useful feedback for the user and a **routing signal** for the graph. In the next step, we will use it to create a conditional edge:

```
                    ┌─── review_passed=True ───► Save & Finish
Application        │
Reviewer ──────────┤
                    └─── review_passed=False ──► Revise (loop back)
```

This is where LangGraph's conditional edges shine. The Reviewer does not just produce output — it makes a decision that controls the flow of the entire pipeline.

## Test the Reviewer

```python
# test_reviewer.py
# ==========================================
# Test the Application Reviewer with mock data
# ==========================================

from agents.reviewer import review_application

mock_state = {
    "company_name": "DataFlow Inc.",
    "job_title": "Senior Python Developer",
    "key_skills": "Python, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, Kafka, CI/CD",
    "requirements": """
    - 5+ years Python experience
    - Strong FastAPI or Django experience
    - Distributed systems (Kafka, RabbitMQ)
    - PostgreSQL and Redis
    - Docker and Kubernetes
    """,
    "tailored_resume": """# Alex Chen
**Senior Python Developer** | San Francisco, CA

## Experience
### Software Engineer — Acme Corp (2022–Present)
- Architected high-throughput REST APIs with Python and FastAPI,
  serving 50k+ daily active users with PostgreSQL and Redis
- Led migration from monolith to microservices on AWS with Docker
  and Kubernetes, reducing deployment time by 60%
- Built CI/CD pipelines with GitHub Actions for automated testing
  and deployment across 12 microservices

## Skills
Python, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, AWS, CI/CD, Git
""",
    "cover_letter": """Dear Hiring Manager,

DataFlow's mission to build next-generation data infrastructure caught my
attention — particularly your focus on high-throughput pipeline services.

In my current role at Acme Corp, I have spent the last two years doing
exactly this: designing FastAPI services that handle 50k+ daily users,
backed by PostgreSQL and Redis. I led our migration from a monolith to
a microservices architecture on Docker and Kubernetes, which maps directly
to the distributed systems work your team is tackling.

I thrive in remote-first, async environments — my team at Acme operates
across three time zones, and clear written communication is how we ship.

I would welcome the chance to discuss how my experience with Python-based
data services could accelerate DataFlow's platform roadmap.

Best regards,
Alex Chen""",
    "job_posting": "",
    "resume": "",
    "culture_notes": "",
}

result = review_application(mock_state)
print(result["review"])
print(f"\nPassed: {result['review_passed']}")
```

```bash
python test_reviewer.py
```

The Reviewer should produce scores for each category, list strengths, suggest improvements, and give a PASS or NEEDS_REVISION verdict.

Clean up:

```bash
rm test_reviewer.py
```

## Key Design Decisions

| Decision | Why |
|----------|-----|
| **Numeric scores (1-5)** | Forces the LLM to be specific rather than vague |
| **Structured output format** | Makes the review parseable and actionable |
| **Separate `review_passed` flag** | Enables conditional routing in the graph |
| **Specific criteria** | Each score maps to a real quality dimension hiring managers care about |
| **"Be honest but constructive"** | Without this, LLMs tend to be overly positive |

---

[← The Cover Letter Writer](06-the-cover-letter-writer.md) | [Next: Step 8 - Wire the Graph →](08-wire-the-graph.md)
