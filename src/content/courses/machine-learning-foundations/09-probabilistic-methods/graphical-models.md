# Graphical Models

**One-Line Summary**: Bayesian networks and Markov random fields representing conditional dependencies as graphs -- structured probabilistic reasoning.

**Prerequisites**: Probability theory, conditional independence, Bayes' theorem, graph theory basics.

## What Is a Graphical Model?

Imagine trying to reason about the weather, whether your lawn sprinkler is on, and whether the grass is wet. These variables are not independent -- rain affects wet grass, the sprinkler affects wet grass, and your decision to turn on the sprinkler depends on whether it is cloudy. A graphical model represents these relationships as a graph, where **nodes** are random variables and **edges** encode statistical dependencies. The graph structure tells you which variables directly influence which others, and -- critically -- which variables are conditionally independent.

Graphical models provide a language for compactly representing high-dimensional joint distributions by exploiting conditional independence structure. They come in two main flavors: **directed** (Bayesian networks) and **undirected** (Markov random fields).

## How It Works

### Directed Graphical Models (Bayesian Networks)

A Bayesian network is a directed acyclic graph (DAG) where each node $X_i$ has a conditional probability distribution given its parents $\text{Pa}(X_i)$. The joint distribution factorizes as:

$$p(X_1, X_2, \ldots, X_n) = \prod_{i=1}^{n} p(X_i \mid \text{Pa}(X_i))$$

This factorization can dramatically reduce the number of parameters. A joint distribution over $n$ binary variables requires $2^n - 1$ parameters in general, but a Bayesian network with sparse connectivity requires far fewer.

**Example (Sprinkler Network)**:

$$p(C, S, R, W) = p(C) \cdot p(S \mid C) \cdot p(R \mid C) \cdot p(W \mid S, R)$$

where $C$ = Cloudy, $S$ = Sprinkler, $R$ = Rain, $W$ = Wet Grass. The graph encodes that $S$ and $R$ are independent given $C$ (they share a common cause), but become dependent when $W$ is observed (explaining away).

### Conditional Independence and D-Separation

The graph structure implies conditional independence relations via **d-separation**. Three canonical structures govern information flow in DAGs:

- **Chain**: $A \to B \to C$. Observing $B$ blocks information flow: $A \perp\!\!\!\perp C \mid B$.
- **Fork**: $A \leftarrow B \to C$. Observing the common cause $B$ blocks flow: $A \perp\!\!\!\perp C \mid B$.
- **Collider (V-structure)**: $A \to B \leftarrow C$. $A$ and $B$'s parents are marginally independent, but *conditioning on* $B$ (or its descendants) opens the path: $A \not\!\perp\!\!\!\perp C \mid B$.

Two nodes are d-separated given a set $Z$ if every undirected path between them is blocked by $Z$ according to these rules. D-separation implies conditional independence in the distribution.

### Undirected Graphical Models (Markov Random Fields)

A Markov Random Field (MRF) uses an undirected graph. The joint distribution factorizes over **cliques** (fully connected subgraphs):

$$p(X_1, \ldots, X_n) = \frac{1}{Z} \prod_{c \in \mathcal{C}} \psi_c(X_c)$$

where $\psi_c$ are non-negative potential functions and $Z = \sum_X \prod_c \psi_c(X_c)$ is the partition function ensuring normalization. Computing $Z$ is often intractable.

MRFs naturally represent symmetric relationships (spatial correlations in images, pairwise interactions in physics). The **Markov property** for MRFs states: a node is conditionally independent of all other nodes given its neighbors (its **Markov blanket**).

### The Factorization Theorem

A fundamental result connects graph structure to probability: the set of conditional independencies implied by d-separation (for DAGs) or the Markov property (for MRFs) is equivalent to the set of distributions that factorize according to the graph. This is the **Hammersley-Clifford theorem** for undirected models.

### Plate Notation

When a graphical model contains repeated structure (e.g., $n$ i.i.d. observations), **plate notation** compactly represents this by drawing a rectangle (plate) around the repeated variables with a count $N$ in the corner. This avoids drawing $N$ copies of the same subgraph and clarifies the model's generative story.

### Inference

**Variable Elimination**: Systematically sum out (marginalize) variables one at a time to compute a target marginal or conditional distribution. The computational cost depends on the **elimination ordering**, which determines the size of intermediate factors.

**Belief Propagation (Sum-Product Algorithm)**: On tree-structured graphs, belief propagation computes exact marginals in time linear in the number of nodes by passing "messages" between neighbors. On graphs with loops, **loopy belief propagation** is an approximate method that often works well in practice but lacks convergence guarantees.

**Junction Tree Algorithm**: Converts a general graph into a tree of cliques (a junction tree) on which exact message-passing can be performed. The complexity depends on the **treewidth** of the graph -- exact inference is tractable for low-treewidth graphs.

