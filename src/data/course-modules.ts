export interface ModuleInfo {
  number: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  conceptCount: number;
}

const courseModules: Record<string, ModuleInfo[]> = {
  'llm-concepts': [
    { number: '01', slug: 'foundational-architecture', title: 'Foundational Architecture', description: 'Core transformer components — self-attention, multi-head attention, feed-forward networks, residual connections, and architectural variants like MoE and sparse attention.', icon: '🏗', conceptCount: 20 },
    { number: '02', slug: 'input-representation', title: 'Input Representation', description: 'Tokenization, positional encoding, embeddings, and how text becomes numbers.', icon: '📝', conceptCount: 9 },
    { number: '03', slug: 'training-fundamentals', title: 'Training Fundamentals', description: 'Optimization, loss functions, scaling laws, and training data.', icon: '📈', conceptCount: 17 },
    { number: '04', slug: 'distributed-training', title: 'Distributed Training', description: 'Parallelism strategies and distributed systems for large-scale training.', icon: '🔀', conceptCount: 7 },
    { number: '05', slug: 'alignment-and-post-training', title: 'Alignment & Post-Training', description: 'RLHF, DPO, reward modeling, and preference learning.', icon: '🎯', conceptCount: 13 },
    { number: '06', slug: 'parameter-efficient-fine-tuning', title: 'Parameter-Efficient Fine-Tuning', description: 'LoRA, adapters, and methods for efficient model adaptation.', icon: '🔧', conceptCount: 5 },
    { number: '07', slug: 'inference-and-deployment', title: 'Inference & Deployment', description: 'Serving, decoding strategies, caching, and quantization.', icon: '🚀', conceptCount: 18 },
    { number: '08', slug: 'practical-applications', title: 'Practical Applications', description: 'RAG, agents, tool use, and prompt engineering.', icon: '💡', conceptCount: 12 },
    { number: '09', slug: 'safety-and-alignment', title: 'Safety & Alignment', description: 'Attacks, defenses, alignment failures, and guardrails.', icon: '🛡', conceptCount: 21 },
    { number: '10', slug: 'evaluation', title: 'Evaluation', description: 'Benchmarks, metrics, and evaluation methodology.', icon: '📊', conceptCount: 7 },
    { number: '11', slug: 'advanced-and-emerging', title: 'Advanced & Emerging', description: 'Cutting-edge research and emerging techniques.', icon: '🔬', conceptCount: 27 },
  ],
  'ai-agent-concepts': [
    { number: '01', slug: 'foundational-concepts', title: 'Foundational Concepts', description: 'What agents are, the agent loop, autonomy spectrum, and core building blocks.', icon: '🧱', conceptCount: 10 },
    { number: '02', slug: 'reasoning-and-planning', title: 'Reasoning & Planning', description: 'Chain-of-thought, tree search, task decomposition, and planning strategies.', icon: '🧩', conceptCount: 10 },
    { number: '03', slug: 'memory-systems', title: 'Memory Systems', description: 'Working memory, long-term storage, retrieval, and context management.', icon: '🧠', conceptCount: 8 },
    { number: '04', slug: 'tool-use-and-integration', title: 'Tool Use & Integration', description: 'Function calling, API integration, tool selection, and error handling.', icon: '🔧', conceptCount: 10 },
    { number: '05', slug: 'multi-agent-systems', title: 'Multi-Agent Systems', description: 'Agent coordination, communication protocols, and collaborative architectures.', icon: '👥', conceptCount: 8 },
    { number: '06', slug: 'knowledge-and-retrieval', title: 'Knowledge & Retrieval', description: 'RAG, knowledge graphs, semantic search, and information synthesis.', icon: '📚', conceptCount: 8 },
    { number: '07', slug: 'safety-and-control', title: 'Safety & Control', description: 'Guardrails, sandboxing, permission systems, and failure modes.', icon: '🛡', conceptCount: 10 },
    { number: '08', slug: 'evaluation-and-testing', title: 'Evaluation & Testing', description: 'Benchmarks, testing strategies, and quality assessment.', icon: '✅', conceptCount: 8 },
    { number: '09', slug: 'infrastructure-and-operations', title: 'Infrastructure & Operations', description: 'Deployment, monitoring, scaling, and production systems.', icon: '⚙', conceptCount: 8 },
    { number: '10', slug: 'advanced-and-frontier', title: 'Advanced & Frontier', description: 'Emerging agent paradigms and frontier research.', icon: '🔬', conceptCount: 10 },
  ],
  'ai-agent-evaluation': [
    { number: '01', slug: 'foundations-of-agent-evaluation', title: 'Foundations of Agent Evaluation', description: 'Core concepts, challenges, and frameworks for evaluating AI agents.', icon: '📋', conceptCount: 7 },
    { number: '02', slug: 'benchmark-ecosystem', title: 'Benchmark Ecosystem', description: 'Major benchmarks, leaderboards, and evaluation datasets.', icon: '🏆', conceptCount: 9 },
    { number: '03', slug: 'automated-evaluation-methods', title: 'Automated Evaluation Methods', description: 'LLM-as-judge, rubric-based scoring, and automated metrics.', icon: '🤖', conceptCount: 8 },
    { number: '04', slug: 'trajectory-and-process-analysis', title: 'Trajectory & Process Analysis', description: 'Analyzing agent reasoning chains and decision processes.', icon: '🔍', conceptCount: 7 },
    { number: '05', slug: 'statistical-methods-for-evaluation', title: 'Statistical Methods', description: 'Statistical rigor, confidence intervals, and significance testing.', icon: '📊', conceptCount: 7 },
    { number: '06', slug: 'cost-quality-latency-tradeoffs', title: 'Cost-Quality-Latency Tradeoffs', description: 'Balancing evaluation cost, quality, and speed.', icon: '⚖', conceptCount: 6 },
    { number: '07', slug: 'safety-and-alignment-evaluation', title: 'Safety & Alignment Evaluation', description: 'Red teaming, safety benchmarks, and alignment testing.', icon: '🛡', conceptCount: 8 },
    { number: '08', slug: 'evaluation-tooling-and-infrastructure', title: 'Evaluation Tooling', description: 'Frameworks, platforms, and infrastructure for evaluation.', icon: '🔧', conceptCount: 7 },
    { number: '09', slug: 'production-evaluation-and-monitoring', title: 'Production Monitoring', description: 'Online evaluation, A/B testing, and production metrics.', icon: '📡', conceptCount: 6 },
    { number: '10', slug: 'frontier-research-and-open-problems', title: 'Frontier Research', description: 'Open problems and emerging directions in agent evaluation.', icon: '🔬', conceptCount: 7 },
  ],
  'agentic-design-patterns': [
    { number: '01', slug: 'design-patterns', title: 'Design Patterns', description: 'Architecture selection, tool design, error resilience, multi-agent coordination, and production patterns.', icon: '🏛', conceptCount: 12 },
  ],
  'computer-vision-concepts': [
    { number: '01', slug: 'image-fundamentals', title: 'Image Fundamentals', description: 'Pixels, color spaces, image formats, and basic operations.', icon: '🖼', conceptCount: 9 },
    { number: '02', slug: 'feature-extraction-and-classical-vision', title: 'Feature Extraction & Classical Vision', description: 'Edge detection, feature descriptors, and classical CV algorithms.', icon: '🔍', conceptCount: 10 },
    { number: '03', slug: 'convolutional-neural-networks', title: 'Convolutional Neural Networks', description: 'CNN architectures, convolution operations, and design principles.', icon: '🔲', conceptCount: 12 },
    { number: '04', slug: 'training-and-optimization', title: 'Training & Optimization', description: 'Data augmentation, transfer learning, and training strategies.', icon: '📈', conceptCount: 10 },
    { number: '05', slug: 'object-detection', title: 'Object Detection', description: 'YOLO, R-CNN families, anchor-based and anchor-free methods.', icon: '🎯', conceptCount: 12 },
    { number: '06', slug: 'image-segmentation', title: 'Image Segmentation', description: 'Semantic, instance, and panoptic segmentation.', icon: '✂', conceptCount: 9 },
    { number: '07', slug: 'generative-models', title: 'Generative Models', description: 'GANs, diffusion models, and image generation.', icon: '🎨', conceptCount: 10 },
    { number: '08', slug: 'vision-transformers', title: 'Vision Transformers', description: 'ViT, DeiT, and attention-based vision architectures.', icon: '🔄', conceptCount: 8 },
    { number: '09', slug: 'video-understanding', title: 'Video Understanding', description: 'Temporal modeling, action recognition, and video analysis.', icon: '🎬', conceptCount: 8 },
    { number: '10', slug: '3d-vision', title: '3D Vision', description: 'Depth estimation, point clouds, and 3D reconstruction.', icon: '🧊', conceptCount: 9 },
    { number: '11', slug: 'multimodal-and-foundation-models', title: 'Multimodal & Foundation Models', description: 'CLIP, vision-language models, and foundation models for vision.', icon: '🌐', conceptCount: 9 },
    { number: '12', slug: 'applications-and-deployment', title: 'Applications & Deployment', description: 'Edge deployment, optimization, and real-world applications.', icon: '🚀', conceptCount: 8 },
    { number: '13', slug: 'evaluation-and-datasets', title: 'Evaluation & Datasets', description: 'Benchmarks, metrics, and standard datasets.', icon: '📊', conceptCount: 6 },
  ],
  'langgraph-agents': [
    { number: '01', slug: 'langgraph-foundations', title: 'LangGraph Foundations', description: 'Core concepts — graphs, nodes, edges, and state management.', icon: '🏗', conceptCount: 6 },
    { number: '02', slug: 'tools-and-models', title: 'Tools & Models', description: 'Integrating LLMs and tools into LangGraph agents.', icon: '🔧', conceptCount: 8 },
    { number: '03', slug: 'building-your-first-agent', title: 'Building Your First Agent', description: 'Step-by-step guide to creating a functional agent.', icon: '🚀', conceptCount: 4 },
    { number: '04', slug: 'memory-and-persistence', title: 'Memory & Persistence', description: 'State persistence, checkpointing, and memory patterns.', icon: '💾', conceptCount: 5 },
    { number: '05', slug: 'human-in-the-loop', title: 'Human-in-the-Loop', description: 'Approval flows, interrupts, and human oversight.', icon: '🙋', conceptCount: 4 },
    { number: '06', slug: 'streaming', title: 'Streaming', description: 'Token streaming, event streaming, and real-time output.', icon: '🌊', conceptCount: 4 },
    { number: '07', slug: 'multi-agent-systems', title: 'Multi-Agent Systems', description: 'Supervisor patterns, agent teams, and coordination.', icon: '👥', conceptCount: 4 },
    { number: '08', slug: 'observability', title: 'Observability', description: 'Tracing, debugging, and monitoring agent execution.', icon: '🔭', conceptCount: 4 },
    { number: '09', slug: 'deployment', title: 'Deployment', description: 'LangGraph Cloud, Docker, and production deployment.', icon: '☁', conceptCount: 7 },
    { number: '10', slug: 'practical-projects', title: 'Practical Projects', description: 'End-to-end projects and real-world examples.', icon: '💡', conceptCount: 3 },
  ],
  'llm-evolution': [
    { number: '01', slug: 'pre-transformer-foundations', title: 'Pre-Transformer Foundations', description: 'RNNs, LSTMs, seq2seq, and the path to attention.', icon: '🏛', conceptCount: 7 },
    { number: '02', slug: 'the-transformer-revolution', title: 'The Transformer Revolution', description: 'Attention is all you need and the transformer breakthrough.', icon: '⚡', conceptCount: 7 },
    { number: '03', slug: 'the-bert-ecosystem', title: 'The BERT Ecosystem', description: 'BERT, RoBERTa, and the encoder-model era.', icon: '📖', conceptCount: 6 },
    { number: '04', slug: 'the-scaling-era', title: 'The Scaling Era', description: 'GPT-3, scaling laws, and the emergence of capabilities.', icon: '📏', conceptCount: 8 },
    { number: '05', slug: 'alignment-and-the-chatgpt-moment', title: 'Alignment & the ChatGPT Moment', description: 'RLHF, InstructGPT, and the ChatGPT phenomenon.', icon: '💬', conceptCount: 8 },
    { number: '06', slug: 'the-2023-model-boom', title: 'The 2023 Model Boom', description: 'GPT-4, open models, and the explosion of LLM development.', icon: '💥', conceptCount: 8 },
    { number: '07', slug: 'the-2024-frontier-race', title: 'The 2024 Frontier Race', description: 'Claude 3, Gemini, and the frontier model competition.', icon: '🏁', conceptCount: 9 },
    { number: '08', slug: 'reasoning-and-inference-scaling', title: 'Reasoning & Inference Scaling', description: 'Chain-of-thought, o1, and inference-time compute.', icon: '🧩', conceptCount: 6 },
    { number: '09', slug: 'the-cost-revolution-and-global-competition', title: 'Cost Revolution & Global Competition', description: 'DeepSeek, cost reduction, and international competition.', icon: '🌍', conceptCount: 6 },
    { number: '10', slug: 'the-small-model-revolution', title: 'The Small Model Revolution', description: 'Phi, Mistral, and efficient small language models.', icon: '🔬', conceptCount: 7 },
    { number: '11', slug: 'the-2025-frontier', title: 'The 2025 Frontier', description: 'Current frontier models and emerging capabilities.', icon: '🔮', conceptCount: 7 },
    { number: '12', slug: 'architectural-innovation-threads', title: 'Architectural Innovation Threads', description: 'MoE, state space models, and architectural evolution.', icon: '🏗', conceptCount: 9 },
    { number: '13', slug: 'training-innovation-threads', title: 'Training Innovation Threads', description: 'Training techniques, data curation, and optimization advances.', icon: '📈', conceptCount: 7 },
    { number: '14', slug: 'multimodal-evolution', title: 'Multimodal Evolution', description: 'Vision-language models and multimodal capabilities.', icon: '🎭', conceptCount: 5 },
    { number: '15', slug: 'the-llm-landscape', title: 'The LLM Landscape', description: 'The current state and future trajectory of LLMs.', icon: '🗺', conceptCount: 5 },
  ],
  'machine-learning-foundations': [
    { number: '01', slug: 'mathematical-foundations', title: 'Mathematical Foundations', description: 'Linear algebra, calculus, probability, and statistics for ML.', icon: '📐', conceptCount: 9 },
    { number: '02', slug: 'data-science-fundamentals', title: 'Data Science Fundamentals', description: 'Data exploration, cleaning, and preparation.', icon: '📊', conceptCount: 7 },
    { number: '03', slug: 'core-learning-theory', title: 'Core Learning Theory', description: 'Bias-variance tradeoff, PAC learning, and generalization.', icon: '📖', conceptCount: 8 },
    { number: '04', slug: 'supervised-learning-regression', title: 'Supervised Learning: Regression', description: 'Linear regression, regularization, and regression techniques.', icon: '📈', conceptCount: 5 },
    { number: '05', slug: 'supervised-learning-classification', title: 'Supervised Learning: Classification', description: 'Logistic regression, SVMs, decision trees, and classification.', icon: '🏷', conceptCount: 7 },
    { number: '06', slug: 'ensemble-methods', title: 'Ensemble Methods', description: 'Bagging, boosting, random forests, and model ensembles.', icon: '🌲', conceptCount: 6 },
    { number: '07', slug: 'unsupervised-learning', title: 'Unsupervised Learning', description: 'Clustering, dimensionality reduction, and anomaly detection.', icon: '🔍', conceptCount: 8 },
    { number: '08', slug: 'neural-network-foundations', title: 'Neural Network Foundations', description: 'Perceptrons, backpropagation, and deep learning basics.', icon: '🧠', conceptCount: 8 },
    { number: '09', slug: 'probabilistic-methods', title: 'Probabilistic Methods', description: 'Bayesian methods, graphical models, and probabilistic inference.', icon: '🎲', conceptCount: 6 },
    { number: '10', slug: 'model-selection-and-evaluation', title: 'Model Selection & Evaluation', description: 'Cross-validation, metrics, and model comparison.', icon: '✅', conceptCount: 7 },
    { number: '11', slug: 'feature-engineering', title: 'Feature Engineering', description: 'Feature creation, selection, and transformation techniques.', icon: '🔧', conceptCount: 5 },
    { number: '12', slug: 'ml-systems-and-production', title: 'ML Systems & Production', description: 'MLOps, deployment, monitoring, and production ML.', icon: '⚙', conceptCount: 6 },
  ],
  'mcp-server-supabase-course': [
    { number: '01', slug: 'building-mcp-servers', title: 'Building MCP Servers', description: 'A complete guide to building Model Context Protocol servers with Supabase.', icon: '🔌', conceptCount: 14 },
  ],
  'natural-language-processing': [
    { number: '01', slug: 'foundations-of-language', title: 'Foundations of Language', description: 'Linguistics, morphology, syntax, and language structure.', icon: '📖', conceptCount: 8 },
    { number: '02', slug: 'text-preprocessing', title: 'Text Preprocessing', description: 'Tokenization, normalization, stemming, and text cleaning.', icon: '🧹', conceptCount: 8 },
    { number: '03', slug: 'text-representation', title: 'Text Representation', description: 'Bag of words, TF-IDF, word embeddings, and contextual representations.', icon: '📊', conceptCount: 9 },
    { number: '04', slug: 'sequence-models', title: 'Sequence Models', description: 'RNNs, LSTMs, GRUs, and sequence-to-sequence models.', icon: '🔗', conceptCount: 7 },
    { number: '05', slug: 'core-nlp-tasks-analysis', title: 'Core NLP Tasks: Analysis', description: 'POS tagging, NER, parsing, and text classification.', icon: '🔍', conceptCount: 9 },
    { number: '06', slug: 'core-nlp-tasks-generation', title: 'Core NLP Tasks: Generation', description: 'Summarization, translation, and text generation.', icon: '✍', conceptCount: 8 },
    { number: '07', slug: 'information-extraction-and-retrieval', title: 'Information Extraction & Retrieval', description: 'Relation extraction, question answering, and search.', icon: '🔎', conceptCount: 8 },
    { number: '08', slug: 'semantic-understanding', title: 'Semantic Understanding', description: 'Sentiment analysis, semantic similarity, and textual entailment.', icon: '💡', conceptCount: 8 },
    { number: '09', slug: 'pre-trained-models-for-nlp', title: 'Pre-trained Models for NLP', description: 'BERT, GPT, T5, and transfer learning for NLP.', icon: '🏗', conceptCount: 8 },
    { number: '10', slug: 'multilingual-and-low-resource-nlp', title: 'Multilingual & Low-Resource NLP', description: 'Cross-lingual transfer, multilingual models, and low-resource methods.', icon: '🌐', conceptCount: 7 },
    { number: '11', slug: 'speech-and-multimodal-nlp', title: 'Speech & Multimodal NLP', description: 'Speech recognition, synthesis, and multimodal language processing.', icon: '🎤', conceptCount: 7 },
    { number: '12', slug: 'evaluation-and-ethics', title: 'Evaluation & Ethics', description: 'NLP evaluation metrics, bias, fairness, and ethical considerations.', icon: '⚖', conceptCount: 8 },
  ],
  'prompt-engineering': [
    { number: '01', slug: 'foundations', title: 'Foundations', description: 'What prompts are, how LLMs process them, and mental models for effective prompting.', icon: '📖', conceptCount: 9 },
    { number: '02', slug: 'core-prompting-techniques', title: 'Core Prompting Techniques', description: 'Few-shot, zero-shot, role prompting, and structured prompting patterns.', icon: '🎯', conceptCount: 10 },
    { number: '03', slug: 'reasoning-elicitation', title: 'Reasoning Elicitation', description: 'Chain-of-thought, tree-of-thought, and advanced reasoning techniques.', icon: '🧩', conceptCount: 9 },
    { number: '04', slug: 'system-prompts-and-instruction-design', title: 'System Prompts & Instruction Design', description: 'System prompt patterns, instruction clarity, and behavioral control.', icon: '📋', conceptCount: 8 },
    { number: '05', slug: 'structured-output-and-format-control', title: 'Structured Output & Format Control', description: 'JSON, XML, structured generation, and output formatting.', icon: '📐', conceptCount: 8 },
    { number: '06', slug: 'context-engineering-fundamentals', title: 'Context Engineering Fundamentals', description: 'Context window management, prompt compression, and context optimization.', icon: '🔧', conceptCount: 10 },
    { number: '07', slug: 'retrieval-and-knowledge-integration', title: 'Retrieval & Knowledge Integration', description: 'RAG patterns, knowledge grounding, and external data integration.', icon: '📚', conceptCount: 9 },
    { number: '08', slug: 'domain-specific-prompting', title: 'Domain-Specific Prompting', description: 'Code generation, data analysis, and specialized domain techniques.', icon: '🏢', conceptCount: 8 },
    { number: '09', slug: 'safety-testing-and-production', title: 'Safety, Testing & Production', description: 'Prompt injection defense, testing strategies, and production deployment.', icon: '🛡', conceptCount: 8 },
  ],
  'reinforcement-learning': [
    { number: '01', slug: 'foundations', title: 'Foundations', description: 'MDPs, reward signals, policies, and the RL framework.', icon: '🎮', conceptCount: 8 },
    { number: '02', slug: 'tabular-methods', title: 'Tabular Methods', description: 'Q-learning, SARSA, dynamic programming, and Monte Carlo methods.', icon: '📊', conceptCount: 7 },
    { number: '03', slug: 'function-approximation-and-deep-rl', title: 'Function Approximation & Deep RL', description: 'DQN, experience replay, and deep reinforcement learning.', icon: '🧠', conceptCount: 7 },
    { number: '04', slug: 'policy-gradient-methods', title: 'Policy Gradient Methods', description: 'REINFORCE, PPO, A2C, and actor-critic methods.', icon: '📈', conceptCount: 8 },
    { number: '05', slug: 'model-based-rl', title: 'Model-Based RL', description: 'World models, planning, and model-based approaches.', icon: '🗺', conceptCount: 6 },
    { number: '06', slug: 'advanced-methods', title: 'Advanced Methods', description: 'Hierarchical RL, multi-agent RL, and inverse RL.', icon: '🔬', conceptCount: 8 },
    { number: '07', slug: 'rl-for-language-models', title: 'RL for Language Models', description: 'RLHF, reward modeling, and RL in the LLM training pipeline.', icon: '🤖', conceptCount: 7 },
    { number: '08', slug: 'landmark-applications', title: 'Landmark Applications', description: 'AlphaGo, Atari, robotics, and milestone RL achievements.', icon: '🏆', conceptCount: 6 },
  ],
};

export function getModulesForCourse(courseSlug: string): ModuleInfo[] {
  return courseModules[courseSlug] || [];
}

export function getModule(courseSlug: string, moduleSlug: string): ModuleInfo | undefined {
  const mods = courseModules[courseSlug];
  return mods?.find(m => m.slug === moduleSlug);
}

export function getModuleByNumber(courseSlug: string, num: string): ModuleInfo | undefined {
  const mods = courseModules[courseSlug];
  return mods?.find(m => m.number === num);
}
