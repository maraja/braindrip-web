# Evaluation Metrics for NLP

**One-Line Summary**: Automated evaluation metrics quantify NLP system performance using formulas that approximate human judgment, each capturing a different facet of quality -- from exact-match precision to semantic embedding similarity.

**Prerequisites**: `n-gram-language-models.md`, `text-classification.md`, `machine-translation.md`, `text-summarization.md`, `contextual-embeddings.md`

## What Is Evaluation Metrics for NLP?

Imagine grading student essays. One teacher counts spelling mistakes (precision-oriented), another checks whether all key points were covered (recall-oriented), and a third reads for overall coherence (semantic quality). No single grading rubric captures everything, and the same is true for NLP evaluation: different metrics illuminate different dimensions of system output.

Evaluation metrics are mathematical functions that take a system's output and one or more reference answers, then produce a numeric score reflecting quality. They serve as the scoreboard for NLP research -- determining which models get published, which get deployed, and which get discarded. The challenge is that language is enormously flexible: "The cat sat on the mat" and "A feline rested atop the rug" convey similar meaning with zero word overlap, making purely surface-level metrics inherently limited.

## How It Works

### Classification Metrics: Precision, Recall, and F1

For tasks like `text-classification.md`, `named-entity-recognition.md`, and `sentiment-analysis.md`, the core metrics derive from the confusion matrix:

- **Precision** = TP / (TP + FP) -- of everything the system labeled positive, how many were correct?
- **Recall** = TP / (TP + FN) -- of everything that was actually positive, how many did the system find?
- **F1 Score** = 2 * (Precision * Recall) / (Precision + Recall) -- the harmonic mean, balancing both.

For multi-class settings, **macro-F1** averages F1 across classes equally (sensitive to rare classes), while **micro-F1** pools all TP/FP/FN globally (dominated by frequent classes). For sequence labeling tasks like NER, evaluation typically uses **span-level F1** where both the entity boundary and type must match exactly.

### BLEU (Bilingual Evaluation Understudy)

Papineni et al. (2002) designed BLEU for `machine-translation.md`. It computes modified n-gram precision for n = 1 to 4 against one or more references, with a brevity penalty (BP) to penalize overly short outputs:

```
BLEU = BP * exp( sum_{n=1}^{4} w_n * log(p_n) )
BP = min(1, exp(1 - r/c))
```

where w_n = 1/4 (uniform weights), r = reference length, c = candidate length. BLEU ranges from 0 to 1, with human translations typically scoring 0.30--0.40 against other human references. **Limitation**: BLEU rewards n-gram overlap but ignores synonyms, paraphrases, and semantic adequacy entirely. A sentence with correct meaning but different word choices scores poorly.

### ROUGE (Recall-Oriented Understudy for Gisting Evaluation)

Lin (2004) developed ROUGE for `text-summarization.md`. Unlike BLEU's precision focus, ROUGE emphasizes recall -- did the summary capture the important content?

- **ROUGE-N**: Recall of reference n-grams in the system output (ROUGE-1 for unigrams, ROUGE-2 for bigrams).
- **ROUGE-L**: Longest common subsequence between reference and candidate, capturing sentence-level structure.
- **ROUGE-Lsum**: Applies ROUGE-L at the summary level by splitting on sentence boundaries.

Typical strong summarization systems achieve ROUGE-1 around 44--47, ROUGE-2 around 20--23, and ROUGE-L around 40--44 on CNN/DailyMail.

### METEOR

Banerjee and Lavie (2005) designed METEOR to address BLEU's rigidity. It aligns words between candidate and reference using exact match, stemming (run/running), synonym lookup (via WordNet), and paraphrase tables. The final score combines precision and recall with a fragmentation penalty that rewards contiguous aligned chunks. METEOR correlates better with human judgment than BLEU at the sentence level (Pearson r ~ 0.83 vs. BLEU's ~0.72 on WMT data).

### BERTScore

Zhang et al. (2020) compute cosine similarity between contextual embeddings (from `bert.md`) of candidate and reference tokens, then greedily match tokens to compute precision, recall, and F1 in embedding space. BERTScore captures semantic similarity that surface-level metrics miss -- "automobile" and "car" score nearly identically. It achieves Pearson correlation of 0.86+ with human judgments on WMT, outperforming BLEU and METEOR.

### CIDEr (Consensus-based Image Description Evaluation)

Vedantam et al. (2015) designed CIDEr for `image-captioning.md`. It computes TF-IDF weighted n-gram similarity between a candidate caption and multiple references, measuring consensus among references. CIDEr weights rare, informative n-grams more heavily than common ones.

### Perplexity

For language models (see `n-gram-language-models.md`, `gpt-for-nlp-tasks.md`), perplexity measures how surprised the model is by test data:

```
PPL = exp( -(1/N) * sum_{i=1}^{N} log P(w_i | w_{<i}) )
```

