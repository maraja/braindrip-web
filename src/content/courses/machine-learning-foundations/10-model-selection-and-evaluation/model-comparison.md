# Model Comparison

**One-Line Summary**: Paired t-tests, McNemar's test, and Wilcoxon signed-rank -- determining if performance differences are real or noise.

**Prerequisites**: Cross-validation, hypothesis testing, classification metrics, regression metrics.

## What Is Model Comparison?

Imagine two weather forecasting systems. System A achieves 85.2% accuracy and System B achieves 84.7% accuracy on the same test set. Is A genuinely better, or is the difference just a lucky draw of test examples? Without statistical rigor, we might confidently deploy A when the difference is mere noise -- or dismiss B when it is actually superior on the broader population. Model comparison provides the statistical machinery to answer: "Is this performance difference real?"

Formally, given two models $f_A$ and $f_B$ evaluated on the same data, we test the null hypothesis $H_0: E[L_A] = E[L_B]$ (the models have equal expected performance) against the alternative $H_1: E[L_A] \neq E[L_B]$.

## How It Works

### Why Comparing Means Is Not Enough

Suppose 5-fold CV produces accuracy estimates for two models:

| Fold | Model A | Model B |
|---|---|---|
| 1 | 0.87 | 0.85 |
| 2 | 0.83 | 0.86 |
| 3 | 0.86 | 0.84 |
| 4 | 0.85 | 0.83 |
| 5 | 0.84 | 0.87 |

Mean: A = 0.850, B = 0.850. Yet looking fold-by-fold, sometimes A wins, sometimes B wins. Even with different means, the **variability** of the estimates determines whether the difference is significant. We need a test that accounts for this variability.

### Paired t-Test on CV Folds

The most straightforward approach: compute the difference $d_k = L_A^{(k)} - L_B^{(k)}$ for each fold $k$, then test whether the mean difference $\bar{d}$ is significantly different from zero.

$$t = \frac{\bar{d}}{s_d / \sqrt{K}}$$

where $s_d$ is the standard deviation of the $d_k$ values and $K$ is the number of folds. Under $H_0$, $t$ follows a $t$-distribution with $K - 1$ degrees of freedom.

**Problem**: The fold-level estimates $d_k$ are not independent because training sets overlap across folds. This violates the independence assumption of the t-test, inflating the Type I error rate (falsely declaring significance).

### Corrected Resampled t-Test (Nadeau & Bengio)

Nadeau & Bengio (2003) proposed a correction that adjusts the variance estimate to account for the training set overlap:

$$t = \frac{\bar{d}}{\sqrt{\left(\frac{1}{K} + \frac{n_{\text{test}}}{n_{\text{train}}}\right) \hat{\sigma}^2}}$$

where $n_{\text{test}}$ and $n_{\text{train}}$ are the sizes of the test and training sets in each fold, and $\hat{\sigma}^2$ is the variance of the fold-level differences:

$$\hat{\sigma}^2 = \frac{1}{K - 1} \sum_{k=1}^{K} (d_k - \bar{d})^2$$

This correction reduces the false positive rate substantially compared to the naive paired t-test. For $5 \times 2$ CV (5 repetitions of 2-fold CV), a specific variant known as the **$5 \times 2$ CV paired t-test** is recommended.

### McNemar's Test (Classification)

McNemar's test operates on the **predictions themselves** rather than on aggregate metrics. It uses a 2x2 contingency table of how two classifiers differ on individual test examples:

|  | B Correct | B Incorrect |
|---|---|---|
| **A Correct** | $n_{00}$ | $n_{01}$ |
| **A Incorrect** | $n_{10}$ | $n_{11}$ |

Only the **discordant pairs** ($n_{01}$ and $n_{10}$) carry information about which model is better. Under $H_0$:

$$\chi^2 = \frac{(|n_{01} - n_{10}| - 1)^2}{n_{01} + n_{10}}$$

which follows a $\chi^2$ distribution with 1 degree of freedom (the $-1$ is a continuity correction).

**Advantages**: Does not require cross-validation (works on a single test set), avoids the independence issues of paired t-tests on CV folds, and is more powerful when the number of test examples is large.

### Wilcoxon Signed-Rank Test (Non-Parametric)

When fold-level differences are not normally distributed, the Wilcoxon signed-rank test is a robust alternative. It ranks the absolute differences $|d_k|$, assigns signs, and tests whether the sum of positive ranks equals the sum of negative ranks.

