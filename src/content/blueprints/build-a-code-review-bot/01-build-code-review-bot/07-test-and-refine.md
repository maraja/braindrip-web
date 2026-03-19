# Step 7: Test and Refine

One-Line Summary: Test the bot on a real pull request, tune the system prompt for better results, and handle edge cases like large diffs and binary files.

Prerequisites: Complete bot from Steps 1-6

---

## Test on a Real PR

Push your code to a GitHub repository and open a test pull request:

```bash
# Initialize git and push
git init
git add .
git commit -m "Add code review bot"
git remote add origin https://github.com/YOUR_USERNAME/code-review-bot.git
git push -u origin main

# Create a test branch with some intentional issues
git checkout -b test/review-bot
```

Create a test file with some deliberate problems for the bot to find. Add `test-file.ts`:

```typescript
// test-file.ts — intentional issues for testing
// ==========================================

// ------------------------------------------
// Bug: comparison with = instead of ===
// ------------------------------------------
function isAdmin(role: string): boolean {
  if (role = "admin") {
    return true;
  }
  return false;
}

// ------------------------------------------
// Security: SQL injection vulnerability
// ------------------------------------------
function getUser(id: string): string {
  const query = `SELECT * FROM users WHERE id = '${id}'`;
  return query;
}

// ------------------------------------------
// Performance: O(n^2) nested loop
// ------------------------------------------
function findDuplicates(arr: number[]): number[] {
  const dupes: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        dupes.push(arr[i]);
      }
    }
  }
  return dupes;
}
```

```bash
git add test-file.ts
git commit -m "Add feature with some issues"
git push -u origin test/review-bot
```

Open a pull request from `test/review-bot` into `main`. The workflow will trigger automatically. Check the Actions tab to see the bot running.

## Handle Large Diffs

Claude has a generous context window, but very large PRs (50+ files, thousands of lines) can hit token limits. Add a truncation strategy to `src/reviewer.ts`:

```typescript
// src/reviewer.ts (add to existing file)
// ==========================================
// Truncate Diffs That Exceed Token Limits
// ==========================================

// ------------------------------------------
// Rough estimate: 1 token ≈ 4 characters.
// Stay well under the context window to
// leave room for the system prompt and
// Claude's response.
// ------------------------------------------
const MAX_DIFF_CHARS = 100_000; // ~25,000 tokens

export function truncateDiff(diff: string): string {
  if (diff.length <= MAX_DIFF_CHARS) {
    return diff;
  }

  const truncated = diff.slice(0, MAX_DIFF_CHARS);

  // ------------------------------------------
  // Cut at the last complete file boundary
  // so we don't send a partial diff
  // ------------------------------------------
  const lastFileHeader = truncated.lastIndexOf("\n## File:");
  const cleanCut = lastFileHeader > 0
    ? truncated.slice(0, lastFileHeader)
    : truncated;

  return (
    cleanCut +
    "\n\n---\n*[Diff truncated — remaining files omitted due to size]*"
  );
}
```

Update `src/index.ts` to use the truncation:

```typescript
// In src/index.ts, update the diff building step:
// ------------------------------------------
import { reviewDiff, truncateDiff } from "./reviewer";

// ... inside main():

const diff = truncateDiff(buildDiffPayload(files));
```

## Improve Line Number Accuracy

The most common issue with inline comments is Claude referencing a line number that falls outside the diff hunk. Add a validation function to `src/github.ts`:

```typescript
// src/github.ts (add to existing file)
// ==========================================
// Validate Comment Line Numbers Against
// the Actual Diff Hunks
// ==========================================

import { PullRequestFile, ReviewComment } from "./types";

export function validateCommentLines(
  comments: ReviewComment[],
  files: PullRequestFile[]
): ReviewComment[] {
  const filePatches = new Map<string, Set<number>>();

  // ------------------------------------------
  // Parse each file's patch to extract the
  // valid line numbers from diff hunks
  // ------------------------------------------
  for (const file of files) {
    if (!file.patch) continue;
    const lines = new Set<number>();
    let currentLine = 0;

    for (const line of file.patch.split("\n")) {
      const match = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
      if (match) {
        currentLine = parseInt(match[1], 10);
        continue;
      }
      if (line.startsWith("-")) continue;
      if (line.startsWith("+") || line.startsWith(" ")) {
        lines.add(currentLine);
        currentLine++;
      }
    }

    filePatches.set(file.filename, lines);
  }

  // ------------------------------------------
  // Keep only comments that target valid lines
  // ------------------------------------------
  return comments.filter((comment) => {
    const validLines = filePatches.get(comment.path);
    if (!validLines) return false;
    return validLines.has(comment.line);
  });
}
```

## Tune the System Prompt

After running the bot on a few PRs, you will notice patterns. Common adjustments:

- **Too many comments?** Add: "Limit yourself to the 5 most important issues per file."
- **Too vague?** Add: "Always include a concrete code example showing the fix."
- **Missing context?** Add: "Consider the file path to infer the framework (e.g., files in /api/ are likely server routes)."
- **False positives?** Add: "If you are not confident an issue is real, do not comment on it."

These refinements compound. After a few iterations, the bot will match the quality of a thoughtful human reviewer for common patterns.

## Build and Verify

```bash
npx tsc
```

Push the updates and open another test PR to verify the improvements.

---

[← Post Review Comments](06-post-review-comments.md) | [Next: Step 8 - What's Next →](08-whats-next.md)
