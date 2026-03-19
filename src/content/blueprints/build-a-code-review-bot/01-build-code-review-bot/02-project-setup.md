# Step 2: Project Setup

One-Line Summary: Initialize the Node.js project, install the Anthropic SDK and Octokit, and configure TypeScript for building a GitHub Action.

Prerequisites: Node.js 18+ installed, npm

---

## Create the Project

```bash
mkdir code-review-bot && cd code-review-bot
npm init -y
```

## Install Dependencies

```bash
npm install @anthropic-ai/sdk @octokit/rest @actions/core @actions/github
npm install -D typescript @types/node
```

What each package does:

| Package | Purpose |
|---------|---------|
| `@anthropic-ai/sdk` | Official Anthropic TypeScript SDK — sends diffs to Claude and receives structured reviews |
| `@octokit/rest` | GitHub REST API client — fetches PR diffs, posts review comments |
| `@actions/core` | GitHub Actions toolkit — read inputs, set outputs, log messages |
| `@actions/github` | GitHub Actions context — provides the PR number, repo owner, and event payload |
| `typescript` | TypeScript compiler |

## Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

We use `commonjs` modules because GitHub Actions runners expect a standard Node.js `require` setup. The `ES2022` target gives us access to top-level features like `Array.prototype.at()` and `Object.hasOwn()`.

## Update package.json

Add the build script. Open `package.json` and update it:

```json
{
  "name": "code-review-bot",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## Create the Source Files

```bash
mkdir -p src .github/workflows
```

Create the type definitions first. Add `src/types.ts`:

```typescript
// src/types.ts
// ==========================================
// Shared Type Definitions
// ==========================================

// ------------------------------------------
// A single review comment from Claude
// ------------------------------------------
export interface ReviewComment {
  path: string;        // File path relative to repo root
  line: number;        // Line number in the diff
  body: string;        // The review comment text
  severity: "critical" | "warning" | "suggestion";
}

// ------------------------------------------
// The complete review result
// ------------------------------------------
export interface ReviewResult {
  summary: string;           // Overall review summary
  comments: ReviewComment[]; // Inline comments on specific lines
  approved: boolean;         // Whether the code looks good overall
}

// ------------------------------------------
// A file changed in the pull request
// ------------------------------------------
export interface PullRequestFile {
  filename: string;    // Path relative to repo root
  status: string;      // "added", "modified", "removed", "renamed"
  patch?: string;      // The unified diff for this file
  additions: number;   // Lines added
  deletions: number;   // Lines removed
}
```

## Verify the Setup

```bash
npx tsc --version
```

You should see TypeScript 5.x. Then build the types file to confirm everything compiles:

```bash
npx tsc
```

If there are no errors, your project is ready. The `dist/` folder should contain the compiled `types.js` and `types.d.ts`.

---

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - GitHub Action Workflow →](03-github-action-workflow.md)
