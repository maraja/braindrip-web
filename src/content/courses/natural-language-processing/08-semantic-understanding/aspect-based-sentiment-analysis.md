# Aspect-Based Sentiment Analysis

**One-Line Summary**: Aspect-based sentiment analysis (ABSA) goes beyond document-level opinion mining to identify specific aspects of entities and the sentiment expressed toward each, enabling fine-grained understanding of opinions like "The food was great but the service was terrible."

**Prerequisites**: `sentiment-analysis.md`, `named-entity-recognition.md`, `attention-mechanism.md`, `text-classification.md`, `dependency-parsing.md`.

## What Is Aspect-Based Sentiment Analysis?

Imagine reading a restaurant review: "The pasta was delicious, the ambiance was romantic, but the waiter was rude and the prices were outrageous." A document-level sentiment system might rate this as mixed or slightly negative. But that single score misses the rich, aspect-specific structure of the opinion. The diner loved the food and atmosphere but disliked the service and pricing. ABSA captures this granularity by identifying each **aspect** (food, ambiance, service, price) and its associated **sentiment** (positive, positive, negative, negative) separately.

Think of ABSA as a microscope for opinions. Where standard sentiment analysis gives you the big picture (overall positive or negative), ABSA zooms in to show exactly which features of a product, service, or experience are praised or criticized. This level of detail is what businesses actually need: a hotel wants to know that guests love the rooms but hate the breakfast, not just that reviews are "73% positive."

Formally, ABSA decomposes the opinion mining problem into structured subtasks: extracting the aspects being discussed, determining the sentiment polarity toward each aspect, and optionally identifying the opinion expressions that convey the sentiment. The full problem is sometimes called opinion triplet extraction: for each opinion in a sentence, identify the (aspect term, opinion term, sentiment polarity) triple. This structured output transforms unstructured reviews into actionable intelligence.

## How It Works

### Aspect Term Extraction (ATE)

Aspect term extraction identifies the specific entities or features being discussed in a sentence. In "The battery life is amazing but the screen resolution is disappointing," the aspect terms are "battery life" and "screen resolution."

**Sequence labeling approach**: ATE is most commonly framed as a BIO sequence labeling task, identical in formulation to named entity recognition (see `named-entity-recognition.md`). Each token is labeled as B-ASPECT (beginning of an aspect term), I-ASPECT (inside an aspect term), or O (outside).

Example:
```
The    battery    life    is    amazing
O      B-ASPECT   I-ASPECT O     O
```

**CRF and BiLSTM-CRF models**: Conditional Random Fields and BiLSTM-CRF architectures -- the same machinery used for NER -- provide strong baselines. BiLSTM-CRF achieves approximately 70-75% F1 on SemEval-2014 restaurant and laptop aspect extraction tasks.

**BERT-based extraction**: Fine-tuning BERT as a token classifier for aspect extraction achieves approximately 78-83% F1 on SemEval-2014, a significant improvement over BiLSTM-CRF. The pre-trained representations capture the syntactic and semantic patterns that distinguish aspect mentions from ordinary noun phrases.

**Unsupervised and semi-supervised approaches**: Topic modeling variants (e.g., aspect-sentiment topic models) and attention-based autoencoders can discover aspects without labeled data, though their precision is lower than supervised methods.

### Aspect Category Detection (ACD)

While aspect term extraction identifies explicit mentions, aspect category detection assigns predefined categories even when the aspect is not explicitly stated. In "This place is overpriced," there is no explicit aspect term, but the sentence expresses an opinion about the PRICE category.

SemEval defines hierarchical aspect categories. For restaurants: FOOD#QUALITY, FOOD#PRICES, SERVICE#GENERAL, AMBIANCE#GENERAL, RESTAURANT#GENERAL, etc. A sentence may belong to multiple categories simultaneously.

