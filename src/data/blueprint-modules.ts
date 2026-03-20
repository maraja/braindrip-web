export interface BlueprintModuleInfo {
  number: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  stepCount: number;
}

const blueprintModules: Record<string, BlueprintModuleInfo[]> = {
  'build-your-own-mcp-server': [
    { number: '01', slug: 'build-mcp-server', title: 'Build Your Own MCP Server', description: 'Build a personal bookmarks MCP server with Node.js, SQLite, and the official MCP SDK — then connect it to Claude Desktop.', icon: '🔌', stepCount: 8 },
  ],
  'build-a-rag-pipeline': [
    { number: '01', slug: 'build-rag-pipeline', title: 'Build a RAG Pipeline from Scratch', description: 'Build a document Q&A system with Python, LlamaIndex, and Qdrant.', icon: '🗂', stepCount: 10 },
  ],
  'ship-an-ai-agent': [
    { number: '01', slug: 'ship-ai-agent', title: 'Ship an AI Agent with Claude', description: 'Build and deploy a tool-using AI agent with the Anthropic SDK.', icon: '🚀', stepCount: 9 },
  ],
  'build-a-code-review-bot': [
    { number: '01', slug: 'build-code-review-bot', title: 'Build a Code Review Bot', description: 'Create a GitHub Action that reviews PRs using Claude.', icon: '🔍', stepCount: 8 },
  ],
  'create-a-multi-agent-system': [
    { number: '01', slug: 'build-multi-agent-system', title: 'Create a Multi-Agent System', description: 'Build collaborating agents with CrewAI — researcher, writer, and editor.', icon: '🤝', stepCount: 11 },
  ],
  'deploy-your-own-llm': [
    { number: '01', slug: 'deploy-open-source-llm', title: 'Deploy Your Own Open-Source LLM', description: 'Run and serve an open-source model with Ollama and vLLM.', icon: '🏗', stepCount: 10 },
  ],
  'build-your-own-ai-cli': [
    { number: '01', slug: 'build-ai-cli-tool', title: 'Build Your Own AI CLI Tool', description: 'Create a terminal assistant with Node.js and the Anthropic SDK.', icon: '⌨️', stepCount: 8 },
  ],
  'build-an-agent-with-google-adk': [
    { number: '01', slug: 'build-google-adk-agent', title: 'Build an Agent with Google ADK', description: 'Build and deploy a tool-using AI agent with Google ADK and Gemini.', icon: '🤖', stepCount: 9 },
  ],
  'build-a-langgraph-agent-team': [
    { number: '01', slug: 'build-langgraph-agent-team', title: 'Build a LangGraph Agent Team', description: 'Build a multi-agent job application assistant with LangGraph and OpenAI.', icon: '🕸️', stepCount: 10 },
  ],
};

export function getBlueprintModules(blueprintSlug: string): BlueprintModuleInfo[] {
  return blueprintModules[blueprintSlug] || [];
}

export function getBlueprintModule(blueprintSlug: string, moduleSlug: string): BlueprintModuleInfo | undefined {
  return getBlueprintModules(blueprintSlug).find(m => m.slug === moduleSlug);
}

export { blueprintModules };
