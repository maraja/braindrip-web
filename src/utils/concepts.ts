import { getCollection } from 'astro:content';

/** Map content directory names to module slugs */
const MODULE_DIR_MAP: Record<string, string> = {
  '01-foundational-architecture': 'foundational-architecture',
  '02-input-representation': 'input-representation',
  '03-training-fundamentals': 'training-fundamentals',
  '04-distributed-training': 'distributed-training',
  '05-alignment-and-post-training': 'alignment-and-post-training',
  '06-parameter-efficient-fine-tuning': 'parameter-efficient-fine-tuning',
  '07-inference-and-deployment': 'inference-and-deployment',
  '08-practical-applications': 'practical-applications',
  '09-safety-and-alignment': 'safety-and-alignment',
  '10-evaluation': 'evaluation',
  '11-advanced-and-emerging': 'advanced-and-emerging',
};

/** Parse a content collection ID like "01-foundational-architecture/self-attention.md"
 *  into { moduleDir, moduleSlug, conceptSlug } */
function parseConceptId(id: string) {
  // ID format: "01-module-name/concept-name.md" or possibly just "concept-name.md"
  const parts = id.replace(/\.md$/, '').split('/');
  if (parts.length >= 2) {
    const moduleDir = parts.slice(0, -1).join('/');
    const conceptSlug = parts[parts.length - 1];
    return {
      moduleDir,
      moduleSlug: MODULE_DIR_MAP[moduleDir] || moduleDir.replace(/^\d+-/, ''),
      conceptSlug,
    };
  }
  // Fallback for flat IDs
  return {
    moduleDir: '01-foundational-architecture',
    moduleSlug: 'foundational-architecture',
    conceptSlug: parts[0],
  };
}

export async function getAllConcepts() {
  const concepts = await getCollection('concepts');
  return concepts.map(concept => {
    const { moduleSlug, conceptSlug } = parseConceptId(concept.id);
    return {
      ...concept,
      slug: conceptSlug,
      moduleSlug,
      url: `/concepts/${moduleSlug}/${conceptSlug}`,
    };
  });
}

export async function getConceptBySlug(slug: string) {
  const concepts = await getAllConcepts();
  return concepts.find(c => c.slug === slug);
}

