# Instruction Following and Compliance

**One-Line Summary**: LLM instruction compliance depends on instruction salience, formatting, position, and the model's training-shaped attention budget, and understanding these factors enables systematic improvement of adherence rates.
**Prerequisites**: `04-system-prompts-and-instruction-design/system-prompt-anatomy.md`, `01-foundations/how-llms-process-prompts.md`

## What Is Instruction Following?

Think about why some road signs are obeyed and others ignored. A bright red stop sign at an intersection gets near-universal compliance. A small "speed limit 25" sign half-hidden by a tree branch gets far less. The difference is not about the importance of the rule -- it is about the sign's visibility, clarity, and the driver's expectations. LLM instruction following works the same way: the model's compliance with a given instruction depends not just on what the instruction says but on how it is presented, where it is positioned, how it is formatted, and whether it competes with other instructions for the model's attention.

Instruction following is the foundational capability that makes LLM applications possible. Every prompt, system instruction, and constraint relies on the model's ability to receive an instruction, understand it, and generate output that adheres to it. When instruction following is reliable, applications behave predictably. When it fails, applications produce off-brand outputs, violate safety constraints, ignore formatting requirements, or respond to things they were told to ignore.

The science of instruction following reveals that compliance is not binary (follow or ignore) but probabilistic: each instruction has a compliance probability that is influenced by multiple factors. Understanding these factors transforms instruction design from guesswork into engineering, where you can predict which instructions will be followed and adjust the ones that will not be.

*Recommended visual: A heatmap-style diagram of a system prompt where each instruction line is color-coded by compliance probability (green = high compliance at top and bottom, yellow = moderate in mid-sections, red = low compliance buried in the middle), illustrating the primacy/recency effect and the attention budget concept.*
*Source: Adapted from Liu et al., "Lost in the Middle" (2024) and Ouyang et al., "Training Language Models to Follow Instructions with Human Feedback" (2022)*

*Recommended visual: A bar chart comparing instruction compliance rates across formatting strategies: "Prose paragraphs" (~70%), "Bullet points" (~78%), "Numbered lists" (~88%), "Numbered lists with emphasis markers" (~93%), showing the progressive improvement from formatting optimization.*
*Source: Derived from findings in Mu et al., "Can LLMs Follow Simple Rules?" (2023) and Zhou et al., "LIMA: Less Is More for Alignment" (2023)*

## How It Works

### Instruction Salience

Salience is how "loud" an instruction is in the model's attention landscape. High-salience instructions stand out from surrounding text and are more likely to be attended to.

Factors that increase salience include: uppercase or bold formatting ("IMPORTANT:"), position at the beginning or end of the prompt (primacy/recency effects), separation from surrounding text (blank lines, dividers), specificity (concrete instructions are more salient than vague ones), and novelty (unusual instructions stand out more than boilerplate).

A practical test: if you read the prompt quickly, would the instruction catch your eye? If yes, it has high salience. If it blends into the surrounding text, it has low salience and is likely to be overlooked by the model as well.

### Instruction Competition

When a prompt contains multiple instructions, they compete for the model's attention budget. The model cannot attend equally to all instructions simultaneously; it allocates attention based on salience, relevance to the current generation, and proximity.

Adding a new instruction can inadvertently reduce compliance with existing instructions by diluting the attention pool. This is why 15 well-chosen rules outperform 30 comprehensive ones -- the additional rules do not add net compliance, they redistribute it.

This competition effect means that prompt optimization is not just about making individual instructions better -- it is about managing the total instruction load and ensuring that the highest-priority instructions receive sufficient attention.

### RLHF and Instruction-Following Training

Modern instruction-tuned models (GPT-4, Claude, Gemini) are trained through reinforcement learning from human feedback (RLHF) or constitutional AI (CAI) to follow instructions. This training shapes which instruction patterns the model is most responsive to.

Instructions that resemble patterns heavily reinforced during training (clear directives, specific constraints, common formatting patterns) receive higher compliance than novel or unusual instruction formats. Understanding the model's training biases helps explain why some phrasings work better than others.

For example, RLHF training heavily reinforces helpfulness, which means instructions that align with being helpful are followed more readily, while instructions that might seem "unhelpful" (like refusing to elaborate) may face lower compliance.

### The Attention Budget Model

A useful mental model is that the model has a finite "attention budget" for instructions. Each instruction consumes a portion of this budget based on its salience and complexity. Simple, clear instructions consume less budget than complex, ambiguous ones.

When the total instruction demand exceeds the budget, lower-priority instructions are dropped. This model explains why: (1) fewer high-quality instructions outperform many low-quality ones, (2) instruction compliance degrades with prompt length, and (3) formatting and position matter as much as content.

The attention budget is not a fixed number but a useful abstraction. In practice, it varies with model capability, context window usage, and the semantic relationship between instructions and the current generation task.

## Why It Matters

### Predictable Application Behavior

Understanding instruction compliance allows developers to predict which behaviors will be reliable and which will be brittle. Instructions with high predicted compliance can be relied upon for critical behaviors. Instructions with lower predicted compliance need redundant enforcement mechanisms (code-level checks, output validation, re-prompting).

### Systematic Prompt Optimization

Instead of trial-and-error prompt editing, understanding compliance factors enables systematic optimization: identify low-compliance instructions, diagnose the cause (poor salience, competition, weak phrasing), and apply the appropriate fix (reformat, reposition, consolidate, or remove competing instructions).

