# Step 3: GitHub Action Workflow

One-Line Summary: Create the YAML workflow file that triggers the code review bot whenever a pull request is opened or updated.

Prerequisites: Project structure from Step 2

---

## How GitHub Actions Works

GitHub Actions runs workflows in response to events. We want our bot to run when:

1. A pull request is **opened** for the first time
2. A pull request is **synchronized** (new commits pushed to the branch)

The workflow will check out the code, install dependencies, build the TypeScript, and run the review bot.

## Create the Workflow File

Create `.github/workflows/code-review.yml`:

```yaml
# .github/workflows/code-review.yml
# ==========================================
# Code Review Bot — Triggered on PR Events
# ==========================================

name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

# ------------------------------------------
# Permissions required to read PR diffs
# and post review comments
# ------------------------------------------
permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    name: Review PR with Claude
    runs-on: ubuntu-latest

    # ------------------------------------------
    # Skip draft PRs and dependabot PRs
    # ------------------------------------------
    if: |
      github.event.pull_request.draft == false &&
      github.actor != 'dependabot[bot]'

    steps:
      # ------------------------------------------
      # Step 1: Check out the repository
      # ------------------------------------------
      - name: Checkout code
        uses: actions/checkout@v4

      # ------------------------------------------
      # Step 2: Set up Node.js
      # ------------------------------------------
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      # ------------------------------------------
      # Step 3: Install dependencies and build
      # ------------------------------------------
      - name: Install dependencies
        run: npm ci

      - name: Build TypeScript
        run: npm run build

      # ------------------------------------------
      # Step 4: Run the code review bot
      # ------------------------------------------
      - name: Run AI code review
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          PR_NUMBER: ${{ github.event.pull_request.number }}
          REPO_OWNER: ${{ github.repository_owner }}
          REPO_NAME: ${{ github.event.repository.name }}
        run: node dist/index.js
```

## What Each Section Does

**`on.pull_request.types`** — Triggers the workflow on two events. `opened` fires when a new PR is created. `synchronize` fires when new commits are pushed to the PR branch. We intentionally skip `edited` (title/description changes) since those do not change code.

**`permissions`** — GitHub Actions uses a short-lived `GITHUB_TOKEN` with scoped permissions. We need `contents: read` to check out the code, and `pull-requests: write` to post review comments.

**`if` condition** — Skips draft PRs (no point reviewing work-in-progress) and Dependabot PRs (dependency bumps rarely need AI review).

**Environment variables** — We pass the PR metadata as environment variables so our TypeScript code can read them without parsing the event payload directly. `GITHUB_TOKEN` is provided automatically by GitHub Actions. `ANTHROPIC_API_KEY` must be added as a repository secret.

## Add the Anthropic API Key Secret

Go to your GitHub repository:

1. Navigate to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY`
4. Value: Your Anthropic API key (starts with `sk-ant-`)
5. Click **Add secret**

The `GITHUB_TOKEN` is provided automatically — you do not need to create it.

## Test the Workflow Syntax

You can validate the YAML locally before pushing:

```bash
# Install the GitHub Actions linter (optional)
npm install -g @action-validator/cli

# Validate the workflow file
action-validator .github/workflows/code-review.yml
```

Or simply push the file — GitHub will show syntax errors in the Actions tab if anything is wrong.

---

[← Project Setup](02-project-setup.md) | [Next: Step 4 - Fetch PR Diff →](04-fetch-pr-diff.md)
