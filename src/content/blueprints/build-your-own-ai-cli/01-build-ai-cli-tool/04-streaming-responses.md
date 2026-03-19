# Step 4: Streaming Responses

One-Line Summary: Replace the batch API call with streaming so Claude's response appears word-by-word in the terminal — just like ChatGPT and Claude Code.

Prerequisites: Working ask command from Step 3

---

## Why Streaming Matters

With the batch approach from Step 3, the user stares at a spinner for several seconds, then the entire response dumps at once. Streaming fixes this:

- **Faster perceived response** — text starts appearing within milliseconds
- **Better UX** — the user can start reading immediately
- **Can cancel early** — Ctrl+C stops the stream if the answer is going off-track

The Anthropic SDK has first-class streaming support. We just need to switch from `messages.create()` to `messages.stream()`.

## Update the Ask Module

Replace the contents of `src/ask.ts`:

```typescript
// src/ask.ts
// ------------------------------------------
// Core ask logic — streaming version
// Sends a question to Claude and streams
// the response token-by-token to the terminal
// ------------------------------------------

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// ------------------------------------------
// askClaude: non-streaming version
// (kept for cases where you need the full text)
// ------------------------------------------
export async function askClaude(question: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: question }],
  });

  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');
}

// ------------------------------------------
// streamAsk: streams the response to stdout
// Calls onText for each chunk of text received
// ------------------------------------------
export async function streamAsk(
  question: string,
  onText: (chunk: string) => void
): Promise<void> {
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: question }],
  });

  // ------------------------------------------
  // Listen for text delta events
  // Each event contains a small chunk of text
  // ------------------------------------------
  stream.on('text', (text) => {
    onText(text);
  });

  // ------------------------------------------
  // Wait for the stream to complete
  // This also handles errors and cleanup
  // ------------------------------------------
  await stream.finalMessage();
}
```

The `stream.on('text', ...)` callback fires every time Claude produces a new chunk of text — usually a few words or a partial sentence. We pass each chunk to the caller via the `onText` callback, which gives the CLI full control over how to display it.

## Update the CLI to Use Streaming

Replace `src/index.ts`:

```typescript
#!/usr/bin/env node
// src/index.ts
// ------------------------------------------
// CLI Entry Point — streaming version
// ------------------------------------------

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { streamAsk } from './ask.js';

const program = new Command();

program
  .name('ask')
  .description('AI-powered terminal assistant')
  .version('1.0.0');

// ------------------------------------------
// Default command: ask "question"
// Now streams the response in real time
// ------------------------------------------
program
  .argument('[question...]', 'question to ask Claude')
  .action(async (questionParts: string[]) => {
    const question = questionParts.join(' ');

    if (!question) {
      console.log(chalk.yellow('Usage: ask "your question here"'));
      process.exit(1);
    }

    const spinner = ora('Thinking...').start();
    let started = false;

    try {
      await streamAsk(question, (chunk) => {
        // ------------------------------------------
        // Stop the spinner on the first chunk
        // then write text directly to stdout
        // ------------------------------------------
        if (!started) {
          spinner.stop();
          console.log('\n' + chalk.bold('Answer:\n'));
          started = true;
        }
        process.stdout.write(chunk);
      });

      // ------------------------------------------
      // Add a newline after the stream ends
      // ------------------------------------------
      console.log('\n');
    } catch (error: any) {
      spinner.fail(chalk.red('Error: ' + error.message));
      process.exit(1);
    }
  });

program.parse();
```

**Important:** We use `process.stdout.write(chunk)` instead of `console.log()`. `console.log` adds a newline after each call, which would break words across lines. `process.stdout.write` outputs the raw text exactly as received, creating a smooth typing effect.

## Build and Test

```bash
npx tsc
node dist/index.js "Explain how TCP works in simple terms"
```

You should see the spinner briefly, then text streaming in word by word. Try Ctrl+C while it is streaming to confirm you can cancel mid-response.

The CLI now feels responsive and professional. Next, we will add a subcommand that reads and explains code files.

---

[← Basic Ask Command](03-basic-ask-command.md) | [Next: Step 5 - Explain File Command →](05-explain-file-command.md)
