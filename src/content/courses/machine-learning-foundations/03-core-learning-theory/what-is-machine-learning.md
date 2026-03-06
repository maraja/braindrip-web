# What Is Machine Learning?

**One-Line Summary**: Learning patterns from data rather than programming rules explicitly -- the three paradigms and when each applies.

**Prerequisites**: Basic probability, basic linear algebra, programming fundamentals.

## What Is Machine Learning?

Imagine you want to build a spam filter. In traditional programming, you would sit down and write rules: "if the email contains 'free money,' mark it as spam." You would keep adding rules, patching edge cases, and maintaining an ever-growing list of heuristics. Machine learning flips this: instead of writing rules, you give the computer examples of spam and not-spam emails, and the algorithm *discovers* the rules itself.

More formally, Tom Mitchell (1997) defined machine learning as follows:

> A computer program is said to **learn** from experience $E$ with respect to some class of tasks $T$ and performance measure $P$, if its performance at tasks in $T$, as measured by $P$, improves with experience $E$.

This definition is precise and useful. For a spam filter: $T$ is classifying emails as spam or not, $P$ is the percentage correctly classified, and $E$ is the labeled training emails the system observes.

## How It Works

### Traditional Programming vs. Machine Learning

In traditional programming:

$$\text{Rules} + \text{Data} \rightarrow \text{Answers}$$

In machine learning:

$$\text{Data} + \text{Answers} \rightarrow \text{Rules (Model)}$$

This inversion is the core insight. Instead of encoding domain expertise as explicit instructions, ML systems extract statistical regularities from data.

### The Learning Pipeline

Every ML system follows a general pipeline:

1. **Data Collection**: Gather raw observations -- images, text, sensor readings, transactions.
2. **Feature Engineering / Representation**: Transform raw data into a numerical representation $\mathbf{x} \in \mathbb{R}^d$ that captures relevant information.
3. **Model Selection**: Choose a hypothesis class $\mathcal{H}$ -- the family of functions from which the algorithm will search for a solution.
4. **Training (Optimization)**: Find the function $h^* \in \mathcal{H}$ that minimizes some loss function $\mathcal{L}$ on the training data:

$$h^* = \arg\min_{h \in \mathcal{H}} \frac{1}{n} \sum_{i=1}^{n} \mathcal{L}(h(\mathbf{x}_i), y_i)$$

5. **Evaluation**: Measure performance on held-out data to estimate generalization.
6. **Deployment & Monitoring**: Serve predictions in production; detect distribution shift.

### The Three Paradigms

**Supervised Learning.** The training data consists of input-output pairs $\{(\mathbf{x}_i, y_i)\}_{i=1}^n$. The goal is to learn a mapping $f: \mathcal{X} \rightarrow \mathcal{Y}$. When $y$ is categorical, this is *classification*; when $y$ is continuous, it is *regression*. Examples: image recognition, medical diagnosis, house price prediction.

**Unsupervised Learning.** The training data consists of inputs only $\{\mathbf{x}_i\}_{i=1}^n$ with no labels. The goal is to discover hidden structure -- clusters, latent factors, density estimates, or low-dimensional representations. Examples: customer segmentation, topic modeling, anomaly detection.

**Reinforcement Learning.** An agent interacts with an environment, taking actions $a_t$ in states $s_t$, receiving rewards $r_t$, and learning a policy $\pi(s) \rightarrow a$ that maximizes cumulative reward $\sum_{t=0}^{T} \gamma^t r_t$. There are no labeled examples -- only a scalar reward signal. Examples: game playing, robotic control, recommendation systems.

### When ML Is Appropriate

ML is the right tool when:

- The problem has **patterns** that are difficult to articulate as rules.
- You have **sufficient data** to learn those patterns.
- The environment is **not fully deterministic** or is too complex for hand-coded solutions.
- You need the system to **adapt** over time as data changes.

ML is *not* appropriate when:

- Simple rules or heuristics solve the problem reliably.
- You have no data or extremely little data (fewer than dozens of examples for simple tasks).
- The problem requires **guaranteed correctness** (e.g., safety-critical control with known physics).
- The cost of errors is catastrophic and the model cannot be validated thoroughly.

### A Concrete Example: House Price Prediction

