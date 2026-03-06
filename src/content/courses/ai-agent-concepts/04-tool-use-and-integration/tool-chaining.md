# Tool Chaining

**One-Line Summary**: Tool chaining is the practice of using the output of one tool as the input to the next, enabling agents to complete complex tasks through sequential multi-step tool invocations that build toward a goal.

**Prerequisites**: Function calling, tool selection and routing, state management basics

## What Is Tool Chaining?

Consider how a detective solves a case. They start by interviewing a witness (step 1), which gives them a name. They search that name in a database (step 2), which reveals an address. They visit that address and collect evidence (step 3), which they send to the lab. The lab returns forensic results (step 4), which they compile into a case report (step 5). Each step depends on the output of the previous one, and skipping any step makes the chain collapse. Tool chaining in AI agents follows the same logic: each tool call produces output that becomes the input or context for the next call.

Tool chaining is what elevates an agent from performing single actions to completing real workflows. A user asks "Find all customers who signed up last month and send them a welcome email." This requires: (1) query the customer database with a date filter, (2) retrieve the list of email addresses from the result, (3) fetch the email template, (4) for each customer, personalize the template, (5) call the email API to send each message. No single tool does all of this. The agent must orchestrate a chain of 3-5 (or more) tool calls, managing the data flow between them.

The critical challenge in tool chaining is not the individual calls — it is the intermediate state management. The agent must carry forward results from earlier calls, transform data between the format one tool outputs and the format the next tool expects, handle errors at any point in the chain, and decide whether to continue, retry, or abandon the sequence. This orchestration is where much of the agent's reasoning capability is exercised.

