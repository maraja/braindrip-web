# Building MCP Servers on Supabase: A Comprehensive Course

**One-Line Summary**: Learn how to build a production-ready Model Context Protocol (MCP) server using Supabase Edge Functions and a Supabase Postgres database -- giving any AI agent (Claude, Cursor, Windsurf, etc.) the ability to query, create, update, and delete data in your database through natural language.

**Prerequisites**: Basic TypeScript/JavaScript knowledge, familiarity with REST APIs, a Supabase account (free tier works), and the Supabase CLI installed locally. No prior MCP experience required.

---

## Course Modules

| # | Module | File | Description |
|---|--------|------|-------------|
| 1 | [What is MCP and Why Does It Matter?](01-what-is-mcp.md) | `01-what-is-mcp.md` | The problem MCP solves, core concepts, and why Supabase |
| 2 | [Architecture Overview](02-architecture-overview.md) | `02-architecture-overview.md` | System diagram, JSON-RPC protocol, transport layer |
| 3 | [Setting Up Your Supabase Project](03-setting-up-supabase.md) | `03-setting-up-supabase.md` | CLI install, project init, Edge Function scaffold |
| 4 | [Creating the Database Schema and Dummy Data](04-database-schema-and-data.md) | `04-database-schema-and-data.md` | Tables, views, indexes, triggers, and 27 products with sales history |
| 5 | [Building Your First MCP Server](05-building-your-first-mcp-server.md) | `05-building-your-first-mcp-server.md` | Minimal working server with Hono + MCP SDK |
| 6 | [Adding Database Tools (CRUD Operations)](06-adding-database-tools.md) | `06-adding-database-tools.md` | 5 tools: search, create, update, delete, sales summary |
| 7 | [Adding Resources (Read-Only Data Exposure)](07-adding-resources.md) | `07-adding-resources.md` | Categories, stats, and dynamic product detail resources |
| 8 | [Adding Prompts (Reusable Templates)](08-adding-prompts.md) | `08-adding-prompts.md` | Inventory report and product recommendation prompts |
| 9 | [Local Development and Testing](09-local-development-and-testing.md) | `09-local-development-and-testing.md` | cURL tests, MCP Inspector, debugging |
| 10 | [Deploying to Production](10-deploying-to-production.md) | `10-deploying-to-production.md` | Link, push, deploy, and verify |
| 11 | [Connecting AI Agents to Your MCP Server](11-connecting-ai-agents.md) | `11-connecting-ai-agents.md` | Claude Desktop, Claude Code, and Cursor configuration |
| 12 | [Security, Authentication, and Best Practices](12-security-and-best-practices.md) | `12-security-and-best-practices.md` | API key auth, RLS, and 8 production best practices |
| 13 | [Complete Source Code Reference](13-complete-source-code.md) | `13-complete-source-code.md` | Full `index.ts`, file checklist, command cheatsheet, further reading |

---

## What We Are Building

A **product inventory MCP server** deployed on Supabase Edge Functions that lets AI agents:

- Query products by name, category, or price range
- Create, update, and delete products with validation
- View sales analytics and inventory statistics
- Use pre-built prompts for inventory reports and product recommendations

## Quick Start

If you want to jump straight to the code, see [Module 13: Complete Source Code Reference](13-complete-source-code.md).

To follow the course step-by-step, start with [Module 1: What is MCP?](01-what-is-mcp.md).
