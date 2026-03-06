# Action Space Design

**One-Line Summary**: The action space defines everything an agent can do — the set of tools, their parameters, and their constraints — and its design is a critical balancing act between expressiveness (enough tools to be useful) and tractability (few enough tools for the LLM to select correctly).

**Prerequisites**: `what-is-an-ai-agent.md`, `agent-loop.md`, `llm-as-reasoning-engine.md`

## What Is Action Space Design?

Imagine equipping a new employee for their first day. If you hand them a laptop with 200 unlabeled applications, they will waste time figuring out which tool does what and frequently pick the wrong one. If you give them only a text editor, they will not be able to do most of their job. The ideal setup is a curated toolkit — 10-15 well-chosen, clearly labeled applications that cover the essential tasks, with the option to request specialized tools when needed. Designing an agent's action space follows exactly this logic.

The action space is the complete set of operations an agent can perform. In LLM-based agents, these operations are represented as tools — functions the LLM can invoke by generating structured calls. Each tool has a name, a description, a parameter schema, and an implementation. When the LLM decides to act, it selects a tool from the action space and provides the required parameters. The agent runtime executes the tool and returns the result as an observation.

Action space design determines the agent's fundamental capabilities and limitations. An agent with access to `read_file`, `write_file`, and `run_command` can accomplish most coding tasks. An agent with only `read_file` can observe but not change anything. An agent with `run_command` but no guardrails can delete the entire file system. The action space is simultaneously the source of the agent's power and the boundary of its safety.

*Recommended visual: A Venn diagram showing three overlapping circles: "Expressiveness," "Safety," and "Tractability" with the optimal action space at the intersection — see [Anthropic, "Tool Use Documentation" (2024)](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)*

## How It Works

### Tool Anatomy

Every tool in the action space has four components:

```json
{
  "name": "read_file",
  "description": "Read the contents of a file at the specified path. Returns the file contents as text with line numbers. Use this to examine source code, configuration files, and documentation.",
  "parameters": {
    "type": "object",
    "properties": {
      "file_path": {
        "type": "string",
        "description": "Absolute path to the file to read"
      },
      "offset": {
        "type": "integer",
        "description": "Line number to start reading from (optional, defaults to 1)"
      },
      "limit": {
        "type": "integer",
        "description": "Maximum number of lines to read (optional, defaults to 2000)"
      }
    },
    "required": ["file_path"]
  },
  "implementation": "// Runtime function that reads the file and returns its contents"
}
```

The **name** must be descriptive and unambiguous. The **description** is critical — it is the primary mechanism the LLM uses to select the correct tool. The **parameter schema** defines the inputs using JSON Schema. The **implementation** is the actual code executed by the runtime (invisible to the LLM).

### Discrete vs. Parameterized Actions

**Discrete actions** have no parameters or only simple selectors. Example: `list_directory` with a `path` parameter. The action space is essentially a finite menu of choices.

**Parameterized actions** accept complex, open-ended parameters. Example: `run_command` with a `command` parameter that can be any shell command. The effective action space is infinite because the parameters can take arbitrary values.

Most production agents use a mix: a discrete set of tools, each with parameterized inputs. The discrete set limits the categories of actions; the parameters provide flexibility within each category. `run_command` is the most powerful and most dangerous pattern — a single parameterized tool that provides access to an effectively unlimited action space.

### The Tool Count Problem