### Learning Structure vs Parameters

**Parameter learning**: Given a known graph structure, estimate the conditional probability tables (or parameters of continuous distributions). With complete data, maximum likelihood estimation is straightforward. With latent variables, EM is required.

**Structure learning**: Discover the graph structure from data. Approaches include score-based methods (e.g., BIC score with greedy search), constraint-based methods (e.g., PC algorithm using conditional independence tests), and Bayesian approaches that place priors over graph structures.

### Hidden Markov Models as an Example

A Hidden Markov Model (HMM) is a Bayesian network where a sequence of hidden states $z_1 \to z_2 \to \cdots \to z_T$ forms a Markov chain, and each hidden state $z_t$ generates an observation $x_t$. The model is parameterized by:

- **Initial state distribution**: $\pi_k = p(z_1 = k)$
- **Transition matrix**: $A_{jk} = p(z_t = k \mid z_{t-1} = j)$
- **Emission distribution**: $p(x_t \mid z_t = k)$

Inference (computing $p(z_t \mid x_1, \ldots, x_T)$) is performed by the forward-backward algorithm, a special case of belief propagation on a chain graph. The most likely state sequence is found via the Viterbi algorithm. Parameter learning uses the Baum-Welch algorithm, which is EM applied to HMMs. HMMs are widely used in speech recognition, genomics, and financial modeling.

### Practical Applications

Graphical models underpin many real-world systems. **Medical diagnosis** systems use Bayesian networks to reason from symptoms to diseases. **Image segmentation** uses MRFs to enforce spatial coherence in pixel labels. **Natural language processing** uses conditional random fields (discriminative undirected models) for sequence labeling tasks like named entity recognition. **Recommender systems** use probabilistic matrix factorization models expressible as graphical models.

## Why It Matters

Graphical models provide a unifying framework for an enormous range of probabilistic models: naive Bayes, HMMs, Kalman filters, topic models, conditional random fields, and deep generative models. They make the conditional independence assumptions of a model explicit and visual, facilitate the design of efficient inference algorithms, and provide a shared language across statistics, machine learning, and causal reasoning.

## Key Technical Details

- Directed models (Bayesian networks) factorize as products of conditionals; undirected models (MRFs) factorize over clique potentials.
- D-separation determines conditional independence in directed models; the Markov blanket does so in undirected models.
- Exact inference is tractable on trees (belief propagation) and low-treewidth graphs (junction tree).
- The partition function $Z$ in MRFs is generally intractable to compute.
- Structure learning is NP-hard in the general case for both directed and undirected models.
- Plate notation compactly represents repeated i.i.d. structure.

## Common Misconceptions

- **"Bayesian networks must represent causal relationships."** The arrows in a Bayesian network encode factorization and conditional dependencies, not necessarily causation. Causal Bayesian networks are a special case with additional assumptions (interventional semantics).

- **"Undirected and directed models are interchangeable."** Some independence structures can only be represented by one type. The "explaining away" pattern ($A \to C \leftarrow B$ where $A \perp\!\!\!\perp B$ but $A \not\!\perp\!\!\!\perp B \mid C$) cannot be captured by an undirected model without adding a spurious edge.

- **"Belief propagation always converges on loopy graphs."** Loopy BP can oscillate or diverge. Convergence is guaranteed only on trees. Variants like damped BP or tree-reweighted BP improve robustness.

- **"More edges in the graph means a better model."** Adding edges increases expressiveness but also increases the number of parameters and can lead to overfitting. The graph structure should reflect genuine dependencies, and model selection (e.g., BIC) balances fit with complexity.

## Connections to Other Concepts

- **Bayesian Inference**: Graphical models provide the structure within which Bayesian inference operates. The graph determines which posterior computations are tractable.
- **Expectation-Maximization**: EM is the standard algorithm for learning parameters of graphical models with latent variables (e.g., HMMs via Baum-Welch, LDA via variational EM).
- **Variational Inference**: When exact inference in a graphical model is intractable, variational methods approximate the posterior by exploiting the graph structure (e.g., mean-field approximation respects the graph).
- **MCMC**: Gibbs sampling exploits the graphical model structure directly -- each variable is sampled from its conditional given its Markov blanket.
- **Gaussian Processes**: GP-LVMs use graphical model representations where GPs define the conditional distributions.

## Further Reading

- Koller and Friedman, "Probabilistic Graphical Models: Principles and Techniques" (2009) -- The comprehensive reference.
- Bishop, "Pattern Recognition and Machine Learning" (2006), Ch. 8 -- Accessible introduction to directed and undirected models.
- Murphy, "Machine Learning: A Probabilistic Perspective" (2012), Ch. 10-22 -- Extensive coverage of inference and learning in graphical models.
- Pearl, "Probabilistic Reasoning in Intelligent Systems" (1988) -- The foundational work connecting graphs and probability.
