# Step 7: Pipe and Stdin

One-Line Summary: Add support for piped input so you can send any command's output to Claude — `git diff | ask "summarize"` and `cat file.py | ask "review this"`.

Prerequisites: Shell command generator from Step 6

---

## What This Enables

Pipes are what make a CLI tool feel native to the terminal. With pipe support, your tool composes with everything:

```bash
cat server.py | ask "find bugs in this code"
git diff | ask "write a commit message for these changes"
git log --oneline -20 | ask "summarize what happened this week"
curl -s https://api.example.com/data | ask "explain this JSON"
ls -la | ask "which files were modified today?"
```

The pattern is simple: if stdin is not a TTY (meaning data is being piped in), read it and prepend it to the user's question.

## Add Stdin Reading

Create `src/utils.ts`:

```typescript
// src/utils.ts
// ------------------------------------------
// Shared utilities — stdin reading
// ------------------------------------------

// ------------------------------------------
// Read all data from stdin (piped input)
// Returns null if stdin is a TTY (no pipe)
// ------------------------------------------
export function readStdin(): Promise<string | null> {
  return new Promise((resolve) => {
    // ------------------------------------------
    // process.stdin.isTTY is true when the user
    // is typing interactively, and undefined/false
    // when data is being piped in
    // ------------------------------------------
    if (process.stdin.isTTY) {
      resolve(null);
      return;
    }

    const chunks: Buffer[] = [];

    process.stdin.on('data', (chunk) => {
      chunks.push(chunk);
    });

    process.stdin.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf-8').trim();
      resolve(text || null);
    });

    // ------------------------------------------
    // Handle errors gracefully
    // ------------------------------------------
    process.stdin.on('error', () => {
      resolve(null);
    });
  });
}
```

The key insight is `process.stdin.isTTY`. When the user types `ask "question"` directly, `isTTY` is `true` and we skip stdin. When they pipe something in with `|`, `isTTY` is `undefined` and we read the piped data.

## Update the Default Command

Now update the default command action in `src/index.ts` to check for piped input. Replace the entire default command block:

```typescript
import { readStdin } from './utils.js';
```

Add this import alongside the others, then replace the default command action:

```typescript
// ------------------------------------------
// Default command: ask "question"
// Supports piped input: echo "code" | ask "review"
// ------------------------------------------
program
  .argument('[question...]', 'question to ask Claude')
  .action(async (questionParts: string[]) => {
    const question = questionParts.join(' ');

    // ------------------------------------------
    // Check for piped input from stdin
    // ------------------------------------------
    const stdinContent = await readStdin();

    if (!question && !stdinContent) {
      console.log(chalk.yellow('Usage: ask "your question here"'));
      console.log(chalk.yellow('       cat file | ask "your question"'));
      process.exit(1);
    }

    // ------------------------------------------
    // Build the full prompt
    // If there is piped content, include it as context
    // ------------------------------------------
    let fullPrompt: string;
    if (stdinContent && question) {
      fullPrompt =
        `${question}\n\n` +
        `Here is the content:\n\n` +
        `\`\`\`\n${stdinContent}\n\`\`\``;
    } else if (stdinContent) {
      fullPrompt =
        `Analyze the following content and provide a helpful summary:\n\n` +
        `\`\`\`\n${stdinContent}\n\`\`\``;
    } else {
      fullPrompt = question;
    }

    const spinner = ora('Thinking...').start();
    let started = false;

    try {
      await streamAsk(fullPrompt, (chunk) => {
        if (!started) {
          spinner.stop();
          console.log('\n' + chalk.bold('Answer:\n'));
          started = true;
        }
        process.stdout.write(chunk);
      });
      console.log('\n');
    } catch (error: any) {
      spinner.fail(chalk.red('Error: ' + error.message));
      process.exit(1);
    }
  });
```

**How the prompt assembly works:**

- **Pipe + question** (`git diff | ask "write a commit message"`) — the question becomes the instruction, and the piped content becomes the context.
- **Pipe only** (`cat file | ask`) — we add a default instruction to analyze and summarize.
- **Question only** (`ask "what is a mutex"`) — works exactly like before.

## Build and Test

```bash
npx tsc
```

Test with various pipes:

```bash
# Pipe a file for review
cat src/ask.ts | node dist/index.js "what does this code do?"

# Pipe command output
ls -la | node dist/index.js "which is the largest file?"

# Pipe with no question (auto-summarize)
cat package.json | node dist/index.js
```

Your CLI tool now composes with the entire Unix ecosystem. Any command that produces text output can be piped into `ask` for analysis.

---

[← Shell Command Generator](06-shell-command-generator.md) | [Next: Step 8 - What's Next →](08-whats-next.md)
