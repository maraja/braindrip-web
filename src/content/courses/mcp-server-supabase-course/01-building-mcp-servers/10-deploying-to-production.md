# Module 10: Deploying to Production

[← Local Development and Testing](09-local-development-and-testing.md) | [Next: Connecting AI Agents →](11-connecting-ai-agents.md)

---

## Step 1: Link to Your Cloud Project

```bash
supabase link --project-ref <your-project-ref>
```

You can find your project ref in the Supabase Dashboard URL: `https://supabase.com/dashboard/project/<your-project-ref>`.

## Step 2: Push the Database Schema

```bash
supabase db push
```

This applies your migrations to the cloud database. Then seed your production data by running the seed SQL through the Supabase Dashboard SQL Editor, or by using:

```bash
# Option: Run seed via psql (connection string from Dashboard > Settings > Database)
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f supabase/seed.sql
```

## Step 3: Deploy the Edge Function

```bash
supabase functions deploy --no-verify-jwt mcp
```

Your MCP server is now live at:
```
https://<your-project-ref>.supabase.co/functions/v1/mcp
```

## Step 4: Verify the Deployment

```bash
curl -X POST 'https://<your-project-ref>.supabase.co/functions/v1/mcp' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

You should see your five tools listed in the response.

---

[Next: Module 11 - Connecting AI Agents to Your MCP Server →](11-connecting-ai-agents.md)
