# Responsible AI and Fairness

**One-Line Summary**: Measuring and mitigating bias, ensuring transparency, and building ML systems that are accountable and equitable.

**Prerequisites**: Classification metrics, probability distributions, model evaluation, basic ethics reasoning.

## What Is Responsible AI?

Imagine a hiring algorithm that screens resumes. It was trained on a decade of hiring data from a company that historically favored certain demographics. The model learns these historical patterns and perpetuates them -- not because it was programmed to discriminate, but because it learned discrimination from the data. The model is accurate (it predicts who *was* hired) but not fair (it excludes who *should be* hired).

Responsible AI is the discipline of designing, building, and deploying ML systems that are fair, transparent, accountable, and aligned with human values. It recognizes that ML models are not neutral: they encode the biases present in their training data, the choices made by their designers, and the objectives they are optimized for. Responsible AI provides the frameworks and tools to identify, measure, and mitigate these issues.

## How It Works

### Sources of Bias

Bias enters ML systems at every stage:

**Historical Bias**: The training data reflects past societal inequities. A criminal recidivism model trained on arrest data inherits policing biases, since arrest rates correlate with enforcement patterns, not just criminal behavior.

**Representation Bias**: Certain groups are underrepresented in the training data. A facial recognition system trained primarily on lighter-skinned faces performs worse on darker-skinned faces -- not because the algorithm is inherently biased, but because it had fewer examples to learn from.

**Measurement Bias**: The features or labels used as proxies are imperfect and systematically different across groups. Using zip code as a feature can proxy for race due to residential segregation.

**Aggregation Bias**: A single model is applied to groups with fundamentally different data-generating processes. A diabetes prediction model trained on a combined population may perform poorly for specific ethnic groups with different risk profiles.

### Fairness Metrics

There is no single definition of fairness. Several mathematically precise definitions exist, and they are often mutually incompatible.

**Demographic Parity (Statistical Parity)**: The selection rate should be equal across groups.

$$P(\hat{Y}=1 | A=a) = P(\hat{Y}=1 | A=b) \quad \forall \, a, b$$

where $A$ is the protected attribute. Limitation: ignores actual qualification differences between groups.

**Equalized Odds**: True positive rates and false positive rates should be equal across groups.

$$P(\hat{Y}=1 | Y=y, A=a) = P(\hat{Y}=1 | Y=y, A=b) \quad \forall \, y, a, b$$

This means the model makes errors at the same rate regardless of group membership.

**Calibration**: Among individuals assigned a predicted probability $p$, the actual outcome rate should be $p$, regardless of group.

$$P(Y=1 | \hat{p}=s, A=a) = s \quad \forall \, s, a$$

### The Impossibility Theorem

Chouldechova (2017) and Kleinberg et al. (2016) proved that except in degenerate cases, **demographic parity, equalized odds, and calibration cannot all hold simultaneously** when base rates differ between groups:

$$P(Y=1 | A=a) \neq P(Y=1 | A=b) \implies \text{at most one fairness criterion can be satisfied}$$

This means fairness is not a checkbox -- it requires deliberate choices about which definition is most appropriate for a given context. A lending model might prioritize calibration (predicted probabilities should be accurate), while a hiring model might prioritize equalized odds (equal error rates across groups).

### Bias Mitigation Strategies

**Pre-processing**: Modify the training data to remove bias before training.
- Resampling to balance representation across groups.
- Relabeling data points near the decision boundary.
- Learning fair representations that encode useful information but not group membership.

**In-processing**: Modify the training algorithm to incorporate fairness constraints.
- Add a regularization term that penalizes fairness violations:

$$\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{task}} + \lambda \cdot \mathcal{L}_{\text{fairness}}$$

- Adversarial debiasing: train an adversary to predict the protected attribute from model predictions; the model is penalized when the adversary succeeds.

**Post-processing**: Adjust the model's predictions after training.
- Apply group-specific thresholds to equalize error rates.
- Calibrate predictions separately for each group.

Each approach has tradeoffs: pre-processing is model-agnostic but may discard useful signal; in-processing is principled but requires algorithm modification; post-processing is simple but may reduce overall accuracy.

### Explainability

Fairness requires transparency -- stakeholders must understand *why* a model makes its decisions.

**SHAP (SHapley Additive exPlanations)**: Based on cooperative game theory, SHAP assigns each feature an importance value for each prediction:

$$\phi_i = \sum_{S \subseteq N \setminus \{i\}} \frac{|S|!(|N|-|S|-1)!}{|N|!} \left[f(S \cup \{i\}) - f(S)\right]$$

SHAP values have desirable theoretical properties (local accuracy, consistency, missingness) and can reveal whether protected attributes or their proxies drive predictions.

**LIME (Local Interpretable Model-agnostic Explanations)**: Fits a simple, interpretable model (e.g., linear regression) around a specific prediction to explain it locally. Fast and model-agnostic but can be unstable.

**Feature Importance**: Global measures of which features the model relies on most. Useful for identifying proxy variables (e.g., zip code proxying for race).

### Model Cards

A model card is a standardized documentation format for ML models, proposed by Mitchell et al. (2019). It includes:

- Model details (architecture, training data, intended use).
- Performance metrics broken down by demographic subgroups.
- Ethical considerations and known limitations.
- Recommended use cases and out-of-scope applications.

Model cards make accountability concrete by requiring developers to explicitly state what a model should and should not be used for.

### AI Governance and Regulation

**EU AI Act**: The first comprehensive AI regulation. Classifies AI systems by risk level:
- *Unacceptable risk*: Social scoring, real-time biometric surveillance (banned).
- *High risk*: Hiring, credit scoring, law enforcement (heavy requirements for transparency, human oversight, auditing).
- *Limited risk*: Chatbots (transparency obligations).
- *Minimal risk*: Spam filters (no requirements).

**Organizational governance**: Internal review boards, fairness audits, red-teaming exercises, and incident response plans for AI-related harms.

## Why It Matters

ML systems increasingly make decisions that affect people's lives: who gets a loan, who gets hired, who gets paroled, what medical treatment is recommended. Without deliberate attention to fairness, these systems amplify historical biases at unprecedented scale and speed. Responsible AI is not just an ethical imperative -- it is a legal requirement in many jurisdictions and a business necessity as stakeholders demand accountability.

## Key Technical Details

- **Intersectionality**: Fairness metrics computed on single protected attributes miss compounded disadvantages. A model may be fair for women and fair for minorities but unfair for minority women specifically.
- **Proxy features**: Removing the protected attribute from features does not eliminate bias. Correlated features (zip code, name, education) can proxy for protected attributes. This is called "fairness through unawareness" and it does not work.
- **Tradeoff quantification**: Measure the accuracy cost of each fairness constraint. Often the tradeoff is small (1-2% accuracy) for significant fairness improvement.
- **Dynamic fairness**: Fairness must be monitored continuously, not just at training time. Data drift can introduce new biases post-deployment.

## Common Misconceptions

- **"Removing protected attributes from the data makes the model fair."** Proxy variables carry the same information. A model without race as a feature can still discriminate via zip code, income, and education.
- **"Fairness and accuracy are always at odds."** The tradeoff is often smaller than expected. Some debiasing techniques even improve accuracy by reducing overfitting to spurious correlations.
- **"AI is objective because it uses math."** The math is only as good as the data and objectives chosen by humans. Every design choice -- from data collection to loss function to evaluation metric -- embeds human values.
- **"One fairness metric is enough."** Different stakeholders have legitimate but conflicting notions of fairness. The impossibility theorem means you must choose, and that choice should be made transparently.

## Connections to Other Concepts

- `model-deployment-and-serving.md`: Fairness audits should be a deployment gate. Model cards should accompany every production model.
- `data-drift-and-model-monitoring.md`: Monitoring must include fairness metrics broken down by demographic subgroups, not just aggregate performance.
- `ab-testing-for-ml.md`: A/B tests should measure fairness impact, not just overall business metrics. A model that improves revenue but disproportionately harms a subgroup is not a net positive.
- `experiment-tracking.md`: Log fairness metrics alongside standard metrics for every training run. Make disparities visible from the start.

## Further Reading

- Mitchell et al., "Model Cards for Model Reporting" (2019) -- The foundational paper on standardized model documentation.
- Barocas, Hardt, and Narayanan, "Fairness and Machine Learning" (2023) -- The comprehensive textbook on algorithmic fairness (freely available online).
- Chouldechova, "Fair Prediction with Disparate Impact: A Study of Bias in Recidivism Prediction Instruments" (2017) -- Proves the impossibility of satisfying multiple fairness criteria simultaneously.
- Ribeiro et al., "Why Should I Trust You? Explaining the Predictions of Any Classifier" (2016) -- The LIME paper on local model explanations.