**Procedure**:
1. Compute differences $d_k = L_A^{(k)} - L_B^{(k)}$.
2. Discard any $d_k = 0$.
3. Rank the $|d_k|$ values from smallest to largest.
4. Compute $W^+ = \sum_{\text{ranks where } d_k > 0} \text{rank}_k$ and $W^- = \sum_{\text{ranks where } d_k < 0} \text{rank}_k$.
5. The test statistic is $W = \min(W^+, W^-)$.

Under $H_0$, $W$ has a known distribution. For large $K$, a normal approximation applies.

### Friedman Test (Comparing Multiple Models)

When comparing $M > 2$ models across $K$ datasets (or folds), the Friedman test is a non-parametric alternative to repeated-measures ANOVA. For each fold, models are ranked from best to worst. The test statistic evaluates whether the average ranks differ significantly:

$$\chi_F^2 = \frac{12K}{M(M+1)} \left[ \sum_{j=1}^{M} R_j^2 - \frac{M(M+1)^2}{4} \right]$$

where $R_j$ is the average rank of model $j$.

If the Friedman test is significant, **post-hoc pairwise tests** determine which specific pairs differ.

### Nemenyi Post-Hoc Test

After a significant Friedman test, the Nemenyi test checks all pairwise comparisons. Two models are significantly different if their average rank difference exceeds the critical difference:

$$CD = q_\alpha \sqrt{\frac{M(M+1)}{6K}}$$

where $q_\alpha$ is the critical value from the Studentized range distribution. Results are often visualized in a **critical difference diagram**, where models connected by a horizontal bar are not significantly different.

### Effect Sizes

Statistical significance alone can be misleading -- with enough data, even tiny differences become significant. **Effect size** measures the practical magnitude of the difference:

$$\text{Cohen's } d = \frac{\bar{d}}{s_d}$$

Rules of thumb: $d < 0.2$ is small, $0.2 \leq d < 0.8$ is medium, $d \geq 0.8$ is large. Always report effect sizes alongside p-values.

## Why It Matters

In machine learning research and practice, model comparisons are made constantly -- on Kaggle leaderboards, in papers, and in production A/B tests. Without statistical tests, we cannot distinguish genuine improvements from noise. This leads to wasted engineering effort on "improvements" that do not generalize, or publication of results that do not replicate.

## Key Technical Details

- **Multiple comparisons**: When comparing many model pairs, apply corrections (Bonferroni, Holm) to control the family-wise error rate.
- **Power**: McNemar's test has higher statistical power than paired t-tests on CV folds for large test sets because it uses individual predictions rather than fold aggregates.
- **Assumptions matter**: The paired t-test assumes normally distributed differences. When in doubt, use the Wilcoxon signed-rank test.
- **Practical significance vs. statistical significance**: A 0.1% accuracy improvement may be statistically significant on a large test set but practically meaningless. Always report effect sizes.

## Common Misconceptions

- **"The model with higher cross-validation accuracy is always better."** Without a statistical test, you cannot know whether the difference is due to chance. Fold-level variance can be substantial.
- **"A paired t-test on CV folds is valid."** The standard paired t-test underestimates variance because CV folds share training data. Use the corrected resampled t-test or McNemar's test.
- **"p < 0.05 means the improvement matters."** Statistical significance says the difference is unlikely due to chance, not that it is large enough to care about. Report effect sizes and confidence intervals.
- **"You need cross-validation for model comparison."** McNemar's test works on a single train/test split and avoids the dependence issues of CV-based tests entirely.

## Connections to Other Concepts

- **Cross-Validation**: Produces the fold-level estimates that feed into paired tests.
- **Classification Metrics / Regression Metrics**: The metrics being compared (accuracy, RMSE, etc.).
- **Hyperparameter Tuning**: After tuning, statistical tests verify that the tuned model genuinely outperforms alternatives.
- **Learning Curves**: Provide visual context for where models differ and whether the gap is narrowing or widening.
- **Calibration**: Two models may have similar accuracy but very different calibration quality; compare calibration metrics too.

## Further Reading

- Demsar, "Statistical Comparisons of Classifiers over Multiple Data Sets" (2006) -- Definitive guide to Friedman test, Nemenyi test, and critical difference diagrams.
- Nadeau & Bengio, "Inference for the Generalization Error" (2003) -- Corrected resampled t-test for cross-validation.
- Dietterich, "Approximate Statistical Tests for Comparing Supervised Classification Learning Algorithms" (1998) -- Comprehensive comparison of McNemar's test, paired t-test, and 5x2 CV test.
