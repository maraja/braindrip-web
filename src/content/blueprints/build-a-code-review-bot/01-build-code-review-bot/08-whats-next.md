# Step 8: What's Next

One-Line Summary: Extend the bot with severity-based approvals, multi-language support, rate limiting, and smarter review strategies.

Prerequisites: Working code review bot from Steps 1-7

---

## What You Built

You now have a fully functional GitHub Action that:

| Capability | Details |
|-----------|---------|
| **Automatic triggering** | Runs on every PR open and update |
| **Smart filtering** | Skips lock files, binaries, drafts, and Dependabot PRs |
| **Claude-powered review** | Structured analysis with severity levels |
| **Inline comments** | Posts feedback on the exact lines that need attention |
| **Graceful fallbacks** | Falls back to a summary comment if inline placement fails |
| **Diff truncation** | Handles large PRs without hitting token limits |

This is a production-ready starting point. Below are extensions that will make it even more useful.

## Extension 1: Auto-Approve Clean PRs

If Claude finds no issues, automatically approve the PR to speed up the merge workflow:

```typescript
// src/github.ts — upgrade postReview
// ==========================================
// Auto-Approve When Claude Finds No Issues
// ==========================================

// ------------------------------------------
// Change the event type to APPROVE when
// the review has zero comments and Claude
// explicitly marked it as approved
// ------------------------------------------
const event: "APPROVE" | "COMMENT" | "REQUEST_CHANGES" =
  review.approved && review.comments.length === 0
    ? "APPROVE"
    : review.comments.some((c) => c.severity === "critical")
      ? "REQUEST_CHANGES"
      : "COMMENT";
```

This creates three tiers: clean PRs get auto-approved, PRs with critical issues get changes requested, and everything else gets advisory comments.

## Extension 2: Severity-Based Labels

Automatically label PRs based on the highest severity found:

```typescript
// src/github.ts — add after postReview
// ==========================================
// Apply Labels Based on Review Severity
// ==========================================

export async function applyReviewLabels(
  prNumber: number,
  review: ReviewResult
): Promise<void> {
  // ------------------------------------------
  // Remove any existing review labels first
  // ------------------------------------------
  const reviewLabels = ["review:clean", "review:warnings", "review:critical"];
  const { data: currentLabels } = await octokit.issues.listLabelsOnIssue({
    owner,
    repo,
    issue_number: prNumber,
  });

  for (const label of currentLabels) {
    if (reviewLabels.includes(label.name)) {
      await octokit.issues.removeLabel({
        owner,
        repo,
        issue_number: prNumber,
        name: label.name,
      });
    }
  }

  // ------------------------------------------
  // Apply the appropriate label
  // ------------------------------------------
  const hasCritical = review.comments.some((c) => c.severity === "critical");
  const hasWarnings = review.comments.some((c) => c.severity === "warning");

  const label = hasCritical
    ? "review:critical"
    : hasWarnings
      ? "review:warnings"
      : "review:clean";

  await octokit.issues.addLabels({
    owner,
    repo,
    issue_number: prNumber,
    labels: [label],
  });
}
```

## Extension 3: Rate Limiting and Cost Control

Add rate limiting to avoid unexpected API costs on busy repositories:

```typescript
// src/reviewer.ts — add rate limiting
// ==========================================
// Rate Limiting and Cost Controls
// ==========================================

// ------------------------------------------
// Skip review if the diff is trivially small
// (e.g., a one-line typo fix)
// ------------------------------------------
const MIN_DIFF_LINES = 5;

export function shouldReview(diff: string): boolean {
  const lineCount = diff.split("\n").length;
  if (lineCount < MIN_DIFF_LINES) {
    console.log(`Diff too small (${lineCount} lines). Skipping review.`);
    return false;
  }
  return true;
}

// ------------------------------------------
// Track daily usage to cap API costs.
// Store the count in a workflow artifact
// or environment variable.
// ------------------------------------------
const MAX_REVIEWS_PER_DAY = 50;

export function checkDailyLimit(): boolean {
  const today = new Date().toISOString().split("T")[0];
  const countKey = `REVIEW_COUNT_${today}`;
  const count = parseInt(process.env[countKey] ?? "0", 10);
  return count < MAX_REVIEWS_PER_DAY;
}
```

## Extension 4: Multi-Language Review Hints

Improve review quality by telling Claude which languages are in the PR:

```typescript
// src/reviewer.ts — add language detection
// ==========================================
// Detect Languages for Better Reviews
// ==========================================

const LANGUAGE_MAP: Record<string, string> = {
  ".ts": "TypeScript",
  ".tsx": "TypeScript React",
  ".js": "JavaScript",
  ".jsx": "JavaScript React",
  ".py": "Python",
  ".go": "Go",
  ".rs": "Rust",
  ".java": "Java",
  ".rb": "Ruby",
  ".swift": "Swift",
  ".kt": "Kotlin",
};

export function detectLanguages(filenames: string[]): string[] {
  const languages = new Set<string>();
  for (const name of filenames) {
    const ext = name.slice(name.lastIndexOf("."));
    const lang = LANGUAGE_MAP[ext];
    if (lang) languages.add(lang);
  }
  return Array.from(languages);
}
```

Add the detected languages to the system prompt so Claude can apply language-specific rules (e.g., checking for `nil` handling in Go, or `unwrap()` usage in Rust).

## Further Ideas

- **Review only the delta** — On `synchronize` events, review only the new commits since the last review, not the entire PR diff
- **Configurable rules** — Add a `.code-review.yml` config file to let each repository customize which checks to run
- **Comment threading** — Reply to existing bot comments instead of creating new ones on each push
- **Metrics dashboard** — Track how many issues the bot catches vs. what humans find, and use it to improve the prompt
- **PR description review** — Check whether the PR description adequately explains the changes

You have a solid foundation. Each extension builds on the same architecture: fetch context from GitHub, analyze with Claude, act on the results. The patterns you learned here apply to any AI-powered developer tool.

---

[← Test and Refine](07-test-and-refine.md)
