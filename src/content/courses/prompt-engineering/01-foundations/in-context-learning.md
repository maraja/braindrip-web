# In-Context Learning

**One-Line Summary**: In-context learning (ICL) is the emergent ability of large language models to learn tasks from examples provided in the prompt — without any parameter updates — enabling few-shot prompting and fundamentally changing how we program AI systems.

**Prerequisites**: `how-llms-process-prompts.md`, `what-is-a-prompt.md`.

## What Is In-Context Learning?

Imagine showing someone how to fill out a tax form by giving them a completed example. You do not teach them tax law. You do not explain the reasoning behind each field. You simply hand them a filled-out form and a blank one, and they figure out the pattern: this field gets the address, this field gets the income, this field gets the calculation. They are not learning tax accounting — they are learning the format and mapping from your example. If you give them three completed examples, they get even more reliable, not because they understand more, but because the pattern becomes unambiguous.

In-context learning is the ability of large language models to perform new tasks by conditioning on input-output examples provided in the prompt, with zero changes to the model's parameters. Discovered at scale by Brown et al. (2020) with GPT-3, ICL was one of the most surprising findings in modern AI: a model trained purely to predict the next token could, given a few examples, perform translation, classification, arithmetic, and dozens of other tasks it was never explicitly trained to do. This capability is emergent — it appears at scale (generally 1B+ parameters) and is absent or unreliable in smaller models.

ICL is the mechanism that makes few-shot prompting work. Understanding its properties, limitations, and theoretical underpinnings is essential for designing effective prompts, because the rules governing ICL are counterintuitive — format matters more than label correctness, example diversity matters more than example count, and the ability emerges from pretraining dynamics, not instruction tuning.

![Prompt engineering approaches including zero-shot, few-shot, and chain-of-thought](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/gpt3-language-model.png)
*Source: Lilian Weng, "Prompt Engineering," lilianweng.github.io, 2023.*

*Recommended visual: A scaling curve showing in-context learning performance (y-axis: task accuracy) vs. number of few-shot examples (x-axis: 0 to 20+) across different model sizes (1B, 10B, 100B+), demonstrating that ICL is emergent at scale and that returns diminish after 3-8 examples.*
*Source: Adapted from Brown et al., "Language Models are Few-Shot Learners," NeurIPS 2020.*

## How It Works

### The Brown et al. Discovery (GPT-3, 2020)

GPT-3's paper demonstrated that a 175B-parameter language model could perform tasks with zero, one, or a few examples provided in the prompt. The key experimental setup: provide the model with examples formatted as "Input: X → Output: Y" and then a new "Input: Z → Output:" and let the model complete. On a range of benchmarks, few-shot performance approached or exceeded fine-tuned models — without any gradient updates. Performance scaled with model size and number of examples. This established the paradigm that prompt engineering could replace model training for many tasks.

### The Min et al. Finding: Format Over Labels (2022)

In a result that surprised the field, Min et al. (2022) showed that the correctness of labels in few-shot examples matters far less than the format and input distribution. When they deliberately assigned random incorrect labels to few-shot examples (e.g., labeling positive reviews as "negative" and vice versa), model performance dropped only marginally compared to correct labels. What mattered was:

1. **The input-output format**: The model learns that inputs of type X should produce outputs of type Y.
2. **The input distribution**: The examples show what kind of inputs to expect.
3. **The label space**: The examples define what the valid output categories are.
4. **The pairing is less critical**: The specific input-to-label mapping is partially ignored.

This finding suggests ICL is partly task recognition (identifying the task from the format) rather than pure inductive learning from examples. However, subsequent work showed that label correctness does matter for harder tasks and larger models — the relationship is nuanced.

### Theoretical Explanations

Several theoretical frameworks attempt to explain ICL:

- **Implicit Bayesian inference**: The model implicitly conditions on a distribution of tasks consistent with the examples, then generates output from the posterior predictive distribution. This explains why format matters more than specific labels — the format constrains the task space.
- **Task recognition / retrieval**: The model has seen similar tasks during pretraining and ICL examples help it "retrieve" the relevant skill. This is supported by the finding that ICL works best for tasks well-represented in pretraining data.
- **Transformer as meta-learner**: Theoretical work (Akyurek et al. 2022, von Oswald et al. 2023) shows that transformer attention layers can implement gradient descent steps on the examples, effectively learning a linear model in a single forward pass.
- **Induction heads**: Olsson et al. (2022) identified specific attention patterns ("induction heads") that copy patterns from earlier in the context to the current generation point, providing a mechanistic basis for ICL.

### Scaling Properties

ICL capability scales with model size, example count, and model quality:

