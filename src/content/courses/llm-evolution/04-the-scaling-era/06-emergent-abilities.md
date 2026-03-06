# Emergent Abilities of Large Language Models

**One-Line Summary**: Certain capabilities — like few-shot arithmetic, chain-of-thought reasoning, and word unscrambling — appear to emerge unpredictably at specific model scales, sparking a fierce debate about whether these phase transitions are real or artifacts of how we measure.

**Prerequisites**: `01-gpt-3.md`, `02-kaplan-scaling-laws.md`, `04-palm.md`

## What Is Emergence in LLMs?

Imagine heating water. Temperature rises gradually, and nothing dramatic happens — until 100 degrees Celsius, when the water suddenly boils. The transition from liquid to gas is not gradual; it is a phase transition that emerges from the underlying physics at a critical threshold. In 2022, Jason Wei and colleagues at Google argued that large language models exhibit something similar: abilities that are essentially absent in smaller models but suddenly appear once the model crosses a critical size threshold.

The concept was formally introduced in Wei et al.'s 2022 paper "Emergent Abilities of Large Language Models," which surveyed results from GPT-3, PaLM, LaMDA, and other model families. They documented dozens of tasks where performance was near-zero (or random) at smaller scales and then jumped sharply once models reached a certain size — typically between 10B and 100B+ parameters. Three-digit addition, for example, showed near-zero accuracy in models below ~13B parameters and then jumped to 80%+ in PaLM-540B. Word unscrambling was similarly absent in small models and present in large ones.

This finding electrified the field because it challenged the smooth, predictable scaling described by Kaplan's laws. If some abilities appear discontinuously, then scaling laws based on aggregate loss metrics might not capture the full picture. You could not simply extrapolate from a small model's performance to predict what a large model would do. This had profound implications for both capabilities research (what surprising abilities might emerge next?) and safety research (what dangerous capabilities might appear without warning?).

## How It Works

```
  Emergent Abilities: Phase Transitions in Model Capabilities

  Task Accuracy
       │
  100% │                                          ╭─────── Capability
       │                                     ╭────╯        appears!
       │                                ╭────╯
   50% │                           ╭────╯
       │                      ╭────╯
       │  ─────────────────────╯
    0% │  ░░░░░░░░░░░░░░░░░░░░░    ← Near-zero performance
       └────────────────────────────────────────────▶
         100M  1B   10B   100B  500B
                  Model Scale (params)

  Training Loss (always smooth):    Task Accuracy (can be sharp):
       │╲                                │
       │  ╲                              │         ╭──
       │    ╲──                          │    ╭────╯
       │       ──────                    │────╯
       └──────────────▶                  └────────────▶
         (Kaplan power law)              (potential phase transition)

  The Metric Debate (Schaeffer et al., 2023):
  ┌────────────────────────────────────────────────────────┐
  │  Exact-match accuracy: "Was EVERY digit correct?"      │
  │  95% digits right ──▶ score = 0  (looks like no skill) │
  │  100% digits right ──▶ score = 1 (looks like emergence)│
  │                                                        │
  │  Token-level accuracy: "What fraction of digits right?"│
  │  95% ──▶ score = 0.95  (gradual improvement visible)  │
  │  100% ──▶ score = 1.00 (smooth scaling, no "emergence")│
  └────────────────────────────────────────────────────────┘
  Is emergence real or a measurement artifact? Debate continues.
```
*Figure: Emergent abilities appear as sharp transitions in task performance at certain model scales. However, the choice of metric (exact-match vs. token-level) can make smooth improvements appear discontinuous, raising questions about whether emergence is a property of models or of measurement.*

### Defining Emergence

Wei et al. defined an emergent ability as "an ability that is not present in smaller models but is present in larger models." Critically, this is measured at the task level, not at the level of training loss. Training loss decreases smoothly with scale (as Kaplan showed), but individual task performance can be discontinuous. The authors identified emergence by plotting accuracy vs. model scale across multiple model families and looking for tasks where the curve shows a sharp elbow rather than a gradual rise.

### The Evidence

The paper catalogued emergence across multiple model families and dozens of tasks:

- **Few-shot arithmetic**: Three-digit addition showed near-random performance below ~13B parameters, then jumped in PaLM-540B and GPT-3 175B.
- **Chain-of-thought reasoning**: The ability to solve multi-step reasoning problems when prompted with step-by-step examples appeared only in the largest models.
- **Word unscrambling**: Rearranging scrambled letters into words showed a sharp threshold around 60-100B parameters.
- **International Olympiad problems**: Zero performance below certain scales, then nonzero performance above them.
- **Instruction following**: Smaller models often ignored or misinterpreted instructions; larger models reliably followed them.

These patterns appeared across GPT-3, PaLM, LaMDA, and Chinchilla, suggesting they were not artifacts of a single model family.

### The Metric Artifact Critique

