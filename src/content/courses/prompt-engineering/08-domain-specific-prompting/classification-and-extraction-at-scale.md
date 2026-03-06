# Classification and Extraction at Scale

**One-Line Summary**: Running classification and extraction prompts across thousands of inputs requires batch consistency, drift detection, calibration monitoring, and sampling strategies that single-input prompting does not demand.
**Prerequisites**: `04-system-prompts-and-instruction-design/system-prompt-anatomy.md`, `05-structured-output-and-format-control/json-mode-and-schema-enforcement.md`

## What Is Classification and Extraction at Scale?

Think of classification at scale like quality control on an assembly line. When you inspect one product, you can give it your full attention and catch every defect. But when you need to inspect 10,000 products per hour, you need systematic processes: standardized checklists, sampling strategies, drift detection (are defects increasing over time?), and calibration (are all inspectors using the same standards?). The inspection task itself is the same, but operating at scale introduces an entirely new set of challenges.

Classification and extraction at scale is the practice of applying consistent, reliable prompts across thousands to millions of inputs. Classification assigns categories (sentiment, topic, intent, urgency) to inputs; extraction pulls structured data (entities, dates, amounts, relationships) from unstructured text. At small scale, minor inconsistencies are tolerable. At scale, a 2% error rate means 2,000 errors per 100,000 inputs — and systematic biases that are invisible in 50 examples become glaring patterns across 50,000.

The core challenges at scale are distinct from single-input prompting: maintaining consistency across inputs that vary in format, length, and complexity; detecting when prompt performance degrades as data distributions shift; calibrating confidence thresholds so that "high confidence" means the same thing for the 1st input and the 100,000th; and monitoring quality without manually reviewing every output.

*Recommended visual: An assembly line quality control diagram showing the classification-at-scale pipeline -- inputs flowing through a consistent prompt template, LLM processing, structured output parsing, confidence-based routing (high confidence to auto-accept, low confidence to human review queue), with drift detection monitors sampling outputs at regular intervals.*
*Source: Adapted from Sun et al., "Text Classification via Large Language Models," 2023.*

*Recommended visual: A calibration curve (reliability diagram) showing predicted confidence (x-axis, 0.0-1.0) vs. actual accuracy (y-axis, 0.0-1.0), with a perfectly calibrated diagonal line and a typical LLM curve showing overconfidence at high predicted probabilities -- annotated with the optimal confidence threshold zone (0.85-0.95) for human review routing.*
*Source: Adapted from Ding et al., "Is GPT-3 a Good Data Annotator?" 2023.*

## How It Works

### Batch Processing Patterns

Processing large volumes efficiently requires structured batch approaches:

**Consistent prompt template**: Use the exact same prompt template for every input. Variations in prompt wording (even minor ones) introduce inconsistencies. Template the input slot clearly: "Classify the following customer feedback into one of these categories: [Bug Report, Feature Request, General Inquiry, Complaint]. Customer feedback: {input}"

**Single-input vs batch-input**: Two approaches for API efficiency:
- **Single-input**: One input per API call. Maximum consistency (identical prompt every time) but higher latency and cost.
- **Batch-input**: Multiple inputs in a single prompt. More efficient but introduces ordering effects — the model's classification of item 5 can be influenced by items 1-4. Limit batches to 5-10 items to minimize cross-contamination.

**Structured output enforcement**: Use JSON mode or function calling to ensure every output is parseable. At scale, even 0.1% of outputs being unparseable means hundreds of failures. Template: "Respond with ONLY a JSON object: {\"category\": \"<one of: Bug Report, Feature Request, General Inquiry, Complaint>\", \"confidence\": <0.0-1.0>}"

**Retry and fallback**: Implement automatic retry for failed or unparseable outputs. Use a fallback classification (e.g., "Needs Human Review") for inputs that fail after 2-3 retries.

### Consistency Across Diverse Inputs

Real-world data is messier than test data. Consistency mechanisms include:

