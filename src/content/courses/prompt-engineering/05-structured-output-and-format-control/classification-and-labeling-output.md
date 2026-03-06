# Classification and Labeling Output

**One-Line Summary**: Classification and labeling output techniques use prompt design, label space engineering, and output constraints to reliably sort LLM inputs into predefined categories with calibrated confidence.
**Prerequisites**: None.

## What Is Classification and Labeling Output?

Imagine sorting mail into bins at a post office. Each letter arrives as unstructured content — handwritten addresses, varying formats, different sizes — but it must end up in exactly the right bin: local delivery, interstate, international, return to sender. The bins are predefined, the categories are exhaustive, and every letter must go somewhere. LLM classification works the same way: unstructured text goes in, and a structured label comes out.

Classification is one of the most common and commercially valuable LLM tasks. Sentiment analysis, content moderation, support ticket routing, intent detection, document categorization — all are classification tasks at their core. Unlike free-form generation, classification produces a constrained output from a fixed set of options, making it measurable, automatable, and directly actionable.

What makes LLM classification powerful compared to traditional ML classifiers is its flexibility. A traditional classifier requires training data, feature engineering, and retraining for any label change. An LLM classifier can be reconfigured with a prompt edit — add a new category, redefine boundaries, adjust for edge cases — all without retraining. This flexibility comes at the cost of precision and cost per classification, creating a design space where prompt engineering directly determines quality.

*Recommended visual: A decision tree diagram showing the classification prompt design process: "Define label space" (with checks for exhaustiveness and mutual exclusivity) -> "Choose single-label vs. multi-label" -> "Add CoT reasoning?" (if ambiguous task, yes; if simple task, no) -> "Select output format" (JSON with enum constraint vs. constrained decoding) -> "Add few-shot examples (2-3 per category)," with accuracy improvement percentages annotated at each decision.*
*Source: Adapted from Sun et al., "Text Classification via Large Language Models" (2023)*

*Recommended visual: A confusion-matrix-style heatmap showing classification accuracy as a function of label count (x-axis: 5, 10, 15, 20, 30 labels) and technique (y-axis: zero-shot, few-shot, CoT + few-shot, hierarchical), with cells colored from green (high accuracy) to red (low accuracy), illustrating that accuracy degrades beyond 20 labels without hierarchical approaches.*
*Source: Adapted from Zhao et al., "Calibrate Before Use" (2021) and Wei et al., "Chain-of-Thought Prompting" (2022)*

## How It Works

### Label Space Design

The label space — the set of possible categories — is the foundation of any classification task. Two principles govern good label space design:

**Exhaustiveness**: Every possible input must fit into at least one category. If inputs can fall outside your defined labels, add an "Other" or "Unknown" category. Missing categories force the model to choose the least-wrong option, degrading accuracy for ambiguous inputs.

**Mutual exclusivity** (for single-label tasks): Each input should belong to exactly one category. Overlapping categories like "Technical Issue" and "Bug Report" create ambiguity that reduces both accuracy and inter-rater reliability. When overlap is unavoidable, provide explicit decision rules: "Use 'Bug Report' for confirmed software defects; use 'Technical Issue' for configuration or usage problems."

Label names matter. Use descriptive, unambiguous names that the model can interpret correctly. "POS" is ambiguous (positive? point of sale?); "Positive Sentiment" is clear. Include brief definitions for each label in the prompt, especially for domain-specific categories.

### Single-Label vs Multi-Label Classification

Single-label classification assigns exactly one category per input. The prompt should explicitly state this constraint: "Choose exactly one of the following categories." Multi-label classification allows multiple simultaneous labels — a support ticket might be both "Billing" and "Urgent." Multi-label prompts must specify: "Select all applicable categories from the following list."

Multi-label classification is inherently harder and produces lower accuracy per label. Models tend to under-predict labels (assign fewer than they should) because each additional label is an additional decision with associated uncertainty. Compensate by prompting: "Consider each category independently — would this input qualify?"

### Chain-of-Thought Before Classification

Having the model reason before classifying improves accuracy by 5-10% on complex tasks. The pattern is:

1. Analyze the input and identify relevant features.
2. Consider which categories match those features.
3. Make the final classification decision.

This works because reasoning tokens allow the model to "think" about edge cases, resolve ambiguity, and weigh competing signals before committing to a label. The improvement is most significant for ambiguous inputs where the correct label is not immediately obvious.

For production systems, structure this as: `<reasoning>` tags for the analysis (optionally hidden from the end user), followed by the classification label in a parseable format.

### Hierarchical Classification

Some classification tasks have natural hierarchies: "Electronics > Computers > Laptops > Gaming Laptops." Two approaches work for hierarchical classification:

**Top-down**: Classify at the broadest level first, then narrow. This reduces the label space at each step and improves accuracy for deep hierarchies. Use separate prompts or a single prompt with explicit hierarchy instructions.

**Flat with full paths**: Present all leaf-level categories with their full paths and let the model choose directly. This works for hierarchies with fewer than 20-30 leaf categories but degrades beyond that due to label space size.

## Why It Matters

### Direct Business Impact

Classification powers automation. A correctly classified support ticket is automatically routed to the right team, reducing response time from hours to seconds. Accurate content moderation protects platforms from harmful content at scale. Sentiment classification drives product decisions from customer feedback. The accuracy of the classifier directly translates to business outcomes.

### Measurability and Iteration

Classification is one of the few LLM tasks with clear ground truth. A label is either correct or it is not. This enables systematic measurement (precision, recall, F1), A/B testing of prompts, and data-driven iteration. Teams can build evaluation datasets, track accuracy over time, and make evidence-based improvements — a luxury that free-form generation tasks rarely offer.

### Cost Efficiency at Scale

Classification typically requires short outputs (a single label or small set of labels), making it one of the cheapest LLM tasks per inference. Even with chain-of-thought reasoning, the total output is usually under 200 tokens. At scale, this efficiency enables processing millions of items at manageable cost.

## Key Technical Details

- **Chain-of-thought before classification improves accuracy by 5-10%** on ambiguous tasks, with the largest gains on inputs near decision boundaries.
- **Label space size impacts accuracy**: models handle 5-10 categories well, 10-20 with slight degradation, and 20+ with noticeable accuracy drops requiring hierarchical approaches.
- **Label ordering in the prompt creates position bias**: models slightly favor labels listed first. Randomize or alphabetize label order to mitigate.
- **Including 2-3 examples per category** (few-shot) improves accuracy by 10-15% compared to zero-shot classification, with the largest gains on domain-specific categories.
- **Confidence calibration**: asking the model to rate confidence (1-10 or percentage) correlates weakly with actual accuracy. Log-probabilities of the label token are a better calibration signal where available.
- **The "Other" category is critical**: without it, the model force-assigns ambiguous inputs to the closest category, inflating false positive rates for all categories.
- **Temperature 0 is recommended** for classification tasks to maximize consistency and reproducibility.
- **Decision threshold tuning**: when using confidence scores, adjusting the threshold where a classification is "accepted" (vs sent to human review) trades precision for recall.

## Common Misconceptions

- **"LLMs are just worse versions of fine-tuned classifiers."** For tasks with clear, well-separated categories and ample training data, fine-tuned classifiers often outperform. But LLMs excel at nuanced, context-dependent classification where traditional classifiers struggle — and they require no training data.
- **"More labels means the model needs more examples."** Few-shot examples help, but the primary driver of accuracy with many labels is clear label definitions and decision boundaries, not example quantity.
- **"The model's stated confidence is well-calibrated."** Self-reported confidence (e.g., "I'm 80% sure") is poorly calibrated in most LLMs. Token log-probabilities, where available, provide better calibration signals.
- **"Classification doesn't need chain-of-thought."** For simple, clear-cut classification, CoT adds unnecessary tokens. For ambiguous, multi-factor decisions, CoT's 5-10% accuracy improvement is significant and worth the token cost.
- **"You should always use the shortest possible label names."** Short labels save tokens but can introduce ambiguity. "Pos" vs "Neg" saves tokens but is less reliable than "Positive" vs "Negative." Clarity beats brevity for label names.

## Connections to Other Concepts

- `json-mode-and-schema-enforcement.md` — Classification output is best enforced as JSON with enum-constrained label fields.
- `constrained-decoding-from-prompt-perspective.md` — Constrained decoding can guarantee valid labels from the defined set.
- `output-length-control.md` — Classification is inherently a short-output task; length control prevents unnecessary elaboration.
- `extraction-and-parsing-prompts.md` — Classification and extraction are often combined: extract entities, then classify them.
- `multi-step-output-pipelines.md` — Classification often serves as a routing step in multi-stage pipelines.

## Further Reading

- Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (2022) — Demonstrates how reasoning before answering improves classification on complex tasks.
- Sun et al., "Text Classification via Large Language Models" (2023) — Comprehensive evaluation of LLM classification strategies including label design, few-shot, and CoT.
- Zhao et al., "Calibrate Before Use: Improving Few-Shot Performance of Language Models" (2021) — Addresses calibration and position bias in LLM classification.
- OpenAI, "Best Practices for Classification" (2023) — Practical guidance on designing LLM classification prompts.
