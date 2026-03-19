# Step 5: Analyze with Claude

One-Line Summary: Send the PR diff to Claude with a carefully crafted system prompt for code review, and parse the response into structured feedback.

Prerequisites: GitHub module from Step 4

---

The quality of your code review bot depends almost entirely on the system prompt. A good prompt turns Claude into a focused, actionable reviewer. A vague prompt produces generic commentary.

## Create the Reviewer Module

Create `src/reviewer.ts`:

```typescript
// src/reviewer.ts
// ==========================================
// Claude Integration — Analyze Code Diffs
// and Return Structured Review Feedback
// ==========================================

import Anthropic from "@anthropic-ai/sdk";
import { ReviewResult, ReviewComment } from "./types";

// ------------------------------------------
// Initialize the Anthropic client
// ------------------------------------------
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ------------------------------------------
// System prompt — this is the most important
// part of the entire bot. It defines how
// Claude reviews code.
// ------------------------------------------
const SYSTEM_PROMPT = `You are a senior software engineer performing a code review on a pull request. Your job is to identify real issues — bugs, security problems, performance concerns, and maintainability risks.

Rules for your review:
1. Focus on REAL issues, not style preferences. Do not nitpick formatting, naming conventions, or minor style choices unless they cause confusion.
2. Every comment must be actionable. Say what is wrong AND how to fix it.
3. Be concise. One to three sentences per comment. No essays.
4. Use severity levels: "critical" for bugs and security issues, "warning" for performance and logic concerns, "suggestion" for improvements that are not urgent.
5. If the code looks good, say so. Do not invent problems to seem thorough.
6. Review each file independently. Reference the specific file path and line number.

Respond ONLY with valid JSON in this exact format:
{
  "summary": "Brief overall assessment of the PR (1-2 sentences)",
  "approved": true/false,
  "comments": [
    {
      "path": "src/example.ts",
      "line": 42,
      "body": "**warning**: This array lookup can return undefined when the index is out of bounds. Add a bounds check or use optional chaining.",
      "severity": "warning"
    }
  ]
}

If there are no issues, return an empty comments array and set approved to true.`;

// ------------------------------------------
// Send the diff to Claude and parse the
// structured response
// ------------------------------------------
export async function reviewDiff(
  diff: string,
  prTitle: string,
  prBody: string
): Promise<ReviewResult> {
  const userMessage = [
    `## Pull Request: ${prTitle}`,
    "",
    prBody ? `### Description\n${prBody}` : "",
    "",
    "### Changed Files",
    "",
    diff,
  ]
    .filter(Boolean)
    .join("\n");

  // ------------------------------------------
  // Call the Claude API with the diff
  // ------------------------------------------
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  // ------------------------------------------
  // Extract the text content from the response
  // ------------------------------------------
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  return parseReviewResponse(textBlock.text);
}

// ------------------------------------------
// Parse Claude's JSON response into our
// ReviewResult type. Handles edge cases
// like markdown code fences in the response.
// ------------------------------------------
function parseReviewResponse(raw: string): ReviewResult {
  // ------------------------------------------
  // Claude sometimes wraps JSON in ```json
  // code fences — strip them if present
  // ------------------------------------------
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    const parsed = JSON.parse(cleaned);

    // ------------------------------------------
    // Validate the structure matches our types
    // ------------------------------------------
    const result: ReviewResult = {
      summary: parsed.summary ?? "No summary provided.",
      approved: parsed.approved ?? false,
      comments: [],
    };

    if (Array.isArray(parsed.comments)) {
      result.comments = parsed.comments
        .filter(
          (c: any) =>
            typeof c.path === "string" &&
            typeof c.line === "number" &&
            typeof c.body === "string"
        )
        .map((c: any): ReviewComment => ({
          path: c.path,
          line: c.line,
          body: c.body,
          severity: ["critical", "warning", "suggestion"].includes(c.severity)
            ? c.severity
            : "suggestion",
        }));
    }

    return result;
  } catch (error) {
    // ------------------------------------------
    // If JSON parsing fails, return the raw
    // text as a summary with no inline comments
    // ------------------------------------------
    console.error("Failed to parse Claude response as JSON:", error);
    return {
      summary: raw,
      comments: [],
      approved: false,
    };
  }
}
```

## Why This Prompt Works

The system prompt follows three principles:

1. **Constraints reduce noise.** Telling Claude to skip style nitpicks and focus on real issues prevents the most common complaint about AI reviewers: too many trivial comments.

2. **Structured output enables automation.** By requiring JSON with specific fields, we can programmatically post each comment on the correct file and line. Without structure, we would need fragile text parsing.

3. **Severity levels prioritize attention.** Developers can scan for `critical` items first, then address `warning` and `suggestion` items when they have time.

## Handling Large Diffs

Claude's context window is large, but extremely long diffs can still cause issues. We will address truncation strategies in Step 7. For now, the `filterReviewableFiles` function from Step 4 keeps the payload manageable by excluding lock files, binaries, and generated code.

## Build and Verify

```bash
npx tsc
```

No errors means the reviewer module is ready. Next, we will post Claude's feedback as PR review comments.

---

[← Fetch PR Diff](04-fetch-pr-diff.md) | [Next: Step 6 - Post Review Comments →](06-post-review-comments.md)
