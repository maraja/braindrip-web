# Step 3: Basic Ask Command

One-Line Summary: Create the core `ask "question"` command that sends a prompt to Claude and prints the response in the terminal.

Prerequisites: Project setup from Step 2, a valid `ANTHROPIC_API_KEY`

---

## How It Works

The default command takes whatever arguments you pass and sends them to Claude as a message. The flow is:

1. User types `ask "What is a goroutine?"`
2. Commander captures the arguments as a string
3. We show a loading spinner with ora
4. The Anthropic SDK sends the prompt to Claude
5. We print the response with chalk formatting

## Create the Ask Module

Create `src/ask.ts`:

```typescript
// src/ask.ts
// ------------------------------------------
// Core ask logic — sends a question to Claude
// and returns the response text
// ------------------------------------------

import Anthropic from '@anthropic-ai/sdk';

// ------------------------------------------
// Initialize the Anthropic client
// Reads ANTHROPIC_API_KEY from environment
// ------------------------------------------
const client = new Anthropic();

export async function askClaude(question: string): Promise<string> {
  // ------------------------------------------
  // Send the question as a user message
  // ------------------------------------------
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: question,
      },
    ],
  });

  // ------------------------------------------
  // Extract text from the response
  // Claude can return multiple content blocks;
  // we join all text blocks together
  // ------------------------------------------
  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n');

  return text;
}
```

## Wire It Into the CLI

Replace your `src/index.ts` with the full command setup:

```typescript
#!/usr/bin/env node
// src/index.ts
// ------------------------------------------
// CLI Entry Point — wires up the ask command
// ------------------------------------------

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { askClaude } from './ask.js';

const program = new Command();

program
  .name('ask')
  .description('AI-powered terminal assistant')
  .version('1.0.0');

// ------------------------------------------
// Default command: ask "question"
// Captures all remaining arguments as the prompt
// ------------------------------------------
program
  .argument('[question...]', 'question to ask Claude')
  .action(async (questionParts: string[]) => {
    const question = questionParts.join(' ');

    if (!question) {
      console.log(chalk.yellow('Usage: ask "your question here"'));
      process.exit(1);
    }

    // ------------------------------------------
    // Show a spinner while waiting for the API
    // ------------------------------------------
    const spinner = ora('Thinking...').start();

    try {
      const answer = await askClaude(question);
      spinner.stop();
      console.log('\n' + chalk.bold('Answer:\n'));
      console.log(answer);
      console.log();
    } catch (error: any) {
      spinner.fail(chalk.red('Error: ' + error.message));
      process.exit(1);
    }
  });

program.parse();
```

**Key details:**

- `argument('[question...]')` uses the variadic `...` syntax so users do not need to wrap their question in quotes — `ask what is a mutex` works just as well as `ask "what is a mutex"`.
- The spinner gives visual feedback that something is happening. Without it, the terminal just hangs silently.
- Errors are caught and displayed cleanly instead of dumping a raw stack trace.

## Build and Test

```bash
npx tsc
```

Now try it:

```bash
node dist/index.js "What is a promise in JavaScript?"
```

You should see the spinner appear, then Claude's response printed in your terminal. Try a few more:

```bash
node dist/index.js What are the SOLID principles
node dist/index.js "Give me 5 git commands every developer should know"
```

The basic flow works. But notice the response appears all at once after a wait — in the next step, we will add streaming so it prints word by word.

---

[← Project Setup](02-project-setup.md) | [Next: Step 4 - Streaming Responses →](04-streaming-responses.md)