**Edge case handling**: Define behavior for ambiguous cases explicitly in the prompt: "If a feedback item could fit multiple categories, choose the primary category. If it is genuinely ambiguous, classify as 'Needs Human Review.'"

**Length normalization**: Very short inputs (1-2 words) and very long inputs (1000+ words) may be classified differently than medium-length inputs. Test across length distributions and add instructions: "Apply the same classification criteria regardless of input length."

**Format variation**: Inputs may arrive as formal emails, chat messages, bullet points, or single words. The prompt must specify: "Classify based on content and intent, regardless of formatting, grammar, or writing style."

**Label definitions**: Provide clear, mutually exclusive definitions for each category with examples. "Bug Report: The user describes something that is not working as expected. Example: 'The login page crashes when I click submit.' Feature Request: The user asks for new functionality. Example: 'It would be great if you could add dark mode.'" Definitions with examples reduce inter-rater disagreement by 20-30%.

### Drift Detection

Prompt performance degrades over time as data distributions change:

**Distribution monitoring**: Track the distribution of output categories over time. If "Bug Report" suddenly increases from 15% to 35% of classifications, either the actual bug rate increased or the prompt is misclassifying. Statistical tests (chi-squared, KL divergence) detect distribution shifts.

**Confidence monitoring**: Track average confidence scores over time. Declining confidence suggests the model is encountering inputs that are increasingly different from what the prompt was designed for.

**Periodic human evaluation**: Sample 50-100 outputs per week for human review. Calculate accuracy, precision, and recall per category. Significant drops trigger prompt revision.

**Version tracking**: Maintain versioned prompts and track performance metrics per version. When performance degrades, compare against previous versions to determine if the issue is the prompt or the data.

### Calibration at Scale

Confidence scores must be meaningful and consistent:

**Calibration assessment**: A well-calibrated model's confidence of 0.9 should be correct 90% of the time. Measure calibration by binning predictions by confidence level and comparing against actual accuracy. Plot reliability diagrams (calibration curves) to visualize miscalibration.

**Threshold tuning**: Set confidence thresholds based on the cost of errors. For high-stakes classification (medical triage, fraud detection), set a high threshold (0.85-0.95) and route low-confidence items to human review. For low-stakes classification (content tagging), a lower threshold (0.6-0.7) maximizes throughput.

**Temperature for calibration**: Temperature settings affect confidence calibration. Higher temperature (0.3-0.5) can produce better-calibrated probabilities than temperature 0 (greedy decoding), which tends to be overconfident. However, higher temperature also introduces more randomness in the classification itself.

### Sampling Strategies for Quality Monitoring

Monitoring all outputs is impractical; sampling strategies make quality assurance feasible:

**Random sampling**: Review a random 1-5% of outputs. This catches systematic issues but may miss rare failure modes. Minimum sample size: 100-200 for statistically meaningful accuracy estimates.

**Stratified sampling**: Sample proportionally from each output category. This ensures rare categories are represented in the quality review even if they constitute only 2-3% of outputs.

**Uncertainty sampling**: Prioritize reviewing outputs with low confidence scores. These are the most likely to be incorrect and the most informative for identifying prompt weaknesses.

**Adversarial sampling**: Specifically seek out edge cases — very short inputs, inputs with unusual formatting, inputs in unexpected languages — to test prompt robustness on the long tail.

## Why It Matters

### Small Error Rates Scale to Large Numbers

A 2% error rate is acceptable for 100 inputs (2 errors) but produces 20,000 errors at 1 million inputs. At scale, even minor systematic biases — such as consistently misclassifying a specific subtype — compound into significant data quality problems that affect downstream decision-making.

### Consistency Is Harder Than Accuracy

A model that is 95% accurate but inconsistent (sometimes classifying the same input differently) is less useful for analytics than one that is 90% accurate but perfectly consistent. Analytics and trend detection depend on consistent application of classification criteria over time.

### Prompt Degradation Is Invisible Without Monitoring

Unlike traditional software that fails loudly with errors, prompt degradation fails silently with slightly worse outputs. Without active monitoring, a prompt that was 92% accurate at deployment can drift to 78% accuracy over months as data distributions shift — and no one notices until the downstream impact becomes visible.

