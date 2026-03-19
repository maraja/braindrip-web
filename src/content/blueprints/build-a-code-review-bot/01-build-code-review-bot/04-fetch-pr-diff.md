# Step 4: Fetch PR Diff

One-Line Summary: Use Octokit to fetch the pull request diff, extract changed files, and gather PR metadata for Claude to review.

Prerequisites: Workflow file from Step 3, types from Step 2

---

## The GitHub Module

This module wraps all GitHub API interactions: fetching PR details, getting the diff, and (later) posting review comments. We use `@octokit/rest` for typed API access.

Create `src/github.ts`:

```typescript
// src/github.ts
// ==========================================
// GitHub API Integration — Fetch Diffs,
// Post Reviews
// ==========================================

import { Octokit } from "@octokit/rest";
import { PullRequestFile } from "./types";

// ------------------------------------------
// Initialize the Octokit client with the
// GitHub token from the Actions environment
// ------------------------------------------
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.REPO_OWNER!;
const repo = process.env.REPO_NAME!;

// ------------------------------------------
// Fetch the list of files changed in a PR
// ------------------------------------------
export async function getPullRequestFiles(
  prNumber: number
): Promise<PullRequestFile[]> {
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber,
    per_page: 100,
  });

  return files.map((file) => ({
    filename: file.filename,
    status: file.status,
    patch: file.patch,
    additions: file.additions,
    deletions: file.deletions,
  }));
}

// ------------------------------------------
// Fetch PR metadata (title, description,
// base branch, head branch)
// ------------------------------------------
export async function getPullRequestDetails(prNumber: number) {
  const { data: pr } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });

  return {
    title: pr.title,
    body: pr.body ?? "",
    baseBranch: pr.base.ref,
    headBranch: pr.head.ref,
    author: pr.user?.login ?? "unknown",
    additions: pr.additions,
    deletions: pr.deletions,
    changedFiles: pr.changed_files,
  };
}

// ------------------------------------------
// Filter out files we should not review:
// lock files, generated code, binary files,
// and files with no patch (binary changes)
// ------------------------------------------
export function filterReviewableFiles(
  files: PullRequestFile[]
): PullRequestFile[] {
  const skipPatterns = [
    /package-lock\.json$/,
    /yarn\.lock$/,
    /pnpm-lock\.yaml$/,
    /\.lock$/,
    /\.min\.js$/,
    /\.min\.css$/,
    /\.map$/,
    /\.snap$/,
    /dist\//,
    /build\//,
    /node_modules\//,
    /\.png$/, /\.jpg$/, /\.jpeg$/, /\.gif$/, /\.svg$/, /\.ico$/,
    /\.woff$/, /\.woff2$/, /\.ttf$/, /\.eot$/,
  ];

  return files.filter((file) => {
    // ------------------------------------------
    // Skip files with no patch (binary files)
    // ------------------------------------------
    if (!file.patch) return false;

    // ------------------------------------------
    // Skip deleted files — nothing to review
    // ------------------------------------------
    if (file.status === "removed") return false;

    // ------------------------------------------
    // Skip files matching ignore patterns
    // ------------------------------------------
    return !skipPatterns.some((pattern) => pattern.test(file.filename));
  });
}

// ------------------------------------------
// Build a unified diff string from all
// reviewable files for Claude to analyze
// ------------------------------------------
export function buildDiffPayload(files: PullRequestFile[]): string {
  return files
    .map((file) => {
      return [
        `## File: ${file.filename}`,
        `Status: ${file.status} (+${file.additions} -${file.deletions})`,
        "```diff",
        file.patch,
        "```",
      ].join("\n");
    })
    .join("\n\n");
}
```

## How the Diff Format Works

GitHub's API returns diffs in **unified diff format**. Each file's `patch` field looks like this:

```diff
@@ -10,6 +10,8 @@ function calculateTotal(items) {
   let total = 0;
   for (const item of items) {
+    if (item.price < 0) continue;
     total += item.price * item.quantity;
   }
+  return Math.round(total * 100) / 100;
   return total;
 }
```

Lines starting with `+` are additions, `-` are deletions, and the `@@` header tells you the line numbers. This is exactly the context Claude needs to provide useful code reviews.

## Why We Filter Files

Not every file in a PR needs review. Lock files add noise (thousands of lines of dependency hashes), binary files have no readable diff, and generated files like source maps are not human-authored. The `filterReviewableFiles` function removes these so Claude focuses on the code that matters.

## Build and Verify

```bash
npx tsc
```

No errors means the GitHub module is ready. Next, we will send these diffs to Claude for analysis.

---

[← GitHub Action Workflow](03-github-action-workflow.md) | [Next: Step 5 - Analyze with Claude →](05-analyze-with-claude.md)
