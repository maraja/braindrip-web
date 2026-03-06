# Module 5: Building Your First MCP Server

[← Database Schema and Data](04-database-schema-and-data.md) | [Next: Adding Database Tools →](06-adding-database-tools.md)

---

Now for the main event -- building the MCP server as a Supabase Edge Function.

## Understanding the Stack

Our MCP server uses:
- **`@modelcontextprotocol/sdk`** -- The official MCP TypeScript SDK
- **`WebStandardStreamableHTTPServerTransport`** -- HTTP transport compatible with Deno/Edge Functions
- **`Hono`** -- Lightweight HTTP framework (Supabase's recommended router for Edge Functions)
- **`Zod`** -- Schema validation (used by the MCP SDK for tool input schemas)
- **`@supabase/supabase-js`** -- Database client

## Step 1: Write the MCP Server

Replace the contents of `supabase/functions/mcp/index.ts` with the following. We will build this up incrementally, starting with the foundation:

```typescript
// supabase/functions/mcp/index.ts
// ==========================================
// MCP Server for Product Inventory Management
// ==========================================

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { McpServer } from 'npm:@modelcontextprotocol/sdk@1.25.3/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from 'npm:@modelcontextprotocol/sdk@1.25.3/server/webStandardStreamableHttp.js'
import { Hono } from 'npm:hono@^4.9.7'
import { z } from 'npm:zod@^4.1.13'
import { createClient } from 'npm:@supabase/supabase-js@2'

// ------------------------------------------
// 1. Initialize Supabase Client
// ------------------------------------------
// Supabase automatically injects these environment variables
// into Edge Functions. The service role key bypasses RLS,
// which is appropriate here since we control access at the
// MCP server level.
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// ------------------------------------------
// 2. Create the MCP Server
// ------------------------------------------
const server = new McpServer({
  name: 'inventory-mcp-server',
  version: '1.0.0',
})

// ------------------------------------------
// 3. Register Tools (Module 6 -- see below)
// ------------------------------------------

// ... (we will add tools in the next module)

// ------------------------------------------
// 4. Register Resources (Module 7 -- see below)
// ------------------------------------------

// ... (we will add resources in the next module)

// ------------------------------------------
// 5. Register Prompts (Module 8 -- see below)
// ------------------------------------------

// ... (we will add prompts in the next module)

// ------------------------------------------
// 6. HTTP Routing with Hono
// ------------------------------------------
const app = new Hono()

// All MCP communication goes through this single endpoint
app.all('*', async (c) => {
  const transport = new WebStandardStreamableHTTPServerTransport()
  await server.connect(transport)
  return transport.handleRequest(c.req.raw)
})

// Start the Deno server
Deno.serve(app.fetch)
```

**What is happening here:**

1. **Imports**: We pull in the MCP SDK, Hono for HTTP routing, Zod for validation, and the Supabase client.
2. **Supabase Client**: Created with the service role key (auto-injected by Supabase). This gives the MCP server full database access.
3. **MCP Server**: Instantiated with a name and version. This is the core object where we register tools, resources, and prompts.
4. **HTTP Routing**: Every request to this Edge Function is handed to the MCP transport layer, which handles the JSON-RPC protocol.

## Step 2: Test the Minimal Server

```bash
# Make sure Supabase is running
supabase start

# Serve the function locally
supabase functions serve --no-verify-jwt mcp
```

Test that it responds to MCP's `initialize` handshake:

```bash
curl -X POST 'http://localhost:54321/functions/v1/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-03-26",
      "capabilities": {},
      "clientInfo": { "name": "test-client", "version": "1.0.0" }
    }
  }'
```

You should receive an SSE response with the server's capabilities. If you see this, your MCP server is alive!

---

[Next: Module 6 - Adding Database Tools (CRUD Operations) →](06-adding-database-tools.md)
