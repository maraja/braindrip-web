# Fairness in NLP

**One-Line Summary**: Fairness in NLP formalizes the requirement that language technologies perform equitably across demographic groups, using mathematical definitions that reveal fundamental trade-offs between competing notions of what "fair" means.

**Prerequisites**: `bias-in-nlp.md`, `text-classification.md`, `evaluation-metrics-for-nlp.md`, `named-entity-recognition.md`, `coreference-resolution.md`

## What Is Fairness in NLP?

Imagine a university admissions office that wants to be "fair." One definition says admit the same percentage from every demographic group (demographic parity). Another says among equally qualified applicants, accept at the same rate regardless of group (equalized odds). A third says treat similar individuals similarly regardless of group membership (individual fairness). These three definitions are all reasonable -- and mathematically incompatible in most real-world settings. You cannot satisfy all of them simultaneously.

Fairness in NLP brings this same tension into language technology. It goes beyond detecting bias (covered in `bias-in-nlp.md`) to defining what equitable performance means, measuring whether systems achieve it, and developing interventions to close gaps. The field draws heavily on the broader algorithmic fairness literature from machine learning but faces unique challenges: language is ambiguous, context-dependent, and culturally situated, making fairness definitions harder to operationalize than in structured prediction tasks like credit scoring or recidivism prediction.

## How It Works

### Formal Fairness Definitions

**Demographic Parity (Statistical Parity)**: A system satisfies demographic parity if its positive prediction rate is equal across protected groups. Formally: P(Y_hat = 1 | A = a) = P(Y_hat = 1 | A = b) for all groups a, b. In NLP, this might mean a resume screening system recommends the same percentage of candidates from each racial group. **Limitation**: Ignores base rates -- if qualified candidates are distributed unevenly, demographic parity forces either over- or under-selection.

**Equalized Odds**: A system satisfies equalized odds (Hardt et al., 2016) if the true positive rate and false positive rate are equal across groups: P(Y_hat = 1 | Y = 1, A = a) = P(Y_hat = 1 | Y = 1, A = b) and P(Y_hat = 1 | Y = 0, A = a) = P(Y_hat = 1 | Y = 0, A = b). This ensures that, among actually positive cases, all groups are detected at equal rates, and among actually negative cases, all groups are falsely flagged at equal rates. A relaxation, **equal opportunity**, requires only the TPR condition.

