# Step 7: Adding Prompts

One-Line Summary: Create reusable prompt templates for common bookmark tasks — a weekly digest and a tag cleanup assistant.

Prerequisites: Resources from Step 6

---

Prompts are **reusable templates** that help Claude interact with your data in a structured way. They are different from tools (actions) and resources (data). Think of them as saved workflows that Claude can invoke.

## Replace prompts.ts

Replace the contents of `src/prompts.ts`:

```typescript
// src/prompts.ts
// ==========================================
// MCP Prompts — Reusable Templates
// ==========================================

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as db from './db.js';

export function registerPrompts(server: McpServer): void {
  // ------------------------------------------
  // PROMPT: Weekly Digest
  // ------------------------------------------
  server.prompt(
    'weekly-digest',
    'Generate a summary of bookmarks saved in the last N days, organized by tag.',
    { days: z.string().optional().describe('Number of days to look back (default: 7)') },
    async ({ days }) => {
      const lookback = parseInt(days || '7', 10);
      const recent = db.getRecent(lookback);

      if (recent.length === 0) {
        return {
          messages: [{
            role: 'user',
            content: {
              type: 'text',
              text: `No bookmarks saved in the last ${lookback} days. Let the user know their collection is quiet.`,
            },
          }],
        };
      }

      // Group by tags
      const byTag = new Map<string, typeof recent>();
      for (const b of recent) {
        const tags = b.tags ? b.tags.split(',') : ['untagged'];
        for (const tag of tags) {
          const trimmed = tag.trim();
          if (!byTag.has(trimmed)) byTag.set(trimmed, []);
          byTag.get(trimmed)!.push(b);
        }
      }

      const grouped = [...byTag.entries()]
        .map(([tag, bookmarks]) =>
          `**${tag}** (${bookmarks.length}):\n` +
          bookmarks.map(b => `- [${b.title}](${b.url})`).join('\n')
        ).join('\n\n');

      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Here are the ${recent.length} bookmarks saved in the last ${lookback} days, grouped by tag:\n\n${grouped}\n\nPlease create a concise weekly digest summary. Highlight any themes or patterns you notice. Suggest which bookmarks are worth revisiting.`,
          },
        }],
      };
    }
  );

  // ------------------------------------------
  // PROMPT: Tag Cleanup
  // ------------------------------------------
  server.prompt(
    'tag-cleanup',
    'Analyze bookmark tags and suggest improvements — merge duplicates, add missing tags, improve organization.',
    {},
    async () => {
      const tags = db.getTags();
      const bookmarks = db.getAll(100);

      const untagged = bookmarks.filter(b => !b.tags);

      const tagList = tags.map(t => `- ${t.name} (${t.count} bookmarks)`).join('\n');

      const untaggedList = untagged.length > 0
        ? untagged.map(b => `- ${b.title}: ${b.url}`).join('\n')
        : 'None — all bookmarks are tagged!';

      return {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: `Please analyze my bookmark tags and suggest improvements.\n\n` +
              `**Current tags:**\n${tagList || 'No tags yet.'}\n\n` +
              `**Untagged bookmarks:**\n${untaggedList}\n\n` +
              `**Total bookmarks:** ${bookmarks.length}\n\n` +
              `Please suggest:\n` +
              `1. Tags that should be merged (duplicates or near-duplicates)\n` +
              `2. Tags for the untagged bookmarks\n` +
              `3. Any new tag categories that would improve organization\n` +
              `4. Tags that might be too broad or too narrow`,
          },
        }],
      };
    }
  );
}
```

**How prompts differ from tools:**

| | Tools | Prompts |
|--|-------|---------|
| **Purpose** | Execute an action | Start a conversation |
| **Output** | Direct result | Message template for Claude |
| **User interaction** | Claude calls automatically | User explicitly selects |
| **Example** | "Save this bookmark" | "Generate my weekly digest" |

Prompts are powerful for workflows that require Claude's reasoning — like analyzing patterns in your bookmarks or suggesting organizational improvements. Tools are better for direct CRUD operations.

## Build

```bash
npx tsc
```

Your MCP server is now feature-complete. It has 5 tools, 4 resources, and 2 prompts. In the next step, we will connect it to Claude Desktop.

---

[← Adding Resources](06-adding-resources.md) | [Next: Step 8 - Connect to Claude Desktop →](08-connect-to-claude.md)