### Cost-Effective Quality Improvement

Instruction compliance improvements are free -- they require no additional API calls, no model changes, and no infrastructure. Reformatting a constraint from prose to a numbered list, or repositioning it from the middle to the top of the prompt, can improve compliance by 10-20% at zero cost.

### Measuring and Monitoring Compliance

Understanding compliance factors enables measurement. Each instruction can be associated with a test (automated or LLM-judged) that checks whether the output adheres to it. Tracking compliance rates over time reveals drift (model updates changing compliance patterns), regression (prompt changes breaking existing adherence), and optimization opportunities (consistently low-compliance instructions that need reformulation).

## Key Technical Details

- **Numbered lists vs. prose**: Instructions formatted as numbered lists show 15-20% higher compliance than equivalent instructions in paragraph form.
- **Position effect**: Instructions at the top and bottom of a prompt are followed 10-15% more reliably than instructions in the middle (primacy/recency effect documented in Liu et al., 2024).
- **Instruction count sweet spot**: 5-15 instructions per prompt maximizes total compliance. Beyond 15, marginal compliance per instruction drops significantly due to attention competition.
- **Formatting impact**: Using section headers (###), emphasis markers (IMPORTANT:, NOTE:), and visual separation (blank lines, dividers) improves compliance by 5-15% per instruction.
- **Specificity premium**: Specific instructions ("Respond in exactly 3 bullet points") are followed 20-30% more reliably than vague equivalents ("Keep your response brief and structured").
- **Repetition effect**: Stating a critical instruction twice (e.g., at the top and bottom of the system prompt) improves compliance by 5-10% relative to stating it once.
- **Instruction length**: Shorter instructions (under 20 words) are followed more reliably than longer ones (50+ words). Complex instructions should be decomposed into multiple short instructions.
- **Training alignment**: Instructions that align with the model's RLHF training (helpfulness, safety, honesty) receive higher baseline compliance than instructions that work against it.

## Common Misconceptions

- **"If the model can understand the instruction, it will follow it."** Understanding and compliance are separate capabilities. A model can perfectly understand "never mention competitors" and still mention competitors because the instruction has low salience, is buried in a long prompt, or competes with a user question that directly asks about competitors.

- **"More detailed instructions are always better."** Detailed instructions provide clarity but consume attention budget. An instruction that is 100 words long may be less effective than a 15-word version because the model's attention is diluted across the additional words. Conciseness and clarity are more important than completeness.

- **"Instruction following is a fixed model capability."** Compliance varies dramatically with instruction formatting, position, and context. The same model will follow the same instruction with different reliability depending on how it is presented. Compliance is a property of the instruction-model interaction, not just the model.

- **"The model intentionally ignores instructions."** LLMs do not make conscious decisions to ignore instructions. Non-compliance results from attention dynamics, instruction competition, and the probabilistic nature of token generation. The model generates text that is likely given all of its context, and sometimes the instruction's influence is insufficient to overcome other contextual pressures.

- **"RLHF makes models perfectly instruction-following."** RLHF significantly improves instruction following but creates its own biases. Models trained heavily on helpfulness may override constraint instructions when they perceive the constraint as "unhelpful." Models trained on verbosity may generate longer responses than instructed. Understanding these training biases helps predict compliance patterns.

## Connections to Other Concepts

- `04-system-prompts-and-instruction-design/behavioral-constraints-and-rules.md` -- Constraint design directly applies compliance principles: specific, positively framed, numbered, well-positioned rules achieve higher adherence.
- `04-system-prompts-and-instruction-design/system-prompt-anatomy.md` -- The six-component anatomy is designed to maximize compliance by organizing instructions into high-salience, well-structured blocks.
- `04-system-prompts-and-instruction-design/multi-turn-instruction-persistence.md` -- Instruction persistence is a temporal dimension of compliance: the same instruction may have high initial compliance that decays over turns.
- `04-system-prompts-and-instruction-design/instruction-hierarchy-design.md` -- Hierarchy violations are a specific form of compliance failure where lower-priority instructions override higher-priority ones.
- `03-reasoning-elicitation/zero-shot-chain-of-thought.md` -- The effectiveness of trigger phrases ("Let's think step by step") is an instance of instruction compliance: some phrasings are more reliably followed than others.

## Further Reading

- Liu, N. F., Lin, K., Hewitt, J., et al. (2024). "Lost in the Middle: How Language Models Use Long Contexts." TACL. Empirically demonstrates position-dependent attention in long contexts, directly explaining position effects in instruction compliance.
- Ouyang, L., Wu, J., Jiang, X., et al. (2022). "Training Language Models to Follow Instructions with Human Feedback." NeurIPS 2022. The InstructGPT paper that established the RLHF paradigm for instruction following, providing foundational understanding of how compliance is trained.
- Zhou, C., Liu, P., Xu, P., et al. (2023). "LIMA: Less Is More for Alignment." NeurIPS 2023. Demonstrates that instruction-following quality depends more on instruction quality than quantity, supporting the "fewer, better instructions" principle.
- Mu, J., Li, X., & Goodman, N. (2023). "Can LLMs Follow Simple Rules?" Systematic study of rule-following capability, measuring compliance rates across rule types, quantities, and formulations.
