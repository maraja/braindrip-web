# Data Types and Structures

**One-Line Summary**: Numerical, categorical, ordinal, text, time series -- understanding your data's nature determines every downstream decision.

**Prerequisites**: Basic statistics, introductory programming (Python/R), familiarity with matrices and arrays.

## What Is Data Typing in Machine Learning?

Imagine you are sorting mail. Letters go in one bin, packages in another, and fragile items get special handling. You would never stuff a glass vase into a letter slot. Data typing works the same way: every column in your dataset has a nature, and that nature dictates how you store it, visualize it, preprocess it, and which algorithms can consume it. Misidentifying a data type is like mislabeling that vase -- it will break downstream.

Formally, a **data type** describes the domain of values a variable can take and the operations that are meaningful on it. A **data structure** is the container that holds those values in memory -- a DataFrame row, a tensor slice, a graph adjacency list. Together, type and structure form the contract between raw reality and the mathematical machinery of machine learning.

## How It Works

### Numerical Data

Numerical variables take on quantitative values where arithmetic operations (addition, averaging) are meaningful.

- **Continuous**: Can assume any real value within an interval. Examples: temperature ($22.7°C$), stock price ($\$148.32$), sensor voltage. Formally, a continuous variable $X$ has support on some subset of $\mathbb{R}$.
- **Discrete**: Restricted to countable values, typically integers. Examples: number of children, website click counts, word frequency. A discrete variable $X$ takes values in $\mathbb{Z}$ or a finite subset.

The distinction matters because continuous features suit kernel methods and distance-based algorithms, while discrete counts may call for Poisson regression or count-based models.

### Categorical Data

Categorical variables represent group membership with no inherent arithmetic meaning.

- **Nominal**: Unordered categories. Examples: country, blood type (A, B, AB, O), color. There is no sense in which "red" > "blue."
- **Ordinal**: Categories with a meaningful rank but non-uniform spacing. Examples: education level (high school < bachelor's < master's < PhD), customer satisfaction (1-5 stars). The gap between "satisfied" and "very satisfied" is not guaranteed to equal the gap between "neutral" and "satisfied."

Treating nominal data as ordinal -- for instance, label-encoding country names as 1, 2, 3 -- introduces a false ordering that algorithms like linear regression will exploit, producing nonsensical results. See **Encoding Categorical Variables** for proper strategies.

### Text Data

Text is a sequence of tokens drawn from a vocabulary $V$. A document $d$ can be represented as a bag-of-words vector $\mathbf{x} \in \mathbb{R}^{|V|}$, a TF-IDF weighted vector, or a dense embedding $\mathbf{e} \in \mathbb{R}^{k}$ from models like Word2Vec or BERT. Text is high-dimensional, sparse, and order-dependent, requiring specialized pipelines (tokenization, stemming, embedding).

### Time Series Data

A time series is a sequence of observations indexed by time: $\{x_{t_1}, x_{t_2}, \ldots, x_{t_n}\}$. The temporal ordering is the defining feature -- shuffling rows destroys the signal. Key properties include trend, seasonality, and autocorrelation. Time series demand special splitting strategies (see **Data Splitting and Sampling**) and models that respect temporal structure (ARIMA, LSTMs).

### Image Data

An image is a tensor of pixel intensities. A grayscale image of height $H$ and width $W$ is a matrix $\mathbf{I} \in \mathbb{R}^{H \times W}$; a color image adds a channel dimension: $\mathbf{I} \in \mathbb{R}^{H \times W \times 3}$ (RGB). Convolutional architectures exploit the spatial locality inherent in this structure.

### Graph / Network Data

Nodes and edges encode relational structure. A graph $G = (V, E)$ with $|V| = n$ nodes can be represented by an adjacency matrix $\mathbf{A} \in \{0,1\}^{n \times n}$ and a node feature matrix $\mathbf{X} \in \mathbb{R}^{n \times d}$. Graph neural networks operate directly on this non-Euclidean structure.

