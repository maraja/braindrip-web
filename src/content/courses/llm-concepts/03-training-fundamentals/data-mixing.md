# Data Mixing & Domain Weighting

**One-Line Summary**: Data mixing -- the art of choosing how much of each data source to include in training -- has as much impact on model quality as architecture or scale, with optimal ratios differing substantially from natural data distributions.

**Prerequisites**: Understanding of pre-training, training data curation, scaling laws, and cross-entropy loss.

## What Is Data Mixing?

Imagine you are designing the curriculum for a medical school. You would not simply hand students a random sample of all books ever written and hope they learn medicine. You would carefully balance textbooks, clinical case studies, research papers, and some general knowledge -- and the ratio matters enormously. Too much anatomy and too little pharmacology produces a lopsided doctor. Too much general reading and not enough medical content produces a well-read person who cannot practice medicine.

*Recommended visual: Data mixing ratios comparison across major LLMs showing domain proportions — see [Longpre et al. "A Pretrainer's Guide to Training Data" (arXiv:2305.13169)](https://arxiv.org/abs/2305.13169)*


Data mixing is the process of deciding what proportion of each data domain (web text, code, books, academic papers, Wikipedia, conversational data, math, etc.) to include in the pre-training dataset. This seemingly mundane decision turns out to be one of the most consequential choices in LLM development -- small changes in mixing ratios can produce large differences in downstream capability, often exceeding the impact of architectural modifications.

## How It Works


*Recommended visual: DoReMi algorithm illustration showing proxy model training, domain weights optimization, and final model training — see [Xie et al. DoReMi Paper (arXiv:2305.10429)](https://arxiv.org/abs/2305.10429)*

### The Core Challenge

Natural data distributions are a poor proxy for what models need to learn. The internet is dominated by low-quality web pages, advertisements, and repetitive content. If you train on a uniform sample of crawled web data, the model spends most of its compute learning to predict boilerplate text rather than developing reasoning, factual knowledge, or code generation capabilities.

The solution is to **re-weight** domains: oversample high-value sources (code, math, scientific text, high-quality prose) and undersample low-value sources (web crawl, near-duplicate content), relative to their natural frequency.

### Domain Categories

Modern pre-training datasets typically include some combination of:

- **Web crawl** (Common Crawl, filtered): 60-80% of tokens. The backbone of pre-training data, heavily filtered and deduplicated. Quality varies enormously.
- **Code** (GitHub, Stack Exchange): 5-20% of tokens. Dramatically improves reasoning and structured problem-solving even for non-code tasks.
- **Books and long-form text**: 3-10%. Teaches long-range coherence, narrative structure, and detailed factual knowledge.
- **Academic papers** (arXiv, PubMed, Semantic Scholar): 2-5%. Provides scientific reasoning, mathematical notation, and domain expertise.
- **Wikipedia and encyclopedic sources**: 2-5%. High-density factual knowledge with relatively neutral tone.
- **Conversational data** (forums, Q&A): 2-5%. Teaches dialogue patterns and question-answering.
- **Math-specific data**: 1-5%. Dedicated mathematical content improves quantitative reasoning disproportionately.
- **Multilingual data**: Variable. Determines the model's language coverage and proficiency.

### Approaches to Finding Optimal Ratios

**Manual tuning**: The most common approach in practice. Teams train small proxy models with different mixing ratios, evaluate downstream performance, and iterate. This is labor-intensive but allows incorporating human judgment about which capabilities matter. LLaMA 1 and 2 used manually tuned ratios.

**DoReMi (Domain Reweighting with Miniature Proxy Models)** (Xie et al., 2023): An algorithmic approach that trains a small proxy model on uniform data, identifies which domains have the highest excess loss (indicating the model is struggling to learn them), and up-weights those domains for the full training run. DoReMi improved average downstream accuracy by 6.5% over uniform mixing on the Pile benchmark while using the same total compute.

**Data mixing laws** (Ye et al., 2024): Extends Chinchilla-style scaling laws to predict optimal data mixing ratios as a function of model size and total compute budget. The key finding: optimal mixing ratios change with scale. A 1B model benefits from different ratios than a 70B model. For instance, the optimal proportion of code tends to increase with model size, as larger models can extract more value from structured data.

**Regression-based optimization**: SlimPajama and related work fit regression models to predict downstream performance as a function of domain weights, then optimize the weights to maximize predicted performance. This is cheaper than training many proxy models but requires a good predictive model of the data-to-performance relationship.

### Key Findings from the Literature

**Code improves everything.** Perhaps the most consistently replicated finding is that including code in pre-training improves performance not just on coding tasks but on reasoning, math, and even natural language tasks. DeepSeek found that their model's mathematical reasoning improved significantly when code proportion increased from 10% to 20%. The hypothesis is that code teaches formal logical structure that transfers to other domains.

**Diminishing returns per domain.** Each domain follows diminishing returns -- the first 5% of code data provides far more benefit than going from 15% to 20%. This means the optimal strategy is diversification: a broad mix outperforms over-indexing on any single domain.

**Quality within domains matters more than ratios between domains.** Aggressively filtering a domain (removing duplicates, low-quality content, toxic text) typically has a larger effect than adjusting the domain's weight by a few percentage points. The LLaMA 3 team reported that their data filtering pipeline was more impactful than mixing ratio optimization.

**Multi-epoch training changes optimal ratios.** When data is limited and models train for multiple epochs, the optimal mixing ratio shifts toward higher-quality data that benefits from repetition (code, academic text) and away from data that quickly saturates (web crawl). Muennighoff et al. (2023) showed that the value of additional epochs decays at different rates per domain.

### Annealing and Curriculum Effects

Some training pipelines adjust mixing ratios during training:

- **Domain annealing**: Gradually shift toward higher-quality data in later training stages. The LLaMA 3 training pipeline upsampled high-quality sources during an "annealing" phase in the final portion of training, which improved benchmark scores without increasing total data volume.
- **Code warmup**: Start with lower code proportions and increase them as the model develops basic language competence.
- **Quality ramp**: Begin with all available data (including lower-quality web text) for broad coverage, then shift to curated, high-quality subsets for refinement.

## Why It Matters

1. **Leverage on capability**: Data mixing is one of the few levers that can significantly change model capabilities without increasing compute, parameter count, or training time. Getting the mix right is essentially free performance.
2. **Capability targeting**: By adjusting mixing ratios, developers can specialize a model for particular domains (more code for a coding model, more scientific text for a research model) without separate fine-tuning.
3. **Efficiency**: Training on a well-mixed dataset reaches target performance with fewer total tokens than training on poorly mixed data. This directly reduces cost.
4. **Reproducibility**: Data mixing recipes are among the most closely guarded secrets in LLM development. Understanding the principles helps practitioners replicate results and build competitive models even with limited data.

## Key Technical Details

- LLaMA 1 used approximately 67% web (CCNet), 15% C4, 4.5% GitHub, 4.5% Wikipedia, 4.5% books, 2.5% ArXiv, 2% StackExchange.
- DeepSeek-V3's pre-training corpus included a higher proportion of code and math than comparable models, contributing to its strong reasoning performance.
- Optimal code proportion generally increases with model size: smaller models benefit from ~5-10% code, while larger models can absorb and benefit from 15-20%+.
- Data mixing interacts with deduplication: deduplication within a domain changes its effective weight, so mixing ratios should be set after deduplication.
- The Pile (EleutherAI) was an early influential attempt at a well-mixed, documented pre-training corpus with 22 component datasets and explicit mixing ratios.
- FineWeb (HuggingFace, 2024) and DCLM (DataComp-LM, 2024) represent the latest generation of curated, publicly documented pre-training datasets with carefully tuned mixing.

## Common Misconceptions

- **"More data is always better."** More data from a low-quality domain can actually *hurt* performance by diluting the model's exposure to high-quality content. Strategic curation beats volume.
- **"Optimal mixing ratios are universal."** The best ratios depend on model size, training duration, intended use case, and the specific data sources available. There is no single correct recipe.
- **"Natural distribution is the neutral choice."** Training on the "natural" distribution of internet text is itself a choice -- one that heavily over-represents low-quality web content and under-represents the knowledge-dense sources that drive capability.
- **"Data mixing is a solved problem."** It remains highly empirical. Algorithmic approaches like DoReMi and data mixing laws improve over manual tuning but do not eliminate the need for experimentation.

## Connections to Other Concepts

- **Training Data Curation**: Data mixing is the macro-level complement to curation's micro-level filtering (see `training-data-curation.md`).
- **Scaling Laws**: Data mixing laws extend Chinchilla scaling laws by adding domain composition as a dimension of optimization (see `scaling-laws.md`).
- **Pre-Training**: Data mixing directly shapes the pre-training process and its outcomes (see `pre-training.md`).
- **Model Collapse**: Poor mixing (especially over-reliance on synthetic data or narrow domains) can accelerate model collapse (see `model-collapse.md`).
- **Curriculum Learning**: Domain annealing during training is a form of data-level curriculum (see `curriculum-learning.md`).

## Further Reading

- **"DoReMi: Optimizing Data Mixtures Speeds Up Language Model Pretraining" (Xie et al., 2023)** -- Algorithmic domain reweighting using miniature proxy models, demonstrating significant improvements over uniform mixing.
- **"A Pretrainer's Guide to Training Data: Measuring the Effects of Data Age, Domain Coverage, Quality, & Toxicity" (Longpre et al., 2023)** -- Comprehensive analysis of how data characteristics affect model performance across benchmarks.
- **"Data Mixing Laws: Optimizing Data Mixtures by Predicting Language Modeling Performance" (Ye et al., 2024)** -- Scaling law framework for predicting optimal domain weights as a function of model size and compute budget.
- **"The Llama 3 Herd of Models" (Meta, 2024)** -- Describes Meta's data mixing and annealing strategy for training LLaMA 3, including the shift toward high-quality data in later stages.
- **"FineWeb: Decanting the Web for the Finest Text Data at Scale" (Penedo et al., HuggingFace, 2024)** -- Detailed methodology for constructing a high-quality, reproducible web-scale pre-training dataset.
