/**
 * Registry mapping concept slugs to their interactive elements.
 *
 * Each entry specifies:
 *   - component: the React component name (must match the hydrator's component map)
 *   - afterSection: the h2 heading text after which the element is injected
 *
 * Components are placed at roughly 1/3 and 2/3 through each article by targeting
 * the "How It Works" section (~1/3) and "Key Technical Details" section (~2/3).
 */
export const interactiveRegistry = {
  'transformer-architecture': [
    { component: 'TransformerLayerBuilder', afterSection: 'How It Works' },
    { component: 'TransformerScaleExplorer', afterSection: 'Key Technical Details' },
  ],
  'self-attention': [
    { component: 'SelfAttentionWalkthrough', afterSection: 'How It Works' },
    { component: 'AttentionPatternVisualizer', afterSection: 'Key Technical Details' },
  ],
  'multi-head-attention': [
    { component: 'MultiHeadSplitVisualizer', afterSection: 'How It Works' },
    { component: 'HeadSpecializationDemo', afterSection: 'Key Technical Details' },
  ],
  'causal-attention': [
    { component: 'CausalMaskVisualizer', afterSection: 'How It Works' },
    { component: 'CausalVsBidirectional', afterSection: 'Key Technical Details' },
  ],
  'grouped-query-attention': [
    { component: 'GQAGroupingVisualizer', afterSection: 'How It Works' },
    { component: 'GQAMemoryCalculator', afterSection: 'Key Technical Details' },
  ],
  'sliding-window-attention': [
    { component: 'SlidingWindowVisualizer', afterSection: 'How It Works' },
    { component: 'WindowSizeExplorer', afterSection: 'Key Technical Details' },
  ],
  'sparse-attention': [
    { component: 'SparsePatternVisualizer', afterSection: 'How It Works' },
    { component: 'SparseVsDenseComparison', afterSection: 'Key Technical Details' },
  ],
  'attention-sinks': [
    { component: 'AttentionSinkHeatmap', afterSection: 'How It Works' },
    { component: 'StreamingLLMDemo', afterSection: 'Key Technical Details' },
  ],
  'differential-transformer': [
    { component: 'DifferentialAttentionVisualizer', afterSection: 'How It Works' },
    { component: 'NoiseReductionDemo', afterSection: 'Key Technical Details' },
  ],
  'feed-forward-networks': [
    { component: 'FFNNeuronActivation', afterSection: 'How It Works' },
    { component: 'FFNBottleneckExplorer', afterSection: 'Key Technical Details' },
  ],
  'activation-functions': [
    { component: 'ActivationFunctionGrapher', afterSection: 'How It Works' },
    { component: 'ActivationComparison', afterSection: 'Key Technical Details' },
  ],
  'residual-connections': [
    { component: 'ResidualFlowVisualizer', afterSection: 'How It Works' },
    { component: 'GradientFlowDemo', afterSection: 'Key Technical Details' },
  ],
  'layer-normalization': [
    { component: 'LayerNormVisualizer', afterSection: 'How It Works' },
    { component: 'NormalizationComparison', afterSection: 'Key Technical Details' },
  ],
  'logits-and-softmax': [
    { component: 'SoftmaxTemperature', afterSection: 'How It Works' },
    { component: 'TopKTopPExplorer', afterSection: 'Key Technical Details' },
  ],
  'encoder-decoder-architecture': [
    { component: 'ArchitectureComparison', afterSection: 'How They Work' },
    { component: 'CrossAttentionFlow', afterSection: 'Key Technical Details' },
  ],
  'autoregressive-generation': [
    { component: 'AutoregressiveStepThrough', afterSection: 'How It Works' },
    { component: 'GenerationSpeedCalculator', afterSection: 'Key Technical Details' },
  ],
  'next-token-prediction': [
    { component: 'NextTokenPredictor', afterSection: 'How It Works' },
    { component: 'LossLandscapeExplorer', afterSection: 'Key Technical Details' },
  ],
  'mixture-of-experts': [
    { component: 'MoERoutingVisualizer', afterSection: 'How It Works' },
    { component: 'MoEEfficiencyCalculator', afterSection: 'Key Technical Details' },
  ],
  'mixture-of-depths': [
    { component: 'MoDTokenRouting', afterSection: 'How It Works' },
    { component: 'ComputeBudgetExplorer', afterSection: 'Key Technical Details' },
  ],
  'byte-latent-transformers': [
    { component: 'ByteVsTokenVisualizer', afterSection: 'How It Works' },
    { component: 'PatchingStrategyDemo', afterSection: 'Key Technical Details' },
  ],

  // === Module 02: Input Representation ===
  'tokenization': [
    { component: 'TokenizationPlayground', afterSection: 'How It Works' },
    { component: 'TokenBoundaryExplorer', afterSection: 'Key Technical Details' },
  ],
  'byte-pair-encoding': [
    { component: 'BPEMergeVisualizer', afterSection: 'How It Works' },
    { component: 'BPEVsWordPiece', afterSection: 'Key Technical Details' },
  ],
  'vocabulary-design': [
    { component: 'VocabSizeTradeoff', afterSection: 'How It Works' },
    { component: 'MultilingualTokenCost', afterSection: 'Key Technical Details' },
  ],
  'special-tokens': [
    { component: 'SpecialTokenMap', afterSection: 'How It Works' },
    { component: 'SpecialTokenQuiz', afterSection: 'Key Technical Details' },
  ],
  'token-embeddings': [
    { component: 'EmbeddingSpaceVisualizer', afterSection: 'How It Works' },
    { component: 'EmbeddingDimExplorer', afterSection: 'Key Technical Details' },
  ],
  'positional-encoding': [
    { component: 'SinusoidalPositionDemo', afterSection: 'How It Works' },
    { component: 'PositionalEncodingComparison', afterSection: 'Key Technical Details' },
  ],
  'rotary-position-embedding': [
    { component: 'RoPERotationVisualizer', afterSection: 'How It Works' },
    { component: 'RoPEFrequencySpectrum', afterSection: 'Key Technical Details' },
  ],
  'alibi': [
    { component: 'ALiBiSlopeVisualizer', afterSection: 'How It Works' },
    { component: 'ALiBiExtrapolationDemo', afterSection: 'Key Technical Details' },
  ],
  'context-window': [
    { component: 'ContextWindowTimeline', afterSection: 'How It Works' },
    { component: 'ContextMemoryCalculator', afterSection: 'Key Technical Details' },
  ],

  // === Module 03: Training Fundamentals ===
  'cross-entropy-loss': [
    { component: 'CrossEntropyVisualizer', afterSection: 'How It Works' },
    { component: 'PerplexityComparison', afterSection: 'Key Technical Details' },
  ],
  'backpropagation': [
    { component: 'BackpropChainRule', afterSection: 'How It Works' },
    { component: 'GradientDescentSteps', afterSection: 'Key Technical Details' },
  ],
  'adam-optimizer': [
    { component: 'AdamMomentumVisualizer', afterSection: 'How It Works' },
    { component: 'OptimizerMemoryCalculator', afterSection: 'Key Technical Details' },
  ],
  'learning-rate-scheduling': [
    { component: 'LRScheduleVisualizer', afterSection: 'How It Works' },
    { component: 'WarmupEffectDemo', afterSection: 'Key Technical Details' },
  ],
  'gradient-clipping': [
    { component: 'GradientClippingDemo', afterSection: 'Gradient Clipping' },
    { component: 'GradientAccumulationCalc', afterSection: 'Gradient Accumulation' },
  ],
  'mixed-precision-training': [
    { component: 'PrecisionFormatExplorer', afterSection: 'How It Works' },
    { component: 'MixedPrecisionMemory', afterSection: 'Key Technical Details' },
  ],
  'gradient-checkpointing': [
    { component: 'CheckpointMemoryTradeoff', afterSection: 'How It Works' },
    { component: 'ActivationMemoryVisualizer', afterSection: 'Key Technical Details' },
  ],
  'pre-training': [
    { component: 'PreTrainingPipeline', afterSection: 'How It Works' },
    { component: 'TrainingCostEstimator', afterSection: 'Key Technical Details' },
  ],
  'training-data-curation': [
    { component: 'DataQualityFilter', afterSection: 'How It Works' },
    { component: 'DatasetCompositionViz', afterSection: 'Key Technical Details' },
  ],
  'data-mixing': [
    { component: 'DataMixingRatios', afterSection: 'How It Works' },
    { component: 'DomainWeightImpact', afterSection: 'Key Technical Details' },
  ],
  'curriculum-learning': [
    { component: 'CurriculumScheduleDemo', afterSection: 'How It Works' },
    { component: 'DifficultyMetricsExplorer', afterSection: 'Key Technical Details' },
  ],
  'scaling-laws': [
    { component: 'ScalingLawCalculator', afterSection: 'How It Works' },
    { component: 'ComputeOptimalPlot', afterSection: 'Key Technical Details' },
  ],
  'emergent-abilities': [
    { component: 'EmergentAbilitiesTimeline', afterSection: 'How It Works' },
    { component: 'EmergenceDebateExplorer', afterSection: 'Key Technical Details' },
  ],
  'grokking': [
    { component: 'GrokkingPhaseDemo', afterSection: 'How It Works' },
    { component: 'MemorizationVsGeneralization', afterSection: 'Key Technical Details' },
  ],
  'model-collapse': [
    { component: 'ModelCollapseSimulator', afterSection: 'How It Works' },
    { component: 'SyntheticDataMixCalc', afterSection: 'Key Technical Details' },
  ],
  'catastrophic-forgetting': [
    { component: 'ForgettingCurveDemo', afterSection: 'How It Works' },
    { component: 'ParameterInterferenceViz', afterSection: 'Key Technical Details' },
  ],
  'self-play-and-self-improvement': [
    { component: 'SelfPlayLoopViz', afterSection: 'How It Works' },
    { component: 'BootstrapAccuracyTracker', afterSection: 'Key Technical Details' },
  ],

  // === Module 04: Distributed Training ===
  'data-parallelism': [
    { component: 'AllReduceVisualizer', afterSection: 'How It Works' },
    { component: 'DDPScalingCalculator', afterSection: 'Key Technical Details' },
  ],
  'tensor-parallelism': [
    { component: 'TensorSplitVisualizer', afterSection: 'How It Works' },
    { component: 'TensorParallelComm', afterSection: 'Key Technical Details' },
  ],
  'pipeline-parallelism': [
    { component: 'PipelineBubbleDemo', afterSection: 'How It Works' },
    { component: 'PipelineStageAssigner', afterSection: 'Key Technical Details' },
  ],
  'zero-and-fsdp': [
    { component: 'ZeROStageCompare', afterSection: 'How It Works' },
    { component: 'FSDPShardingViz', afterSection: 'Key Technical Details' },
  ],
  '3d-parallelism': [
    { component: 'ParallelismDimensionMap', afterSection: 'How It Works' },
    { component: 'TrainingConfigCalculator', afterSection: 'Key Technical Details' },
  ],
  'expert-parallelism': [
    { component: 'ExpertRoutingVisualizer', afterSection: 'How It Works' },
    { component: 'ExpertLoadBalancer', afterSection: 'Key Technical Details' },
  ],
  'ring-attention': [
    { component: 'RingAttentionVisualizer', afterSection: 'How It Works' },
    { component: 'ContextScalingCalculator', afterSection: 'Key Technical Details' },
  ],

  // === Module 05: Alignment & Post-Training ===
  'supervised-fine-tuning': [
    { component: 'SFTDataPipeline', afterSection: 'How It Works' },
    { component: 'InstructionFormatExplorer', afterSection: 'Key Technical Details' },
  ],
  'rlhf': [
    { component: 'RLHFPipelineVisualizer', afterSection: 'How It Works' },
    { component: 'KLDivergenceExplorer', afterSection: 'Key Technical Details' },
  ],
  'reward-modeling': [
    { component: 'RewardModelTrainer', afterSection: 'How It Works' },
    { component: 'RewardHackingDemo', afterSection: 'Key Technical Details' },
  ],
  'process-reward-models': [
    { component: 'PRMvsORMComparison', afterSection: 'How It Works' },
    { component: 'PreferencePairAnnotator', afterSection: 'Key Technical Details' },
  ],
  'dpo': [
    { component: 'DPOLossVisualizer', afterSection: 'How It Works' },
    { component: 'DPOvsRLHFComparison', afterSection: 'Key Technical Details' },
  ],
  'rejection-sampling': [
    { component: 'RejectionSamplingDemo', afterSection: 'How It Works' },
    { component: 'AlignmentTaxExplorer', afterSection: 'Key Technical Details' },
  ],
  'preference-learning-variants': [
    { component: 'PreferenceLearningMap', afterSection: 'How It Works' },
    { component: 'PolicyGradientViz', afterSection: 'Key Technical Details' },
  ],
  'grpo': [
    { component: 'GRPOGroupScoring', afterSection: 'How It Works' },
    { component: 'GRPOvssPPOComparison', afterSection: 'Key Technical Details' },
  ],
  'rlaif': [
    { component: 'RLAIFPipelineViz', afterSection: 'How It Works' },
    { component: 'RLVRRewardDemo', afterSection: 'Key Technical Details' },
  ],
  'constitutional-ai': [
    { component: 'ConstitutionBuilder', afterSection: 'How It Works' },
    { component: 'CAIRedTeamDemo', afterSection: 'Key Technical Details' },
  ],
  'synthetic-data': [
    { component: 'SyntheticDataGenerator', afterSection: 'How It Works' },
    { component: 'SyntheticDataQualityViz', afterSection: 'Key Technical Details' },
  ],
  'rlvr': [
    { component: 'VerifiableRewardTypes', afterSection: 'How It Works' },
    { component: 'ReasoningChainViz', afterSection: 'Key Technical Details' },
  ],
  'chain-of-thought-training': [
    { component: 'CoTTrainingPipeline', afterSection: 'How It Works' },
    { component: 'ExtendedThinkingDemo', afterSection: 'Key Technical Details' },
  ],

  // === Module 06: Parameter-Efficient Fine-Tuning ===
  'full-vs-peft-fine-tuning': [
    { component: 'FullVsPEFTComparison', afterSection: 'How It Works' },
    { component: 'PEFTDecisionTree', afterSection: 'Key Technical Details' },
  ],
  'lora': [
    { component: 'LoRAMatrixVisualizer', afterSection: 'How It Works' },
    { component: 'LoRARankExplorer', afterSection: 'Key Technical Details' },
  ],
  'adapters-and-prompt-tuning': [
    { component: 'AdapterArchitectureViz', afterSection: 'How It Works' },
    { component: 'SoftPromptDemo', afterSection: 'Key Technical Details' },
  ],
  'qlora': [
    { component: 'QLoRAMemoryCalculator', afterSection: 'How It Works' },
    { component: 'NF4QuantizationViz', afterSection: 'Key Technical Details' },
  ],
  'multi-lora-serving': [
    { component: 'MultiLoRARoutingViz', afterSection: 'How It Works' },
    { component: 'LoRASwapDemo', afterSection: 'Key Technical Details' },
  ],

  // === Module 07: Inference & Deployment ===
  'kv-cache': [
    { component: 'KVCacheVisualizer', afterSection: 'How It Works' },
    { component: 'KVCacheMemoryCalc', afterSection: 'Key Technical Details' },
  ],
  'flash-attention': [
    { component: 'FlashAttentionTiling', afterSection: 'How It Works' },
    { component: 'FlashAttentionIOComparison', afterSection: 'Key Technical Details' },
  ],
  'paged-attention': [
    { component: 'PagedAttentionViz', afterSection: 'How It Works' },
    { component: 'PagedAttentionWasteCalc', afterSection: 'Key Technical Details' },
  ],
  'throughput-vs-latency': [
    { component: 'ThroughputLatencyTradeoff', afterSection: 'How It Works' },
    { component: 'BatchSizeOptimizer', afterSection: 'Key Technical Details' },
  ],
  'continuous-batching': [
    { component: 'ContinuousBatchingViz', afterSection: 'How It Works' },
    { component: 'ContinuousBatchingTimeline', afterSection: 'Key Technical Details' },
  ],
  'model-serving': [
    { component: 'ModelServingArchitecture', afterSection: 'How It Works' },
    { component: 'ServingFrameworkComparison', afterSection: 'Key Technical Details' },
  ],
  'kv-cache-compression': [
    { component: 'KVCacheCompressionViz', afterSection: 'How It Works' },
    { component: 'KVCacheEvictionDemo', afterSection: 'Key Technical Details' },
  ],
  'prefix-caching': [
    { component: 'PrefixCachingDemo', afterSection: 'How It Works' },
    { component: 'PrefixSharingViz', afterSection: 'Key Technical Details' },
  ],
  'prefill-decode-disaggregation': [
    { component: 'PrefillDecodeViz', afterSection: 'How It Works' },
    { component: 'PrefillDecodeTimeline', afterSection: 'Key Technical Details' },
  ],
  'speculative-decoding': [
    { component: 'SpeculativeDecodingDemo', afterSection: 'How It Works' },
    { component: 'SpeculativeAcceptanceViz', afterSection: 'Key Technical Details' },
  ],
  'medusa-parallel-decoding': [
    { component: 'MedusaHeadViz', afterSection: 'How It Works' },
    { component: 'ParallelDecodingComparison', afterSection: 'Key Technical Details' },
  ],
  'sampling-strategies': [
    { component: 'SamplingStrategyViz', afterSection: 'How It Works' },
    { component: 'SamplingComparison', afterSection: 'Key Technical Details' },
  ],
  'constrained-decoding': [
    { component: 'ConstrainedDecodingViz', afterSection: 'How It Works' },
    { component: 'GrammarMaskDemo', afterSection: 'Key Technical Details' },
  ],
  'quantization': [
    { component: 'QuantizationLevelsViz', afterSection: 'How It Works' },
    { component: 'QuantizationImpactCalc', afterSection: 'Key Technical Details' },
  ],
  'knowledge-distillation': [
    { component: 'DistillationPipelineViz', afterSection: 'How It Works' },
    { component: 'InferenceCostBreakdown', afterSection: 'Key Technical Details' },
  ],
  'distillation-for-reasoning': [
    { component: 'DistillationForReasoningViz', afterSection: 'How It Works' },
    { component: 'ReasoningDistillationQuality', afterSection: 'Key Technical Details' },
  ],
  'prompt-compression': [
    { component: 'PromptCompressionDemo', afterSection: 'How It Works' },
    { component: 'PromptCompressionQuality', afterSection: 'Key Technical Details' },
  ],
  'model-routing': [
    { component: 'ModelRoutingViz', afterSection: 'How It Works' },
    { component: 'RouterCostCalculator', afterSection: 'Key Technical Details' },
  ],

  // === Module 08: Practical Applications ===
  'prompt-engineering': [
    { component: 'PromptTechniqueExplorer', afterSection: 'How It Works' },
    { component: 'PromptTemplateBuilder', afterSection: 'Key Technical Details' },
  ],
  'structured-output': [
    { component: 'JSONModeDemo', afterSection: 'How It Works' },
    { component: 'SchemaValidationViz', afterSection: 'Key Technical Details' },
  ],
  'function-calling-and-tool-use': [
    { component: 'FunctionCallingFlow', afterSection: 'How It Works' },
    { component: 'ToolSelectionDemo', afterSection: 'Key Technical Details' },
  ],
  'rag': [
    { component: 'RAGPipelineViz', afterSection: 'How It Works' },
    { component: 'RAGvsFineTuning', afterSection: 'Key Technical Details' },
  ],
  'chunking-strategies': [
    { component: 'ChunkingMethodComparison', afterSection: 'How It Works' },
    { component: 'ChunkSizeExplorer', afterSection: 'Key Technical Details' },
  ],
  'embedding-models-and-vector-databases': [
    { component: 'EmbeddingSimilarityDemo', afterSection: 'How It Works' },
    { component: 'VectorDBArchitectureViz', afterSection: 'Key Technical Details' },
  ],
  'ai-agents': [
    { component: 'AgentLoopViz', afterSection: 'How It Works' },
    { component: 'AgentToolChain', afterSection: 'Key Technical Details' },
  ],
  'react-pattern': [
    { component: 'ReActStepThrough', afterSection: 'How It Works' },
    { component: 'ReActVsCoT', afterSection: 'Key Technical Details' },
  ],
  'self-reflection': [
    { component: 'ReflexionLoopViz', afterSection: 'How It Works' },
    { component: 'SelfCritiqueDemo', afterSection: 'Key Technical Details' },
  ],
  'memory-systems': [
    { component: 'MemoryArchitectureViz', afterSection: 'How It Works' },
    { component: 'MemoryRetrievalDemo', afterSection: 'Key Technical Details' },
  ],
  'multi-agent-systems': [
    { component: 'MultiAgentDebateViz', afterSection: 'How It Works' },
    { component: 'AgentOrchestrationViz', afterSection: 'Key Technical Details' },
  ],
  'model-context-protocol': [
    { component: 'MCPArchitectureViz', afterSection: 'How It Works' },
    { component: 'MCPToolDiscoveryDemo', afterSection: 'Key Technical Details' },
  ],

  // === Module 09: Safety & Alignment ===
  'hallucination': [
    { component: 'HallucinationTypeViz', afterSection: 'How It Works' },
    { component: 'HallucinationDetector', afterSection: 'Key Technical Details' },
  ],
  'bias-and-fairness': [
    { component: 'BiasTypeExplorer', afterSection: 'How It Works' },
    { component: 'FairnessMetricsViz', afterSection: 'Key Technical Details' },
  ],
  'toxicity-detection': [
    { component: 'ToxicityClassifierDemo', afterSection: 'How It Works' },
    { component: 'ContentFilterViz', afterSection: 'Key Technical Details' },
  ],
  'prompt-injection': [
    { component: 'PromptInjectionDemo', afterSection: 'How It Works' },
    { component: 'InjectionDefenseViz', afterSection: 'Key Technical Details' },
  ],
  'jailbreaking': [
    { component: 'JailbreakTechniqueViz', afterSection: 'How It Works' },
    { component: 'JailbreakDefenseDemo', afterSection: 'Key Technical Details' },
  ],
  'red-teaming': [
    { component: 'RedTeamProcessViz', afterSection: 'How It Works' },
    { component: 'AttackSurfaceMap', afterSection: 'Key Technical Details' },
  ],
  'guardrails': [
    { component: 'GuardrailPipelineViz', afterSection: 'How It Works' },
    { component: 'GuardrailConfigDemo', afterSection: 'Key Technical Details' },
  ],
  'alignment-problem': [
    { component: 'AlignmentSpectrumViz', afterSection: 'How It Works' },
    { component: 'MisalignmentExamples', afterSection: 'Key Technical Details' },
  ],
  'reward-hacking': [
    { component: 'RewardHackingExamples', afterSection: 'How It Works' },
    { component: 'RewardGameViz', afterSection: 'Key Technical Details' },
  ],
  'specification-gaming': [
    { component: 'SpecGamingCatalog', afterSection: 'How It Works' },
    { component: 'SpecGamingSimulator', afterSection: 'Key Technical Details' },
  ],
  'sycophancy': [
    { component: 'SycophancyDetector', afterSection: 'How It Works' },
    { component: 'SycophancyComparisonViz', afterSection: 'Key Technical Details' },
  ],
  'goodharts-law': [
    { component: 'GoodhartLawViz', afterSection: 'How It Works' },
    { component: 'MetricProxyExplorer', afterSection: 'Key Technical Details' },
  ],
  'scalable-oversight': [
    { component: 'OversightScalabilityViz', afterSection: 'How It Works' },
    { component: 'DebateProtocolDemo', afterSection: 'Key Technical Details' },
  ],
  'weak-to-strong-generalization': [
    { component: 'WeakToStrongViz', afterSection: 'How It Works' },
    { component: 'SupervisionGapDemo', afterSection: 'Key Technical Details' },
  ],
  'machine-unlearning': [
    { component: 'UnlearningMethodViz', afterSection: 'How It Works' },
    { component: 'UnlearningVerificationDemo', afterSection: 'Key Technical Details' },
  ],
  'watermarking-llm-text': [
    { component: 'WatermarkEmbeddingViz', afterSection: 'How It Works' },
    { component: 'WatermarkDetectionDemo', afterSection: 'Key Technical Details' },
  ],
  'circuit-breakers': [
    { component: 'CircuitBreakerFlowViz', afterSection: 'How It Works' },
    { component: 'RepresentationMonitorDemo', afterSection: 'Key Technical Details' },
  ],
  'instruction-hierarchy': [
    { component: 'InstructionHierarchyViz', afterSection: 'How It Works' },
    { component: 'HierarchyConflictDemo', afterSection: 'Key Technical Details' },
  ],
  'sleeper-agents': [
    { component: 'SleeperAgentViz', afterSection: 'How It Works' },
    { component: 'BackdoorDetectionDemo', afterSection: 'Key Technical Details' },
  ],
  'ai-sandbagging': [
    { component: 'SandbaggingDemo', afterSection: 'How It Works' },
    { component: 'SandbaggingDetectionViz', afterSection: 'Key Technical Details' },
  ],
  'adversarial-robustness': [
    { component: 'AdversarialAttackViz', afterSection: 'How It Works' },
    { component: 'RobustnessTestingDemo', afterSection: 'Key Technical Details' },
  ],

  // === Module 10: Evaluation ===
  'benchmarks': [
    { component: 'BenchmarkExplorer', afterSection: 'How It Works' },
    { component: 'BenchmarkLeaderboardViz', afterSection: 'Key Technical Details' },
  ],
  'evaluation-metrics': [
    { component: 'MetricComparisonViz', afterSection: 'How It Works' },
    { component: 'MetricCorrelationDemo', afterSection: 'Key Technical Details' },
  ],
  'perplexity': [
    { component: 'PerplexityCalculator', afterSection: 'How It Works' },
    { component: 'PerplexityModelComparison', afterSection: 'Key Technical Details' },
  ],
  'human-evaluation': [
    { component: 'HumanEvalSetupViz', afterSection: 'How It Works' },
    { component: 'AnnotatorAgreementDemo', afterSection: 'Key Technical Details' },
  ],
  'llm-as-judge': [
    { component: 'LLMJudgeViz', afterSection: 'How It Works' },
    { component: 'JudgeBiasExplorer', afterSection: 'Key Technical Details' },
  ],
  'chatbot-arena': [
    { component: 'ArenaMatchViz', afterSection: 'How It Works' },
    { component: 'EloRatingExplorer', afterSection: 'Key Technical Details' },
  ],
  'benchmark-contamination-detection': [
    { component: 'ContaminationDetectorViz', afterSection: 'How It Works' },
    { component: 'DecontaminationMethodsDemo', afterSection: 'Key Technical Details' },
  ],

  // === Module 11: Advanced & Emerging ===
  'in-context-learning': [
    { component: 'ICLDemoViz', afterSection: 'How It Works' },
    { component: 'ICLvsFineTuning', afterSection: 'Key Technical Details' },
  ],
  'multimodal-models': [
    { component: 'MultimodalArchViz', afterSection: 'How It Works' },
    { component: 'ModalityComparisonDemo', afterSection: 'Key Technical Details' },
  ],
  'vision-language-models': [
    { component: 'VLMPipelineViz', afterSection: 'How It Works' },
    { component: 'ImagePatchTokenizer', afterSection: 'Key Technical Details' },
  ],
  'state-space-models': [
    { component: 'SSMvsTransformerViz', afterSection: 'How It Works' },
    { component: 'MambaBlockViz', afterSection: 'Key Technical Details' },
  ],
  'mechanistic-interpretability': [
    { component: 'NeuronActivationViz', afterSection: 'How It Works' },
    { component: 'CircuitDiscoveryDemo', afterSection: 'Key Technical Details' },
  ],
  'representation-engineering': [
    { component: 'RepresentationVectorViz', afterSection: 'How It Works' },
    { component: 'ActivationSteeringDemo', afterSection: 'Key Technical Details' },
  ],
  'model-merging': [
    { component: 'MergingMethodViz', afterSection: 'How It Works' },
    { component: 'MergeRecipeBuilder', afterSection: 'Key Technical Details' },
  ],
  'multi-token-prediction': [
    { component: 'MultiTokenVsAutoregressive', afterSection: 'How It Works' },
    { component: 'MultiTokenSpeedupCalc', afterSection: 'Key Technical Details' },
  ],
  'context-window-extension': [
    { component: 'ContextExtensionMethods', afterSection: 'How It Works' },
    { component: 'ContextLengthImpact', afterSection: 'Key Technical Details' },
  ],
  'test-time-compute': [
    { component: 'TestTimeComputeViz', afterSection: 'How It Works' },
    { component: 'ComputeBudgetAllocation', afterSection: 'Key Technical Details' },
  ],
  'inference-time-scaling-laws': [
    { component: 'InferenceScalingCurve', afterSection: 'How It Works' },
    { component: 'ScalingStrategyComparison', afterSection: 'Key Technical Details' },
  ],
  'reasoning-models': [
    { component: 'ReasoningModelComparison', afterSection: 'How It Works' },
    { component: 'ReasoningVsStandardViz', afterSection: 'Key Technical Details' },
  ],
  'tree-of-thought': [
    { component: 'TreeOfThoughtViz', afterSection: 'How It Works' },
    { component: 'ToTvsCOT', afterSection: 'Key Technical Details' },
  ],
  'neurosymbolic-ai': [
    { component: 'NeurosymbolicArchViz', afterSection: 'How It Works' },
    { component: 'SymbolicVsNeuralDemo', afterSection: 'Key Technical Details' },
  ],
  'compound-ai-systems': [
    { component: 'CompoundSystemViz', afterSection: 'How It Works' },
    { component: 'SystemCompositionDemo', afterSection: 'Key Technical Details' },
  ],
  'mixture-of-agents': [
    { component: 'MoALayerViz', afterSection: 'How It Works' },
    { component: 'MoAvsingle', afterSection: 'Key Technical Details' },
  ],
  'agentic-rag': [
    { component: 'AgenticRAGViz', afterSection: 'How It Works' },
    { component: 'AgenticVsNaiveRAG', afterSection: 'Key Technical Details' },
  ],
  'corrective-rag': [
    { component: 'CRAGFlowViz', afterSection: 'How It Works' },
    { component: 'RelevanceGatingDemo', afterSection: 'Key Technical Details' },
  ],
  'self-rag': [
    { component: 'SelfRAGFlowViz', afterSection: 'How It Works' },
    { component: 'ReflectionTokenDemo', afterSection: 'Key Technical Details' },
  ],
  'graphrag': [
    { component: 'GraphRAGViz', afterSection: 'How It Works' },
    { component: 'GraphVsVectorRAG', afterSection: 'Key Technical Details' },
  ],
  'raptor': [
    { component: 'RAPTORTreeViz', afterSection: 'How It Works' },
    { component: 'TreeTraversalDemo', afterSection: 'Key Technical Details' },
  ],
  'hyde-hypothetical-document-embeddings': [
    { component: 'HyDEPipelineViz', afterSection: 'How It Works' },
    { component: 'HyDEvsDirectSearch', afterSection: 'Key Technical Details' },
  ],
  'colbert-late-interaction': [
    { component: 'ColBERTInteractionViz', afterSection: 'How It Works' },
    { component: 'ColBERTvsDenseRetrieval', afterSection: 'Key Technical Details' },
  ],
  'reranking-and-cross-encoders': [
    { component: 'RerankingPipelineViz', afterSection: 'How It Works' },
    { component: 'CrossEncoderVsBiEncoder', afterSection: 'Key Technical Details' },
  ],
  'late-chunking': [
    { component: 'LateChunkingViz', afterSection: 'How It Works' },
    { component: 'LateVsEarlyChunking', afterSection: 'Key Technical Details' },
  ],
  'matryoshka-representation-learning': [
    { component: 'MatryoshkaDimViz', afterSection: 'How It Works' },
    { component: 'DimensionTruncationDemo', afterSection: 'Key Technical Details' },
  ],
  'query-decomposition-and-multi-step-retrieval': [
    { component: 'QueryDecompViz', afterSection: 'How It Works' },
    { component: 'MultiStepRetrievalDemo', afterSection: 'Key Technical Details' },
  ],
};