**Individual Fairness**: Dwork et al. (2012) proposed that similar individuals should be treated similarly: d(f(x), f(x')) <= L * d(x, x') for individuals x and x'. This requires a task-specific distance metric over individuals, which is itself difficult to define for text. Two resumes with similar qualifications but different names should receive similar scores.

**Predictive Parity (Calibration)**: Among all individuals predicted positive, the actual positive rate should be the same across groups: P(Y = 1 | Y_hat = 1, A = a) = P(Y = 1 | Y_hat = 1, A = b). This ensures the system's confidence is equally trustworthy across groups.

### The Impossibility Theorem

Chouldechova (2017) and Kleinberg et al. (2017) independently proved that when base rates differ between groups (P(Y = 1 | A = a) != P(Y = 1 | A = b)), a system cannot simultaneously satisfy demographic parity, equalized odds, and predictive parity -- except in the trivial case of a perfect or random classifier. This impossibility result means that fairness requires value judgments about which definition to prioritize in each context, and those judgments are inherently social and political, not purely technical.

### Fairness Metrics for NLP

**Performance Disparity**: The difference in a task metric (accuracy, F1, BLEU) across demographic groups. For example, a sentiment classifier with 93% accuracy on Standard American English but 81% on AAVE has a 12-point performance disparity.

**False Positive Equality Difference (FPED)**: The gap in false positive rates across groups. Critical for toxicity detection where false positives silence legitimate speech from minority communities.

**Equality of Opportunity Difference (EOD)**: The gap in true positive rates. Important for systems like resume screening where missing qualified candidates from a group constitutes harm.

**Counterfactual Fairness** (Kusner et al., 2017): A prediction is counterfactually fair if it would remain the same had the individual belonged to a different demographic group, holding other characteristics constant.

### Mitigation Strategies

**Pre-Processing**: Modify the training data before training. Counterfactual data augmentation (Zhao et al., 2018) creates balanced examples by swapping identity terms. Data resampling adjusts class/group proportions. Debiasing word embeddings (see `bias-in-nlp.md`) removes stereotypical associations from input representations.

**In-Processing**: Modify the training procedure. Adversarial debiasing (Zhang et al., 2018) adds a discriminator that tries to predict protected attributes from model representations, and the model is trained to minimize both task loss and discriminator accuracy. Constrained optimization adds fairness metrics as explicit constraints during training.

**Post-Processing**: Modify the model's outputs. Threshold adjustment sets different classification thresholds per group to equalize error rates. Hardt et al. (2016) showed this can achieve equalized odds with minimal accuracy loss (~1--2%). Calibration adjustment ensures predicted probabilities are equally meaningful across groups.

### Fairness Benchmarks

**CrowS-Pairs** (Nangia et al., 2020): 1,508 sentence pairs testing stereotypical vs. anti-stereotypical associations across 9 bias categories (gender, race, religion, age, etc.). A fair language model should assign equal probability to both sentences. BERT shows stereotypical preference in 57--70% of pairs depending on category.

**WinoBias** (Zhao et al., 2018): Tests gender bias in `coreference-resolution.md` with sentences like "The nurse told the doctor that she/he would be late." Systems must resolve the pronoun correctly regardless of gender stereotypes. BERT-based coreference systems show 10--20% accuracy gaps between pro-stereotypical and anti-stereotypical cases.

**StereoSet** (Nadeem et al., 2021): 17,000 examples measuring stereotypical associations in language models across four domains (gender, profession, race, religion). Reports both a Language Modeling Score (LMS) and a Stereotype Score (SS); an ideal model achieves high LMS and SS near 50%.

**BBQ (Bias Benchmark for QA)** (Parrish et al., 2022): 58,000 question-answering examples testing social bias in 9 categories, measuring whether models default to stereotypical answers when context is ambiguous.

## Why It Matters

1. **Regulatory compliance**: The EU AI Act classifies NLP systems used in hiring, education, and criminal justice as "high-risk," requiring fairness audits and documentation before deployment.
2. **User trust**: Systems perceived as unfair are rejected by users, particularly those from affected communities, undermining adoption and utility.
3. **Legal liability**: Disparate impact in employment decisions, even when unintentional, violates Title VII of the US Civil Rights Act. NLP-based screening tools that produce disparate outcomes face legal challenge.
4. **Avoiding harm feedback loops**: Unfair systems can create self-reinforcing cycles -- biased hiring tools reduce diversity, producing less diverse training data, producing more biased models.
5. **Scientific rigor**: Models that achieve high aggregate accuracy by performing well on majority groups while failing on minority groups are less robust and generalizable.

## Key Technical Details

- **WinoBias gap**: BERT-based coreference systems show 81% accuracy on pro-stereotypical examples vs. 63% on anti-stereotypical examples -- an 18-point gap.
- **CrowS-Pairs**: GPT-2 shows stereotypical preference in 56.4% of gender pairs, 62.3% of race pairs, and 66.7% of religion pairs.
- **StereoSet ideal scores**: A perfectly fair LM would score SS = 50% (no stereotypical preference) with LMS near 100% (high language quality). BERT scores SS ~60% and LMS ~84%.
- **Threshold adjustment cost**: Post-processing to achieve equalized odds typically reduces overall accuracy by 0.5--2% while reducing group-level TPR disparity from 10--15% to <2%.
- **Adversarial debiasing overhead**: Adds ~20--30% training time and requires careful hyperparameter tuning; Elazar and Goldberg (2018) showed that adversarial training often fails to fully remove demographic information from representations.
- **Impossibility in practice**: For a toxicity classifier where hate speech prevalence differs by 3x across demographic mentions, satisfying both equalized odds and predictive parity is mathematically impossible.

## Common Misconceptions

**"Fairness means treating everyone identically."** Identical treatment (fairness through unawareness -- simply removing protected attributes) is insufficient because proxy variables carry demographic information. Removing gender from text does not prevent a model from inferring gender from occupation, writing style, or name. Equitable outcomes often require group-aware interventions.

**"There is a single correct definition of fairness."** The impossibility theorem proves this is mathematically false. Different fairness definitions embody different values, and the appropriate choice depends on the application context, the stakeholders involved, and the potential harms of different error types. Fairness definition selection is a normative, not technical, decision.

**"Achieving fairness requires sacrificing accuracy."** The accuracy-fairness trade-off is real but often overstated. For well-calibrated models, post-processing to achieve equalized odds typically costs 0.5--2% aggregate accuracy. In many cases, fixing fairness issues also fixes genuine model errors (e.g., the model was exploiting demographic shortcuts rather than learning the actual task), improving robustness.

**"Fairness benchmarks comprehensively measure fairness."** CrowS-Pairs, WinoBias, and StereoSet test specific, limited aspects of bias. A model scoring well on these benchmarks may still exhibit bias in other dimensions (socioeconomic, disability, intersectional) or in other task settings not covered by existing benchmarks.

## Connections to Other Concepts

- `bias-in-nlp.md` documents the sources and types of bias that fairness frameworks aim to address -- bias diagnosis precedes fairness intervention.
- `text-classification.md` and `sentiment-analysis.md` are common tasks where fairness metrics (equalized odds, performance parity) are applied.
- `coreference-resolution.md` is directly tested by WinoBias for gender fairness.
- `named-entity-recognition.md` shows performance disparities across name demographics that fairness metrics quantify.
- `evaluation-metrics-for-nlp.md` provides the base metrics (F1, accuracy) that are disaggregated across groups to measure fairness.
- `responsible-nlp-development.md` describes the model cards and documentation practices that operationalize fairness audits.
- `privacy-in-nlp.md` intersects with fairness through the tension between collecting demographic data for fairness auditing and protecting individual privacy.
- `human-evaluation-for-nlp.md` is relevant because annotator demographics affect fairness in gold-standard labels.

## Further Reading

- Hardt et al., *Equality of Opportunity in Supervised Learning*, 2016 -- introduced equalized odds and the post-processing approach to achieving it.
- Chouldechova, *Fair Prediction with Disparate Impact: A Study of Bias in Recidivism Prediction Instruments*, 2017 -- proved the impossibility of simultaneously satisfying multiple fairness criteria.
- Zhao et al., *Gender Bias in Coreference Resolution: Evaluation and Debiasing Methods*, 2018 -- introduced WinoBias and counterfactual data augmentation for NLP fairness.
- Nangia et al., *CrowS-Pairs: A Challenge Dataset for Measuring Social Biases in Masked Language Models*, 2020 -- created a benchmark specifically for measuring stereotypical associations in LMs.
- Blodgett et al., *Language (Technology) Is Power: A Critical Survey of Bias in NLP*, 2020 -- critically examined how NLP papers define and operationalize bias and fairness.
- Dwork et al., *Fairness Through Awareness*, 2012 -- the foundational individual fairness framework requiring similar treatment for similar individuals.
