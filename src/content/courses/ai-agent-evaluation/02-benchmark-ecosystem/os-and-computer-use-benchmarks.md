# OS and Computer Use Benchmarks

**One-Line Summary**: OS and computer use benchmarks evaluate AI agents on their ability to operate full desktop environments -- clicking, typing, navigating GUIs, and executing terminal commands -- across real operating systems.

**Prerequisites**: `../01-foundations-of-agent-evaluation/why-agent-evaluation-is-hard.md`, `web-benchmarks.md`

## What Is OS and Computer Use Benchmarking?

Imagine handing someone a laptop running an unfamiliar operating system and asking them to complete a series of tasks: install software, configure settings, edit documents, and manage files -- all while being observed through screenshots alone. OS and computer use benchmarks pose exactly this challenge to AI agents, testing whether they can operate computers the way humans do: through visual perception of the screen and physical interaction via keyboard and mouse.

These benchmarks represent the most ambitious tier of agent evaluation. Where web benchmarks constrain agents to a browser, and coding benchmarks constrain them to code editors, OS benchmarks drop agents into full desktop environments with no guardrails. The agent must interpret screenshots, decide where to click, what to type, and how to chain dozens of interactions into a coherent workflow.

The field has seen remarkable progress: OSWorld scores jumped from 12.24% (GPT-4V, early 2024) to over 76% (OSAgent, late 2025), with some systems surpassing the approximately 72% human baseline on specific task subsets. This rapid improvement has made OS benchmarks both a proving ground and a moving target.

## How It Works

### OSWorld

OSWorld (Xie et al., 2024) is the most comprehensive OS-level benchmark, featuring 369 tasks across three operating systems:

- **Ubuntu Linux** (~200 tasks): Terminal operations, GUI application management, system configuration
- **Windows** (~100 tasks): Office suite tasks, settings navigation, file management
- **macOS** (~70 tasks): Application workflows, system preferences, Finder operations

Each task runs in a sandboxed virtual machine. The agent receives only screenshots (and optionally accessibility tree data) as observations and must produce mouse/keyboard actions. Tasks are evaluated by checking the final state of the environment -- file contents, application settings, system configuration -- against expected outcomes.

**Task categories include:**
- File and directory management
- Application installation and configuration
- Document editing (LibreOffice, TextEdit, Word)
- Web browsing within the OS context
- Multi-application workflows (e.g., "Download data from this URL, open it in a spreadsheet, create a chart, and save it as a PDF")

### Screenshot-Based Evaluation

OSWorld pioneered screenshot-based evaluation: instead of checking internal application state through APIs, evaluation scripts analyze the screen or filesystem to determine whether the task was completed. This approach is more realistic (it mirrors what a human observer would check) but introduces evaluation noise -- a task might be completed correctly but scored as failed if a dialog box obscures the expected element.

OSWorld-Verified and OSWorld-Human extensions address this by having human annotators validate evaluation scripts and adding tasks calibrated against human performance baselines.

### Terminal-Bench

Terminal-Bench focuses specifically on command-line proficiency. Tasks include:

- File manipulation (find, grep, sed, awk)
- System administration (user management, service configuration, networking)
- Development workflows (git operations, build systems, dependency management)
- Scripting challenges (write a bash script to accomplish X)

Evaluation is typically based on the final filesystem state or command output, making it more deterministic than GUI-based evaluation.

### CUB (Computer Use Benchmark)

CUB (2025) provides 106 real-world workflows across 7 industry verticals:

- **Finance**: Spreadsheet analysis, report generation, data reconciliation
- **Healthcare**: EHR navigation, appointment scheduling, record management
- **Legal**: Document review, contract editing, case file organization
- **Education**: LMS management, grade entry, curriculum planning
- **Marketing**: Campaign setup, analytics review, content scheduling
- **Sales**: CRM operations, pipeline management, proposal creation
- **IT Operations**: System monitoring, ticket management, deployment tasks

CUB emphasizes multi-application workflows that span 10-30+ steps, reflecting the complexity of real knowledge work.

### The OSAgent Breakthrough

