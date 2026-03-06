# Sentiment Analysis

**One-Line Summary**: Sentiment analysis detects subjective opinion, polarity (positive/negative/neutral), and emotion in text, operating at document, sentence, and aspect levels of granularity.

**Prerequisites**: `text-classification.md`, `bag-of-words.md`, `tf-idf.md`, `contextual-embeddings.md`, `bert.md`

## What Is Sentiment Analysis?

Think of a restaurant owner reading through hundreds of online reviews. Some praise the food but complain about service; others are sarcastic ("Oh great, another 45-minute wait"). Sentiment analysis automates this reading process, determining not just whether a review is positive or negative, but which specific aspects are praised or criticized and with what intensity.

Formally, sentiment analysis is a specialization of `text-classification.md` where the label set represents opinion polarity (positive, negative, neutral), fine-grained intensity (1--5 stars), or discrete emotions (joy, anger, sadness, etc.). The task varies in scope: **document-level** analysis assigns a single sentiment to an entire review, **sentence-level** analysis classifies individual sentences, and **aspect-based sentiment analysis** (ABSA) identifies sentiment toward specific attributes of an entity (e.g., "battery life: positive" but "screen quality: negative" within a single phone review).

## How It Works

### Lexicon-Based Approaches

Lexicon-based methods assign sentiment scores using manually or semi-automatically constructed word-sentiment dictionaries.

**VADER** (Valence Aware Dictionary and sEntiment Reasoner; Hutto & Gilbert, 2014) uses a curated lexicon of ~7,500 words with human-rated valence scores, combined with grammatical heuristics for negation, intensifiers ("very"), capitalization, and punctuation. It handles social media text well and requires no training data.

**SentiWordNet** (Baccianella et al., 2010) assigns positivity, negativity, and objectivity scores to each WordNet synset, providing sense-level sentiment that can help with polysemy (e.g., "cold" as temperature vs. "cold" as unfriendly).

Lexicon approaches are transparent and need no labeled data, but they struggle with domain-specific language, sarcasm, and evolving slang.

### Machine Learning Approaches

**Traditional ML**: Pang & Lee (2002) showed that Naive Bayes and SVMs trained on unigram/bigram features outperform lexicon methods on movie review sentiment. TF-IDF features with an SVM remain a competitive baseline, achieving ~88% accuracy on IMDB binary sentiment.

**Neural Models**: BiLSTMs with attention mechanisms improve over bag-of-words by capturing word order and long-range context. Fine-tuned BERT achieves ~95.5% on IMDB and ~93--94% on SST-2, reflecting the power of pre-trained contextual representations.

### Fine-Grained Sentiment (1--5 Stars)

Mapping text to a 5-point scale is substantially harder than binary classification. SST-5, the fine-grained Stanford Sentiment Treebank, has SOTA accuracy around 59%, illustrating how much information is lost when collapsing nuanced opinion into discrete levels. Ordinal regression approaches that respect the ordering of labels (1 < 2 < 3 < 4 < 5) sometimes outperform standard multi-class classification.

### Emotion Detection

Beyond positive/negative polarity, emotion detection classifies text into discrete emotional categories. Ekman's six basic emotions (anger, disgust, fear, joy, sadness, surprise) provide one widely-used taxonomy. Plutchik's wheel of emotions extends this to eight primary emotions with varying intensity levels. Datasets like GoEmotions (Demszky et al., 2020), with 58k Reddit comments labeled across 27 emotion categories, enable training of fine-grained emotion classifiers.

### Aspect-Based Sentiment Analysis (ABSA)

ABSA involves two sub-tasks: (1) identifying aspect terms or categories ("battery life," "screen resolution") and (2) determining sentiment polarity toward each aspect. This can be modeled as a sequence labeling task for aspect extraction combined with targeted classification for polarity. See `aspect-based-sentiment-analysis.md` for a detailed treatment.

## Why It Matters