Lower perplexity means better prediction. GPT-2 achieves ~29.4 perplexity on WikiText-103; GPT-3 (175B) achieves ~20.5. **Limitation**: Perplexity measures prediction quality, not generation quality -- a model with low perplexity can still produce bland or repetitive text.

## Why It Matters

1. **Reproducibility**: Standardized metrics enable fair comparison across papers and systems, forming the backbone of empirical NLP research.
2. **Development feedback**: Automated metrics provide instant scores during model development, enabling rapid iteration that would be impossible with human evaluation alone.
3. **Deployment decisions**: Production teams use metric thresholds to gate model releases -- e.g., "deploy only if BLEU exceeds 35 on the test set."
4. **Benchmark leaderboards**: Metrics drive community benchmarks (WMT, SQuAD, GLUE), focusing research effort and tracking progress over time.
5. **Metric-aware training**: Some systems directly optimize metrics like BLEU via reinforcement learning (SCST), making the choice of metric a design decision that shapes model behavior.

## Key Technical Details

- **BLEU on WMT En-De**: State-of-the-art systems score 35--42; human translations score 30--40 against other human references due to valid variation.
- **ROUGE on CNN/DailyMail**: Top abstractive systems achieve ROUGE-1/ROUGE-2/ROUGE-L of approximately 47/23/44.
- **BERTScore**: Uses RoBERTa-large by default; adding IDF weighting from the test corpus improves correlation by ~1 point.
- **Perplexity baselines**: GPT-2 small (117M) = 65.9, GPT-2 large (774M) = 35.7, GPT-3 (175B) = 20.5 on WikiText-103.
- **SacreBLEU** (Post, 2018) standardizes BLEU computation (tokenization, reference handling) to ensure reproducibility -- raw BLEU scores are not comparable across papers without it.
- **COMET** (Rei et al., 2020): A learned metric using cross-lingual embeddings, achieving 0.90+ Kendall correlation with human judgments on WMT, now preferred over BLEU for MT evaluation.
- **Exact Match (EM)** and **token-level F1** are standard for `question-answering.md`; on SQuAD 2.0, top systems achieve ~90% EM and ~93% F1.

## Common Misconceptions

**"Higher BLEU always means better translation."** BLEU is a corpus-level metric with poor sentence-level reliability. A system scoring 32 BLEU may produce individual translations that are superior to a system scoring 35 BLEU. Additionally, BLEU differences below ~1 point are generally not statistically significant without bootstrap resampling.

**"ROUGE measures summary quality."** ROUGE measures n-gram overlap with references, which correlates with but does not capture quality dimensions like factual consistency, coherence, and informativeness. A summary can have high ROUGE by copying sentences verbatim while missing the main point.

**"Perplexity and generation quality are the same thing."** Low perplexity means the model assigns high probability to the test data. But generation involves sampling or decoding from the model's distribution, where mode-seeking strategies (greedy/beam search) tend to produce repetitive text and stochastic strategies (nucleus sampling) may produce diverse but occasionally incoherent text.

**"BERTScore solves all the limitations of surface metrics."** While BERTScore captures synonymy and paraphrase, it still struggles with factual correctness, logical consistency, and pragmatic appropriateness. Saying "The patient has no cancer" vs. "The patient has cancer" yields high BERTScore despite opposite meaning.

## Connections to Other Concepts

- `machine-translation.md` describes BLEU in its evaluation context and discusses the shift toward learned metrics like COMET.
- `text-summarization.md` relies on ROUGE as its primary automated metric, with factual consistency metrics as an emerging complement.
- `text-classification.md` uses precision, recall, and F1 as its core evaluation framework.
- `intrinsic-vs-extrinsic-evaluation.md` discusses when perplexity (intrinsic) vs. downstream task metrics (extrinsic) are appropriate.
- `human-evaluation-for-nlp.md` covers the gold standard against which all automated metrics are validated.
- `image-captioning.md` uses CIDEr and METEOR as primary automated metrics.
- `bert.md` provides the contextual embeddings underlying BERTScore.
- `question-answering.md` uses Exact Match and token-level F1 as task-specific metrics.

## Further Reading

- Papineni et al., *BLEU: A Method for Automatic Evaluation of Machine Translation*, 2002 -- the foundational MT metric used for over two decades.
- Lin, *ROUGE: A Package for Automatic Evaluation of Summaries*, 2004 -- established recall-oriented evaluation for summarization.
- Banerjee and Lavie, *METEOR: An Automatic Metric for MT Evaluation with Improved Correlation with Human Judgments*, 2005 -- introduced stem and synonym matching to go beyond exact n-gram overlap.
- Zhang et al., *BERTScore: Evaluating Text Generation with BERT*, 2020 -- leveraged contextual embeddings for semantically-aware evaluation.
- Post, *A Call for Clarity in Reporting BLEU Scores*, 2018 -- exposed reproducibility issues in BLEU computation and introduced SacreBLEU.
- Rei et al., *COMET: A Neural Framework for MT Evaluation*, 2020 -- learned metric achieving state-of-the-art correlation with human judgments.
