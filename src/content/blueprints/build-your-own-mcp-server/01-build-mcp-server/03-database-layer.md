# Step 3: Database Layer

One-Line Summary: Set up a SQLite database with tables for bookmarks and tags, plus helper functions for all CRUD operations.

Prerequisites: Project setup from Step 2

---

## Why SQLite

SQLite is perfect for a local MCP server:
- **Zero configuration** — no server process, no connection strings
- **Single file** — your entire database is one `bookmarks.db` file
- **Fast** — `better-sqlite3` runs synchronously, no async overhead
- **Portable** — move your database by copying one file

## Create the Database Module

Create `src/db.ts`:

```typescript
// src/db.ts
// ==========================================
// SQLite Database Layer for Bookmarks
// ==========================================

import Database from 'better-sqlite3';
import path from 'path';

// ------------------------------------------
// 1. Initialize Database
// ------------------------------------------
// Store the database file next to the compiled JS
const DB_PATH = path.join(process.cwd(), 'bookmarks.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// ------------------------------------------
// 2. Create Tables
// ------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS bookmark_tags (
    bookmark_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (bookmark_id, tag_id),
    FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_bookmarks_url ON bookmarks(url);
  CREATE INDEX IF NOT EXISTS idx_bookmarks_created ON bookmarks(created_at);
  CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
`);

// ------------------------------------------
// 3. Prepared Statements
// ------------------------------------------
const insertBookmark = db.prepare(`
  INSERT INTO bookmarks (url, title, description)
  VALUES (@url, @title, @description)
`);

const findBookmarkByUrl = db.prepare(`
  SELECT * FROM bookmarks WHERE url = ?
`);

const searchBookmarks = db.prepare(`
  SELECT b.*, GROUP_CONCAT(t.name) as tags
  FROM bookmarks b
  LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
  LEFT JOIN tags t ON bt.tag_id = t.id
  WHERE b.title LIKE @query OR b.description LIKE @query OR b.url LIKE @query
  GROUP BY b.id
  ORDER BY b.created_at DESC
  LIMIT @limit
`);

const getBookmarksByTag = db.prepare(`
  SELECT b.*, GROUP_CONCAT(t2.name) as tags
  FROM bookmarks b
  JOIN bookmark_tags bt ON b.id = bt.bookmark_id
  JOIN tags t ON bt.tag_id = t.id
  LEFT JOIN bookmark_tags bt2 ON b.id = bt2.bookmark_id
  LEFT JOIN tags t2 ON bt2.tag_id = t2.id
  WHERE t.name = @tag
  GROUP BY b.id
  ORDER BY b.created_at DESC
  LIMIT @limit
`);

const getAllBookmarks = db.prepare(`
  SELECT b.*, GROUP_CONCAT(t.name) as tags
  FROM bookmarks b
  LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
  LEFT JOIN tags t ON bt.tag_id = t.id
  GROUP BY b.id
  ORDER BY b.created_at DESC
  LIMIT @limit
`);

const getAllTags = db.prepare(`
  SELECT t.name, COUNT(bt.bookmark_id) as count
  FROM tags t
  LEFT JOIN bookmark_tags bt ON t.id = bt.tag_id
  GROUP BY t.id
  ORDER BY count DESC
`);

const insertTag = db.prepare(`
  INSERT OR IGNORE INTO tags (name) VALUES (?)
`);

const linkTagToBookmark = db.prepare(`
  INSERT OR IGNORE INTO bookmark_tags (bookmark_id, tag_id)
  VALUES (?, (SELECT id FROM tags WHERE name = ?))
`);

const deleteBookmark = db.prepare(`
  DELETE FROM bookmarks WHERE id = ?
`);

const getRecentBookmarks = db.prepare(`
  SELECT b.*, GROUP_CONCAT(t.name) as tags
  FROM bookmarks b
  LEFT JOIN bookmark_tags bt ON b.id = bt.bookmark_id
  LEFT JOIN tags t ON bt.tag_id = t.id
  WHERE b.created_at >= datetime('now', @since)
  GROUP BY b.id
  ORDER BY b.created_at DESC
`);

// ------------------------------------------
// 4. Export Database Functions
// ------------------------------------------

export interface Bookmark {
  id: number;
  url: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  tags: string | null;
}

export function addBookmark(
  url: string,
  title: string,
  description: string | null,
  tags: string[]
): Bookmark {
  const existing = findBookmarkByUrl.get(url) as Bookmark | undefined;
  if (existing) {
    throw new Error(`Bookmark already exists: ${url}`);
  }

  const result = insertBookmark.run({ url, title, description });
  const bookmarkId = result.lastInsertRowid as number;

  for (const tag of tags) {
    const normalized = tag.toLowerCase().trim();
    if (normalized) {
      insertTag.run(normalized);
      linkTagToBookmark.run(bookmarkId, normalized);
    }
  }

  return getAllBookmarks.get({ limit: 1 }) as Bookmark;
}

export function search(query: string, limit = 20): Bookmark[] {
  const pattern = `%${query}%`;
  return searchBookmarks.all({ query: pattern, limit }) as Bookmark[];
}

export function getByTag(tag: string, limit = 20): Bookmark[] {
  return getBookmarksByTag.all({ tag: tag.toLowerCase(), limit }) as Bookmark[];
}

export function getAll(limit = 50): Bookmark[] {
  return getAllBookmarks.all({ limit }) as Bookmark[];
}

export function getTags(): { name: string; count: number }[] {
  return getAllTags.all() as { name: string; count: number }[];
}

export function getRecent(days: number): Bookmark[] {
  return getRecentBookmarks.all({ since: `-${days} days` }) as Bookmark[];
}

export function remove(id: number): boolean {
  const result = deleteBookmark.run(id);
  return result.changes > 0;
}

export function addTagsToBookmark(bookmarkId: number, tags: string[]): void {
  for (const tag of tags) {
    const normalized = tag.toLowerCase().trim();
    if (normalized) {
      insertTag.run(normalized);
      linkTagToBookmark.run(bookmarkId, normalized);
    }
  }
}

export { db };
```

**Key design decisions:**

- **Prepared statements** are defined once at module load — they are compiled once and reused for every call, which is faster and safer than string interpolation.
- **Tags are normalized** to lowercase to prevent duplicates like "AI" and "ai".
- **`INSERT OR IGNORE`** on tags and tag links makes the code idempotent — adding the same tag twice is a no-op.
- **`GROUP_CONCAT`** returns all tags for a bookmark as a comma-separated string, so we get tag data in a single query.

## Test It

You can verify the database works by adding a quick test. Create `src/test-db.ts`:

```typescript
import { addBookmark, search, getTags, getAll } from './db';

// Add a test bookmark
const bm = addBookmark(
  'https://modelcontextprotocol.io',
  'MCP Documentation',
  'Official MCP protocol documentation',
  ['mcp', 'ai', 'docs']
);

console.log('Added:', bm);
console.log('Search:', search('mcp'));
console.log('Tags:', getTags());
console.log('All:', getAll());
```

Run it:

```bash
npx tsc && node dist/test-db.js
```

You should see the bookmark with its tags. You can delete `test-db.ts` and `bookmarks.db` after — we will recreate it when we run the real server.

---

[← Project Setup](02-project-setup.md) | [Next: Step 4 - Server Skeleton →](04-server-skeleton.md)
