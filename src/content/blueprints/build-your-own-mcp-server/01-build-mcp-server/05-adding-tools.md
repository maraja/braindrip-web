# Step 5: Adding Tools

One-Line Summary: Register four MCP tools — save, search, tag, and delete bookmarks — so Claude can take actions on your collection.

Prerequisites: Server skeleton from Step 4

---

Tools are the most powerful MCP primitive. They let Claude **take actions** — each tool has a name, a description (which Claude reads to decide when to use it), an input schema (validated with Zod), and a handler function.

## Replace tools.ts

Replace the contents of `src/tools.ts` with the full implementation:

```typescript
// src/tools.ts
// ==========================================
// MCP Tools — Actions Claude Can Take
// ==========================================

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as db from './db.js';

export function registerTools(server: McpServer): void {
  // ------------------------------------------
  // TOOL: save_bookmark
  // ------------------------------------------
  server.tool(
    'save_bookmark',
    'Save a new bookmark to your collection. Use this when the user wants to save a URL, ' +
    'article, or link. Always include at least one tag for organization.',
    {
      url: z.string().url().describe('The URL to bookmark'),
      title: z.string().describe('A descriptive title for the bookmark'),
      description: z.string().optional().describe('Optional notes about why this is worth saving'),
      tags: z.array(z.string()).min(1).describe('Tags for categorization (e.g., ["ai", "tutorial"])'),
    },
    async ({ url, title, description, tags }) => {
      try {
        const bookmark = db.addBookmark(url, title, description ?? null, tags);
        return {
          content: [{
            type: 'text',
            text: `Bookmark saved!\n\n` +
              `- **${bookmark.title}**\n` +
              `- URL: ${bookmark.url}\n` +
              `- Tags: ${bookmark.tags || tags.join(', ')}\n` +
              `- Saved: ${bookmark.created_at}`,
          }],
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Error saving bookmark: ${error.message}` }],
          isError: true,
        };
      }
    }
  );

  // ------------------------------------------
  // TOOL: search_bookmarks
  // ------------------------------------------
  server.tool(
    'search_bookmarks',
    'Search your bookmark collection by keyword. Searches across titles, descriptions, ' +
    'and URLs. Use this when the user asks about their saved links or wants to find ' +
    'something they bookmarked previously.',
    {
      query: z.string().describe('Search term to match against titles, descriptions, and URLs'),
      limit: z.number().int().positive().optional().describe('Maximum results to return (default: 20)'),
    },
    async ({ query, limit }) => {
      const results = db.search(query, limit ?? 20);

      if (results.length === 0) {
        return {
          content: [{ type: 'text', text: `No bookmarks found matching "${query}".` }],
        };
      }

      const summary = `Found ${results.length} bookmark(s) matching "${query}":\n\n` +
        results.map((b, i) =>
          `${i + 1}. **${b.title}**\n` +
          `   ${b.url}\n` +
          `   Tags: ${b.tags || 'none'} | Saved: ${b.created_at}` +
          (b.description ? `\n   _${b.description}_` : '')
        ).join('\n\n');

      return { content: [{ type: 'text', text: summary }] };
    }
  );

  // ------------------------------------------
  // TOOL: get_bookmarks_by_tag
  // ------------------------------------------
  server.tool(
    'get_bookmarks_by_tag',
    'Get all bookmarks with a specific tag. Use this when the user wants to browse ' +
    'a category like "ai", "tutorial", "work", etc.',
    {
      tag: z.string().describe('Tag name to filter by'),
      limit: z.number().int().positive().optional().describe('Maximum results (default: 20)'),
    },
    async ({ tag, limit }) => {
      const results = db.getByTag(tag, limit ?? 20);

      if (results.length === 0) {
        return {
          content: [{ type: 'text', text: `No bookmarks found with tag "${tag}".` }],
        };
      }

      const summary = `${results.length} bookmark(s) tagged "${tag}":\n\n` +
        results.map((b, i) =>
          `${i + 1}. **${b.title}**\n` +
          `   ${b.url}\n` +
          `   Tags: ${b.tags || tag}`
        ).join('\n\n');

      return { content: [{ type: 'text', text: summary }] };
    }
  );

  // ------------------------------------------
  // TOOL: delete_bookmark
  // ------------------------------------------
  server.tool(
    'delete_bookmark',
    'Delete a bookmark by its ID. Use this when the user wants to remove a saved link. ' +
    'Always confirm with the user before deleting.',
    {
      id: z.number().int().positive().describe('The bookmark ID to delete'),
      confirm: z.boolean().describe('Must be true to confirm deletion'),
    },
    async ({ id, confirm }) => {
      if (!confirm) {
        return {
          content: [{
            type: 'text',
            text: 'Deletion not confirmed. Set confirm to true to proceed.',
          }],
        };
      }

      const removed = db.remove(id);
      if (!removed) {
        return {
          content: [{ type: 'text', text: `No bookmark found with ID ${id}.` }],
          isError: true,
        };
      }

      return {
        content: [{ type: 'text', text: `Bookmark ${id} deleted.` }],
      };
    }
  );

  // ------------------------------------------
  // TOOL: add_tags
  // ------------------------------------------
  server.tool(
    'add_tags',
    'Add tags to an existing bookmark. Use this when the user wants to re-categorize ' +
    'or add additional tags to a bookmark they already saved.',
    {
      bookmark_id: z.number().int().positive().describe('The bookmark ID to tag'),
      tags: z.array(z.string()).min(1).describe('Tags to add'),
    },
    async ({ bookmark_id, tags }) => {
      try {
        db.addTagsToBookmark(bookmark_id, tags);
        return {
          content: [{
            type: 'text',
            text: `Added tags [${tags.join(', ')}] to bookmark ${bookmark_id}.`,
          }],
        };
      } catch (error: any) {
        return {
          content: [{ type: 'text', text: `Error: ${error.message}` }],
          isError: true,
        };
      }
    }
  );
}
```

**Key design decisions:**

- **Tool descriptions are written for Claude** — they explain *when* to use each tool, not just what it does. This is critical. Claude reads these descriptions to decide which tool to call.
- **Zod schemas** validate inputs before your handler runs. If Claude passes invalid data, the SDK returns a clear error automatically.
- **Error handling** returns `isError: true` so Claude knows the operation failed and can try something different.
- **The delete tool** requires explicit confirmation — this prevents accidental deletions.
- **Five tools** is a good number. Enough to be useful, few enough that Claude can reason about which one to pick.

## Build

```bash
npx tsc
```

No errors means the tools are registered correctly. We will test them with Claude after completing the remaining steps.

---

[← Server Skeleton](04-server-skeleton.md) | [Next: Step 6 - Adding Resources →](06-adding-resources.md)