export async function getModuleConcepts(moduleSlug: string) {
  const concepts = await getAllConcepts();
  return concepts
    .filter(c => c.moduleSlug === moduleSlug)
    .sort((a, b) => {
      const orderA = getConceptOrder(moduleSlug);
      const idxA = orderA.indexOf(a.slug);
      const idxB = orderA.indexOf(b.slug);
      if (idxA === -1 && idxB === -1) return a.slug.localeCompare(b.slug);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
}

/** Get ordered concept list for prev/next navigation */
export function getConceptOrder(moduleSlug?: string): string[] {
  const orders: Record<string, string[]> = {
    'foundational-architecture': [
      'transformer-architecture',
      'self-attention',
      'multi-head-attention',
      'causal-attention',
      'grouped-query-attention',
      'sliding-window-attention',
      'sparse-attention',
      'attention-sinks',
      'differential-transformer',
      'feed-forward-networks',
      'activation-functions',
      'residual-connections',
      'layer-normalization',
      'logits-and-softmax',
      'encoder-decoder-architecture',
      'autoregressive-generation',
      'next-token-prediction',
      'mixture-of-experts',
      'mixture-of-depths',
      'byte-latent-transformers',
    ],
    'input-representation': [
      'tokenization',
      'byte-pair-encoding',
      'vocabulary-design',
      'special-tokens',
      'token-embeddings',
      'positional-encoding',
      'rotary-position-embedding',
      'alibi',
      'context-window',
    ],
    'training-fundamentals': [
      'cross-entropy-loss',
      'backpropagation',
      'adam-optimizer',
      'learning-rate-scheduling',
      'gradient-clipping',
      'mixed-precision-training',
      'gradient-checkpointing',
      'pre-training',
      'training-data-curation',
      'data-mixing',
      'curriculum-learning',
      'scaling-laws',
      'emergent-abilities',
      'grokking',
      'model-collapse',
      'catastrophic-forgetting',
      'self-play-and-self-improvement',
    ],
    'distributed-training': [
      'data-parallelism',
      'tensor-parallelism',
      'pipeline-parallelism',
      'zero-and-fsdp',
      '3d-parallelism',
      'expert-parallelism',
      'ring-attention',
    ],
    'alignment-and-post-training': [
      'supervised-fine-tuning',
      'rlhf',
      'reward-modeling',
      'process-reward-models',
      'dpo',
      'rejection-sampling',
      'preference-learning-variants',
      'grpo',
      'rlaif',
      'constitutional-ai',
      'synthetic-data',
      'rlvr',
      'chain-of-thought-training',
    ],
    'parameter-efficient-fine-tuning': [
      'full-vs-peft-fine-tuning',
      'lora',
      'adapters-and-prompt-tuning',
      'qlora',
      'multi-lora-serving',
    ],
    'inference-and-deployment': [
      'kv-cache',
      'flash-attention',
      'paged-attention',
      'throughput-vs-latency',
      'continuous-batching',
      'model-serving',
      'kv-cache-compression',
      'prefix-caching',
      'prefill-decode-disaggregation',
      'speculative-decoding',
      'medusa-parallel-decoding',
      'sampling-strategies',
      'constrained-decoding',
      'quantization',
      'knowledge-distillation',
      'distillation-for-reasoning',
      'prompt-compression',
      'model-routing',
    ],
    'practical-applications': [
      'prompt-engineering',
      'structured-output',
      'function-calling-and-tool-use',
      'rag',
      'chunking-strategies',
      'embedding-models-and-vector-databases',
      'ai-agents',
      'react-pattern',
      'self-reflection',
      'memory-systems',
      'multi-agent-systems',
      'model-context-protocol',
    ],
    'safety-and-alignment': [
      'hallucination',
      'bias-and-fairness',
      'toxicity-detection',
      'prompt-injection',
      'jailbreaking',
      'red-teaming',
      'guardrails',
      'alignment-problem',
      'reward-hacking',
      'specification-gaming',
      'sycophancy',
      'goodharts-law',
      'scalable-oversight',
      'weak-to-strong-generalization',
      'machine-unlearning',
      'watermarking-llm-text',
      'circuit-breakers',
      'instruction-hierarchy',
      'sleeper-agents',
      'ai-sandbagging',
      'adversarial-robustness',
    ],
    'evaluation': [
      'benchmarks',
      'evaluation-metrics',
      'perplexity',
      'human-evaluation',
      'llm-as-judge',
      'chatbot-arena',
      'benchmark-contamination-detection',
    ],
    'advanced-and-emerging': [
      'in-context-learning',
      'multimodal-models',
      'vision-language-models',
      'state-space-models',
      'mechanistic-interpretability',
      'representation-engineering',
      'model-merging',
      'multi-token-prediction',
      'context-window-extension',
      'test-time-compute',
      'inference-time-scaling-laws',
      'reasoning-models',
      'tree-of-thought',
      'neurosymbolic-ai',
      'compound-ai-systems',
      'mixture-of-agents',
      'agentic-rag',
      'corrective-rag',
      'self-rag',
      'graphrag',
      'raptor',
      'hyde-hypothetical-document-embeddings',
      'colbert-late-interaction',
      'reranking-and-cross-encoders',
      'late-chunking',
      'matryoshka-representation-learning',
      'query-decomposition-and-multi-step-retrieval',
    ],
  };

  if (moduleSlug && orders[moduleSlug]) {
    return orders[moduleSlug];
  }

  // Return all concepts flattened (for backwards compatibility)
  return Object.values(orders).flat();
}

export function getPrevNext(slug: string, moduleSlug: string) {
  const order = getConceptOrder(moduleSlug);
  const idx = order.indexOf(slug);
  return {
    prev: idx > 0 ? order[idx - 1] : null,
    next: idx < order.length - 1 ? order[idx + 1] : null,
  };
}
