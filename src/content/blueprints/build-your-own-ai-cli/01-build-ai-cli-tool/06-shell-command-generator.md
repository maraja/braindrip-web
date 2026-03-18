# Step 6: Shell Command Generator

One-Line Summary: Add an `ask cmd "description"` subcommand that translates plain English into a shell command, shows it for review, and optionally executes it.

Prerequisites: Explain command from Step 5

---

## What This Command Does

Describe what you want in plain English, and Claude generates the exact shell command:

```bash
ask cmd "find all TypeScript files modified in the last 7 days"
ask cmd "kill the process running on port 3000"
ask cmd "resize all PNGs in this folder to 50%"
```

This is one of the most practical features you can add — no more searching Stack Overflow for obscure `find` or `awk` syntax.

## Create the Cmd Module

Create `src/cmd.ts`:

```typescript
// src/cmd.ts
// ------------------------------------------
// Shell command generator — translates plain
// English into shell commands using Claude
// ------------------------------------------

import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import * as os from 'os';
import * as readline from 'readline';

const client = new Anthropic();

// ------------------------------------------
// Generate a shell command from a description
// Returns just the command string
// ------------------------------------------
export async function generateCommand(
  description: string
): Promise<string> {
  const platform = os.platform();
  const shell = process.env.SHELL || 'bash';

  // ------------------------------------------
  // The system prompt constrains Claude to
  // return ONLY the command, no explanation
  // ------------------------------------------
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    system:
      `You are a shell command generator. ` +
      `The user's OS is ${platform} and their shell is ${shell}. ` +
      `Respond with ONLY the shell command — no explanation, ` +
      `no markdown, no code fences. Just the raw command. ` +
      `If multiple commands are needed, join them with && or ;`,
    messages: [{ role: 'user', content: description }],
  });

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim();

  return text;
}

// ------------------------------------------
// Prompt the user for confirmation before
// running a generated command
// ------------------------------------------
export function confirmAndRun(command: string): Promise<boolean> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('Run this command? [y/N] ', (answer) => {
      rl.close();

      if (answer.toLowerCase() === 'y') {
        try {
          // ------------------------------------------
          // Execute the command and inherit stdio so
          // the user sees output in real time
          // ------------------------------------------
          execSync(command, { stdio: 'inherit' });
          resolve(true);
        } catch {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  });
}
```

**Key design decisions:**

- The system prompt tells Claude to return only the raw command — no markdown, no explanation. This makes parsing trivial.
- We detect the user's OS and shell so Claude generates platform-appropriate commands (e.g., `pbcopy` on macOS vs `xclip` on Linux).
- The confirmation prompt defaults to "No" — you must explicitly type `y` to execute. Never run AI-generated commands blindly.

## Register the Subcommand

Add the import and command to `src/index.ts`. Add this import at the top alongside the others:

```typescript
import { generateCommand, confirmAndRun } from './cmd.js';
```

Then add this subcommand block after the `explain` command:

```typescript
// ------------------------------------------
// Subcommand: ask cmd "description"
// ------------------------------------------
program
  .command('cmd')
  .description('Generate a shell command from a description')
  .argument('<description...>', 'describe what you want to do')
  .action(async (descParts: string[]) => {
    const description = descParts.join(' ');
    const spinner = ora('Generating command...').start();

    try {
      const command = await generateCommand(description);
      spinner.stop();

      // ------------------------------------------
      // Display the command with syntax highlighting
      // ------------------------------------------
      console.log('\n' + chalk.bold('Command:\n'));
      console.log('  ' + chalk.green(command));
      console.log();

      // ------------------------------------------
      // Ask the user whether to run it
      // ------------------------------------------
      await confirmAndRun(command);
    } catch (error: any) {
      spinner.fail(chalk.red('Error: ' + error.message));
      process.exit(1);
    }
  });
```

## Build and Test

```bash
npx tsc
```

Try generating some commands:

```bash
node dist/index.js cmd "list all files larger than 10MB"
node dist/index.js cmd "count lines of code in all TypeScript files"
node dist/index.js cmd "show disk usage sorted by size"
```

Each time, you will see the generated command in green, followed by the `[y/N]` prompt. Type `y` to run it, or press Enter to skip.

---

[← Explain File Command](05-explain-file-command.md) | [Next: Step 7 - Pipe and Stdin →](07-pipe-and-stdin.md)
