import { getCollection } from 'astro:content';

/**
 * Parse a content collection ID like "llm-concepts/01-foundational-architecture/self-attention"
 * into { courseSlug, moduleDir, moduleSlug, conceptSlug }
 */
function parseConceptId(id: string) {
  const parts = id.replace(/\.md$/, '').split('/');
  if (parts.length >= 3) {
    const courseSlug = parts[0];
    const moduleDir = parts[1];
    const conceptSlug = parts[parts.length - 1];
    return {
      courseSlug,
      moduleDir,
      moduleSlug: moduleDir.replace(/^\d+-/, ''),
      conceptSlug,
    };
  }
  if (parts.length === 2) {
    return {
      courseSlug: parts[0],
      moduleDir: parts[0],
      moduleSlug: parts[0],
      conceptSlug: parts[1],
    };
  }
  return {
    courseSlug: 'unknown',
    moduleDir: 'unknown',
    moduleSlug: 'unknown',
    conceptSlug: parts[0],
  };
}

export async function getAllConcepts(courseSlug?: string) {
  const entries = await getCollection('courses');
  const mapped = entries.map(entry => {
    const { courseSlug: cs, moduleSlug, conceptSlug } = parseConceptId(entry.id);
    return {
      ...entry,
      slug: conceptSlug,
      courseSlug: cs,
      moduleSlug,
      url: `/courses/${cs}/${moduleSlug}/${conceptSlug}`,
    };
  });
  if (courseSlug) {
    return mapped.filter(c => c.courseSlug === courseSlug);
  }
  return mapped;
}

export async function getConceptBySlug(courseSlug: string, slug: string) {
  const concepts = await getAllConcepts(courseSlug);
  return concepts.find(c => c.slug === slug);
}

export async function getModuleConcepts(courseSlug: string, moduleSlug: string) {
  const concepts = await getAllConcepts(courseSlug);
  return concepts
    .filter(c => c.moduleSlug === moduleSlug)
    .sort((a, b) => {
      const order = getConceptOrder(courseSlug, moduleSlug);
      const idxA = order.indexOf(a.slug);
      const idxB = order.indexOf(b.slug);
      if (idxA === -1 && idxB === -1) return a.slug.localeCompare(b.slug);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
}

/** Get ordered concept list for prev/next navigation.
 *  Only llm-concepts has curated orders; other courses fall back to alphabetical. */
export function getConceptOrder(courseSlug: string, moduleSlug?: string): string[] {
  const llmConceptOrders: Record<string, string[]> = {
    'foundational-architecture': [
      'transformer-architecture', 'self-attention', 'multi-head-attention',
      'causal-attention', 'grouped-query-attention', 'sliding-window-attention',
      'sparse-attention', 'attention-sinks', 'differential-transformer',
      'feed-forward-networks', 'activation-functions', 'residual-connections',
      'layer-normalization', 'logits-and-softmax', 'encoder-decoder-architecture',
      'autoregressive-generation', 'next-token-prediction', 'mixture-of-experts',
      'mixture-of-depths', 'byte-latent-transformers',
    ],
    'input-representation': [
      'tokenization', 'byte-pair-encoding', 'vocabulary-design', 'special-tokens',
      'token-embeddings', 'positional-encoding', 'rotary-position-embedding',
      'alibi', 'context-window',
    ],
    'training-fundamentals': [
      'cross-entropy-loss', 'backpropagation', 'adam-optimizer',
      'learning-rate-scheduling', 'gradient-clipping', 'mixed-precision-training',
      'gradient-checkpointing', 'pre-training', 'training-data-curation',
      'data-mixing', 'curriculum-learning', 'scaling-laws', 'emergent-abilities',
      'grokking', 'model-collapse', 'catastrophic-forgetting',
      'self-play-and-self-improvement',
    ],
    'distributed-training': [
      'data-parallelism', 'tensor-parallelism', 'pipeline-parallelism',
      'zero-and-fsdp', '3d-parallelism', 'expert-parallelism', 'ring-attention',
    ],
    'alignment-and-post-training': [
      'supervised-fine-tuning', 'rlhf', 'reward-modeling', 'process-reward-models',
      'dpo', 'rejection-sampling', 'preference-learning-variants', 'grpo', 'rlaif',
      'constitutional-ai', 'synthetic-data', 'rlvr', 'chain-of-thought-training',
    ],
    'parameter-efficient-fine-tuning': [
      'full-vs-peft-fine-tuning', 'lora', 'adapters-and-prompt-tuning',
      'qlora', 'multi-lora-serving',
    ],
    'inference-and-deployment': [
      'kv-cache', 'flash-attention', 'paged-attention', 'throughput-vs-latency',
      'continuous-batching', 'model-serving', 'kv-cache-compression',
      'prefix-caching', 'prefill-decode-disaggregation', 'speculative-decoding',
      'medusa-parallel-decoding', 'sampling-strategies', 'constrained-decoding',
      'quantization', 'knowledge-distillation', 'distillation-for-reasoning',
      'prompt-compression', 'model-routing',
    ],
    'practical-applications': [
      'prompt-engineering', 'structured-output', 'function-calling-and-tool-use',
      'rag', 'chunking-strategies', 'embedding-models-and-vector-databases',
      'ai-agents', 'react-pattern', 'self-reflection', 'memory-systems',
      'multi-agent-systems', 'model-context-protocol',
    ],
    'safety-and-alignment': [
      'hallucination', 'bias-and-fairness', 'toxicity-detection', 'prompt-injection',
      'jailbreaking', 'red-teaming', 'guardrails', 'alignment-problem',
      'reward-hacking', 'specification-gaming', 'sycophancy', 'goodharts-law',
      'scalable-oversight', 'weak-to-strong-generalization', 'machine-unlearning',
      'watermarking-llm-text', 'circuit-breakers', 'instruction-hierarchy',
      'sleeper-agents', 'ai-sandbagging', 'adversarial-robustness',
    ],
    'evaluation': [
      'benchmarks', 'evaluation-metrics', 'perplexity', 'human-evaluation',
      'llm-as-judge', 'chatbot-arena', 'benchmark-contamination-detection',
    ],
    'advanced-and-emerging': [
      'in-context-learning', 'multimodal-models', 'vision-language-models',
      'state-space-models', 'mechanistic-interpretability', 'representation-engineering',
      'model-merging', 'multi-token-prediction', 'context-window-extension',
      'test-time-compute', 'inference-time-scaling-laws', 'reasoning-models',
      'tree-of-thought', 'neurosymbolic-ai', 'compound-ai-systems',
      'mixture-of-agents', 'agentic-rag', 'corrective-rag', 'self-rag',
      'graphrag', 'raptor', 'hyde-hypothetical-document-embeddings',
      'colbert-late-interaction', 'reranking-and-cross-encoders', 'late-chunking',
      'matryoshka-representation-learning', 'query-decomposition-and-multi-step-retrieval',
    ],
  };

  if (courseSlug !== 'llm-concepts') return [];
  if (moduleSlug && llmConceptOrders[moduleSlug]) {
    return llmConceptOrders[moduleSlug];
  }
  return Object.values(llmConceptOrders).flat();
}

export function getPrevNext(courseSlug: string, slug: string, moduleSlug: string) {
  const order = getConceptOrder(courseSlug, moduleSlug);
  const idx = order.indexOf(slug);
  return {
    prev: idx > 0 ? order[idx - 1] : null,
    next: idx < order.length - 1 ? order[idx + 1] : null,
  };
}
