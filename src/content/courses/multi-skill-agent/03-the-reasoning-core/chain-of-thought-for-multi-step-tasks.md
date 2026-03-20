# Chain-of-Thought for Multi-Step Tasks

**One-Line Summary**: Explicit step-by-step reasoning (think, plan, act) dramatically reduces errors when agents must chain multiple tool calls to complete complex tasks.

**Prerequisites**: `skill-selection-reasoning.md`, `system-prompt-as-agent-dna.md`

## What Is Chain-of-Thought for Agents?

Imagine asking someone to plan a dinner party while they are blindfolded and can only act on one instruction at a time. If they just start grabbing ingredients without a plan, they will forget the appetizer, burn the main course, and never make dessert. But if they first pause, think through the full menu, write down the steps, and then execute them one at a time — checking progress after each — the dinner comes together.

Chain-of-thought (CoT) prompting for agents works the same way. Instead of letting the model immediately fire off a tool call in response to a request, you instruct it to first *think* about what needs to happen, *plan* the sequence of steps, and only *then* act on the first step. After each tool result comes back, the model reviews the result, updates its plan if needed, and executes the next step.

This pattern is especially critical for multi-step tasks where the output of one tool becomes the input of the next. Without CoT, the model treats each step independently and frequently loses track of the overall goal. With CoT, error rates on 3+ step tasks drop by 30-50% in empirical benchmarks.

## How It Works

### The Think-Plan-Act Pattern

The core pattern adds an explicit reasoning phase before every action. You encode this in the system prompt.

```python
SYSTEM_PROMPT = """
Before taking any action, you MUST follow this process:

**Think**: Analyze the user's request. What is the goal? What information
do you have? What information do you need?

**Plan**: List the steps required to achieve the goal. Number them.
Identify which tool each step requires.

**Act**: Execute only the FIRST step in your plan. Wait for the result
before proceeding.

After each tool result, re-evaluate your plan. The result may change
what you need to do next.

Format your reasoning like this:
<think>
[Your analysis of the current situation]
</think>
<plan>
1. [First step] — using [tool_name]
2. [Second step] — using [tool_name]
3. [Final step] — respond to user
</plan>
<act>
[Tool call for step 1]
</act>
"""
```

### Before and After: The Impact of CoT

Here is a real scenario showing how CoT changes agent behavior.

**Task**: "Find the top-selling product last month and email the report to the sales team."

**Without CoT** (the model just acts):
```
Step 1: Agent calls send_email with an empty report
        (it hasn't queried the data yet)
→ Error: email sent with no content
Step 2: Agent calls query_database for top products
→ Gets results
Step 3: Agent calls send_email again with the results
→ Success, but the first empty email already confused the team
Total: 3 steps, 1 error, 1 wasted email
```

**With CoT** (the model thinks first):
```
<think>
The user wants two things: (1) find the top-selling product, and
(2) email a report about it. I need the data before I can compose
the email.
</think>
<plan>
1. Query the database for top-selling products last month
2. Format the results into a report
3. Send the report via email to the sales team
</plan>
<act>
Step 1: query_database("SELECT product_name, SUM(quantity) as total
FROM orders WHERE order_date >= '2025-02-01' GROUP BY product_name
ORDER BY total DESC LIMIT 5")
</act>

[Result arrives]

<think>
Got the top 5 products. The #1 seller was Widget Pro with 1,247 units.
Now I can compose and send the report.
</think>
<act>
Step 2: send_email(to="sales-team@acme.com", subject="Top Products Report - Feb 2025", body="...")
</act>

Total: 2 steps, 0 errors
```

### Scratchpad Patterns

A scratchpad is an extended form of CoT where the agent maintains a running workspace of intermediate results, decisions, and open questions. This is particularly useful for tasks requiring 5+ steps.

```python
SCRATCHPAD_PROMPT = """
Maintain a scratchpad in your reasoning that tracks:
- **Goal**: The user's original request (never changes)
- **Progress**: What you've accomplished so far
- **Current data**: Key results from previous tool calls
- **Next step**: What you need to do next
- **Open questions**: Anything you're unsure about

Update the scratchpad after each tool result.

Example:
<scratchpad>
Goal: Generate Q4 revenue report and save to Google Drive
Progress: [2/4 steps complete]
  ✓ Queried revenue data for Q4
  ✓ Aggregated by region
  - Generate formatted report
  - Upload to Google Drive
Current data: Total Q4 revenue = $2.4M, Top region = West ($890K)
Next step: Format data into report template
Open questions: None
</scratchpad>
"""
```

### Self-Prompting Techniques

Self-prompting is when you instruct the agent to ask itself guiding questions before acting. This catches edge cases that direct CoT might miss.

```python
SELF_PROMPT = """
Before each tool call, ask yourself:
1. "Do I have all the information I need for this call?"
2. "Could this call fail? What would I do if it fails?"
3. "Is this the most efficient next step, or am I skipping something?"
4. "After this call, will I be closer to the user's goal?"

If any answer is "no" or uncertain, reconsider your plan.
"""
```