ACD is typically formulated as multi-label classification. BERT-based classifiers achieve approximately 80-87% F1 on SemEval restaurant ACD tasks. Attention mechanisms are particularly useful here, as the model must learn which parts of a sentence signal which category even without explicit aspect mentions.

### Aspect-Level Sentiment Classification (ASC)

Given a sentence and a specified aspect (term or category), aspect-level sentiment classification determines the sentiment toward that specific aspect. This is the most heavily studied ABSA subtask.

**The core challenge**: The same sentence can express different sentiments toward different aspects. "The food was great but the service was terrible" requires the model to assign positive sentiment to "food" and negative sentiment to "service." A model that simply encodes the whole sentence would conflate these signals.

**Attention-based models**: The dominant paradigm uses attention to focus on the words most relevant to each aspect:

- **ATAE-LSTM** (Wang et al., 2016): Concatenates aspect embeddings with word embeddings and uses attention to weight context words by their relevance to the target aspect. The attention distribution highlights "great" when the aspect is "food" and "terrible" when the aspect is "service."
- **IAN (Interactive Attention Networks)** (Ma et al., 2017): Uses separate attention mechanisms for the aspect and context, allowing bidirectional interaction between what is being discussed and what is being said about it.
- **MGAN (Multi-Grained Attention Network)** (Fan et al., 2018): Combines coarse-grained (word-level) and fine-grained (character-level) attention for more precise aspect-opinion alignment.

**BERT for ASC**: Fine-tuning BERT with an auxiliary sentence approach -- constructing input as "[CLS] sentence [SEP] aspect term [SEP]" -- achieves approximately 85-88% accuracy on SemEval-2014 restaurant data and approximately 78-82% on laptop data. The aspect term as a second "sentence" naturally leverages BERT's cross-attention to focus on aspect-relevant context.

**Graph Neural Network approaches**: Dependency parse trees provide structural information about which words modify which aspects. GCN (Graph Convolutional Network) and GAT (Graph Attention Network) models operate on dependency graphs, propagating information along syntactic edges to connect aspect terms with their opinion words. ASGCN (Zhang et al., 2019) achieved approximately 80-84% accuracy on SemEval benchmarks by combining BiLSTM context encoding with GCN over dependency trees.

**Instruction-tuned LLMs**: Recent work frames ABSA as a text generation task. InstructABSA (Scaria et al., 2023) shows that instruction-tuned models can perform ABSA zero-shot or few-shot, achieving competitive results without task-specific fine-tuning on smaller datasets.

### Opinion Triplet Extraction

The most complete formulation of ABSA is opinion triplet extraction, which jointly identifies (aspect term, opinion term, sentiment polarity) triples. For "The food was delicious but overpriced":

- Triple 1: (food, delicious, positive)
- Triple 2: (food, overpriced, negative)

Note that the same aspect ("food") can have multiple opinion-sentiment pairs. This makes triplet extraction significantly harder than any individual subtask.

**Pipeline approaches** extract aspects first, then opinion terms, then classify sentiment. Errors cascade: missed aspects lead to missed triples.

**Joint extraction models**: Span-based approaches enumerate candidate aspect and opinion spans, then classify their relationships and sentiment jointly. GTS (Grid Tagging Scheme by Wu et al., 2020) uses a 2D tagging framework where rows represent aspect spans and columns represent opinion spans, with cell labels encoding sentiment. Peng et al. (2020) formulate triplet extraction as a sequence-to-sequence problem, generating structured triples autoregressively.

**Generative approaches**: T5 and BART-based models generate triples as structured text strings, achieving state-of-the-art results. Yan et al. (2021) frame ABSA as a generative task where the model outputs "(aspect, opinion, sentiment)" tuples, achieving approximately 63-70% F1 on standard triplet extraction benchmarks.

### SemEval ABSA Shared Tasks

The SemEval shared tasks have been the primary evaluation venue for ABSA:

- **SemEval-2014 Task 4** (Pontiki et al., 2014): Introduced the standard ABSA framework with four subtasks: aspect term extraction, aspect term polarity, aspect category detection, and aspect category polarity. Two domains: restaurant reviews (3,041 sentences) and laptop reviews (3,045 sentences). This remains the most widely used ABSA benchmark.

- **SemEval-2015 Task 12**: Expanded to include out-of-domain evaluation and opinion target expressions (the words expressing the opinion, not just the aspect).

- **SemEval-2016 Task 5**: Extended to multiple languages (English, Arabic, Chinese, Dutch, French, Russian, Spanish, Turkish) and multiple domains (restaurants, laptops, hotels, phones, cameras). Also introduced slot-based evaluation and opinion triplet extraction.

The SemEval-2014 restaurant dataset remains the most benchmarked ABSA dataset. State-of-the-art results (as of recent transformer-based systems):
- Aspect term extraction: approximately 83-87% F1
- Aspect sentiment classification: approximately 85-90% accuracy
- Aspect category detection: approximately 85-90% F1

### Neural Architecture Details

**Aspect-aware encoding**: The key architectural innovation across ABSA models is making the sentence encoding aspect-conditional. Rather than computing a single representation of the sentence, the model produces different representations depending on which aspect is being evaluated. This is achieved through:

1. **Aspect-specific attention**: Weighting context words by relevance to the target aspect
2. **Aspect embedding concatenation**: Appending aspect representations to each context word
3. **Graph-based propagation**: Routing information through syntactic dependencies from aspect to opinion words
4. **Cross-encoder formulation**: Using transformer cross-attention between sentence and aspect (BERT-style [SEP] formatting)

**Handling implicit aspects**: Some opinions express sentiment toward an aspect without naming it. "It's too expensive" implies the PRICE aspect. Aspect category detection handles this by classifying into predefined categories, but handling truly implicit aspects in open-domain settings remains challenging.

## Why It Matters

1. **Product intelligence**: Companies analyze millions of reviews to understand specific strengths and weaknesses. "Customers love the camera but complain about battery life" is far more actionable than an overall sentiment score.
2. **Competitive analysis**: Comparing aspect-level sentiment across competitors reveals specific areas for improvement: "Our screen quality leads the market but our customer support trails competitors."
3. **Recommendation systems**: Understanding which aspects users care about enables personalized recommendations. A user who cares about food quality over ambiance should receive different restaurant recommendations.
4. **Service improvement**: Hotels, airlines, and restaurants use ABSA to identify exactly which aspects of the customer experience need attention, prioritizing improvements by frequency and severity of complaints.
5. **Healthcare and patient feedback**: Analyzing patient reviews of healthcare providers at the aspect level (wait time, bedside manner, treatment effectiveness) supports quality improvement initiatives.

## Key Technical Details

- SemEval-2014 restaurant dataset: 3,041 training sentences with 3,693 aspect terms and 12 aspect categories.
- SemEval-2014 laptop dataset: 3,045 training sentences with 2,358 aspect terms and approximately 80 fine-grained categories.
- BERT-based ASC: approximately 85-88% accuracy on SemEval-2014 restaurant, approximately 78-82% on laptop.
- BERT-based ATE: approximately 78-83% F1 on SemEval-2014 restaurant aspect extraction.
- GNN-based models (ASGCN): approximately 80-84% accuracy on SemEval-2014 by exploiting dependency tree structure.
- Opinion triplet extraction: approximately 63-70% F1 on standard benchmarks, reflecting the difficulty of joint extraction.
- SemEval-2016 covered 8 languages and multiple domains, enabling cross-lingual and cross-domain ABSA research.
- Human inter-annotator agreement on aspect sentiment is approximately 85-90%, setting a practical performance ceiling.
- Aspect-specific attention models outperform context-independent encoders by approximately 3-7% accuracy, confirming that aspect-conditional encoding is essential.

## Common Misconceptions