1. **Business intelligence**: Companies monitor brand sentiment across social media, reviews, and support tickets to detect emerging issues and measure campaign impact.
2. **Financial markets**: Sentiment signals from news and social media are integrated into quantitative trading strategies; studies show aggregate Twitter sentiment correlates with short-term stock movements.
3. **Product development**: Aspect-level sentiment highlights specific features users love or hate, directly informing engineering priorities.
4. **Political analysis**: Tracking public opinion on policies, candidates, and events at scale supplements traditional polling.
5. **Healthcare**: Patient sentiment in clinical notes and online forums helps identify treatment satisfaction and mental health indicators.

## Key Technical Details

- **SST-2 (binary)**: SOTA ~97% accuracy (DeBERTa-v3); human agreement estimated at ~97%.
- **SST-5 (fine-grained, 5-class)**: SOTA ~59% accuracy; human agreement ~68%, showing inherent subjectivity.
- **IMDB (binary, 50k reviews)**: BERT-family models reach ~95.5%; an SVM with bigrams achieves ~89%.
- **SemEval ABSA benchmarks**: Aspect extraction F1 ~85--87%; aspect sentiment classification accuracy ~82--86% depending on domain (restaurant, laptop).
- **VADER** achieves ~0.96 F1 on social media data without any training, making it ideal for quick prototyping.
- **Sarcasm detection** remains a challenge: best models achieve ~75% F1 on dedicated sarcasm benchmarks, far below human performance.
- **Cross-domain transfer** typically drops accuracy by 5--15 percentage points (e.g., movie reviews to product reviews).

## Common Misconceptions

**"Sentiment analysis is just positive vs. negative."** Binary polarity is the simplest formulation. Real-world applications require fine-grained scales, aspect-level analysis, emotion detection, and handling of mixed sentiment within a single text. A restaurant review that praises food but criticizes service is not simply "positive."

**"Lexicon-based methods are obsolete."** VADER and similar tools remain valuable for domains with no labeled data, for interpretable baselines, and for real-time social media monitoring where speed matters. They also serve as useful features alongside neural models.

**"Sentiment is objective."** Human annotators disagree on sentiment labels roughly 3--10% of the time (depending on granularity), establishing a ceiling that no model can reliably exceed. Cultural context, personal experience, and domain knowledge all affect interpretation.

**"Negation is handled by flipping the polarity."** Simple negation flipping ("not good" -> negative) fails for double negation ("not bad" -> weakly positive), sarcasm ("Oh, wonderful, another delay"), and scope issues ("I wouldn't say it was bad"). Modern contextual models handle negation better but remain imperfect.

## Connections to Other Concepts

- Sentiment analysis is a specialized instance of `text-classification.md`, inheriting its methods and evaluation practices.
- `aspect-based-sentiment-analysis.md` extends sentiment analysis to fine-grained, entity-attribute-level opinions.
- `contextual-embeddings.md` and `bert.md` provide the representations that drive current SOTA sentiment models.
- `negation-and-speculation-detection.md` addresses one of sentiment analysis's core linguistic challenges.
- `named-entity-recognition.md` is often a prerequisite for aspect extraction in ABSA pipelines.
- `text-cleaning-and-noise-removal.md` is critical for social media sentiment, where non-standard text is the norm.
- `evaluation-metrics-for-nlp.md` covers the precision, recall, F1, and accuracy metrics used for sentiment evaluation.

## Further Reading

- Pang & Lee, *Opinion Mining and Sentiment Analysis*, 2008 -- comprehensive survey that defined the field's scope and key challenges.
- Hutto & Gilbert, *VADER: A Parsimonious Rule-Based Model for Sentiment Analysis of Social Media Text*, 2014 -- introduced the most widely-used lexicon-based sentiment tool.
- Socher et al., *Recursive Deep Models for Semantic Compositionality Over a Sentiment Treebank*, 2013 -- introduced SST and the Recursive Neural Tensor Network for compositional sentiment.
- Demszky et al., *GoEmotions: A Dataset of Fine-Grained Emotions*, 2020 -- a large-scale, 27-category emotion classification dataset from Reddit.
- Pontiki et al., *SemEval-2014 Task 4: Aspect Based Sentiment Analysis*, 2014 -- established the benchmark tasks and datasets for ABSA.
