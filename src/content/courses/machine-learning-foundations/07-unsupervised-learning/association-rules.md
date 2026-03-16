# Association Rules

**One-Line Summary**: Discovering frequent itemsets and co-occurrence patterns in transactional data -- the Apriori algorithm and market basket analysis.

**Prerequisites**: Basic probability (joint probability, conditional probability), set theory, combinatorics.

## What Are Association Rules?

When a grocery store notices that customers who buy diapers also tend to buy beer, that is an association rule in action. The store did not hypothesize this relationship in advance -- it emerged from mining millions of transaction records. Association rule learning discovers interesting relationships (co-occurrences) between variables in large datasets, most classically in market basket data where each transaction is a set of purchased items.

Formally, given a set of items $I = \{i_1, i_2, \ldots, i_m\}$ and a database $D$ of transactions where each transaction $T \subseteq I$, an association rule is an implication of the form $A \Rightarrow B$ where $A, B \subseteq I$ and $A \cap B = \emptyset$. The rule asserts that transactions containing $A$ tend to also contain $B$.

## How It Works

### Core Metrics

Three measures quantify the strength of a rule $A \Rightarrow B$:

**Support**: The fraction of transactions containing both $A$ and $B$:

$$\text{support}(A \Rightarrow B) = \frac{|\{T \in D : A \cup B \subseteq T\}|}{|D|}$$

Support measures how frequently the pattern occurs. Low-support rules may be statistically unreliable.

**Confidence**: The fraction of transactions containing $A$ that also contain $B$:

$$\text{confidence}(A \Rightarrow B) = \frac{\text{support}(A \cup B)}{\text{support}(A)} = P(B \mid A)$$

Confidence measures the reliability of the rule. High confidence means $B$ usually appears when $A$ does.

**Lift**: The ratio of observed co-occurrence to expected co-occurrence under independence:

$$\text{lift}(A \Rightarrow B) = \frac{\text{confidence}(A \Rightarrow B)}{\text{support}(B)} = \frac{P(A \cap B)}{P(A) \cdot P(B)}$$

Lift $> 1$ indicates positive association (items appear together more often than by chance). Lift $= 1$ means independence. Lift $< 1$ indicates negative association. Lift corrects for the base rate of $B$, which confidence alone ignores.

### The Apriori Algorithm

Apriori (Agrawal and Srikant, 1994) discovers all frequent itemsets -- sets of items with support above a user-specified minimum threshold $s_{\min}$ -- using a level-wise search:

1. **Generate candidate 1-itemsets**: Count the support of each individual item. Prune those below $s_{\min}$.
2. **Generate candidate $k$-itemsets**: Join frequent $(k-1)$-itemsets that share $k-2$ items to form candidate $k$-itemsets.
3. **Prune**: Apply the **Apriori principle** (anti-monotonicity): if any subset of a candidate is not frequent, the candidate cannot be frequent. Remove such candidates without counting.
4. **Count**: Scan the database to count the support of surviving candidates. Prune those below $s_{\min}$.
5. **Repeat** until no new frequent itemsets are found.

The Apriori principle is the key insight: if $\{A, B, C\}$ is frequent, then all subsets ($\{A, B\}$, $\{A, C\}$, $\{B, C\}$, $\{A\}$, $\{B\}$, $\{C\}$) must also be frequent. This dramatically reduces the search space.

### Generating Rules from Frequent Itemsets

Once all frequent itemsets are discovered, generate rules by partitioning each frequent itemset $F$ into antecedent $A$ and consequent $B = F \setminus A$:

For each non-empty subset $A \subset F$:
- Compute $\text{confidence}(A \Rightarrow F \setminus A) = \frac{\text{support}(F)}{\text{support}(A)}$
- If confidence exceeds the minimum threshold $c_{\min}$, output the rule.

### FP-Growth: A Faster Alternative

FP-Growth (Han et al., 2000) avoids the expensive candidate generation of Apriori:

1. **Build an FP-tree**: Scan the database twice. First, count item frequencies and discard infrequent items. Second, insert transactions (sorted by frequency) into a prefix tree (FP-tree) that compresses the database.
2. **Mine the FP-tree**: For each item, extract its conditional pattern base (the set of prefix paths leading to that item), build a conditional FP-tree, and recursively mine it.

FP-Growth typically runs 2-3 orders of magnitude faster than Apriori on large datasets because it compresses the database into a compact tree structure and eliminates candidate generation entirely. It requires only two database scans, compared to Apriori's multiple scans.

## Why It Matters

Association rule mining is one of the most commercially impactful unsupervised learning techniques:

- **Market basket analysis**: Retailers use it to optimize product placement, cross-selling strategies, and promotional bundles.
- **Recommender systems**: "Customers who bought X also bought Y" is an association rule in production.
- **Web usage mining**: Discovering common navigation paths helps optimize website layout.
- **Medical informatics**: Identifying co-occurring symptoms, drug interactions, or comorbidity patterns.
- **Network security**: Detecting patterns of events that precede security incidents.

### Practical Example

