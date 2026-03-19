# Step 4: Server Skeleton

One-Line Summary: Create the MCP server entry point with STDIO transport — the minimal wiring that makes Claude discover your server.

Prerequisites: Database layer from Step 3

---

## The Entry Point

Create `src/index.ts` — this is the file Claude will launch when it starts your server:

```typescript
// src/index.ts
// ==========================================
// Bookmark MCP Server — Entry Point
// ==========================================

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools.js';
import { registerResources } from './resources.js';
import { registerPrompts } from './prompts.js';

// ------------------------------------------
// 1. Create the MCP Server
// ------------------------------------------
const server = new McpServer({
  name: 'bookmark-mcp',
  version: '1.0.0',
});

// ------------------------------------------
// 2. Register Capabilities
// ------------------------------------------
registerTools(server);
registerResources(server);
registerPrompts(server);

// ------------------------------------------
// 3. Connect via STDIO
// ------------------------------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
```

**What is happening here:**

1. **`McpServer`** is the core object from the MCP SDK. It manages tool/resource/prompt registration and handles the JSON-RPC protocol.
2. **`StdioServerTransport`** reads from `stdin` and writes to `stdout`. Claude Desktop launches your server as a child process and communicates over these streams.
3. **Registration functions** (defined in the next steps) add tools, resources, and prompts to the server. Separating them into modules keeps the code organized.
4. **No HTTP, no ports, no auth** — STDIO transport is the simplest way to connect to Claude. It just works.

## Create Placeholder Modules

We will fill these in over the next three steps. For now, create empty placeholders so TypeScript compiles:

`src/tools.ts`:

```typescript
// src/tools.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerTools(server: McpServer): void {
  // Tools will be added in Step 5
}
```

`src/resources.ts`:

```typescript
// src/resources.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerResources(server: McpServer): void {
  // Resources will be added in Step 6
}
```

`src/prompts.ts`:

```typescript
// src/prompts.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerPrompts(server: McpServer): void {
  // Prompts will be added in Step 7
}
```

## Build and Verify

```bash
npx tsc
```

If this compiles without errors, your server skeleton is ready. The server will not do anything useful yet — we need to add tools, resources, and prompts — but the wiring is complete.

---

[← Database Layer](03-database-layer.md) | [Next: Step 5 - Adding Tools →](05-adding-tools.md)
