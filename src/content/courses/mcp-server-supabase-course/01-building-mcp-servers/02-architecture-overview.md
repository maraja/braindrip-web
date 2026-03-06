# Module 2: Architecture Overview

[← What is MCP?](01-what-is-mcp.md) | [Next: Setting Up Supabase →](03-setting-up-supabase.md)

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         AI Agent (Claude Desktop / Cursor / etc.)        │
│                                                                          │
│  User says: "Show me all electronics under $500"                        │
│                                                                          │
│  Agent recognizes this requires the "search_products" tool               │
│  Agent sends MCP request via Streamable HTTP                            │
└──────────────────────┬───────────────────────────────────────────────────┘
                       │
                       │ POST (JSON-RPC 2.0 over HTTP)
                       │ Accept: application/json, text/event-stream
                       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    Supabase Edge Function (/functions/v1/mcp)            │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                     MCP Server (TypeScript)                      │    │
│  │                                                                   │    │
│  │  Transport: WebStandardStreamableHTTPServerTransport             │    │
│  │                                                                   │    │
│  │  Tools:                                                           │    │
│  │    - search_products(query, category?, min_price?, max_price?)   │    │
│  │    - create_product(name, description, price, category, stock)   │    │
│  │    - update_product(id, fields...)                                │    │
│  │    - delete_product(id)                                           │    │
│  │    - get_sales_summary(period)                                    │    │
│  │                                                                   │    │
│  │  Resources:                                                       │    │
│  │    - inventory://categories        (list of categories)          │    │
│  │    - inventory://stats             (inventory statistics)        │    │
│  │    - inventory://product/{id}      (individual product details)  │    │
│  │                                                                   │    │
│  │  Prompts:                                                         │    │
│  │    - inventory-report              (generate inventory report)   │    │
│  │    - product-recommendation        (recommend products)          │    │
│  └────────────────────────┬────────────────────────────────────────┘    │
│                           │                                              │
│                           │ Supabase Client (service role)               │
│                           ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │              Supabase Postgres Database                          │    │
│  │                                                                   │    │
│  │  Tables:                                                          │    │
│  │    - products (id, name, description, price, category, stock)   │    │
│  │    - categories (id, name, description)                          │    │
│  │    - sales (id, product_id, quantity, sale_date, revenue)        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────┘
```

## How MCP Communication Works

MCP uses **JSON-RPC 2.0** over HTTP. Here is the request/response flow:

**1. Tool Discovery** -- The AI agent asks what tools are available:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

**2. Tool Call** -- The agent invokes a specific tool:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "search_products",
    "arguments": {
      "category": "Electronics",
      "max_price": 500
    }
  }
}
```

**3. Response** -- The server returns results via Server-Sent Events (SSE):
```
event: message
data: {"jsonrpc":"2.0","id":2,"result":{"content":[{"type":"text","text":"[{\"id\":1,\"name\":\"Wireless Mouse\",...}]"}]}}
```

The transport layer used on Supabase Edge Functions is `WebStandardStreamableHTTPServerTransport`, which implements the MCP Streamable HTTP specification -- an HTTP-based transport that supports both request/response and server-initiated streaming via SSE.

---

[Next: Module 3 - Setting Up Your Supabase Project →](03-setting-up-supabase.md)