A supermarket analyzes 500,000 transaction records. Setting $s_{\min} = 0.01$ (appears in at least 1% of transactions) and $c_{\min} = 0.5$ (rule correct at least half the time), Apriori discovers that $\{\text{bread}, \text{butter}\} \Rightarrow \{\text{milk}\}$ has support 0.05, confidence 0.65, and lift 1.8. The lift of 1.8 means this combination is 80% more likely than chance. The store places these items near each other and offers targeted coupons, increasing basket size.

### Multi-Level and Sequential Patterns

Extensions of basic association rules include:
- **Multi-level rules**: Mining at different granularity levels (e.g., "dairy products" vs. "2% milk") using item taxonomies.
- **Sequential pattern mining**: Discovering ordered patterns over time, such as "customers who buy a laptop tend to buy a case within one week, then software within one month." Algorithms like GSP and PrefixSpan extend Apriori and FP-Growth to sequences.

## Key Technical Details

- **Apriori complexity**: In the worst case, exponential in the number of items ($2^m$ possible subsets). In practice, the minimum support threshold keeps the number of frequent itemsets manageable.
- **FP-Growth complexity**: $O(n \cdot m)$ for tree construction, where $n$ is the number of transactions and $m$ is the average transaction length. Mining complexity depends on tree structure.
- **Minimum support trade-off**: Too high and you miss interesting rare patterns. Too low and you drown in spurious associations and combinatorial explosion.
- **Additional metrics**: Beyond support, confidence, and lift, practitioners use conviction ($\frac{1 - \text{support}(B)}{1 - \text{confidence}(A \Rightarrow B)}$), leverage ($P(A \cap B) - P(A) \cdot P(B)$), and cosine similarity to filter rules.
- **Handling continuous data**: Association rules require discrete items. Continuous features must be binned (e.g., age groups, price ranges) before mining.
- **Redundancy elimination**: Closed and maximal frequent itemsets reduce the output by removing subsets that carry no additional information beyond their supersets.

## Common Misconceptions

- **"High confidence means a rule is useful."** A rule $A \Rightarrow B$ can have 95% confidence yet be useless if $B$ already has 96% support (lift < 1). Always check lift to distinguish genuine associations from base-rate effects.
- **"Association implies causation."** The rule "beer $\Rightarrow$ diapers" does not mean buying beer causes one to buy diapers. It is a co-occurrence pattern. Causal interpretation requires additional analysis or randomized experiments.
- **"Apriori is obsolete because FP-Growth is faster."** FP-Growth is faster for dense datasets, but Apriori can be more memory-efficient for very sparse data. Both remain relevant in different settings.
- **"More rules are better."** Mining with low thresholds generates thousands of rules, most of which are redundant or uninteresting. Post-filtering by lift, conviction, or domain relevance is essential.
- **"Association rules only apply to retail."** While market basket analysis is the canonical application, the same algorithms discover co-occurring symptoms in medical records, correlated network events in security logs, and co-authored paper patterns in bibliometrics.
- **"The diapers-and-beer story is confirmed."** This famous example is likely apocryphal or at least unverifiable. It persists because it makes the concept memorable, but be cautious about repeating it as fact.

## Connections to Other Concepts

- `anomaly-detection.md`: Transactions that violate strong association rules (unexpected item combinations or missing expected items) can be flagged as anomalous -- useful in fraud detection and quality control.
- `k-means-clustering.md`: Clustering can be applied to transactions (using Jaccard distance on binary item vectors) to find customer segments, complementing the item-level view of association rules.
- `dbscan.md`: Both discover structure without predefined categories, but in different spaces -- DBSCAN in continuous feature space, association rules in discrete transaction space.
- `gaussian-mixture-models.md`: While GMMs model continuous density, association rules model discrete co-occurrence. They address different data types but share the goal of finding hidden structure.
- `principal-component-analysis.md`: For binary transaction matrices, PCA (or its binary analog, correspondence analysis) can reveal latent factors underlying purchasing patterns, providing a complementary view to discrete association rules.

## Implementation Notes

In Python, the `mlxtend` library provides efficient implementations of both Apriori and FP-Growth via `apriori()` and `fpgrowth()`, along with `association_rules()` for rule generation. Input data should be a one-hot encoded DataFrame where each column is an item and each row is a transaction. For large-scale mining, Apache Spark's MLlib provides distributed implementations that scale to billions of transactions.

When setting thresholds, start with a moderately high support (e.g., 0.05) and confidence (e.g., 0.5), examine the results, and iteratively adjust. Always filter the final rules by lift $> 1$ to ensure genuine positive association. Visualizing rules as a scatter plot of support vs. confidence, colored by lift, helps identify the most actionable patterns.

## Further Reading

- Agrawal, Imielinski, and Swami, "Mining Association Rules Between Sets of Items in Large Databases" (1993) -- The paper that launched the field.
- Agrawal and Srikant, "Fast Algorithms for Mining Association Rules" (1994) -- The Apriori algorithm.
- Han, Pei, and Yin, "Mining Frequent Patterns without Candidate Generation" (2000) -- The FP-Growth algorithm.
- Tan, Steinbach, and Kumar, *Introduction to Data Mining* (2005), Chapter 6 -- Excellent textbook treatment of association analysis with practical guidance.
- Hahsler, Gruen, and Hornik, "arules -- A Computational Environment for Mining Association Rules" (2005) -- The R package that is the standard tool for association rule mining.
