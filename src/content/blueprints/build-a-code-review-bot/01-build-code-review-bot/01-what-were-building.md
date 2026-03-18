# Step 1: What We're Building

One-Line Summary: A GitHub Action that uses Claude to automatically review pull requests — analyzing diffs, finding bugs, and posting inline comments directly on the PR.

Prerequisites: Basic TypeScript knowledge, a GitHub account, an Anthropic API key

---

## The Goal

By the end of this blueprint, you will have a GitHub Action that:

- **Triggers automatically** when a pull request is opened or updated
- **Fetches the PR diff** using the GitHub REST API
- **Sends the diff to Claude** with a carefully tuned system prompt for code review
- **Parses structured feedback** from Claude's response
- **Posts inline review comments** on the exact lines that need attention

When someone opens a PR in your repository, the bot will analyze every changed file and leave review comments like a senior engineer — catching bugs, suggesting improvements, and flagging potential issues.

## Why This Stack

| Choice | Why |
|--------|-----|
| **TypeScript/Node.js** | First-class support in the Anthropic SDK. Runs natively in GitHub Actions. |
| **GitHub Actions** | Zero infrastructure. No server to deploy or maintain. Runs on GitHub's compute. |
| **Anthropic SDK** | `@anthropic-ai/sdk` — the official TypeScript client for Claude. Handles auth, retries, and streaming. |
| **Octokit** | `@octokit/rest` — GitHub's official REST API client. Type-safe access to PRs, diffs, and comments. |
| **YAML workflows** | GitHub Actions uses YAML for workflow definitions. Declarative, version-controlled, and familiar. |

## Architecture

```
┌──────────────────┐     PR opened/updated     ┌──────────────────┐
│  GitHub           │ ─────────────────────────►│  GitHub Actions   │
│  Pull Request     │                           │  Workflow Runner  │
└──────────────────┘                           └────────┬─────────┘
                                                        │
                                                        ▼
                                               ┌──────────────────┐
                                               │  Your TypeScript  │
                                               │  Review Bot       │
                                               └───┬──────────┬───┘
                                                   │          │
                                          Fetch diff│          │Send diff
                                                   ▼          ▼
                                            ┌──────────┐ ┌──────────┐
                                            │  GitHub   │ │  Claude  │
                                            │  REST API │ │  API     │
                                            └──────────┘ └────┬─────┘
                                                              │
                                                    Structured│feedback
                                                              ▼
                                                     ┌──────────────┐
                                                     │  PR Review    │
                                                     │  Comments     │
                                                     └──────────────┘
```

The flow is simple: GitHub triggers your action, your code fetches the diff, sends it to Claude for analysis, then posts Claude's feedback as review comments on the PR.

## Project Structure

Here is what we will build:

```
code-review-bot/
├── src/
│   ├── index.ts          # Entry point — orchestrates the review flow
│   ├── github.ts         # Octokit wrapper — fetch diffs, post comments
│   ├── reviewer.ts       # Claude integration — analyze code, parse feedback
│   └── types.ts          # Shared TypeScript interfaces
├── .github/
│   └── workflows/
│       └── code-review.yml  # GitHub Actions workflow definition
├── package.json
├── tsconfig.json
└── action.yml            # GitHub Action metadata (optional)
```

Everything runs inside GitHub Actions. No servers to deploy, no Docker containers, no cloud functions. You push the code, configure a secret, and the bot starts reviewing PRs.

Let's start building.

---

[Next: Step 2 - Project Setup →](02-project-setup.md)
