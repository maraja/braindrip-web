# Step 1: What We're Building

One-Line Summary: A terminal assistant called `ask` that answers questions, explains code, generates shell commands, and processes piped input — all powered by Claude from the command line.

Prerequisites: Basic TypeScript/JavaScript knowledge, Node.js 18+ installed, an Anthropic API key

---

## The Goal

By the end of this blueprint, you will have a working CLI tool called `ask` that:

- **Answers questions** — `ask "What is a mutex?"`
- **Explains code files** — `ask explain src/index.ts`
- **Generates shell commands** — `ask cmd "find all PNG files larger than 1MB"`
- **Processes piped input** — `git diff | ask "summarize these changes"`
- **Streams responses** in real time, word by word, just like ChatGPT

Think of it as a mini Claude Code that lives in your terminal.

## Demo Commands

Once finished, you will be able to run:

```bash
# Ask anything
ask "Explain the difference between REST and GraphQL"

# Explain a file
ask explain ./src/server.ts

# Generate a shell command
ask cmd "compress all JPGs in this folder to 80% quality"

# Pipe in content
cat README.md | ask "summarize this in 3 bullet points"
git log --oneline -20 | ask "what did I work on this week?"
```

## Why This Stack

| Choice | Why |
|--------|-----|
| **Node.js + TypeScript** | Excellent CLI ecosystem, strong typing, fast iteration |
| **Commander.js** | The standard for building Node.js CLIs — subcommands, options, and help text out of the box |
| **@anthropic-ai/sdk** | Official Anthropic SDK with first-class streaming support |
| **chalk** | Terminal colors that work across platforms — makes output readable |
| **ora** | Elegant loading spinners — gives feedback while waiting for API responses |

## Architecture

```
┌──────────────────────────────────────────────────┐
│                   ask CLI                         │
│                                                   │
│  ┌─────────┐  ┌─────────┐  ┌──────────────────┐ │
│  │Commander│  │ chalk   │  │      ora         │ │
│  │ (parse) │  │ (color) │  │   (spinners)     │ │
│  └────┬────┘  └────┬────┘  └───────┬──────────┘ │
│       │            │               │             │
│       ▼            ▼               ▼             │
│  ┌──────────────────────────────────────────┐    │
│  │           Anthropic SDK                   │    │
│  │      (streaming Claude responses)         │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
                        │
                        ▼ HTTPS
               ┌─────────────────┐
               │  Claude API      │
               │  (claude-sonnet) │
               └─────────────────┘
```

## Project Structure

Here is what we will build:

```
ask-cli/
├── src/
│   ├── index.ts          # CLI entry point — Commander setup
│   ├── ask.ts            # Core "ask a question" logic
│   ├── explain.ts        # File explanation command
│   ├── cmd.ts            # Shell command generator
│   └── utils.ts          # Shared helpers (spinner, streaming)
├── package.json
├── tsconfig.json
└── dist/                 # Compiled output
```

Each step in this blueprint adds one piece. By Step 7, everything connects. Let's start.

---

[Next: Step 2 - Project Setup →](02-project-setup.md)
