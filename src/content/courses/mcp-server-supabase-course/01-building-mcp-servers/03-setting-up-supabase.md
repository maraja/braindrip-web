# Module 3: Setting Up Your Supabase Project

[← Architecture Overview](02-architecture-overview.md) | [Next: Database Schema and Data →](04-database-schema-and-data.md)

---

## Step 1: Install Prerequisites

**Install the Supabase CLI:**

```bash
# macOS (Homebrew)
brew install supabase/tap/supabase

# npm (cross-platform)
npm install -g supabase

# Verify installation
supabase --version
```

**Ensure you have:**
- Docker Desktop running (required for local development)
- Node.js 20+ installed
- A [Supabase account](https://supabase.com/dashboard) (free tier is fine)

## Step 2: Create a New Supabase Project

**Option A: Cloud Project (recommended for deploying)**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Choose an organization (or create one)
4. Set a project name: `mcp-inventory`
5. Set a database password (save this somewhere safe)
6. Choose a region close to you
7. Click **"Create new project"**

Once created, note your:
- **Project Reference ID** (from the URL: `https://supabase.com/dashboard/project/<project-ref>`)
- **Project URL**: `https://<project-ref>.supabase.co`
- **Service Role Key**: Found in Settings > API (keep this secret!)

**Option B: Local-Only Development**

You can develop entirely locally without a cloud project:

```bash
mkdir mcp-inventory
cd mcp-inventory
supabase init
supabase start
```

This spins up a full local Supabase stack (Postgres, Auth, Storage, Edge Functions) via Docker.

## Step 3: Initialize the Project Structure

```bash
mkdir mcp-inventory
cd mcp-inventory
supabase init
```

This creates:
```
mcp-inventory/
├── supabase/
│   ├── config.toml          # Supabase project configuration
│   ├── functions/            # Edge Functions live here
│   ├── migrations/           # Database migrations
│   └── seed.sql              # Seed data (we'll create this)
```

## Step 4: Create the Edge Function

```bash
supabase functions new mcp
```

This creates `supabase/functions/mcp/index.ts` with a starter template. We will replace this with our MCP server code shortly.

Your project structure should now look like:
```
mcp-inventory/
├── supabase/
│   ├── config.toml
│   ├── functions/
│   │   └── mcp/
│   │       └── index.ts      # Our MCP server (we'll write this)
│   ├── migrations/            # SQL migrations (we'll create these)
│   └── seed.sql               # Dummy data (we'll create this)
```

---

[Next: Module 4 - Creating the Database Schema and Dummy Data →](04-database-schema-and-data.md)
