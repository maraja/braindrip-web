# Step 6: The Cover Letter Writer

One-Line Summary: Build the Cover Letter Writer agent that drafts a targeted, compelling cover letter using the job analysis and original resume.

Prerequisites: Resume Tailor from Step 5

---

## The Cover Letter Writer's Job

Given the Job Analyzer's output and the user's resume, the Cover Letter Writer:

1. Opens with a specific hook — why this company, why this role
2. Maps the candidate's strongest experiences to the job's top requirements
3. Matches the company's tone and culture (from the Analyzer's culture notes)
4. Closes with a confident, forward-looking call to action
5. Keeps it concise — under 400 words

> **Important:** The Cover Letter Writer uses the **original resume**, not the tailored one. This is intentional — the cover letter should complement the resume, not repeat it. If both agents read the same tailored resume, they would produce redundant content.

## Build the Agent

```python
# agents/writer.py
# ==========================================
# Cover Letter Writer — drafts targeted cover letters
# ==========================================

from state import JobApplicationState
from utils import get_llm


WRITER_PROMPT = """You are an expert cover letter writer who has helped
thousands of candidates land interviews at top companies. You write
cover letters that are specific, genuine, and compelling.

## Job Details
Company: {company_name}
Title: {job_title}

Requirements:
{requirements}

Culture Notes:
{culture_notes}

## Candidate's Resume
{resume}

## Your Instructions

Write a cover letter following these rules:

1. **Opening hook**: Start with something specific about the company or
   role that shows genuine interest. Never start with "I am writing to
   apply for..." — it's the most generic opening in existence.

2. **Match top 3 requirements**: Identify the three most important
   requirements and show how the candidate's experience directly
   addresses each one. Use specific examples from the resume.

3. **Show cultural fit**: Reference the company's values or culture
   (from the culture notes) and connect them to the candidate's
   work style or achievements.

4. **Be concise**: Keep it under 400 words. Hiring managers skim.
   Every sentence must earn its place.

5. **Close with confidence**: End with a forward-looking statement,
   not a passive "I hope to hear from you."

6. **Tone**: Professional but human. No corporate jargon. Write like
   a thoughtful person, not a template.

Output ONLY the cover letter text. No subject line, no commentary.
Start with "Dear Hiring Manager," (or the team name if mentioned in
the posting)."""


def write_cover_letter(state: JobApplicationState) -> dict:
    """Draft a targeted cover letter."""
    llm = get_llm()

    prompt = WRITER_PROMPT.format(
        company_name=state.get("company_name", "the company"),
        job_title=state.get("job_title", "the role"),
        requirements=state.get("requirements", ""),
        culture_notes=state.get("culture_notes", "No culture information available."),
        resume=state["resume"],
    )

    response = llm.invoke(prompt)
    return {"cover_letter": response.content}
```

## Prompt Design: What Makes a Good Cover Letter Prompt

The prompt explicitly bans bad patterns:

- **"Never start with 'I am writing to apply for...'"** — Without this rule, LLMs default to the most generic opening imaginable. Negative constraints are as important as positive ones.

- **"Under 400 words"** — LLMs tend to be verbose. A hard word limit forces conciseness.

- **"No corporate jargon"** — Without this, you get "leverage synergies" and "passionate about driving impact." Real people do not talk like that.

These negative constraints make as much difference as the positive instructions. When writing agent prompts, think about what bad output looks like and explicitly forbid it.

## Why Parallel Execution Matters

In our graph, the Resume Tailor and Cover Letter Writer both depend on the Job Analyzer but not on each other:

```
Job Analyzer
     │
     ├──► Resume Tailor      (needs: requirements, key_skills, resume)
     │
     └──► Cover Letter Writer (needs: requirements, culture_notes, resume)
```

LangGraph can run both in parallel. On a practical level, this means the pipeline completes faster — both LLM calls happen simultaneously instead of one after the other.

We will wire this up in Step 8 when we build the full graph.

## Test the Cover Letter Writer

```python
# test_writer.py
# ==========================================
# Test the Cover Letter Writer with mock state
# ==========================================

from agents.writer import write_cover_letter
from utils import load_file

resume = load_file("sample_resume.md")

mock_state = {
    "resume": resume,
    "company_name": "DataFlow Inc.",
    "job_title": "Senior Python Developer",
    "requirements": """
    - 5+ years Python experience
    - Strong FastAPI or Django experience
    - Distributed systems (Kafka, RabbitMQ)
    - PostgreSQL and Redis
    - Docker and Kubernetes
    """,
    "culture_notes": (
        "Remote-first company that values ownership, clear communication, "
        "and shipping fast. Async collaboration. Startup backed by top-tier VCs."
    ),
    "job_posting": "",
}

result = write_cover_letter(mock_state)
print(result["cover_letter"])
```

```bash
python test_writer.py
```

Check that the cover letter:

- Opens with something specific about DataFlow (not a generic intro)
- References 2-3 specific experiences from the resume
- Mentions remote work, ownership, or shipping fast (culture match)
- Stays under 400 words
- Ends with a confident close

Clean up:

```bash
rm test_writer.py
```

---

[← The Resume Tailor](05-the-resume-tailor.md) | [Next: Step 7 - The Application Reviewer →](07-the-application-reviewer.md)
