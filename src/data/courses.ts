export interface CourseInfo {
  slug: string;
  title: string;
  description: string;
  icon: string;
  moduleCount: number;
  conceptCount: number;
}

export const courses: CourseInfo[] = [
  {
    slug: 'llm-concepts',
    title: 'LLM Concepts',
    description: 'From transformer architecture to cutting-edge research — each concept explained with intuition, math, and connections to the bigger picture.',
    icon: '🧠',
    moduleCount: 11,
    conceptCount: 156,
  },
  {
    slug: 'ai-agent-concepts',
    title: 'AI Agent Concepts',
    description: 'Foundations of autonomous AI agents — reasoning, planning, memory, tool use, multi-agent systems, and safety.',
    icon: '🤖',
    moduleCount: 10,
    conceptCount: 90,
  },
  {
    slug: 'ai-agent-evaluation',
    title: 'AI Agent Evaluation',
    description: 'Benchmarks, automated evaluation methods, trajectory analysis, and production monitoring for AI agents.',
    icon: '📋',
    moduleCount: 10,
    conceptCount: 72,
  },
  {
    slug: 'agentic-design-patterns',
    title: 'Agentic Design Patterns',
    description: 'Architecture selection, tool design, error resilience, multi-agent coordination, and production patterns for agentic systems.',
    icon: '🏛',
    moduleCount: 1,
    conceptCount: 12,
  },
  {
    slug: 'computer-vision-concepts',
    title: 'Computer Vision Concepts',
    description: 'Image fundamentals through CNNs, object detection, segmentation, generative models, vision transformers, and 3D vision.',
    icon: '👁',
    moduleCount: 13,
    conceptCount: 120,
  },
  {
    slug: 'langgraph-agents',
    title: 'LangGraph Agents',
    description: 'Build production AI agents with LangGraph — tools, memory, human-in-the-loop, streaming, multi-agent systems, and deployment.',
    icon: '🔗',
    moduleCount: 10,
    conceptCount: 49,
  },
  {
    slug: 'llm-evolution',
    title: 'LLM Evolution',
    description: 'The history and trajectory of large language models — from pre-transformer foundations through the 2025 frontier.',
    icon: '📜',
    moduleCount: 15,
    conceptCount: 105,
  },
  {
    slug: 'machine-learning-foundations',
    title: 'Machine Learning Foundations',
    description: 'Mathematical foundations, learning theory, supervised and unsupervised methods, neural networks, and production ML systems.',
    icon: '📐',
    moduleCount: 12,
    conceptCount: 82,
  },
  {
    slug: 'mcp-server-supabase-course',
    title: 'Building MCP Servers with Supabase',
    description: 'A hands-on guide to building Model Context Protocol servers with Supabase — from architecture to production deployment.',
    icon: '🔌',
    moduleCount: 1,
    conceptCount: 14,
  },
  {
    slug: 'natural-language-processing',
    title: 'Natural Language Processing',
    description: 'Text preprocessing, representation, sequence models, NLP tasks, information extraction, and multilingual NLP.',
    icon: '💬',
    moduleCount: 12,
    conceptCount: 95,
  },
  {
    slug: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Core prompting techniques, reasoning elicitation, system prompts, structured output, context engineering, and production safety.',
    icon: '✍',
    moduleCount: 9,
    conceptCount: 79,
  },
  {
    slug: 'reinforcement-learning',
    title: 'Reinforcement Learning',
    description: 'Foundations through deep RL, policy gradients, model-based methods, RL for language models, and landmark applications.',
    icon: '🎮',
    moduleCount: 8,
    conceptCount: 57,
  },
  {
    slug: 'multi-skill-agent',
    title: 'Building a Multi-Skill AI Agent',
    description: 'Hands-on guide to building an AI agent with multiple skills — architecture, tool design, orchestration, error handling, and a capstone research agent project.',
    icon: '🛠',
    moduleCount: 10,
    conceptCount: 42,
  },
];

export function getCourse(slug: string): CourseInfo | undefined {
  return courses.find(c => c.slug === slug);
}
