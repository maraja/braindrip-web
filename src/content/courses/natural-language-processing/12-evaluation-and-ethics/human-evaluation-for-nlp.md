# Human Evaluation for NLP

**One-Line Summary**: Human evaluation remains the gold standard for assessing NLP system quality, using structured protocols with trained annotators to judge dimensions -- fluency, adequacy, coherence -- that automated metrics cannot reliably capture.

**Prerequisites**: `evaluation-metrics-for-nlp.md`, `text-generation.md`, `machine-translation.md`, `text-summarization.md`, `data-annotation-and-labeling.md`

## What Is Human Evaluation for NLP?

Imagine tasting wine. A chemical analysis can measure sugar content, acidity, and tannin levels (analogous to automated metrics), but only a human taster can judge whether the wine is actually enjoyable, well-balanced, and worth recommending. Similarly, automated metrics like BLEU and ROUGE measure surface-level properties of text, but only human evaluators can reliably judge whether a translation is faithful, a summary is useful, or a chatbot response is helpful.

Human evaluation is the process of having people read, compare, or rate NLP system outputs according to defined criteria. It is simultaneously the most trusted form of evaluation and the most expensive, slowest, and hardest to reproduce. Every automated metric is ultimately validated by how well it correlates with human judgments, making human evaluation the anchor of the entire evaluation ecosystem.

## How It Works

### Rating Scales

**Likert Scales**: Annotators rate outputs on a fixed ordinal scale, typically 1--5 or 1--7. For example, a fluency Likert scale might define 1 = "incomprehensible," 3 = "understandable but awkward," 5 = "perfectly natural." Likert scales are simple to implement but suffer from annotator calibration drift -- one person's "4" may be another's "3."

**Direct Assessment (DA)**: Graham et al. (2013) introduced continuous scoring on a 0--100 scale, producing finer-grained judgments. DA has become the standard for WMT human evaluation campaigns. Annotators see a reference and a candidate, then move a slider to indicate quality. Scores are standardized per annotator (z-scores) to control for individual scale usage.

**Pairwise Comparison**: Annotators choose which of two outputs (system A vs. system B) is better, or declare a tie. This eliminates calibration issues since annotators only make relative judgments. Pairwise comparison requires O(n^2) comparisons for n systems but can be made efficient with TrueSkill or Bradley-Terry models that infer global rankings from sparse pairwise data.

**Best-Worst Scaling (BWS)**: Annotators see 3--5 outputs and select the best and worst. Louviere et al. (2015) showed BWS produces more reliable ratings than Likert scales with fewer annotations. Each annotation provides two data points (best and worst) rather than one, improving efficiency by roughly 2x.

### Inter-Annotator Agreement

Measuring whether annotators agree is critical for establishing reliability:

- **Cohen's Kappa**: Agreement between two annotators, corrected for chance. Kappa = (p_o - p_e) / (1 - p_e), where p_o is observed agreement and p_e is chance agreement. Kappa > 0.80 = almost perfect; 0.60--0.80 = substantial; 0.40--0.60 = moderate.
- **Fleiss' Kappa**: Extends Cohen's kappa to three or more annotators. Commonly used in crowdsourcing where each item gets multiple annotators.
- **Krippendorff's Alpha**: The most general agreement metric, handling any number of annotators, missing data, and ordinal/interval/ratio scales. Alpha > 0.80 is considered reliable; 0.67--0.80 allows tentative conclusions.

Typical inter-annotator agreement in NLP: adequacy evaluation achieves kappa ~0.55--0.70; fluency achieves ~0.50--0.65; open-ended generation quality achieves only ~0.30--0.50, reflecting genuine subjectivity.

### Evaluation Dimensions for Generation Tasks

**Adequacy/Faithfulness**: Does the output preserve the meaning of the source (in MT) or the key information (in summarization)? Rated on a 1--5 scale or via binary factual consistency checks.

**Fluency**: Is the output grammatically correct and natural-sounding? Fluency is now often near-ceiling for neural systems, making it less discriminative than adequacy.

**Informativeness**: Does the output contain sufficient relevant information? Particularly important for `text-summarization.md` and `question-answering.md`.

**Coherence**: Does the text flow logically from sentence to sentence? Critical for `text-generation.md` and multi-sentence outputs.

**MOS (Mean Opinion Score)**: For `automatic-speech-recognition.md` and `text-to-speech.md`, listeners rate speech quality on a 1--5 scale (1 = bad, 5 = excellent). MOS has been the speech quality standard since the 1990s. Modern neural TTS systems like WaveNet achieve MOS scores of 4.2--4.5 compared to natural speech at 4.5--4.8.

### Annotator Challenges

**Fatigue**: Annotation quality degrades after 60--90 minutes of continuous work. Standard practice caps sessions at 1 hour with breaks, and uses attention-check items to detect degraded performance.

**Bias**: Annotators may favor fluent-sounding outputs even when they contain factual errors (fluency bias), prefer longer outputs (length bias), or be influenced by output ordering (position bias). Randomizing presentation order and using blind evaluation protocols mitigate these effects.

**Expertise**: Some tasks (medical NLP, legal NLP) require domain expert annotators, while others can use crowdworkers. Expert annotation costs $50--$200/hour vs. crowdworker rates of $10--$20/hour, but expert judgments show higher agreement and fewer errors.