**"ABSA is just sentiment analysis applied to smaller text units."**
ABSA requires fundamentally different modeling than document or sentence-level sentiment. The same sentence contains multiple, potentially conflicting sentiments. The model must learn to selectively attend to the context relevant to each aspect -- a capability that standard sentiment classifiers do not possess.

**"Aspect extraction and sentiment classification can be done independently without loss."**
Pipeline approaches that extract aspects first and then classify sentiment suffer from error propagation and miss the interactions between the two tasks. Joint models that simultaneously extract aspects and their sentiment consistently outperform pipeline approaches by 2-5% F1.

**"Dependency parsing is always needed for ABSA."**
While graph neural networks over dependency trees show improvements, attention-based models without explicit syntactic structure perform competitively. BERT's self-attention implicitly captures syntactic patterns, reducing the need for explicit parsing. GNN approaches show the largest gains on sentences with long-range aspect-opinion dependencies.

**"More aspect categories always help."**
Overly fine-grained category taxonomies reduce inter-annotator agreement and model accuracy. SemEval found that moving from 5 coarse categories to 12+ fine-grained categories decreased system performance and annotation consistency. The right granularity depends on the application.

**"ABSA only applies to product reviews."**
While product reviews are the most studied domain, ABSA applies to any text where multiple aspects receive distinct evaluations: healthcare (aspect = treatment, doctor, wait time), education (aspect = teaching, curriculum, facilities), politics (aspect = economy, immigration, healthcare policy), and employee reviews (aspect = salary, culture, management).

## Connections to Other Concepts

- `sentiment-analysis.md` covers the broader sentiment analysis landscape, of which ABSA is the fine-grained sub-field.
- `named-entity-recognition.md` shares sequence-labeling formulations and techniques (BIO tagging, CRF layers) with aspect term extraction.
- `attention-mechanism.md` explains the attention-based architectures that enable aspect-conditional sentence encoding.
- `dependency-parsing.md` provides the syntactic trees used by graph neural network approaches to connect aspects with opinion words.
- `relation-extraction.md` shares the structured extraction paradigm -- both tasks identify typed relationships between text spans.
- `negation-and-speculation-detection.md` is critical for correctly interpreting negated aspect sentiment ("The food was not bad" = positive toward food aspect).
- `word-sense-disambiguation.md` matters when aspect terms are polysemous -- "bass" could be a musical instrument or a fish, with different relevant aspects.
- `text-classification.md` provides the classification foundations that underpin aspect category detection and sentiment classification.
- `bert.md` and `transfer-learning-in-nlp.md` explain the pre-trained models that achieve state-of-the-art ABSA performance.

## Further Reading

- Pontiki, M. et al., "SemEval-2014 Task 4: Aspect Based Sentiment Analysis," 2014 -- The benchmark-defining shared task establishing standard ABSA evaluation.
- Wang, Y. et al., "Attention-Based LSTM for Aspect-Level Sentiment Classification," 2016 -- ATAE-LSTM, the foundational attention-based model for aspect sentiment.
- Zhang, C., Li, Q., and Song, D., "Aspect-Based Sentiment Classification with Aspect-Specific Graph Convolutional Networks," 2019 -- ASGCN, introducing graph neural networks over dependency trees for ABSA.
- Peng, H. et al., "Knowing What, How and Why: A Near Complete Solution for Aspect-Based Sentiment Analysis," 2020 -- Unified framework for aspect, opinion, and sentiment triplet extraction.
- Yan, H. et al., "A Unified Generative Framework for Aspect-Based Sentiment Analysis," 2021 -- Casting ABSA subtasks as text generation problems using pre-trained seq2seq models.
- Liu, B., "Sentiment Analysis and Opinion Mining," 2012 -- Comprehensive textbook covering the foundations of opinion mining including aspect-level analysis.
- Scaria, K. et al., "InstructABSA: Instruction Learning for Aspect Based Sentiment Analysis," 2023 -- Demonstrating instruction-tuned LLMs for zero-shot and few-shot ABSA.
