# Step 8: What's Next

One-Line Summary: Install your CLI globally with npm link, then explore extensions — conversation history, config files, and publishing to npm.

Prerequisites: All previous steps completed

---

## Install Globally with npm link

Right now you run your tool with `node dist/index.js`. Let's make it a real command. From your project directory:

```bash
npx tsc
npm link
```

That's it. Now `ask` works from anywhere on your system:

```bash
ask "What is the CAP theorem?"
ask explain ~/.bashrc
ask cmd "find all node_modules folders and show their sizes"
echo "hello world" | ask "translate to French"
```

To unlink later:

```bash
npm unlink -g ask-cli
```

## What You Built

You now have a fully functional AI-powered CLI tool with four capabilities:

| Command | What It Does |
|---------|-------------|
| `ask "question"` | Ask Claude anything from the terminal |
| `ask explain <file>` | Read a file and get a structured explanation |
| `ask cmd "description"` | Generate shell commands from plain English |
| `cat file \| ask "prompt"` | Pipe any content into Claude for analysis |

All responses stream in real time. The tool composes with the Unix pipeline. It handles errors gracefully and shows loading spinners for feedback.

## Extension Ideas

Here are concrete ways to keep building.

### Add Conversation History

Store messages in a JSON file so Claude remembers context across multiple calls:

```typescript
// src/history.ts
// ------------------------------------------
// Simple conversation history stored in
// ~/.ask-cli/history.json
// ------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const HISTORY_DIR = path.join(os.homedir(), '.ask-cli');
const HISTORY_FILE = path.join(HISTORY_DIR, 'history.json');

export function loadHistory(): Message[] {
  if (!fs.existsSync(HISTORY_FILE)) return [];
  const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
  return JSON.parse(raw);
}

export function saveHistory(messages: Message[]): void {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
  // ------------------------------------------
  // Keep only the last 20 messages to stay
  // within context limits
  // ------------------------------------------
  const trimmed = messages.slice(-20);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(trimmed, null, 2));
}

export function clearHistory(): void {
  if (fs.existsSync(HISTORY_FILE)) {
    fs.unlinkSync(HISTORY_FILE);
  }
}
```

Then pass the history array as the `messages` parameter to the Anthropic SDK. Add `ask --clear` to reset it.

### Add a Config File

Let users customize the model, max tokens, and system prompt:

```typescript
// ~/.ask-cli/config.json
{
  "model": "claude-sonnet-4-20250514",
  "maxTokens": 2048,
  "systemPrompt": "You are a senior developer. Be concise."
}
```

Load it at startup and merge with defaults:

```typescript
// src/config.ts
// ------------------------------------------
// User configuration — loaded from
// ~/.ask-cli/config.json
// ------------------------------------------

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface Config {
  model: string;
  maxTokens: number;
  systemPrompt?: string;
}

const defaults: Config = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 1024,
};

export function loadConfig(): Config {
  const configPath = path.join(os.homedir(), '.ask-cli', 'config.json');

  if (!fs.existsSync(configPath)) return defaults;

  const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return { ...defaults, ...raw };
}
```

### Publish to npm

When your tool is ready to share:

1. Pick a unique name (check [npmjs.com](https://npmjs.com) for availability)
2. Update `package.json` with your name, description, and repository
3. Add a `.npmignore` file to exclude `src/` and keep only `dist/`
4. Publish:

```bash
npm login
npm publish
```

Then anyone can install it with:

```bash
npm install -g your-cli-name
```

### More Ideas

- **`ask review`** — Run on a git diff to get a code review
- **`ask test`** — Generate unit tests for a file
- **`ask --model`** — Flag to switch between Claude models
- **`ask --system`** — Flag to set a custom system prompt
- **Interactive mode** — `ask -i` opens a REPL for back-and-forth conversation

You have the foundation. Every feature from here is just a new subcommand and a well-crafted prompt. Build what you need, and make the terminal smarter.

---

[← Pipe and Stdin](07-pipe-and-stdin.md)
