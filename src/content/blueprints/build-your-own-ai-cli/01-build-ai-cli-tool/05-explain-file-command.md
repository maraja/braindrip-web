# Step 5: Explain File Command

One-Line Summary: Add an `ask explain <file>` subcommand that reads a source file from disk and asks Claude to explain what it does.

Prerequisites: Streaming setup from Step 4

---

## What This Command Does

You point it at any file, and Claude explains it:

```bash
ask explain src/index.ts
ask explain ../api/auth.py
ask explain Dockerfile
```

This is one of the most useful things a terminal AI tool can do — instant code walkthroughs without copy-pasting into a browser.

## Create the Explain Module

Create `src/explain.ts`:

```typescript
// src/explain.ts
// ------------------------------------------
// Explain command — reads a file and asks
// Claude to explain its contents
// ------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// ------------------------------------------
// Detect the language from the file extension
// Used to tell Claude what kind of file it is
// ------------------------------------------
function detectLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    '.ts': 'TypeScript',
    '.js': 'JavaScript',
    '.py': 'Python',
    '.rs': 'Rust',
    '.go': 'Go',
    '.java': 'Java',
    '.rb': 'Ruby',
    '.cpp': 'C++',
    '.c': 'C',
    '.sh': 'Bash',
    '.sql': 'SQL',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.json': 'JSON',
    '.md': 'Markdown',
    '.dockerfile': 'Dockerfile',
  };
  return map[ext] || 'unknown';
}

// ------------------------------------------
// Read the file and stream an explanation
// ------------------------------------------
export async function explainFile(
  filePath: string,
  onText: (chunk: string) => void
): Promise<void> {
  // ------------------------------------------
  // Resolve the path and read the file
  // ------------------------------------------
  const resolved = path.resolve(filePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }

  const content = fs.readFileSync(resolved, 'utf-8');
  const language = detectLanguage(resolved);
  const fileName = path.basename(resolved);

  // ------------------------------------------
  // Guard against very large files
  // ------------------------------------------
  if (content.length > 50000) {
    throw new Error(
      `File is too large (${content.length} chars). ` +
      `Try a file under 50,000 characters.`
    );
  }

  // ------------------------------------------
  // Build the prompt with file context
  // ------------------------------------------
  const prompt =
    `Explain this ${language} file (${fileName}).\n\n` +
    `Give a clear, structured explanation covering:\n` +
    `1. What this file does (one sentence summary)\n` +
    `2. Key components and how they work\n` +
    `3. How it fits into a larger project\n\n` +
    `\`\`\`${language.toLowerCase()}\n${content}\n\`\`\``;

  // ------------------------------------------
  // Stream the explanation from Claude
  // ------------------------------------------
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  stream.on('text', (text) => {
    onText(text);
  });

  await stream.finalMessage();
}
```

## Register the Subcommand

Update `src/index.ts` to add the `explain` subcommand. Add the import at the top and the command registration after the default command:

```typescript
#!/usr/bin/env node
// src/index.ts
// ------------------------------------------
// CLI Entry Point — with explain subcommand
// ------------------------------------------

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { streamAsk } from './ask.js';
import { explainFile } from './explain.js';

const program = new Command();

program
  .name('ask')
  .description('AI-powered terminal assistant')
  .version('1.0.0');

// ------------------------------------------
// Default command: ask "question"
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

// ------------------------------------------
// Subcommand: ask explain <file>
// ------------------------------------------
program
  .command('explain')
  .description('Explain a source code file')
  .argument('<file>', 'path to the file to explain')
  .action(async (file: string) => {
    const spinner = ora(`Reading ${file}...`).start();
    let started = false;

    try {
      await explainFile(file, (chunk) => {
        if (!started) {
          spinner.stop();
          console.log('\n' + chalk.bold(`Explanation of ${file}:\n`));
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

program.parse();
```

## Build and Test

```bash
npx tsc
```

Try explaining your own source files:

```bash
node dist/index.js explain src/ask.ts
node dist/index.js explain package.json
node dist/index.js explain tsconfig.json
```

You should get a clear, structured breakdown of each file. The language detection helps Claude give more specific explanations — it knows it is looking at TypeScript versus a Dockerfile.

---

[← Streaming Responses](04-streaming-responses.md) | [Next: Step 6 - Shell Command Generator →](06-shell-command-generator.md)