Consider predicting house prices. In a traditional approach, an expert might write: "Price = $200 per square foot, plus $50,000 per bedroom, minus $10,000 if no garage." These hand-crafted rules are brittle and miss complex interactions.

With ML, you provide a dataset of past sales: $\{(\mathbf{x}_i, y_i)\}$ where $\mathbf{x}_i$ encodes features (square footage, bedrooms, location, age, etc.) and $y_i$ is the sale price. A learning algorithm -- say, gradient-boosted trees -- discovers non-linear relationships automatically: perhaps an extra bedroom adds value in suburbs but not in studio-heavy urban markets, or proximity to transit matters more than lot size for condos. The model captures interactions and non-linearities that no human would enumerate.

### The Role of Data Quality

The pipeline above assumes clean, representative data. In practice:

- **Sampling bias** means the training distribution $P_{\text{train}}$ differs from the deployment distribution $P_{\text{deploy}}$. A model trained on urban housing data will perform poorly in rural markets.
- **Label noise** corrupts $y_i$ values. If 5% of house prices in the dataset are data entry errors, the model may learn to reproduce those errors.
- **Missing features** mean important information is absent from $\mathbf{x}$. If school district quality is not included but strongly affects price, no model can capture that relationship.

Data quality often matters more than model sophistication. As practitioners say: "garbage in, garbage out."

## Why It Matters

ML has moved from an academic curiosity to the engine behind search engines, recommendation systems, autonomous vehicles, drug discovery, and language models. Understanding what ML is -- and what it is not -- is the foundation for every other concept in this course. Without this framing, techniques like regularization and loss functions are solutions without a problem statement.

## Key Technical Details

- **Hypothesis class** $\mathcal{H}$ determines the expressiveness of the model. Too small and you underfit; too large and you overfit.
- **Inductive bias** is the set of assumptions a learning algorithm uses to generalize beyond training data. Every algorithm has one.
- The **No Free Lunch Theorem** (Wolpert, 1996) states that no single algorithm is universally best across all possible problems -- assumptions must match the data.
- **Generalization** -- performing well on unseen data -- is the central goal, not memorizing training examples.
- The **i.i.d. assumption** (independent and identically distributed) underpins most classical ML theory: training and test data are drawn from the same distribution.

## Common Misconceptions

- **"ML is just statistics."** ML draws heavily from statistics but also from optimization, computer science, and information theory. The emphasis on prediction, scalability, and computation distinguishes it from classical statistics.
- **"More data always helps."** More *relevant, high-quality* data helps. Noisy, biased, or redundant data can hurt performance or waste resources.
- **"ML models understand the data."** Current ML models find statistical correlations. They do not possess semantic understanding in the way humans do.
- **"Deep learning has replaced all other ML."** For tabular data, gradient-boosted trees often outperform deep learning. The right tool depends on the problem.
- **"You need big data for ML."** Some methods (Bayesian approaches, Gaussian processes) work well with small datasets by incorporating strong priors. "Big data" is needed for complex, high-dimensional tasks with weak inductive bias.

## Connections to Other Concepts

- **Types of Machine Learning**: A detailed breakdown of the supervised, unsupervised, and RL paradigms introduced here.
- **Bias-Variance Tradeoff**: Formalizes the tension between hypothesis class complexity and generalization.
- **Empirical Risk Minimization**: The theoretical framework that justifies the training optimization in step 4 of the pipeline.
- **Loss Functions**: The specific choice of $\mathcal{L}$ in the training objective determines what the model optimizes for.
- **Overfitting and Underfitting**: The practical failure modes that arise when the pipeline goes wrong.
- **Regularization**: Constraining hypothesis complexity to improve generalization, directly implementing the inductive bias principle.
- **Curse of Dimensionality**: Explains why ML becomes harder as the number of features grows and data becomes sparse.

## Further Reading

- Mitchell, T., *Machine Learning* (1997) -- The classic textbook that formalized the definition used here.
- Bishop, C., *Pattern Recognition and Machine Learning* (2006) -- Comprehensive treatment of the probabilistic perspective.
- Abu-Mostafa, Y., Magdon-Ismail, M., Lin, H., *Learning from Data* (2012) -- Excellent introduction to the theoretical foundations.
- Shalev-Shwartz, S. & Ben-David, S., *Understanding Machine Learning: From Theory to Algorithms* (2014) -- Rigorous yet accessible theoretical treatment.