- **Model size**: ICL is weak or absent below ~1B parameters, emergent at 1-10B, and robust at 100B+.
- **Example count**: Performance improves with examples but with diminishing returns — most gains occur in the first 3-8 examples for standard tasks.
- **Pretraining data quality**: Models pretrained on diverse, high-quality data show stronger ICL because they have seen more task patterns during training.

## Why It Matters

### ICL Replaces Fine-Tuning for Many Tasks

Before ICL, adapting a model to a new task required fine-tuning — collecting labeled data, running training, managing model versions. ICL allows task adaptation at inference time, through prompt design alone. For tasks where ICL performance is sufficient (often within 5-10% of fine-tuned models), this eliminates the entire training pipeline. The tradeoff: ICL costs more per-inference (examples consume tokens) but has zero training cost and instant iteration.

### Understanding ICL Informs Example Selection

Because ICL partially relies on format and distribution rather than exact label mappings, the example selection strategy should prioritize:

1. Diverse examples covering the input distribution (more important than many similar examples).
2. Consistent, clear formatting (the model learns format with near-100% reliability).
3. Representative label/output space (show all categories, even if examples are few per category).
4. Correct labels (they help, especially for complex tasks, but are not as critical as format consistency).

### ICL Has Limits You Must Design Around

ICL cannot teach a model genuinely new capabilities — it can only activate and steer capabilities the model acquired during pretraining. If the model has never seen a particular format, language, or reasoning pattern in pretraining data, few-shot examples alone will not teach it. For capabilities beyond what ICL can activate, fine-tuning or a different model is required. Recognizing this boundary prevents wasted effort on prompt engineering that cannot succeed.

## Key Technical Details

- ICL was demonstrated at scale in GPT-3 (175B parameters, Brown et al. 2020) and has been replicated across all frontier model families.
- The emergent threshold is roughly 1B parameters; below this, ICL is unreliable.
- Min et al. (2022) showed that random labels in few-shot examples reduced accuracy by only 0-5% on classification tasks, demonstrating the primacy of format.
- Performance typically improves logarithmically with example count: 3 examples capture ~70% of the gains, 8 examples capture ~85%, and additional examples yield diminishing returns.
- ICL performance varies by task type: classification and formatting tasks work well with 3-5 examples; complex reasoning tasks may need 8-15+.
- Instruction-tuned models show stronger ICL than base models because instruction tuning amplifies the model's ability to follow demonstrated patterns.
- The order of few-shot examples affects ICL quality (see `attention-and-position-effects.md`); random ordering generally outperforms sorted ordering.

## Common Misconceptions

**"In-context learning teaches the model new knowledge."** ICL does not add information to the model. It activates and steers existing capabilities acquired during pretraining. If the model has no relevant pretraining knowledge, ICL cannot create it from scratch.

**"More examples always improve in-context learning."** Returns are strongly diminishing. For most classification and formatting tasks, 3-8 examples capture the vast majority of ICL benefit. Beyond 15-20 examples, additional gains are minimal for standard ICL (though many-shot ICL with 100+ examples can approach fine-tuning quality on some tasks).

**"The labels in few-shot examples must be correct."** Min et al. showed that format consistency matters more than label correctness for many tasks. However, correct labels do help, especially on harder tasks and with more capable models. The takeaway: if you must choose between correct labels with inconsistent format and incorrect labels with perfect format, format wins.

**"ICL works equally well for all tasks."** ICL is strongest for tasks similar to what the model saw in pretraining: translation, classification, summarization, code generation. It is weaker for tasks requiring novel reasoning patterns, precise arithmetic, or domain-specific knowledge absent from pretraining data.

## Connections to Other Concepts

- `few-shot-prompting.md` — Few-shot prompting is the direct practical application of in-context learning.
- `many-shot-prompting.md` — Explores what happens when you push ICL to its limits with 20-500+ examples.
- `zero-shot-prompting.md` — Zero-shot is the baseline: ICL's value is measured relative to zero-shot performance.
- `mental-models-for-prompting.md` — The "pattern matcher" mental model directly corresponds to the ICL mechanism.
- `how-llms-process-prompts.md` — The attention mechanism, specifically induction heads, provides the mechanistic basis for ICL.

## Further Reading

- Brown et al., "Language Models are Few-Shot Learners," NeurIPS 2020. The seminal paper demonstrating ICL at scale with GPT-3.
- Min et al., "Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?" EMNLP 2022. The influential study showing format matters more than labels.
- Olsson et al., "In-context Learning and Induction Heads," 2022. Mechanistic interpretability of the attention patterns underlying ICL.
- Akyurek et al., "What Learning Algorithm Is In-Context Learning? Investigations with Linear Models," ICLR 2023. Theoretical framework showing transformers implement implicit gradient descent during ICL.
- von Oswald et al., "Transformers Learn In-Context by Gradient Descent," ICML 2023. Further theoretical analysis of ICL as implicit optimization.
