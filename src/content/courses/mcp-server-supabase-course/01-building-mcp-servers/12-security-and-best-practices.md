# Module 12: Security, Authentication, and Best Practices

[← Connecting AI Agents](11-connecting-ai-agents.md) | [Next: Complete Source Code Reference →](13-complete-source-code.md)

---

## Current Limitations

As of this writing, Supabase Edge Functions MCP servers use `--no-verify-jwt`, meaning the MCP endpoint is publicly accessible. This is fine for development and internal tools, but production systems should add authentication.

## Adding Basic API Key Authentication

You can add a simple API key check inside your MCP server:

```typescript
// Add this middleware before the MCP handler
app.use('*', async (c, next) => {
  const apiKey = c.req.header('X-API-Key')
  const expectedKey = Deno.env.get('MCP_API_KEY')

  if (expectedKey && apiKey !== expectedKey) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  await next()
})
```

Set the secret:
```bash
supabase secrets set MCP_API_KEY=your-secret-key-here
```

Then configure your MCP client to send the header (varies by client).

## Best Practices

1. **Use the service role key carefully**: The service role key bypasses Row-Level Security. Only use it when your MCP server needs unrestricted access. For multi-tenant scenarios, pass user tokens and use the anon key with RLS policies.

2. **Validate inputs**: Zod schemas handle type validation, but add business logic validation in your handlers (e.g., checking that a category exists before creating a product).

3. **Limit result sizes**: Always use `.limit()` on database queries to prevent returning unbounded result sets.

4. **Log operations**: Add logging for audit trails:
   ```typescript
   console.log(`[MCP] Tool called: ${toolName}`, args)
   ```

5. **Destructive operations need confirmation**: Note how our `delete_product` tool requires a `confirm: true` parameter. Apply this pattern to any destructive operation.

6. **Write descriptive tool descriptions**: The AI agent reads your `description` field to decide *when* and *how* to use each tool. Vague descriptions lead to misuse. Be specific about what the tool does, what it returns, and when to use it.

7. **Return structured data alongside formatted text**: Return both human-readable summaries and raw JSON, so the AI can both present information to users and process it programmatically.

8. **Handle errors gracefully**: Always catch errors and return meaningful error messages via `isError: true`. This helps the AI agent understand what went wrong and potentially retry with different parameters.

---

[Next: Module 13 - Complete Source Code Reference →](13-complete-source-code.md)
