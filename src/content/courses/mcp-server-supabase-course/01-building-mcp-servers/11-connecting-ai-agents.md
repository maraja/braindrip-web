# Module 11: Connecting AI Agents to Your MCP Server

[← Deploying to Production](10-deploying-to-production.md) | [Next: Security and Best Practices →](12-security-and-best-practices.md)

---

## Claude Desktop

Edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "inventory": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://<your-project-ref>.supabase.co/functions/v1/mcp"
      ]
    }
  }
}
```

> **Note**: `mcp-remote` is a bridge that connects Claude Desktop's stdio transport to a remote Streamable HTTP server. Install it first with `npm install -g mcp-remote` or let `npx` handle it.

For **local development**, use:
```json
{
  "mcpServers": {
    "inventory": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:54321/functions/v1/mcp"
      ]
    }
  }
}
```

After saving, restart Claude Desktop. You should see the inventory tools appear in Claude's tool list (the hammer icon).

## Claude Code (CLI)

Add the server to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "inventory": {
      "type": "url",
      "url": "https://<your-project-ref>.supabase.co/functions/v1/mcp"
    }
  }
}
```

Or add it via the CLI:
```bash
claude mcp add inventory --transport http https://<your-project-ref>.supabase.co/functions/v1/mcp
```

## Cursor

In Cursor's Settings > MCP, add:

```json
{
  "mcpServers": {
    "inventory": {
      "url": "https://<your-project-ref>.supabase.co/functions/v1/mcp"
    }
  }
}
```

## Example Conversations

Once connected, you can interact with your inventory naturally:

**User**: "What electronics do we have under $100?"
**Agent**: *Calls `search_products` with `{category: "Electronics", max_price: 100}`*
> Found 4 products:
> 1. **Wireless Bluetooth Mouse** ($29.99) -- 245 in stock
> 2. **Smart Power Strip** ($34.99) -- 203 in stock
> 3. **USB-C Hub 7-in-1** ($49.99) -- 132 in stock
> 4. **Mechanical Keyboard** ($89.99) -- 78 in stock

**User**: "Add a new product: USB-C Cable 6ft, $12.99, Electronics, 500 units, SKU ELEC-009"
**Agent**: *Calls `create_product` with the provided details*
> Product created successfully!
> - **USB-C Cable 6ft** (ID: 28)
> - SKU: ELEC-009
> - Price: $12.99
> - Stock: 500

**User**: "What were our best sellers this month?"
**Agent**: *Calls `get_sales_summary` with `{days: 30, order_by: "revenue"}`*
> Sales Summary (last 30 days):
> **Totals**: $4,523.67 revenue | 127 units sold | 45 orders
>
> Top Products by revenue:
> 1. **Noise-Cancelling Headphones** -- $599.97 revenue, 3 units...

---

[Next: Module 12 - Security, Authentication, and Best Practices →](12-security-and-best-practices.md)
