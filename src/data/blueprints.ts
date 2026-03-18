export interface BlueprintInfo {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audience: 'builders' | 'everyone';
  stepCount: number;
  status: 'coming-soon' | 'published';
}

export const blueprints: BlueprintInfo[] = [
  // --- For Builders (Developer-Focused) ---
  {
    slug: 'build-your-own-mcp-server',
    title: 'Build Your Own MCP Server',
    description: 'Connect any AI assistant to your database using the Model Context Protocol — deploy on Supabase Edge Functions in under an hour.',
    icon: '🔌',
    difficulty: 'intermediate',
    audience: 'builders',
    stepCount: 13,
    status: 'coming-soon',
  },
  {
    slug: 'build-a-rag-pipeline',
    title: 'Build a RAG Pipeline from Scratch',
    description: 'Give AI access to your company\'s knowledge — ingest documents, embed them, and query with natural language.',
    icon: '🗂',
    difficulty: 'intermediate',
    audience: 'builders',
    stepCount: 10,
    status: 'coming-soon',
  },
  {
    slug: 'ship-an-ai-agent',
    title: 'Ship an AI Agent with Claude',
    description: 'Build an autonomous agent that reasons, uses tools, and completes multi-step tasks — from prompt to deployed API.',
    icon: '🚀',
    difficulty: 'intermediate',
    audience: 'builders',
    stepCount: 9,
    status: 'coming-soon',
  },
  {
    slug: 'build-a-code-review-bot',
    title: 'Build a Code Review Bot',
    description: 'Create a GitHub bot that reviews pull requests using AI, catches bugs, and suggests improvements automatically.',
    icon: '🔍',
    difficulty: 'intermediate',
    audience: 'builders',
    stepCount: 8,
    status: 'coming-soon',
  },
  {
    slug: 'create-a-multi-agent-system',
    title: 'Create a Multi-Agent System',
    description: 'Build agents that collaborate — a researcher, writer, and editor working together to produce polished output.',
    icon: '🤝',
    difficulty: 'advanced',
    audience: 'builders',
    stepCount: 11,
    status: 'coming-soon',
  },
  {
    slug: 'deploy-your-own-llm',
    title: 'Deploy Your Own Open-Source LLM',
    description: 'Run Llama, Mistral, or Qwen on your own infrastructure — quantize, serve, and benchmark it end to end.',
    icon: '🏗',
    difficulty: 'advanced',
    audience: 'builders',
    stepCount: 10,
    status: 'coming-soon',
  },
  {
    slug: 'build-your-own-ai-cli',
    title: 'Build Your Own AI CLI Tool',
    description: 'Create a command-line assistant for your specific workflow — file management, code generation, or data processing.',
    icon: '⌨️',
    difficulty: 'intermediate',
    audience: 'builders',
    stepCount: 8,
    status: 'coming-soon',
  },

  // --- For Everyone (Non-Technical / Business-Focused) ---
  {
    slug: 'create-your-business-website-with-ai',
    title: 'Create Your Business Website with AI',
    description: 'Go from idea to live website using AI — no coding required. Design, copy, and deploy in one sitting.',
    icon: '🌐',
    difficulty: 'beginner',
    audience: 'everyone',
    stepCount: 7,
    status: 'coming-soon',
  },
  {
    slug: 'automate-your-workflow-with-ai',
    title: 'Automate Your Workflow with AI',
    description: 'Connect your tools and let AI handle the busywork — email triage, data entry, and report generation using Make or Zapier.',
    icon: '⚡',
    difficulty: 'beginner',
    audience: 'everyone',
    stepCount: 8,
    status: 'coming-soon',
  },
  {
    slug: 'build-your-personal-ai-assistant',
    title: 'Build Your Personal AI Assistant',
    description: 'Create a custom AI tailored to your job — with your documents, your tone, and your processes baked in.',
    icon: '🧑‍💼',
    difficulty: 'beginner',
    audience: 'everyone',
    stepCount: 6,
    status: 'coming-soon',
  },
  {
    slug: 'launch-a-customer-support-chatbot',
    title: 'Launch a Customer Support Chatbot',
    description: 'Deploy an AI chatbot that answers customer questions using your FAQ and docs — live in under an hour.',
    icon: '💬',
    difficulty: 'beginner',
    audience: 'everyone',
    stepCount: 7,
    status: 'coming-soon',
  },
  {
    slug: 'turn-your-docs-into-an-ai-brain',
    title: 'Turn Your Docs into a Searchable AI Brain',
    description: 'Upload your company docs or notes and create an AI-powered search interface anyone on your team can use.',
    icon: '📚',
    difficulty: 'beginner',
    audience: 'everyone',
    stepCount: 6,
    status: 'coming-soon',
  },
  {
    slug: 'ai-powered-content-pipeline',
    title: 'AI-Powered Content Pipeline',
    description: 'Set up a system that drafts blog posts, social media, and newsletters from your ideas — with your voice and brand.',
    icon: '✍️',
    difficulty: 'beginner',
    audience: 'everyone',
    stepCount: 7,
    status: 'coming-soon',
  },
  {
    slug: 'prompt-engineering-that-works',
    title: 'Prompt Engineering That Actually Works',
    description: 'Master the frameworks that get consistently great output — structured prompts, chain-of-thought, and few-shot patterns applied to real tasks.',
    icon: '🎯',
    difficulty: 'beginner',
    audience: 'everyone',
    stepCount: 9,
    status: 'coming-soon',
  },
  {
    slug: 'create-an-ai-powered-slack-bot',
    title: 'Create an AI-Powered Slack Bot',
    description: 'Add an AI teammate to your Slack workspace that answers questions, summarizes threads, and triggers workflows.',
    icon: '💡',
    difficulty: 'intermediate',
    audience: 'everyone',
    stepCount: 8,
    status: 'coming-soon',
  },
];

export function getBlueprint(slug: string): BlueprintInfo | undefined {
  return blueprints.find(b => b.slug === slug);
}

export function getBlueprintsByAudience(audience: 'builders' | 'everyone'): BlueprintInfo[] {
  return blueprints.filter(b => b.audience === audience);
}
