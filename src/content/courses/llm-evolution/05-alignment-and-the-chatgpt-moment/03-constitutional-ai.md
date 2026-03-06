# Constitutional AI

**One-Line Summary**: Anthropic's Constitutional AI replaced the need for extensive human labeling of harmful content by having the model critique and revise its own outputs according to a written set of principles, then training a preference model using AI-generated judgments (RLAIF).

**Prerequisites**: `01-instructgpt-and-rlhf.md`, `01-gpt-3.md`

## What Is Constitutional AI?

Imagine training a new employee by handing them a company handbook — a written constitution of values and principles — and asking them to review their own work against it. They draft a response, read the handbook, identify where their response falls short, and revise. Then a panel of their peers (not managers) votes on which revision is better. Over time, the employee internalizes the handbook's values and needs to consult it less frequently. Constitutional AI works on exactly this principle: instead of requiring humans to label every harmful output, the model learns to police itself against a written constitution.

Published in December 2022 by Yuntao Bai and 51 co-authors at Anthropic, "Constitutional AI: Harmlessness from AI Feedback" was born from a practical problem with RLHF. OpenAI's InstructGPT approach required human labelers to read and rank model outputs — including harmful, disturbing, or offensive content — across thousands of examples. This was psychologically costly for labelers, difficult to scale, and introduced inconsistencies (different labelers have different thresholds for what counts as harmful). Anthropic asked: what if the AI itself could do most of this evaluation work, guided by explicit principles?

The project was led by researchers at Anthropic, a company founded in 2021 by former OpenAI executives Dario Amodei and Daniela Amodei, along with several other former OpenAI researchers. The constitution itself — the set of principles guiding the model's self-critique — was authored primarily by Amanda Askell, a philosopher and ethicist at Anthropic. Constitutional AI became the foundation for all Claude models and established Anthropic's reputation as the "safety-first" AI lab.

## How It Works

```
  Constitutional AI: Self-Critique and RLAIF

  PHASE 1: Supervised Self-Critique
  ┌──────────────────────────────────────────────────────────┐
  │                                                          │
  │  Red-team prompt: "How do I pick a lock?"                │
  │       │                                                  │
  │       ▼                                                  │
  │  Model generates initial (potentially harmful) response  │
  │       │                                                  │
  │       ▼                                                  │
  │  Model critiques itself against the Constitution:        │
  │  ┌──────────────────────────────────────────────┐        │
  │  │ Principle: "Choose the response that is most │        │
  │  │ supportive of life, liberty, and personal    │        │
  │  │ security."                                   │        │
  │  │                                              │        │
  │  │ Critique: "My response provides specific     │        │
  │  │ instructions that could enable illegal       │        │
  │  │ activity..."                                 │        │
  │  └──────────────────────────────────────────────┘        │
  │       │                                                  │
  │       ▼                                                  │
  │  Model generates revised (safer) response                │
  │  ──▶ Revised responses become SFT training data          │
  └──────────────────────────────────────────────────────────┘

  PHASE 2: RLAIF (RL from AI Feedback)
  ┌──────────────────────────────────────────────────────────┐
  │  Standard RLHF:     Humans rank outputs  ──▶ reward model│
  │  Constitutional AI:  AI judges rank outputs ──▶ RM       │
  │                     (guided by constitution)             │
  │                                                          │
  │  Result: Dramatically less human labeling needed         │
  │          Explicit, auditable values (the constitution)   │
  │          Foundation for all Claude models                │
  └──────────────────────────────────────────────────────────┘
```
*Figure: Constitutional AI replaces per-example human labeling with model self-critique guided by explicit principles. Phase 1 generates revised training data; Phase 2 uses AI judges (RLAIF) instead of human labelers for preference modeling.*

### Phase 1: Supervised Self-Critique and Revision (Constitutional SL)

The first phase generates training data through a self-improvement loop:

1. **Red-team prompting**: The model is prompted with requests designed to elicit harmful outputs (e.g., "How do I break into a house?"). The model generates an initial, potentially harmful response.
2. **Critique**: The model is shown its own response alongside a principle from the constitution (e.g., "Please choose the response that is most supportive and encouraging of life, liberty, and personal security") and asked to critique its response against this principle.
3. **Revision**: The model generates a revised response that better satisfies the constitutional principle.
4. **Fine-tuning**: The revised responses are collected and used as supervised training data. The model is fine-tuned on these self-generated, constitution-aligned examples.

This process can be iterated multiple times, with the model producing increasingly refined responses. The key insight is that the model can generate much more training data than human labelers could, and it can do so without exposing humans to harmful content.

### Phase 2: Reinforcement Learning from AI Feedback (RLAIF)

The second phase replaces human preference labelers with AI judges:

1. **Comparison generation**: For each prompt, the model generates multiple responses.
2. **AI evaluation**: A separate AI model (or the same model in a different context) evaluates which response better satisfies the constitutional principles, generating preference labels.
3. **Reward model training**: These AI-generated preferences are used to train a reward model, just as human preferences would be in standard RLHF.
4. **RL optimization**: The model is optimized against this reward model using reinforcement learning (similar to the PPO step in InstructGPT).

The result is a model trained to be helpful while avoiding harmful outputs, with dramatically reduced need for human annotation of harmful content. Humans still write the constitution and validate the overall approach, but the per-example labeling is largely automated.

### The Constitution