## Why It Matters

1. **Metric validation**: Every automated metric is calibrated against human judgments. If BLEU does not correlate with human quality assessments, it fails as a metric. Human evaluation is the foundation that supports the entire automated metric ecosystem.
2. **Capturing what metrics miss**: Factual correctness, coherence across paragraphs, pragmatic appropriateness, and cultural sensitivity are dimensions that no current automated metric reliably measures.
3. **High-stakes deployment**: In clinical NLP, legal applications, and customer-facing systems, human evaluation is often required before deployment to ensure safety and quality.
4. **Advancing the field**: The WMT shared tasks, which have driven machine translation research for nearly two decades, rely on large-scale human evaluation campaigns involving hundreds of annotators.
5. **LLM evaluation**: With the rise of `gpt-for-nlp-tasks.md` and open-ended generation, human evaluation has become more important, not less, because existing automated metrics were designed for constrained tasks.

## Key Technical Details

- **WMT human evaluation**: Annually evaluates ~150 MT systems across 15+ language pairs using Direct Assessment with ~1,000 annotators and ~500,000 individual judgments.
- **Cost estimates**: Professional human evaluation for a single MT system on one language pair costs $2,000--$5,000. Crowdsourced evaluation via Amazon Mechanical Turk costs $500--$1,500 for the same scope.
- **Chatbot Arena** (Zheng et al., 2023): Uses pairwise comparison with crowdsourced human judges; over 500,000 votes have been collected, producing Elo ratings that are considered the most reliable LLM quality ranking.
- **Sample sizes**: A minimum of 100--200 evaluated outputs is typically needed for statistically significant system-level differences. Sentence-level significance requires 500+ items.
- **Annotation speed**: Experienced annotators evaluate ~20--40 sentences per hour for DA, or ~30--50 pairwise comparisons per hour.
- **LLM-as-judge**: Using GPT-4 or Claude as automated evaluators achieves ~80--85% agreement with human annotators on pairwise comparisons, offering a middle ground between automated metrics and full human evaluation.

## Common Misconceptions

**"Human evaluation is objective and unbiased."** Human judges bring substantial subjectivity, cultural assumptions, and cognitive biases. Agreement rates of 0.30--0.50 kappa on generation quality show that even trained annotators frequently disagree. Robust human evaluation requires multiple annotators and statistical aggregation.

**"Crowdsourced evaluation is as reliable as expert evaluation."** For straightforward tasks (fluency, grammaticality), crowdworkers perform comparably to experts. But for tasks requiring domain knowledge (medical text quality, legal accuracy) or nuanced judgment (pragmatic appropriateness, cultural sensitivity), expert annotators are necessary and produce significantly higher agreement.

**"Human evaluation gives a single 'correct' score."** The same output can be rated differently depending on the evaluator's background, the evaluation criteria, and even the time of day. Human evaluation produces a distribution of judgments, not a point estimate. Reporting means without confidence intervals or agreement statistics is misleading.

**"Automated metrics will soon replace human evaluation."** Despite significant progress with learned metrics (COMET, BERTScore) and LLM-as-judge, human evaluation remains irreplaceable for novel tasks, open-ended generation, and safety-critical applications. Each new metric still needs validation against human judgments.

## Connections to Other Concepts

- `evaluation-metrics-for-nlp.md` covers the automated metrics that are calibrated against and validated by human judgments.
- `intrinsic-vs-extrinsic-evaluation.md` discusses where human evaluation fits in the broader evaluation landscape -- it is the ultimate extrinsic measure.
- `machine-translation.md` has the longest tradition of systematic human evaluation through the WMT shared tasks.
- `text-summarization.md` uses human evaluation for factual consistency, coherence, and informativeness.
- `text-generation.md` and `dialogue-systems.md` depend heavily on human evaluation because generation quality is inherently subjective.
- `data-annotation-and-labeling.md` shares annotation methodology -- rating scales, agreement metrics, crowdsourcing -- with human evaluation.
- `bias-in-nlp.md` is relevant because annotator demographics and biases directly affect human evaluation outcomes.
- `text-to-speech.md` uses MOS scores as its primary human evaluation metric.

## Further Reading

- Graham et al., *Continuous Measurement Scales in Human Evaluation of Machine Translation*, 2013 -- introduced Direct Assessment, now the WMT standard.
- Louviere et al., *Best-Worst Scaling: Theory and Methods*, 2015 -- established BWS as a more reliable alternative to Likert scales for subjective evaluation.
- Novikova et al., *Why We Need New Evaluation Metrics for NLG*, 2017 -- showed that existing automated metrics correlate poorly with human judgments for natural language generation.
- van der Lee et al., *Best Practices for the Human Evaluation of Automatically Generated Text*, 2019 -- a comprehensive survey of human evaluation methodology and common pitfalls.
- Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*, 2023 -- introduced Elo-based pairwise evaluation and LLM-as-judge, now the de facto standard for LLM evaluation.
- Clark et al., *All That's 'Human' Is Not Gold: Evaluating Human Evaluation of Generated Text*, 2021 -- critical analysis of human evaluation reliability and its implications for NLP research.