![ReAct interleaved reasoning and acting loop showing Thought, Action, and Observation steps](https://lilianweng.github.io/posts/2023-06-23-agent/react.png)
*Source: [Lilian Weng, "LLM Powered Autonomous Agents" (2023)](https://lilianweng.github.io/posts/2023-06-23-agent/) — The ReAct pattern illustrates tool chaining in action: each Thought-Action-Observation cycle chains the output of one tool call into the reasoning for the next.*

## How It Works

### Sequential Dependency Resolution

The simplest chain is linear: Tool A produces output X, which is passed as input to Tool B, producing output Y, passed to Tool C. The agent plans this chain (sometimes explicitly, sometimes implicitly through step-by-step reasoning) and executes it sequentially. Each step, the agent includes the previous tool's result in its context and decides the next action.

Example chain for "What's the weather like at our CEO's location?":
1. `search_company_directory(query="CEO")` -> returns `{name: "Jane Doe", city: "Seattle"}`
2. `get_weather(location="Seattle")` -> returns `{temp: 55, condition: "Rainy"}`
3. Agent synthesizes: "It's 55°F and rainy in Seattle, where your CEO Jane Doe is located."

### Data Transformation Between Steps

Tool outputs rarely match the exact input format of the next tool. The agent must transform data: extracting fields from JSON objects, converting formats (date strings, number types), aggregating lists, or restructuring data. The LLM handles these transformations naturally as part of its reasoning — it "sees" the output of Tool A and formulates the appropriate input for Tool B.

### Branching and Conditional Chains

Not all chains are linear. The agent may need to branch based on tool output:
- If the search returns no results, try a different search strategy.
- If the API returns an error, retry with modified parameters.
- If the data has multiple items, fan out and process each one (though parallel fan-out is more complex than simple sequential chaining).

These conditional decisions are made by the LLM at each step based on the tool's output.

### Pipeline Construction

For repeating workflows, chains can be formalized into pipelines — predefined sequences of tool calls with variable slots. Frameworks like LangChain (LCEL), Haystack, and Prefect allow developers to define reusable pipelines where data flows through a series of processing steps. The LLM may invoke the entire pipeline as a single meta-tool, or it may step through the pipeline with the ability to make decisions at each stage.

## Why It Matters

### Completing Real Tasks

Real-world tasks almost never map to a single tool call. Booking travel, filing expense reports, debugging code, preparing analyses — these all require multiple steps. Tool chaining is what makes agents useful for actual work, not just answering questions or making isolated API calls.

### Emergent Problem-Solving

When an agent chains tools, it is performing a form of planning and problem decomposition. It breaks a complex goal into sub-goals, maps each to a tool, and sequences them. This emergent capability is one of the most impressive aspects of LLM-based agents: they can construct chains for novel tasks they were never explicitly programmed to handle.

### Error Compounding

The flip side of chaining is that errors compound. If each tool call has a 90% success rate, a chain of 5 calls has a ~59% success rate (0.9^5). This makes error handling, validation, and retry logic at each step critical for practical reliability. Understanding this math explains why agents sometimes fail on multi-step tasks that seem straightforward.

## Key Technical Details

- **Context window pressure**: Each tool call's output consumes context tokens. A chain of 5 calls with 500-token outputs adds 2,500 tokens of intermediate state. For long chains, agents must summarize or discard earlier results to stay within limits.
- **Parallel vs. sequential execution**: When chain steps are independent (e.g., looking up weather in three different cities), they can be executed in parallel. The LLM can request multiple tool calls in a single turn. Dependencies must be sequential.
- **Intermediate state visibility**: The user typically sees only the final result, but developers need visibility into intermediate states for debugging. Logging each tool call's input/output is essential for understanding chain failures.
- **Maximum chain length**: In practice, LLM-orchestrated chains rarely exceed 5-10 steps before reliability degrades. Longer workflows should be broken into sub-chains or handled by explicit orchestration code rather than LLM reasoning.
- **ReAct pattern**: The most common chaining pattern is Reason-Act-Observe (ReAct): the LLM reasons about what to do next, calls a tool, observes the result, then reasons again. This loop naturally produces chains of arbitrary length.
- **Backtracking**: When a chain step fails or produces unexpected results, the agent ideally backtracks — trying an alternative approach rather than proceeding with bad data. Current models handle simple retries but struggle with true backtracking to much earlier steps.
- **Cost accumulation**: Each step in the chain incurs LLM inference cost (the full context is processed at every step) plus tool execution cost. Long chains can become expensive, especially with large context windows.

## Common Misconceptions

- **"The agent plans the entire chain upfront"**: Most agents do not plan complete chains in advance. They use a step-by-step approach (ReAct), deciding the next tool call after observing the result of the current one. Explicit multi-step planning (like writing out a full plan before executing) is possible but less common and not clearly more effective.
- **"Longer chains are more capable"**: Beyond 5-7 steps, chain reliability degrades significantly due to error compounding, context pressure, and the LLM losing track of the original goal. Shorter chains with more capable individual tools are generally more reliable.
- **"Tool chaining is unique to AI agents"**: Chaining is a repackaging of Unix pipes, workflow engines, and functional composition. The novelty is that the LLM dynamically constructs and adapts the chain at runtime based on natural language goals, whereas traditional approaches require pre-programmed chains.
- **"The agent always knows which tools to chain"**: Agents sometimes get stuck mid-chain, unsure how to proceed. Providing planning prompts, few-shot examples of multi-step workflows, and explicit "you can call tools in sequence" instructions helps.

## Connections to Other Concepts

- `function-calling.md` — Each link in the chain is a function call. Tool chaining is the sequential composition of function calls.
- `tool-selection-and-routing.md` — At every step in the chain, the agent must select the right tool for the current sub-task.
- `api-integration.md` — Many chains involve multiple API calls: search a database, then call an external service with the results.
- `code-generation-and-execution.md` — The REPL loop (write code, execute, observe, revise) is a specific form of tool chaining with a single tool.
- `structured-output-for-actions.md` — Reliable data formats between chain steps prevent errors from cascading through the chain.

## Further Reading

- Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (2023) — Foundational paper on the reason-then-act loop that underlies most tool chaining in modern agents.
- Khattab et al., "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines" (2024) — Framework for defining and optimizing multi-step LLM pipelines as composable modules.
- LangChain Documentation, "LangChain Expression Language (LCEL)" (2024) — Practical guide to building composable chains of tool calls with data flow between steps.
- Shinn et al., "Reflexion: Language Agents with Verbal Reinforcement Learning" (2023) — Research on agents that learn from chain failures by reflecting on what went wrong and improving subsequent attempts.
- Anthropic, "Building Effective Agents" (2024) — Practical patterns for building reliable multi-step agent workflows, including chaining and error recovery.
