# Step 8: Connect to Claude Desktop

One-Line Summary: Build the server, configure Claude Desktop to launch it, and test every tool live.

Prerequisites: All previous steps completed

---

## Build the Server

```bash
npx tsc
```

Verify the output exists:

```bash
ls dist/
```

You should see `index.js`, `db.js`, `tools.js`, `resources.js`, and `prompts.js`.

## Configure Claude Desktop

Claude Desktop reads MCP server configurations from a JSON file. Open it:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add your server to the `mcpServers` object:

```json
{
  "mcpServers": {
    "bookmarks": {
      "command": "node",
      "args": ["/absolute/path/to/bookmark-mcp/dist/index.js"],
      "cwd": "/absolute/path/to/bookmark-mcp"
    }
  }
}
```

**Important:** Replace `/absolute/path/to/bookmark-mcp` with the actual path to your project directory. Use the full absolute path — relative paths will not work.

To find your absolute path:

```bash
# In your project directory
pwd
```

## Configure Claude Code (Alternative)

If you use Claude Code instead of Claude Desktop, add the server to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "bookmarks": {
      "command": "node",
      "args": ["/absolute/path/to/bookmark-mcp/dist/index.js"],
      "cwd": "/absolute/path/to/bookmark-mcp"
    }
  }
}
```

Or add it globally via the CLI:

```bash
claude mcp add bookmarks -- node /absolute/path/to/bookmark-mcp/dist/index.js
```

## Restart and Verify

**Claude Desktop:** Quit and reopen the app. Click the MCP icon (plug icon) in the bottom-left corner. You should see "bookmarks" listed with 5 tools, 4 resources, and 2 prompts.

**Claude Code:** Start a new session. Your server will be available automatically.

## Test Your Server

Try these prompts in Claude:

**Save a bookmark:**
> Save this article: https://modelcontextprotocol.io/docs — tag it with "mcp" and "docs"

**Save a few more:**
> Bookmark https://news.ycombinator.com — title "Hacker News", tags: "tech", "news"

> Save https://arxiv.org/abs/2301.00001 as "Attention Is All You Need" with tags "ai", "research", "transformers"

**Search:**
> What bookmarks do I have about AI?

**Browse by tag:**
> Show me everything tagged "research"

**Use a prompt:**
> Run my weekly digest

**Tag cleanup:**
> Analyze my tags and suggest improvements

## Troubleshooting

**Server doesn't appear in Claude Desktop:**
- Check that `claude_desktop_config.json` is valid JSON (no trailing commas)
- Verify the absolute path is correct — try running `node /your/path/dist/index.js` directly to see if it errors
- Restart Claude Desktop completely (quit from the dock/taskbar, not just close the window)

**"Module not found" error:**
- Make sure you ran `npx tsc` to compile the TypeScript
- Check that `dist/index.js` exists

**Database errors:**
- The server creates `bookmarks.db` in the current working directory. Make sure the `cwd` in your config points to the project root.

## What You Built

You now have a fully functional MCP server with:

| Capability | Count | Details |
|-----------|-------|---------|
| **Tools** | 5 | save, search, get by tag, delete, add tags |
| **Resources** | 4 | all bookmarks, tags, recent, stats |
| **Prompts** | 2 | weekly digest, tag cleanup |

Your bookmarks are stored locally in SQLite — no cloud services, no API keys, no subscriptions. The server runs as a subprocess of Claude and communicates over STDIO.

## Next Steps

Some ideas to extend your server:

- **Add a `fetch_title` tool** that automatically extracts the page title from a URL using `fetch`
- **Add full-text search** with SQLite FTS5 for better search relevance
- **Export to HTML** — add a tool that generates a browsable HTML page from your bookmarks
- **Import from browser** — parse a Chrome/Firefox bookmarks export file
- **Scheduled digests** — combine with a cron job to email yourself weekly summaries

---

[← Adding Prompts](07-adding-prompts.md)