OSAgent (late 2025) achieved 76.26% on the OSWorld benchmark, surpassing the estimated ~72% human baseline established through controlled studies. Key architectural features included:

- Dual-mode observation: combining screenshots with accessibility tree data
- Hierarchical planning: decomposing tasks into subtasks before acting
- Action memory: learning from successful action sequences within a session
- Error recovery loops: detecting failed actions and attempting alternatives

## Why It Matters

1. **Universal automation potential**: Desktop environments are the interface to virtually all knowledge work. Agents that can operate GUIs can automate any software, not just those with APIs.
2. **Complete capability test**: OS tasks require perception (screen reading), reasoning (planning steps), action (mouse/keyboard), and memory (tracking multi-step progress) -- the full agent stack.
3. **Cross-application workflows**: Unlike single-domain benchmarks, OS benchmarks test the ability to coordinate across multiple applications, which is how real work actually happens.
4. **Human-comparable baselines**: OSWorld's human baselines provide a grounded ceiling for interpreting agent scores.

## Key Technical Details

- OSWorld tasks require an average of 15 actions to complete; the hardest tasks require 50+
- Screenshot resolution typically set to 1920x1080; agents must parse UI elements at pixel level
- Accessibility tree data (when available) provides structured element information but misses visual layout cues
- VM-based sandboxing adds 30-60 seconds of overhead per task for environment reset
- OSAgent's per-task cost: approximately $0.50-2.00 depending on task complexity
- The human baseline of ~72% reflects time-limited conditions (15 minutes per task); unlimited time pushes human accuracy to ~95%
- Cross-OS generalization remains weak: agents trained primarily on Ubuntu tasks show 20-30% performance degradation on Windows tasks

## Common Misconceptions

**"Surpassing the human baseline means agents are better than humans at using computers."** The ~72% human baseline was measured under constrained conditions (unfamiliar OS, time limits, no internet search). Experienced users in their native OS would score significantly higher. The achievement is impressive but the comparison is asymmetric.

**"Screenshot-only agents are the right approach because humans use vision."** Humans also use spatial memory, peripheral vision, and thousands of hours of GUI familiarity. Agents that combine screenshots with accessibility tree data consistently outperform screenshot-only systems, suggesting pure vision is insufficient with current models.

**"OS benchmarks subsume web benchmarks."** While OS tasks include some web browsing, the evaluation methodology is different. Web benchmarks can check DOM state and database contents; OS benchmarks rely on screenshot or filesystem evaluation, which is less precise. The two benchmark types test overlapping but distinct capabilities.

**"Terminal tasks are easier than GUI tasks."** Terminal tasks have more deterministic evaluation but are not inherently easier. Complex shell scripting, pipeline construction, and system administration tasks remain challenging, with top agents solving only ~60% of advanced Terminal-Bench tasks.

## Connections to Other Concepts

- `web-benchmarks.md` covers the browser-specific subset of computer use evaluation
- `benchmark-saturation-and-evolution.md` discusses how OSWorld's rapid score growth fits the saturation pattern
- `multi-agent-benchmarks.md` explores how multi-agent architectures might tackle complex OS workflows
- `../01-foundations-of-agent-evaluation/compounding-errors-in-multi-step-tasks.md` explains why 50-step OS tasks are so sensitive to per-step accuracy
- `../03-automated-evaluation-methods/environment-state-evaluation.md` details the state-checking methodology OSWorld uses
- `../04-trajectory-and-process-analysis/error-recovery-evaluation.md` addresses the recovery patterns critical in GUI interaction

## Further Reading

- "OSWorld: Benchmarking Multimodal Agents for Open-Ended Tasks in Real Computer Environments" -- Xie et al., 2024
- "Terminal-Bench: Evaluating AI Agents on Real Terminal Tasks" -- Zhang et al., 2025
- "CUB: A Scalable Computer Use Benchmark for Real-World Professional Tasks" -- Li et al., 2025
- "OSAgent: Autonomous Computer Use through Operating System Agents" -- Chen et al., 2025
- "Computer Use Benchmarking: Challenges in Evaluating GUI Agents" -- Park et al., 2025
