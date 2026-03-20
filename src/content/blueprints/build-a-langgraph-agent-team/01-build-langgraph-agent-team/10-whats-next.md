# Step 10: What's Next

One-Line Summary: Extend your agent team with different LLMs, human-in-the-loop, persistence, and a web interface — plus a comparison of multi-agent approaches.

Prerequisites: Working pipeline from Step 9

---

## What You Built

You now have a multi-agent job application assistant that:

- Analyzes job postings and extracts structured requirements
- Tailors a resume with ATS-optimized keywords and framing
- Writes a targeted cover letter that matches company culture
- Reviews everything for quality, consistency, and completeness
- Runs parallel branches for speed
- Loops back for revision when quality is insufficient
- Saves all output to files

That is a real, useful multi-agent system built on LangGraph.

## Swap the LLM Provider

LangGraph works with any LangChain-compatible model. Here is how to swap providers:

```python
# utils.py — swap the LLM provider

# OpenAI (current)
from langchain_openai import ChatOpenAI
def get_llm():
    return ChatOpenAI(model="gpt-4o", temperature=0.3)

# Anthropic (Claude)
from langchain_anthropic import ChatAnthropic
def get_llm():
    return ChatAnthropic(model="claude-sonnet-4-20250514", temperature=0.3)

# Google (Gemini)
from langchain_google_genai import ChatGoogleGenerativeAI
def get_llm():
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)

# Local (Ollama)
from langchain_ollama import ChatOllama
def get_llm():
    return ChatOllama(model="llama3.1")
```

Because every agent calls `get_llm()`, changing this one function swaps the model everywhere. You can even use different models per agent — a cheap, fast model for analysis and a powerful model for writing.

## Add Human-in-the-Loop

LangGraph supports interrupting the graph to get human approval before continuing. This is valuable for the Review step — let the user approve or request changes:

```python
from langgraph.checkpoint.memory import MemorySaver

# Compile with checkpointing
memory = MemorySaver()
app = build_graph().compile(
    checkpointer=memory,
    interrupt_before=["save"],  # Pause before saving
)

# Run until the interrupt
config = {"configurable": {"thread_id": "job-app-1"}}
result = app.invoke(initial_state, config)

# Show the review to the user
print(result["review"])
user_decision = input("Save these files? (y/n): ")

if user_decision == "y":
    # Resume from where we paused
    app.invoke(None, config)
else:
    # Modify state and re-run
    app.update_state(config, {"review_passed": False})
    app.invoke(None, config)
```

The `interrupt_before` parameter pauses execution at the specified node, saves the full state to the checkpointer, and lets you resume later.

## Add Persistence

For long-running or resumable workflows, replace `MemorySaver` with a database-backed checkpointer:

```python
# SQLite persistence
from langgraph.checkpoint.sqlite import SqliteSaver

with SqliteSaver.from_conn_string("./agent_state.db") as checkpointer:
    app = build_graph().compile(checkpointer=checkpointer)

    # State survives server restarts
    result = app.invoke(initial_state, config)
```

This means users can start a job application, close their laptop, and resume later exactly where they left off.

## Use the Supervisor Library

For this blueprint, we built the graph manually to teach the fundamentals. For future projects, consider the [`langgraph-supervisor`](https://github.com/langchain-ai/langgraph-supervisor-py) library which provides a higher-level abstraction:

```python
from langgraph_supervisor import create_supervisor
from langgraph.prebuilt import create_react_agent

# Create specialized agents
analyzer = create_react_agent(
    model=llm,
    tools=[analyze_posting_tool],
    name="job_analyzer",
    prompt="You analyze job postings and extract requirements.",
)

tailor = create_react_agent(
    model=llm,
    tools=[rewrite_resume_tool],
    name="resume_tailor",
    prompt="You rewrite resumes to match job requirements.",
)

# Create a supervisor that coordinates them
workflow = create_supervisor(
    [analyzer, tailor],
    model=llm,
    prompt="You manage a team that helps with job applications.",
)

app = workflow.compile()
```

The supervisor pattern uses tool-based handoffs — the supervisor calls `transfer_to_job_analyzer` or `transfer_to_resume_tailor` as tools. Less control than manual wiring, but faster to set up.

## Build a Web Interface

Wrap your pipeline in a simple web app using Streamlit:

```python
# app_ui.py
import streamlit as st
from graph import app

st.title("Job Application Assistant")

job_text = st.text_area("Paste the job posting:", height=200)
resume_text = st.text_area("Paste your resume:", height=200)

if st.button("Generate Application"):
    with st.spinner("Running agent pipeline..."):
        result = app.invoke({
            "job_posting": job_text,
            "resume": resume_text,
        })

    st.subheader("Tailored Resume")
    st.markdown(result.get("tailored_resume", ""))

    st.subheader("Cover Letter")
    st.markdown(result.get("cover_letter", ""))

    st.subheader("Review")
    st.markdown(result.get("review", ""))
```

```bash
pip install streamlit
streamlit run app_ui.py
```

## Comparing Multi-Agent Approaches

Having seen three approaches across these blueprints, here is how they compare:

| Aspect | Raw SDK (Claude) | ADK (Google) | LangGraph |
|--------|-------------------|-------------|-----------|
| **Agent loop** | You build it | Runner handles it | Graph handles it |
| **Multi-agent** | Manual coordination | Sub-agents list | Graph with parallel branches |
| **State management** | You build it | Built-in sessions | Built-in state graph |
| **Parallel execution** | You thread it | Not built-in | Automatic from graph edges |
| **Conditional routing** | If/else in your code | Agent decides | Conditional edges |
| **Human-in-the-loop** | You build it | Not built-in | `interrupt_before` |
| **Persistence** | You build it | DatabaseSessionService | Checkpointers (SQLite, Postgres) |
| **Learning curve** | Low (just Python) | Medium (ADK concepts) | Medium (graph concepts) |
| **Best for** | Understanding internals | Google ecosystem | Complex multi-agent workflows |

Choose based on your needs:
- **Raw SDK** when you want full control and understanding
- **ADK** when you are in the Google ecosystem and want fast deployment
- **LangGraph** when you have complex multi-agent flows with branching and parallelism

## Where to Go From Here

- **[LangGraph Documentation](https://langchain-ai.github.io/langgraph/)** — Complete reference for all features
- **[LangGraph Tutorials](https://langchain-ai.github.io/langgraph/tutorials/)** — Official multi-agent tutorials
- **[LangGraph Supervisor](https://github.com/langchain-ai/langgraph-supervisor-py)** — Higher-level multi-agent library
- **[LangSmith](https://smith.langchain.com/)** — Tracing and debugging for LangChain/LangGraph apps
- **[LangGraph Platform](https://langchain-ai.github.io/langgraph/concepts/langgraph_platform/)** — Hosted deployment for LangGraph apps

You built a multi-agent team that solves a real problem. Now make it yours — add more agents, try different models, build a UI, or deploy it for your team.

---

[← Run Locally](09-run-locally.md)