## Key Technical Details

- Batch-input processing (multiple items per API call) introduces ordering effects; limiting batches to 5-10 items reduces cross-contamination while maintaining efficiency.
- Structured output enforcement (JSON mode) reduces unparseable outputs from 1-3% to under 0.1% at scale.
- Label definitions with 2-3 examples per category reduce inter-annotator disagreement by 20-30% and improve prompt consistency proportionally.
- Distribution monitoring with weekly chi-squared tests detects classification drift within 1-2 weeks of onset, before downstream impact becomes significant.
- Calibrated confidence thresholds route 10-20% of inputs to human review (at 0.85 threshold) while catching 60-70% of misclassifications.
- Temperature 0 (greedy decoding) maximizes classification consistency but tends toward overconfidence; temperature 0.1-0.3 may improve calibration.
- Minimum sample sizes for statistically meaningful quality monitoring: 100-200 for overall accuracy, 50+ per category for per-category metrics.
- At scale, processing 100,000+ items, even 0.5% unparseable output rates produce 500+ failures requiring exception handling.

## Common Misconceptions

- **"If the prompt works on 50 test examples, it will work at scale."** Test sets are typically cleaner, more representative, and less diverse than production data. Edge cases, format variations, and distribution shifts at scale expose weaknesses invisible in small tests. Always test on a representative sample of at least 500-1,000 production inputs.

- **"Consistency issues are just accuracy issues."** A prompt can be accurate on average but inconsistent on individual examples — classifying the same input differently on different runs. Consistency requires temperature 0 or very low temperature and deterministic processing pipelines.

- **"Once deployed, the prompt doesn't need monitoring."** Data distributions shift over time (new product categories, changing customer language, seasonal patterns). A prompt designed for Q1 data may underperform on Q3 data. Continuous monitoring is essential.

- **"Higher accuracy always means better performance."** The cost of different error types varies. A false positive in fraud detection (blocking a legitimate transaction) has a different cost than a false negative (missing fraud). Optimization should account for the cost matrix, not just aggregate accuracy.

- **"Batch processing is always more efficient."** Batch processing saves API calls but introduces ordering effects, increases prompt complexity, and makes error handling more difficult. For high-stakes classification, single-input processing with its higher consistency may be worth the extra cost.

## Connections to Other Concepts

- `data-analysis-and-summarization.md` — Classification and extraction produce the structured data that analytical prompts consume for insight generation.
- `05-structured-output-and-format-control/json-mode-and-schema-enforcement.md` — Structured output is essential for parseable, machine-processable classification results at scale.
- `translation-and-multilingual-prompting.md` — Multilingual classification must account for quality variation and calibration differences across languages.
- `conversational-and-dialogue-design.md` — Intent classification in conversational systems is a real-time classification task with the additional constraint of multi-turn context.
- `04-system-prompts-and-instruction-design/behavioral-constraints-and-rules.md` — Classification guardrails (confidence thresholds, human review routing) are behavioral constraints applied at scale.

## Further Reading

- Wang, S., Sun, X., Li, X., Ouyang, R., Wu, F., Zhang, T., ... & Wang, H. (2023). "GPT-NER: Named Entity Recognition via Large Language Models." Analysis of extraction quality and consistency at scale using LLM prompting.
- Sun, L., Han, Y., Zhao, Z., Ma, D., Shen, Z., Chen, B., ... & Yin, J. (2023). "Text Classification via Large Language Models." Systematic evaluation of prompt-based classification strategies across multiple datasets.
- Gao, Y., Xiong, Y., Wang, D., Arik, S. O., & Pfister, T. (2024). "Efficient Large Language Models: A Survey." Covers batch processing and efficiency strategies for large-scale LLM inference.
- Ding, B., Qin, C., Liu, L., Chia, Y. K., Li, B., Joty, S., & Bing, L. (2023). "Is GPT-3 a Good Data Annotator?" Analysis of LLM labeling quality and consistency compared to human annotators.
