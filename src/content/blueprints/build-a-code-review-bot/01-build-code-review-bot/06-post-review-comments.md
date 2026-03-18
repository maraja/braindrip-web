# Step 6: Post Review Comments

One-Line Summary: Post Claude's structured feedback as GitHub PR review comments using the Octokit API, placing inline comments on the exact lines that need attention.

Prerequisites: Reviewer module from Step 5

---

## How GitHub PR Reviews Work

GitHub has two ways to comment on a PR:

1. **Issue comments** — General comments on the PR thread (simple but imprecise)
2. **Pull request reviews** — Structured reviews with inline comments on specific diff lines (what we want)

We will use the pull request review API. This posts all comments as a single review, which is cleaner than posting individual comments one at a time.

## Add the Review Posting Function

Add this function to `src/github.ts`:

```typescript
// src/github.ts (add to existing file)
// ==========================================
// Post Review Comments on a Pull Request
// ==========================================

import { ReviewResult, ReviewComment } from "./types";

// ------------------------------------------
// Post a complete review with inline comments
// ------------------------------------------
export async function postReview(
  prNumber: number,
  review: ReviewResult
): Promise<void> {
  // ------------------------------------------
  // Get the latest commit SHA — reviews must
  // reference a specific commit
  // ------------------------------------------
  const { data: pr } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: prNumber,
  });
  const commitSha = pr.head.sha;

  // ------------------------------------------
  // Build the review body with a summary
  // ------------------------------------------
  const severityCounts = {
    critical: review.comments.filter((c) => c.severity === "critical").length,
    warning: review.comments.filter((c) => c.severity === "warning").length,
    suggestion: review.comments.filter((c) => c.severity === "suggestion").length,
  };

  let body = `## AI Code Review\n\n${review.summary}\n\n`;

  if (review.comments.length > 0) {
    body += `**Found ${review.comments.length} item(s):**`;
    const parts: string[] = [];
    if (severityCounts.critical > 0) parts.push(` ${severityCounts.critical} critical`);
    if (severityCounts.warning > 0) parts.push(` ${severityCounts.warning} warning(s)`);
    if (severityCounts.suggestion > 0) parts.push(` ${severityCounts.suggestion} suggestion(s)`);
    body += parts.join(",") + "\n";
  } else {
    body += "No issues found. The code looks good.\n";
  }

  // ------------------------------------------
  // Map our comments to GitHub's review
  // comment format. Each comment targets a
  // specific file and line in the diff.
  // ------------------------------------------
  const comments = review.comments.map((comment) => ({
    path: comment.path,
    line: comment.line,
    body: comment.body,
  }));

  // ------------------------------------------
  // Determine the review action:
  // APPROVE if no issues, COMMENT otherwise.
  // We use COMMENT instead of REQUEST_CHANGES
  // to avoid blocking the PR — the bot is
  // advisory, not a gatekeeper.
  // ------------------------------------------
  const event: "APPROVE" | "COMMENT" = review.approved ? "APPROVE" : "COMMENT";

  try {
    await octokit.pulls.createReview({
      owner,
      repo,
      pull_number: prNumber,
      commit_id: commitSha,
      body,
      event,
      comments,
    });

    console.log(
      `Review posted: ${event} with ${comments.length} inline comment(s)`
    );
  } catch (error: any) {
    // ------------------------------------------
    // If inline comments fail (e.g., line number
    // is out of range), fall back to a simple
    // comment with all feedback in the body
    // ------------------------------------------
    console.error("Failed to post inline review:", error.message);
    await postFallbackComment(prNumber, review);
  }
}

// ------------------------------------------
// Fallback: post all feedback as a single
// PR comment if the review API rejects
// our inline comments
// ------------------------------------------
async function postFallbackComment(
  prNumber: number,
  review: ReviewResult
): Promise<void> {
  let body = `## AI Code Review\n\n${review.summary}\n\n`;

  if (review.comments.length > 0) {
    body += "### Comments\n\n";
    for (const comment of review.comments) {
      body += `**${comment.severity}** — \`${comment.path}:${comment.line}\`\n`;
      body += `${comment.body}\n\n`;
    }
  }

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body,
  });

  console.log("Fallback comment posted on PR");
}
```

## Wire It All Together

Now create the entry point. Add `src/index.ts`:

```typescript
// src/index.ts
// ==========================================
// Entry Point — Orchestrate the Review Flow
// ==========================================

import {
  getPullRequestFiles,
  getPullRequestDetails,
  filterReviewableFiles,
  buildDiffPayload,
  postReview,
} from "./github";
import { reviewDiff } from "./reviewer";

// ------------------------------------------
// Main function — called when the GitHub
// Action runs
// ------------------------------------------
async function main(): Promise<void> {
  const prNumber = parseInt(process.env.PR_NUMBER!, 10);

  if (isNaN(prNumber)) {
    console.error("PR_NUMBER environment variable is not set or invalid");
    process.exit(1);
  }

  console.log(`Reviewing PR #${prNumber}...`);

  // ------------------------------------------
  // Step 1: Fetch PR metadata and files
  // ------------------------------------------
  const [prDetails, allFiles] = await Promise.all([
    getPullRequestDetails(prNumber),
    getPullRequestFiles(prNumber),
  ]);

  console.log(
    `PR: "${prDetails.title}" by ${prDetails.author} ` +
    `(+${prDetails.additions} -${prDetails.deletions}, ${prDetails.changedFiles} files)`
  );

  // ------------------------------------------
  // Step 2: Filter to reviewable files
  // ------------------------------------------
  const files = filterReviewableFiles(allFiles);
  console.log(`Reviewing ${files.length} of ${allFiles.length} changed files`);

  if (files.length === 0) {
    console.log("No reviewable files found. Skipping review.");
    return;
  }

  // ------------------------------------------
  // Step 3: Build the diff payload and
  // send it to Claude
  // ------------------------------------------
  const diff = buildDiffPayload(files);
  const review = await reviewDiff(diff, prDetails.title, prDetails.body);

  console.log(
    `Review complete: ${review.comments.length} comment(s), ` +
    `approved: ${review.approved}`
  );

  // ------------------------------------------
  // Step 4: Post the review on the PR
  // ------------------------------------------
  await postReview(prNumber, review);

  console.log("Done.");
}

main().catch((error) => {
  console.error("Review bot failed:", error);
  process.exit(1);
});
```

## Why a Fallback Comment?

The GitHub review API is strict about line numbers. If Claude references a line that is not part of the diff hunk, the entire review submission fails. The fallback posts all feedback as a regular PR comment so the author still receives the review, even if inline placement fails. We will improve line number accuracy in Step 7.

## Build and Verify

```bash
npx tsc
```

The bot is now fully functional. Next, we will test it on a real pull request and refine the results.

---

[← Analyze with Claude](05-analyze-with-claude.md) | [Next: Step 7 - Test and Refine →](07-test-and-refine.md)