Here is self-prompting catching an error before it happens:

```
User: "Delete all inactive users from the database."

<think>
Self-check:
1. Do I have all info? — No. I don't know what "inactive" means.
   Is it users who haven't logged in for 30 days? 90 days? Ever?
2. Could this fail? — Worse: it could succeed incorrectly and
   delete the wrong users.
3. Most efficient? — I should ask for clarification first.
4. Closer to goal? — Not if I guess wrong.

Decision: Ask the user to define "inactive" before proceeding.
</think>

I'd like to help with that, but I want to make sure I delete the right
users. How do you define "inactive"? For example:
- Users who haven't logged in for 30+ days?
- Users whose accounts are marked as deactivated?
- Users who never completed registration?
```

Without self-prompting, the agent might have run `DELETE FROM users WHERE last_login IS NULL` — a potentially catastrophic action.

### Structured Output for CoT

Some frameworks extract the reasoning into structured fields rather than free text. This makes the plan programmatically inspectable.

```python
from pydantic import BaseModel
from typing import List, Optional

class ReasoningStep(BaseModel):
    thought: str
    tool_name: Optional[str]
    tool_params: Optional[dict]
    expected_result: str

class AgentPlan(BaseModel):
    goal: str
    steps: List[ReasoningStep]
    current_step: int

# The LLM outputs this structure before acting
plan = AgentPlan(
    goal="Find and email top-selling product report",
    steps=[
        ReasoningStep(
            thought="Need sales data first",
            tool_name="query_database",
            tool_params={"query": "SELECT ..."},
            expected_result="List of top products with quantities"
        ),
        ReasoningStep(
            thought="Format and send the report",
            tool_name="send_email",
            tool_params={"to": "sales@acme.com", "body": "..."},
            expected_result="Confirmation that email was sent"
        ),
    ],
    current_step=0
)
```

## Why It Matters

### Multi-Step Error Rates Compound Without Planning

In a 5-step task with a 90% success rate per step, the overall success rate is 0.9^5 = 59%. Adding CoT typically raises per-step accuracy to 95-97%, yielding 77-86% overall success. For a 10-step task, the difference is even starker: 35% vs 60-74%. CoT does not eliminate errors, but it prevents the compounding from becoming catastrophic.

### CoT Makes Agent Behavior Debuggable

When an agent fails silently, you have no idea where it went wrong. With CoT, every step includes the model's reasoning, so you can trace exactly which assumption was wrong or which step went off track. This turns opaque failures into inspectable logs.

## Key Technical Details

- CoT adds 50-150 tokens of overhead per step but reduces total steps by 20-40% on multi-step tasks
- The net token cost is typically lower with CoT because fewer retries are needed
- Empirical benchmarks show CoT reduces tool-chaining errors by 30-50% on tasks with 3+ steps
- Scratchpad patterns are most valuable for tasks exceeding 5 steps where the model risks "forgetting" earlier context
- Self-prompting adds ~10% latency per step but catches 15-25% of would-be errors before they happen
- CoT is less impactful on single-step tasks — the overhead is not justified when there is nothing to plan
- Structured CoT output (JSON plans) enables programmatic plan validation before execution

## Common Misconceptions

**"CoT is just the model talking to itself and wasting tokens"**: The reasoning tokens are not waste — they are computation. LLMs generate better outputs when they "think out loud" because each token of reasoning provides additional context for the next decision. This is analogous to how humans solve complex problems more reliably on paper than in their heads.

**"You can just tell the model to 'think step by step' and it works"**: The generic "think step by step" instruction provides a modest boost, but structured CoT — with explicit think/plan/act phases, scratchpad templates, and self-prompting questions — performs significantly better. The structure gives the model a framework to organize its reasoning rather than rambling.

**"CoT eliminates the need for good tool descriptions"**: CoT and tool descriptions are complementary, not substitutes. CoT helps the model reason about *when* to use a tool, but the tool description determines *which* tool to pick. An agent with great CoT but vague tool descriptions will reason beautifully about the wrong tool.

## Connections to Other Concepts

- `skill-selection-reasoning.md` — CoT improves tool selection by forcing the model to reason about which tool fits before acting
- `system-prompt-as-agent-dna.md` — The CoT pattern is encoded in the system prompt as a behavioral instruction
- `when-to-stop.md` — CoT helps the agent recognize when the goal is achieved and it should stop
- `conversation-as-working-memory.md` — CoT reasoning becomes part of the conversation and serves as working memory for future steps
- `context-window-pressure.md` — CoT tokens accumulate in the context window and must be budgeted

## Further Reading

- Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (2022) — The foundational CoT paper
- Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2023) — The think-act pattern that most agent frameworks implement
- Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023) — Self-reflection patterns for agents that learn from their mistakes
- Anthropic, "Prompt Engineering Guide: Chain of Thought" (2024) — Practical CoT patterns for Claude-based agents
