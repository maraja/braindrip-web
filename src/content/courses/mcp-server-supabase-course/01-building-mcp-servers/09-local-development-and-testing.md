# Module 9: Local Development and Testing

[← Adding Prompts](08-adding-prompts.md) | [Next: Deploying to Production →](10-deploying-to-production.md)

---

## Starting the Full Local Stack

```bash
# Start Supabase (Postgres, Auth, Studio, etc.)
supabase start

# Apply migrations and seed data
supabase db reset

# Serve the Edge Function
supabase functions serve --no-verify-jwt mcp
```

You now have:
- **Postgres** running locally with your schema and dummy data
- **Supabase Studio** at `http://localhost:54323` for visual database inspection
- **MCP Server** at `http://localhost:54321/functions/v1/mcp`

## Testing with cURL

**List available tools:**
```bash
curl -X POST 'http://localhost:54321/functions/v1/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

**Search for products:**
```bash
curl -X POST 'http://localhost:54321/functions/v1/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "search_products",
      "arguments": {
        "category": "Electronics",
        "max_price": 100
      }
    }
  }'
```

**Create a new product:**
```bash
curl -X POST 'http://localhost:54321/functions/v1/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "create_product",
      "arguments": {
        "name": "Wireless Charging Pad",
        "description": "Fast 15W wireless charger with LED indicator",
        "price": 24.99,
        "category": "Electronics",
        "stock_quantity": 200,
        "sku": "ELEC-008"
      }
    }
  }'
```

**Get sales summary:**
```bash
curl -X POST 'http://localhost:54321/functions/v1/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "get_sales_summary",
      "arguments": {
        "days": 30,
        "order_by": "revenue"
      }
    }
  }'
```

**List resources:**
```bash
curl -X POST 'http://localhost:54321/functions/v1/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "resources/list"
  }'
```

**Read a resource:**
```bash
curl -X POST 'http://localhost:54321/functions/v1/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "resources/read",
    "params": {
      "uri": "inventory://stats"
    }
  }'
```

## Testing with MCP Inspector

The MCP Inspector is an interactive debugging GUI for MCP servers:

```bash
npx -y @modelcontextprotocol/inspector
```

In the Inspector UI:
1. Set the transport to **Streamable HTTP**
2. Enter the URL: `http://localhost:54321/functions/v1/mcp`
3. Click **Connect**
4. You can now browse tools, resources, and prompts, and execute them interactively

This is the best way to explore and debug your MCP server during development.

---

[Next: Module 10 - Deploying to Production →](10-deploying-to-production.md)