The constitution itself is a set of natural-language principles covering topics like harmfulness, honesty, helpfulness, and respect for human autonomy. Examples include principles drawn from the UN Universal Declaration of Human Rights, guidelines about avoiding deception, and instructions to prioritize user safety. The constitution is explicit and auditable — unlike the implicit values embedded in human labeler preferences, which are opaque and inconsistent, the constitution can be read, debated, and revised.

### Comparison with Standard RLHF

Constitutional AI and standard RLHF share the same goal (aligning model behavior with human values) but differ in method. RLHF relies on human labelers at every stage; Constitutional AI relies on human-authored principles that the AI applies autonomously. In practice, the approaches are complementary: Constitutional AI is more scalable and reduces human exposure to harmful content, while RLHF captures nuanced human preferences that may be difficult to articulate as explicit rules.

## Why It Matters

### Scaling Safety Without Scaling Human Labor

The fundamental bottleneck in RLHF was human labeling. Training InstructGPT required approximately 33,000 human preference comparisons, and every new model or update required more. As models grew more capable and were deployed more widely, the volume of potentially harmful outputs that needed human review grew exponentially. Constitutional AI broke this scaling bottleneck: once the constitution is written, the model can generate virtually unlimited self-critique and preference data. This made safety training feasible at scales that would be impractical with human-only labeling.

### Explicit, Auditable Values

Standard RLHF embeds values implicitly in the preferences of a specific group of labelers. These values are difficult to inspect, may reflect cultural biases, and can vary across labelers. Constitutional AI makes values explicit: the constitution is a document that can be read, critiqued, and revised by anyone. This transparency is valuable for governance, public accountability, and iterative improvement. It also enables different deployments to use different constitutions — a model for medical use might have different principles than one for creative writing.

### Foundation for Claude

Constitutional AI is the theoretical and practical foundation for all of Anthropic's Claude models. From Claude 1.0 through Claude 3 and beyond, the training pipeline incorporates Constitutional AI techniques. This gives Claude its distinctive character — it tends to be more cautious, more willing to express uncertainty, and more explicit about its limitations compared to models trained purely with RLHF. The approach also enables Anthropic's "helpful, honest, and harmless" (HHH) alignment framework.

## Key Technical Details

- **Published**: December 2022 by Bai et al. at Anthropic (51 authors)
- **Phase 1 (Constitutional SL)**: Model self-critiques against written principles, revised outputs become training data
- **Phase 2 (RLAIF)**: AI judges rank outputs for preference modeling, replacing human labelers
- **Constitution author**: Primarily Amanda Askell (philosopher/ethicist at Anthropic)
- **Principles sources**: UN Declaration of Human Rights, Apple's terms of service, custom guidelines
- **Dramatically reduces** human exposure to harmful content during labeling
- **Foundation for**: All Claude models (Claude 1.0, 2.0, 3, 3.5, and beyond)
- **Company**: Anthropic, founded 2021 by Dario and Daniela Amodei (ex-OpenAI)

## Common Misconceptions

- **"Constitutional AI eliminates the need for human judgment."** Humans write the constitution, validate the training pipeline, evaluate the final model, and iteratively refine the principles. The AI automates the per-example labeling, not the design of values.

- **"The constitution is a fixed, final document."** The constitution is iteratively revised based on model behavior, red-teaming results, and evolving understanding of safety. It is a living document, not a set-in-stone rulebook.

- **"RLAIF produces lower-quality alignment than RLHF."** The original paper showed that RLAIF achieved comparable or better results than RLHF on harmlessness evaluations. AI feedback is more consistent (no inter-labeler disagreement) and can be generated at far greater scale.

- **"Constitutional AI makes models refuse everything."** A well-designed constitution balances harmlessness with helpfulness. The goal is not to refuse all potentially sensitive requests but to respond thoughtfully and safely. Over-refusal is a failure mode, not a goal.

- **"Only Anthropic uses Constitutional AI."** While the term is Anthropic's, the underlying ideas — self-critique, AI-generated feedback, explicit value alignment — have been adopted and adapted by other labs. Google's approach to Gemini safety and Meta's LLaMA 2 safety training both incorporate related techniques.

## Connections to Other Concepts

- `01-instructgpt-and-rlhf.md` — The standard RLHF approach that Constitutional AI augments and partially replaces
- `04-direct-preference-optimization.md` — DPO offers another simplification of the RLHF pipeline, complementary to Constitutional AI
- `02-chatgpt.md` — ChatGPT used standard RLHF; Claude used Constitutional AI — the two approaches produced different model characters
- `07-claude-1-and-2.md` — The Claude model family built on Constitutional AI principles
- `06-synthetic-data-for-training.md` — Constitutional AI's self-critique pipeline is a form of synthetic data generation
- `07-lamda-and-conversational-ai.md` — LaMDA's safety fine-tuning was an earlier, less systematic approach to the same problem

## Further Reading

- Bai et al., "Constitutional AI: Harmlessness from AI Feedback" (2022) — The original Constitutional AI paper.
- Bai et al., "Training a Helpful and Harmless Assistant from Human Feedback" (2022) — Anthropic's earlier RLHF work that motivated Constitutional AI.
- Lee et al., "RLAIF: Scaling Reinforcement Learning from Human Feedback with AI Feedback" (2023) — Google's exploration of AI feedback for alignment.
- Askell et al., "A General Language Assistant as a Laboratory for Alignment" (2021) — Early Anthropic work on alignment evaluation.
