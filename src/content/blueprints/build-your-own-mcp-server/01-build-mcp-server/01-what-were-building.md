# Step 1: What We're Building

One-Line Summary: A personal bookmarks MCP server that lets Claude search, tag, and organize your saved links — built with Node.js and the official TypeScript SDK.

Prerequisites: Basic TypeScript/JavaScript knowledge, Node.js 18+ installed, a text editor

---

## The Goal

By the end of this blueprint, you will have a working MCP server that:

- **Saves bookmarks** with titles, URLs, tags, and notes
- **Searches your collection** by keyword, tag, or domain
- **Organizes with tags** — add, remove, and filter by tags
- **Exposes your collection** as resources Claude can browse
- **Runs locally** and connects to Claude Desktop or Claude Code

You will open Claude and say things like:

> "Save this article: https://example.com/great-post — tag it with 'AI' and 'research'"

> "What bookmarks do I have about machine learning?"

> "Show me everything I saved this week"

...and Claude will execute these against your local bookmark database.

## Why This Stack

| Choice | Why |
|--------|-----|
| **Node.js + TypeScript** | The MCP SDK is most mature in TypeScript. Most developers already know JS. |
| **STDIO transport** | The simplest transport — no HTTP server, no ports, no auth. Claude Desktop launches your server as a subprocess. |
| **SQLite (via better-sqlite3)** | Zero-config database. No external services. Your data stays on your machine. |
| **Official MCP SDK** | `@modelcontextprotocol/sdk` — the reference implementation maintained by Anthropic. |

## How MCP Works (30-Second Version)

```
┌─────────────────┐  STDIO (stdin/stdout)  ┌─────────────────┐
│  Claude Desktop  │◄─────────────────────►│  Your MCP Server │
│  or Claude Code  │   JSON-RPC messages    │  (Node.js)       │
└─────────────────┘                        └────────┬─────────┘
                                                    │ SQL
                                                    ▼
                                           ┌─────────────────┐
                                           │    SQLite DB     │
                                           │  (bookmarks.db)  │
                                           └─────────────────┘
```

MCP defines three primitives your server can expose:

- **Tools** — Actions Claude can take (save a bookmark, search, tag)
- **Resources** — Data Claude can read (your bookmark collection, tag list)
- **Prompts** — Reusable templates (weekly digest, tag cleanup)

Claude discovers these capabilities automatically when it connects to your server.

## Project Structure

Here is what we will build:

```
bookmark-mcp/
├── src/
│   ├── index.ts          # Server entry point
│   ├── db.ts             # SQLite database setup and queries
│   ├── tools.ts          # MCP tool definitions
│   ├── resources.ts      # MCP resource definitions
│   └── prompts.ts        # MCP prompt templates
├── package.json
├── tsconfig.json
└── bookmarks.db          # Created automatically at runtime
```

Let's start building.

---

[Next: Step 2 - Project Setup →](02-project-setup.md)