In 2023, Rylan Schaeffer, Brando Miranda, and Sanmi Koyejo published a provocative rebuttal: "Are Emergent Abilities of Large Language Models a Mirage?" They argued that emergence was an artifact of using nonlinear or discontinuous metrics (like exact-match accuracy) to measure performance. When you use exact-match accuracy, a model must get every token right to score a point — so a model that gets 95% of digits right in arithmetic scores zero, while a slightly better model that gets 100% right scores one. The transition looks like emergence, but the underlying capability improved gradually.

Schaeffer et al. showed that if you replace exact-match accuracy with token-level error rate or Brier score, the sharp transitions disappear and scaling looks smooth again. They argued that "emergent abilities" are a property of the researcher's choice of metric, not a property of the model.

### The Ongoing Debate

The debate remains unresolved. Defenders of emergence argue that some abilities genuinely require compositional reasoning that is not possible below certain scales — that a model needs enough parameters to represent certain algorithmic procedures. Critics argue that every example of "emergence" can be explained by metric choice, evaluation noise at small sample sizes, or insufficient prompting of smaller models. The resolution likely lies somewhere in between: some discontinuities may be real (reflecting genuine capability thresholds) while others are measurement artifacts.

## Why It Matters

### Implications for AI Safety

If dangerous capabilities can emerge unpredictably at certain scales, then safety evaluation becomes much harder. You cannot simply test a smaller version of a model and assume the larger version will behave similarly. This fear motivated calls for evaluating frontier models extensively before deployment and influenced policies at labs like Anthropic (which developed Constitutional AI partly to address unpredictable capabilities) and OpenAI (which developed its "preparedness framework" for evaluating dangerous capabilities).

### The Scaling Debate

Emergence is central to the scaling hypothesis debate. If intelligence emerges from sufficient scale, then the path to AGI is simply "build bigger." If emergence is a mirage, then scaling alone may not produce qualitatively new capabilities, and algorithmic innovation is essential. The answer to this question determines whether billions of dollars in compute investment are well-spent or misallocated.

### How the Field Evaluates Models

The emergence debate fundamentally changed how the field thinks about benchmarks and evaluation. It highlighted that aggregate metrics can hide important patterns, that metric choice can create illusions of discontinuity, and that evaluating models across multiple scales is essential for understanding capability development. Post-emergence, model evaluations became more sophisticated, with researchers using multiple metrics and reporting performance curves rather than single numbers.

## Key Technical Details

- **Introduced by**: Wei et al. (2022), at Google Research / Google Brain
- **Tasks showing emergence**: 100+ tasks catalogued across multiple model families
- **Critical scale**: Most emergent abilities appeared between 10B and 100B+ parameters
- **Model families studied**: GPT-3, PaLM, LaMDA, Chinchilla, Gopher
- **Challenged by**: Schaeffer et al. (2023), arguing emergence is a metric artifact
- **Key metric distinction**: Exact-match accuracy shows sharp transitions; continuous metrics show smooth scaling
- **Training loss**: Always scales smoothly (Kaplan laws hold); task accuracy may not

## Common Misconceptions

- **"Emergence means the model suddenly gains consciousness or understanding."** Emergence in this context refers to measurable task performance crossing a threshold. It says nothing about whether the model "understands" anything in a deeper sense.

- **"Emergent abilities appear at random."** They appear at specific scales and are reproducible across model families. The "unpredictability" is that you cannot predict them from smaller-scale experiments, not that they are random.

- **"Schaeffer et al. debunked emergence entirely."** They showed that metric choice explains many cases of apparent emergence, but did not conclusively prove that all emergence is artifactual. The debate continues.

- **"Smooth scaling laws contradict emergence."** They do not. Training loss scales smoothly, but individual task performance can be non-smooth even when the underlying distribution of capabilities improves gradually. The two findings are compatible.

- **"Emergence only happens in language models."** Similar phase-transition phenomena have been observed in other domains, including vision models and reinforcement learning agents. It is a general property of sufficiently complex systems.

## Connections to Other Concepts

- `01-gpt-3.md` — GPT-3's eight-model suite provided early evidence of emergent abilities
- `04-palm.md` — PaLM's BIG-Bench results were a primary source of emergence examples
- `02-kaplan-scaling-laws.md` — Emergence challenges the assumption that scaling is always smooth and predictable
- `08-the-scaling-hypothesis-debate.md` — Emergence is the strongest evidence for qualitative jumps from scale
- `03-chinchilla-and-compute-optimal-training.md` — Raised questions about whether emergence depends on model size, data size, or both
- `07-gpt-4.md` — GPT-4's leap in reasoning reignited discussions about emergence at frontier scale

## Further Reading

- Wei et al., "Emergent Abilities of Large Language Models" (2022) — The paper that defined and catalogued emergent abilities.
- Schaeffer et al., "Are Emergent Abilities of Large Language Models a Mirage?" (2023) — The influential critique arguing emergence is a metric artifact.
- Srivastava et al., "Beyond the Imitation Game: Quantifying and Extrapolating the Capabilities of Language Models" (2022) — The BIG-Bench evaluation that provided much of the emergence evidence.
- Ganguli et al., "Predictability and Surprise in Large Generative Models" (2022) — Anthropic's analysis of when model behavior is predictable vs. surprising.
