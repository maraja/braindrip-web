# Step 2: Project Setup

One-Line Summary: Initialize the Node.js project, install dependencies, and configure TypeScript for building MCP servers.

Prerequisites: Node.js 18+ installed, npm or yarn

---

## Create the Project

```bash
mkdir bookmark-mcp && cd bookmark-mcp
npm init -y
```

## Install Dependencies

```bash
npm install @modelcontextprotocol/sdk better-sqlite3 zod
npm install -D typescript @types/node @types/better-sqlite3
```

What each package does:

| Package | Purpose |
|---------|---------|
| `@modelcontextprotocol/sdk` | Official MCP TypeScript SDK — server, transport, and protocol types |
| `better-sqlite3` | Synchronous SQLite driver for Node.js — fast, zero-config, no external DB needed |
| `zod` | Schema validation — the MCP SDK uses Zod to define tool input schemas |
| `typescript` | TypeScript compiler |

## Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

## Update package.json

Add the build and start scripts. Open `package.json` and update it:

```json
{
  "name": "bookmark-mcp",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## Create the Source Directory

```bash
mkdir src
```

## Verify the Setup

```bash
npx tsc --version
```

You should see TypeScript 5.x. If this works, your project is ready.

---

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - Database Layer →](03-database-layer.md)
