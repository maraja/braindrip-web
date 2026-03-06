# Module 1: What is MCP and Why Does It Matter?

[← Course Overview](00-course-overview.md) | [Next: Architecture Overview →](02-architecture-overview.md)

---

## The Problem

AI assistants like Claude are powerful, but they live in a sandbox. They can reason, generate code, and answer questions -- but they cannot natively reach into *your* database, *your* APIs, or *your* internal tools. Every organization has unique data locked behind custom systems that AI cannot access out of the box.

Before MCP, connecting an AI agent to your data meant:
- Building custom one-off integrations for each AI tool
- Writing bespoke API wrappers and prompt-engineering the agent to call them
- Maintaining N x M integrations (N AI tools x M data sources)

## The Solution: Model Context Protocol

The **Model Context Protocol (MCP)** is an open standard (created by Anthropic) that defines a universal interface between AI agents and external tools/data. Think of it as **USB-C for AI** -- a single standardized connector that any AI agent can use to talk to any data source.

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   AI Agent       │   MCP   │   MCP Server     │  SQL    │   Database       │
│ (Claude, Cursor, │◄──────►│ (Supabase Edge   │◄──────►│ (Supabase        │
│  Windsurf, etc.) │         │  Function)       │         │  Postgres)       │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

An MCP server exposes three types of capabilities:

| Capability | Analogy | Description |
|-----------|---------|-------------|
| **Tools** | POST/PUT/DELETE endpoints | Actions the AI can execute (query data, create records, run computations) |
| **Resources** | GET endpoints | Read-only data the AI can reference (schemas, configs, documentation) |
| **Prompts** | Saved templates | Reusable prompt templates that help the AI interact with your data consistently |

## Why Supabase?

Supabase is the ideal platform for hosting MCP servers because:

1. **Edge Functions** run globally on Deno -- perfect for MCP's Streamable HTTP transport
2. **Built-in Postgres** means your MCP server and database live on the same platform with zero-latency internal connections
3. **Auto-injected environment variables** (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) eliminate configuration headaches
4. **Free tier** is generous enough for development and small production workloads
5. **One-command deploy** via `supabase functions deploy`

## What We Are Building

In this course, you will build an MCP server that manages a **product inventory system** for a fictional e-commerce company. The server will allow AI agents to:

- **Query products** by name, category, or price range
- **Create new products** with validation
- **Update product details** (price, stock, description)
- **Delete products** from the catalog
- **View sales analytics** as read-only resources
- **Use pre-built prompts** for common inventory tasks

By the end, you will be able to open Claude Desktop (or any MCP-compatible client) and say things like:

> "Show me all electronics under $500 that are low on stock"

> "Add a new product: Wireless Headphones, $79.99, category Electronics, 150 in stock"

> "What were our top-selling products last month?"

...and have the AI agent execute these against your live Supabase database.

---

[Next: Module 2 - Architecture Overview →](02-architecture-overview.md)
