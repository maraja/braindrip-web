# State Machines and Graphs

**One-Line Summary**: State machines and directed graphs provide deterministic control flow structures that make agent behavior predictable, debuggable, and reliable.

**Prerequisites**: Agent orchestration, ReAct pattern, tool use and function calling

## What Is State Machines and Graphs?

Imagine a vending machine. It has a fixed set of states: idle, accepting coins, selecting product, dispensing. From each state, only certain transitions are possible -- you cannot dispense before selecting, you cannot select before paying. A state machine for agents works the same way: you define the valid states your agent can be in and the allowed transitions between them. This eliminates entire categories of bugs by making illegal state transitions impossible.

A directed graph generalizes this idea. Nodes represent states or actions (call the LLM, invoke a tool, check a condition), and edges represent transitions that may be conditional. Unlike a pure finite state machine, a graph-based agent can have dynamic routing where the LLM decides which edge to follow. This gives you the reliability of structured control flow with the flexibility of model-driven decisions.

*Recommended visual: LangGraph-style state graph showing nodes (plan, execute, evaluate) connected by conditional edges, with a cycle from evaluate back to execute when tests fail, and an END terminal — see [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)*

The key insight is that most agent tasks have a natural graph structure. A customer support agent moves through: understand_issue -> classify_issue -> (billing | technical | general) -> resolve -> confirm. Encoding this as a graph means the agent cannot accidentally skip classification or resolve before understanding. LangGraph was built on exactly this principle: agents are compiled state graphs where the structure constrains behavior while the LLM handles reasoning within each node.

## How It Works

### Finite State Machines for Agents
A finite state machine (FSM) consists of states, transitions, and an initial state. For an agent, states might include "planning," "executing_tool," "waiting_for_human," "synthesizing_result," and "done." Transitions fire when conditions are met: the planning state transitions to executing_tool when the LLM outputs a tool call; executing_tool transitions to synthesizing_result when the tool returns output. FSMs are fully deterministic -- given the same state and input, the same transition always fires. This makes them ideal for compliance-critical workflows where you need auditable, reproducible behavior.

### Directed Graphs with Conditional Edges
A directed graph extends the FSM by allowing edges with complex conditions and multiple paths from a single node. In LangGraph, you define a `StateGraph` with typed state, add nodes (Python functions that transform the state), and add edges that can be conditional. A conditional edge inspects the current state and returns the name of the next node. For example, after a "classify" node, a conditional edge might route to "billing_handler" if the classification is "billing" or "tech_handler" if it is "technical." The graph is compiled into an executable that manages state flow automatically.