### Tabular vs. Unstructured Data

| Property | Tabular | Unstructured |
|---|---|---|
| Layout | Fixed rows and columns | Variable-length, multi-dimensional |
| Examples | CSV, SQL tables | Images, audio, free text |
| Typical models | Gradient-boosted trees, logistic regression | CNNs, transformers, RNNs |
| Feature engineering | Manual, domain-driven | Learned representations |

### Core Data Structures

- **DataFrame** (Pandas, Polars): The workhorse for tabular data. Each column has a homogeneous dtype; rows are observations. Operations like `groupby`, `merge`, and `pivot` mirror SQL.
- **Tensor** (NumPy ndarray, PyTorch Tensor): Multi-dimensional arrays optimized for linear algebra and GPU computation. A batch of 32 RGB images of size $224 \times 224$ is a tensor of shape $(32, 3, 224, 224)$.
- **Sparse matrices** (SciPy CSR/CSC): Efficient storage when most entries are zero, common in text (bag-of-words) and recommendation (user-item) data.

## Why It Matters

Choosing the wrong representation cascades through the entire pipeline. Feed a nominal variable into a distance-based algorithm as raw integers and the model hallucinates ordinal relationships. Store a sparse text matrix as a dense array and you exhaust memory. Ignore the temporal ordering of a time series and your cross-validation leaks future information into training. Every preprocessing decision -- scaling (see **Feature Scaling and Normalization**), imputation (see **Handling Missing Data**), encoding -- traces back to data type.

## Key Technical Details

- **Pandas dtype pitfalls**: Pandas infers types on load. A column of integers with one missing value becomes `float64` because `NaN` is a float. Use `Int64` (nullable integer) or careful casting.
- **Cardinality**: The number of distinct values in a categorical column. High-cardinality features (e.g., zip codes with 40,000+ levels) require special encoding (hashing, embeddings) rather than naive one-hot expansion.
- **Mixed types**: A column containing both "42" and "N/A" will be inferred as `object` (string). Always inspect dtypes after loading with `df.dtypes` and `df.describe(include='all')`.
- **Memory optimization**: Downcasting `float64` to `float32` halves memory. Categorical dtype in Pandas uses integer codes internally, reducing memory for repetitive strings by 90% or more.

## Common Misconceptions

- **"Ordinal encoding is fine for all categorical variables."** It is only valid when categories have a genuine, meaningful rank. Applying it to nominal data (e.g., encoding countries as 1-195) injects a false metric structure.
- **"More features always help."** High-dimensional data introduces the curse of dimensionality. A 50,000-column one-hot encoding of a text corpus without dimensionality reduction will cripple most algorithms.
- **"DataFrames and tensors are interchangeable."** DataFrames support heterogeneous column types and named indexing; tensors require homogeneous numeric types but enable GPU-accelerated linear algebra. Use the right tool for the task.

## Connections to Other Concepts

- `exploratory-data-analysis.md`: EDA techniques differ by type -- histograms for continuous, bar charts for categorical, autocorrelation plots for time series.
- `feature-scaling-and-normalization.md`: Only meaningful for numerical data; applying z-score normalization to a one-hot encoded column is nonsensical.
- `encoding-categorical-variables.md`: The bridge from categorical types to numeric representations that algorithms require.
- `data-cleaning-and-preprocessing.md`: Type detection is the first step in any cleaning pipeline -- you must know what a column *should* be before you can fix what it *is*.

## Further Reading

- Wickham, "Tidy Data," *Journal of Statistical Software* (2014) -- Foundational framework for organizing tabular data.
- McKinney, *Python for Data Analysis*, 3rd ed. (2022) -- Definitive guide to Pandas DataFrames and practical data wrangling.
- VanderPlas, *Python Data Science Handbook* (2016) -- Accessible introduction to NumPy arrays, Pandas, and data type handling.