*Recommended visual: A chart showing tool selection accuracy declining as tool count increases, with thresholds at 5, 15, and 30+ tools — see [Patil et al., "Gorilla: Large Language Model Connected with Massive APIs" (2023)](https://arxiv.org/abs/2305.15334)*

Empirical evidence shows a clear relationship between tool count and selection accuracy:

- **1-5 tools**: LLMs select the correct tool 90-98% of the time.
- **6-15 tools**: Accuracy remains high at 85-95%, with occasional confusion between similar tools.
- **16-30 tools**: Accuracy drops to 75-90%. The LLM begins confusing tools with overlapping functionality.
- **30+ tools**: Accuracy drops below 75%. The LLM frequently selects suboptimal tools, generates incorrect parameters, or fails to use the best available tool.

This does not mean agents cannot have more than 30 tools. Strategies for scaling include:

- **Tool categories**: Group tools into categories and have the LLM first select a category, then select a tool within it. This turns one 50-tool selection into two 5-10 tool selections.
- **Dynamic tool loading**: Only present tools relevant to the current task phase. A coding agent in the "investigation" phase sees search/read tools; in the "editing" phase, it sees write/edit tools.
- **Composite tools**: Combine frequently co-used tools into a single tool. Instead of separate `git_add`, `git_commit`, `git_push` tools, provide a single `git_operation` tool with an `operation` parameter.

### Safety Boundaries in the Action Space

Action space design is the primary mechanism for agent safety. Approaches include:

**Allowlists**: The agent can only use explicitly defined tools. It cannot perform any operation not in its tool set. This is the default for most agent frameworks.

**Blocklists**: Within parameterized tools (especially `run_command`), specific operations are blocked. Example: allowing shell commands but blocking `rm -rf /`, `git push --force`, and `sudo` operations.

**Confirmation gates**: Certain tools or parameters require human approval before execution. Example: file writes are auto-approved, but file deletes require confirmation.

**Sandboxing**: Tools operate within a sandboxed environment (container, VM, restricted filesystem). The action space is technically unrestricted, but the blast radius is contained.

**Rate limiting**: Tools that interact with external services are rate-limited to prevent abuse. Example: maximum 10 API calls per minute, maximum 100 file operations per task.

### Tool Description Quality

The LLM selects tools based on their descriptions. Poor descriptions lead to poor tool selection regardless of the LLM's capability. Effective tool descriptions include:

- **What the tool does** (one sentence).
- **When to use it** (specific scenarios).
- **When NOT to use it** (common misuse cases).
- **Parameter details** (what each parameter means, valid values, defaults).
- **Example usage** (one or two concrete examples with parameters).
- **Return value** (what the output looks like).

A good description for a search tool: "Search for files matching a glob pattern. Use this when you need to find files by name or extension (e.g., '**/*.py' for all Python files). Do NOT use this for searching file contents — use the `grep` tool for content search instead. Returns a list of matching file paths sorted by modification time."

## Why It Matters

### Capability Ceiling

An agent cannot do what it has no tool for. If a coding agent lacks a tool for running tests, it cannot verify its changes. If a data analysis agent lacks a tool for creating visualizations, it cannot produce charts. The action space sets the ceiling of the agent's capability; the LLM's reasoning operates within that ceiling.

### Safety Floor

Conversely, the action space sets the floor of the agent's safety. An agent with unrestricted shell access can do anything — including destructive operations. The safety of an autonomous system is only as strong as the constraints on its action space. This is why action space design is a security and safety concern, not just a functionality concern.

### User Experience

The action space shapes the user experience. Too few tools mean the user must do more work manually. Too many tools mean the agent wastes time selecting and often chooses poorly. The right balance creates an agent that "just works" — selecting the right tool for each situation without confusion or delay.

## Key Technical Details

- **Optimal tool count range**: 5-20 tools for most agent systems. Claude Code uses approximately 10-15 core tools. Cursor uses a similar range. Going beyond 20 should be accompanied by categorization or dynamic loading.
- **Description token budget**: Each tool description consumes 100-500 tokens in the system prompt. 15 tools at 300 tokens each = 4,500 tokens of system prompt dedicated to tool definitions. This is a meaningful fraction of the context budget.
- **Parameter validation**: Runtime parameter validation (type checking, range checking, path validation) catches 30-50% of LLM parameter errors before execution, converting potential silent failures into informative error messages.
- **Tool call parsing reliability**: Modern LLMs (Claude 3.5+, GPT-4o) produce syntactically valid tool calls (correct JSON structure) 99%+ of the time. Semantic validity (correct tool choice, correct parameters) is lower at 85-95%.
- **Parallel tool calls**: Allowing the LLM to request multiple tool calls in a single turn reduces total loop iterations. Claude and GPT-4 both support parallel tool calls. A common pattern is reading 3-5 files in parallel during the investigation phase.
- **Tool versioning**: Changing tool descriptions or schemas between sessions can cause inconsistent agent behavior. Production systems should version tool definitions and test for regression when updating.
- **Escape hatch tools**: Many agent systems include a general-purpose tool (like `run_command` or `execute_code`) as an escape hatch for situations not covered by specialized tools. This dramatically increases capability but requires strong safety guardrails.
- **Token cost of tool calls**: Each tool call adds approximately 100-300 tokens of overhead (tool name, parameters, formatting) in addition to the tool result. Over 30 iterations, this overhead adds up to 3,000-9,000 tokens.

## Common Misconceptions

**"More tools always means a more capable agent."**
Beyond approximately 20 tools, each additional tool reduces the agent's ability to select correctly from the existing set. Capability from additional tools must be weighed against the degradation in tool selection accuracy. A 15-tool agent that selects correctly 95% of the time outperforms a 40-tool agent that selects correctly 75% of the time.

**"Tools just need a name and parameters — descriptions don't matter much."**
Tool descriptions are the primary mechanism the LLM uses to decide which tool to call. In ablation studies, removing or degrading tool descriptions reduces tool selection accuracy by 20-40%. The description is effectively a prompt for tool selection, and prompt quality matters enormously.

**"The LLM can figure out how to use a tool from its name alone."**
LLMs often have training data about common tools (file operations, web search), but for custom tools, the LLM relies entirely on the description and schema. A tool named `xq_process_v2` with no description will be used incorrectly or not at all. Clear, detailed descriptions are non-negotiable.

**"Safety can be handled after the action space is designed."**
Safety must be designed into the action space from the start. Adding safety constraints after deployment is reactive and incomplete. Every tool should be designed with its worst-case usage in mind: what is the most dangerous thing the LLM could do with this tool, and how do we prevent or mitigate it?

**"A single all-purpose tool is better than many specialized ones."**
A single `do_anything` tool places the full burden of specification on the LLM's parameters. Specialized tools constrain the LLM's choices and reduce the space for errors. `read_file(path)` is easier for the LLM to use correctly than `execute(action="read", target="file", path=...)`. Specialization is a form of safety and reliability.

## Connections to Other Concepts

- `what-is-an-ai-agent.md` — The action space defines the "action" component of the perception-reasoning-action triad.
- `environment-and-observations.md` — Each tool in the action space produces observations. Tool design is simultaneously action design and observation design.
- `autonomy-spectrum.md` — Higher autonomy levels require more carefully designed action spaces with stronger safety boundaries.
- `agent-loop.md` — The agent loop dispatches tool calls from the action space and feeds results back to the LLM.
- `goal-specification.md` — The action space must be expressive enough to achieve the goals specified to the agent.

## Further Reading

- **Schick et al., "Toolformer: Language Models Can Teach Themselves to Use Tools" (2023)** — Demonstrates LLMs learning to use tools from examples, with implications for how tool descriptions enable tool use.
- **Qin et al., "ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs" (2023)** — Explores scaling tool use to thousands of APIs through hierarchical retrieval and selection, addressing the tool count problem.
- **Patil et al., "Gorilla: Large Language Model Connected with Massive APIs" (2023)** — Trains LLMs specifically for API use, achieving higher accuracy on tool selection and parameter generation.
- **Yang et al., "SWE-agent: Agent-Computer Interfaces Design for Software Engineering" (2024)** — Studies how the design of the tool interface (action space) affects agent performance on software engineering tasks, finding that interface design matters as much as model capability.
- **Anthropic, "Tool Use Documentation" (2024)** — Practical guide to designing tool schemas and descriptions for optimal LLM tool use.