*Recommended visual: Comparison of a finite state machine (fixed transitions, deterministic) vs a directed graph with conditional edges and cycles (LLM-driven routing, dynamic), showing how graphs extend FSMs for agent use — see [Harel, 1987 — Statecharts](https://www.sciencedirect.com/science/article/pii/0167642387900359)*

### Cycles and Iterative Refinement
Unlike simple DAGs (directed acyclic graphs), agent graphs often need cycles. A code-writing agent might loop: write_code -> run_tests -> (if tests fail) -> analyze_errors -> write_code. LangGraph supports cycles explicitly. You define a conditional edge from the test node back to the writing node, with a termination condition (tests pass, or max iterations reached). Without an explicit cycle structure, agents implement loops via the LLM deciding to "try again," which is less reliable and harder to debug.

### State Typing and Validation
The state flowing through a graph should be typed. LangGraph uses Python's TypedDict or Pydantic models to define state schemas. Each node declares what state keys it reads and writes. This catches bugs at graph compilation time rather than runtime: if a node tries to read a state key that no previous node writes, the graph fails to compile. State typing also enables automatic serialization for checkpointing, as the framework knows exactly what needs to be persisted.

## Why It Matters

### Predictability and Reliability
LLMs are inherently stochastic -- the same prompt can produce different outputs. Wrapping the LLM in a state machine constrains this stochasticity. The model can still reason freely within each node, but the overall execution flow follows a defined structure. This is why production agents increasingly use graph-based architectures: they provide guardrails that prevent the agent from going off the rails entirely.

### Debuggability
When an agent fails in a graph-based system, you can pinpoint exactly which node failed, what the state was at that point, and which edge led there. Compare this to a free-form ReAct loop where the agent might have taken 15 actions and the failure could stem from any of them. Graph-based execution produces structured traces that map directly to the visual graph, making debugging a matter of inspecting nodes rather than reading thousands of tokens of conversation.

### Composability
Graphs compose naturally. A high-level agent graph can include a node that is itself an entire subgraph. A "research" node in a report-writing agent might expand into a subgraph with search, read, extract, and synthesize nodes. This hierarchical composition lets you build complex agent systems from well-tested components, similar to how functions compose in programming.

## Key Technical Details

- **LangGraph's `StateGraph`** is parameterized by a state type and compiles into a `CompiledGraph` that can be invoked, streamed, or executed step-by-step
- **The `END` sentinel** in LangGraph marks terminal edges; reaching END halts execution and returns the final state
- **Reducers** define how concurrent writes to the same state key are merged (e.g., appending to a list vs overwriting a value)
- **Checkpointers** (SqliteSaver, PostgresSaver) persist state after each node execution, enabling resume, replay, and time-travel debugging
- **The `interrupt` function** pauses graph execution at a node, persists state, and waits for external input (human approval, webhook response)
- **Graph visualization** via `graph.draw_mermaid()` produces a visual diagram of the agent's control flow, invaluable for documentation and debugging
- **Branch nodes** enable fan-out where a single node dispatches to multiple parallel branches, each processing a subset of the work

## Common Misconceptions

- **"State machines make agents too rigid."** The graph defines the macro structure; within each node, the LLM can reason freely. You get structure where it helps (control flow) and flexibility where it helps (reasoning).
- **"Graphs are only for simple workflows."** LangGraph supports cycles, subgraphs, parallel branches, dynamic routing, and human-in-the-loop -- sufficient for arbitrarily complex agent architectures.
- **"You need to define every possible state upfront."** Dynamic edges let the LLM decide the next state at runtime. The graph defines the possible transitions, but the LLM selects among them based on context.
- **"FSMs and graphs are interchangeable."** An FSM is a special case of a directed graph with a single active state and deterministic transitions. Graphs support parallelism, conditional routing, and cycles that pure FSMs cannot express cleanly.

## Connections to Other Concepts

- `agent-orchestration.md` -- State machines and graphs are the underlying formalism that orchestration frameworks use to manage execution flow
- `error-handling-and-retries.md` -- Graph-based agents can define explicit error-handling nodes and retry edges, making failure recovery a first-class part of the control flow
- `event-driven-architectures.md` -- Graph nodes can be triggered by external events, blending deterministic structure with reactive behavior
- `logging-tracing-and-debugging.md` -- Graph execution produces structured traces that map one-to-one with graph nodes, simplifying observability
- `context-window-management.md` -- Each graph node can include a context preparation step that selects the most relevant state to pass to the LLM

## Further Reading

- **LangGraph Documentation (LangChain team, 2024)** -- Definitive guide to building agent applications as compiled state graphs with typed state, checkpointing, and streaming
- **Hopcroft, Motwani, and Ullman, "Introduction to Automata Theory" (2006)** -- Classic textbook on finite state machines, regular languages, and the theoretical foundations underlying agent state machines
- **"Why LangGraph?" (LangChain blog, 2024)** -- Explains the motivation for graph-based agent architectures over simple loop-based approaches, with concrete reliability comparisons
- **Harel, "Statecharts: A Visual Formalism for Complex Systems" (1987)** -- Foundational paper on hierarchical state machines that influenced modern agent graph frameworks
- **XState Documentation (Stately, 2024)** -- JavaScript state machine library that demonstrates how state charts apply to complex UI and backend workflows, with parallels to agent control flow
