# Step 2: Project Setup

One-Line Summary: Initialize the Node.js project, install all dependencies, configure TypeScript, and wire up the `bin` entry so the CLI runs as a global command.

Prerequisites: Node.js 18+ installed, npm, an Anthropic API key

---

## Create the Project

```bash
mkdir ask-cli && cd ask-cli
npm init -y
```

## Install Dependencies

```bash
npm install commander @anthropic-ai/sdk chalk ora
npm install -D typescript @types/node
```

What each package does:

| Package | Purpose |
|---------|---------|
| `commander` | CLI framework — parses arguments, subcommands, flags, and generates help text |
| `@anthropic-ai/sdk` | Official Anthropic TypeScript SDK — handles auth, requests, and streaming |
| `chalk` | Terminal string styling — colors, bold, dim text for readable output |
| `ora` | Elegant terminal spinners — visual feedback while waiting for API responses |
| `typescript` | TypeScript compiler |

## Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

## Update package.json

Open `package.json` and update it with these fields:

```json
{
  "name": "ask-cli",
  "version": "1.0.0",
  "type": "commonjs",
  "bin": {
    "ask": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js"
  }
}
```

The `bin` field is important — it tells npm to create an executable called `ask` that points to your compiled entry file. This is what makes `ask "question"` work from anywhere in your terminal after linking.

## Set Your API Key

The Anthropic SDK reads your key from the `ANTHROPIC_API_KEY` environment variable. Add it to your shell profile:

```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.bash_profile
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

Reload your shell:

```bash
source ~/.zshrc  # or ~/.bashrc
```

## Create the Source Directory and Entry Point

```bash
mkdir src
```

Create the entry point at `src/index.ts` with a minimal shell to verify everything works:

```typescript
#!/usr/bin/env node
// src/index.ts
// ------------------------------------------
// CLI Entry Point — verifies setup works
// ------------------------------------------

import { Command } from 'commander';

const program = new Command();

program
  .name('ask')
  .description('AI-powered terminal assistant')
  .version('1.0.0');

program.parse();
```

The `#!/usr/bin/env node` shebang is required — it tells the OS to run this file with Node.js when invoked as a CLI command.

## Verify the Setup

```bash
npx tsc && node dist/index.js --help
```

You should see:

```
Usage: ask [options]

AI-powered terminal assistant

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

If that prints, your project is wired up correctly.

---

[← What We're Building](01-what-were-building.md) | [Next: Step 3 - Basic Ask Command →](03-basic-ask-command.md)
