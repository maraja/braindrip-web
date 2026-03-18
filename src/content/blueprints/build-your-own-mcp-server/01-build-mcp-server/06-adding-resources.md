# Step 6: Adding Resources

One-Line Summary: Expose your bookmark collection and tag list as read-only MCP resources that Claude can browse without executing a tool.

Prerequisites: Tools from Step 5

---

Resources are **read-only data** that Claude can access. Unlike tools (which take actions), resources are for browsing and reference. Think of them as GET endpoints — Claude can read them but cannot modify anything.

## Replace resources.ts

Replace the contents of `src/resources.ts`:

```typescript
// src/resources.ts
// ==========================================
// MCP Resources — Data Claude Can Browse
// ==========================================

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as db from './db.js';

export function registerResources(server: McpServer): void {
  // ------------------------------------------
  // RESOURCE: All Bookmarks
  // ------------------------------------------
  server.resource(
    'bookmarks-all',
    'bookmark://collection',
    {
      description: 'Your complete bookmark collection with tags, sorted by most recent.',
      mimeType: 'application/json',
    },
    async () => {
      const bookmarks = db.getAll(100);
      return {
        contents: [{
          uri: 'bookmark://collection',
          mimeType: 'application/json',
          text: JSON.stringify(bookmarks, null, 2),
        }],
      };
    }
  );

  // ------------------------------------------
  // RESOURCE: Tag Directory
  // ------------------------------------------
  server.resource(
    'tags-directory',
    'bookmark://tags',
    {
      description: 'All tags with their bookmark counts, sorted by popularity.',
      mimeType: 'application/json',
    },
    async () => {
      const tags = db.getTags();
      return {
        contents: [{
          uri: 'bookmark://tags',
          mimeType: 'application/json',
          text: JSON.stringify(tags, null, 2),
        }],
      };
    }
  );

  // ------------------------------------------
  // RESOURCE: Recent Bookmarks
  // ------------------------------------------
  server.resource(
    'bookmarks-recent',
    'bookmark://recent',
    {
      description: 'Bookmarks saved in the last 7 days.',
      mimeType: 'application/json',
    },
    async () => {
      const recent = db.getRecent(7);
      return {
        contents: [{
          uri: 'bookmark://recent',
          mimeType: 'application/json',
          text: JSON.stringify(recent, null, 2),
        }],
      };
    }
  );

  // ------------------------------------------
  // RESOURCE: Collection Stats
  // ------------------------------------------
  server.resource(
    'bookmarks-stats',
    'bookmark://stats',
    {
      description: 'Summary statistics about your bookmark collection.',
      mimeType: 'application/json',
    },
    async () => {
      const all = db.getAll(10000);
      const tags = db.getTags();
      const recent = db.getRecent(7);

      const domains = new Map<string, number>();
      for (const b of all) {
        try {
          const domain = new URL(b.url).hostname;
          domains.set(domain, (domains.get(domain) || 0) + 1);
        } catch {}
      }

      const topDomains = [...domains.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([domain, count]) => ({ domain, count }));

      const stats = {
        total_bookmarks: all.length,
        total_tags: tags.length,
        saved_this_week: recent.length,
        top_tags: tags.slice(0, 10),
        top_domains: topDomains,
      };

      return {
        contents: [{
          uri: 'bookmark://stats',
          mimeType: 'application/json',
          text: JSON.stringify(stats, null, 2),
        }],
      };
    }
  );
}
```

**When Claude uses resources vs. tools:**

| Scenario | Claude uses... |
|----------|---------------|
| User asks "what bookmarks do I have?" | `search_bookmarks` tool (more flexible) |
| Claude needs background context about your collection | `bookmark://stats` resource |
| User asks "what are my tags?" | `bookmark://tags` resource |
| User asks "save this link" | `save_bookmark` tool |

Resources are especially useful when Claude needs to understand the *shape* of your data before taking action. For example, before suggesting a tag, Claude might check `bookmark://tags` to see what tags already exist.

## Build

```bash
npx tsc
```

---

[← Adding Tools](05-adding-tools.md) | [Next: Step 7 - Adding Prompts →](07-adding-prompts.md)
