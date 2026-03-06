# Text Classification

**One-Line Summary**: Text classification assigns one or more predefined category labels to a document, sentence, or passage, serving as the most widely deployed NLP capability in production systems.

**Prerequisites**: `bag-of-words.md`, `tf-idf.md`, `word2vec.md`, `contextual-embeddings.md`, `convolutional-models-for-text.md`, `long-short-term-memory.md`

## What Is Text Classification?

Imagine a mail room clerk who reads every incoming letter and drops it into the correct department bin -- marketing, legal, support, or spam. Text classification is the automated version of that clerk: given a piece of text, the model assigns it to one or more predefined categories.

More formally, text classification maps an input text $x$ (a sequence of tokens) to a label $y \in \{c_1, c_2, \dots, c_k\}$ from a fixed label set. When exactly one label is assigned, the task is **multi-class classification**; when multiple labels may apply simultaneously, it becomes **multi-label classification**. Despite its apparent simplicity, text classification underpins spam filtering, topic routing, intent detection in virtual assistants, content moderation, and medical coding -- making it arguably the single most commercially valuable NLP task.

## How It Works

### Traditional Approaches

**Naive Bayes** applies Bayes' theorem with a conditional independence assumption over features. Given a document $d$ and class $c$:

$$P(c \mid d) \propto P(c) \prod_{i=1}^{n} P(w_i \mid c)$$

Despite its simplifying assumption, Multinomial Naive Bayes trained on TF-IDF features achieves roughly 88--90% accuracy on standard topic classification benchmarks and remains a strong baseline for high-dimensional, sparse feature spaces.

**Support Vector Machines (SVMs)** with linear kernels over TF-IDF vectors were the dominant approach from roughly 2002--2014. SVMs find a maximum-margin hyperplane separating classes and handle high-dimensional feature spaces gracefully. Joachims (1998) demonstrated that linear SVMs were particularly well-suited to text, where feature dimensionality (vocabulary size) often exceeds the number of training examples.

### Neural Approaches

**Convolutional Neural Networks (CNNs)**: Kim (2014) showed that a single-layer CNN with multiple filter widths (3, 4, 5) over pre-trained word embeddings achieves strong results on sentence classification. Filters act as n-gram detectors, and max-over-time pooling extracts the most salient feature from each filter map.

**Recurrent Networks (LSTMs/BiLSTMs)**: Bidirectional LSTMs process text left-to-right and right-to-left, then use the final hidden states (or an attention-weighted combination) as the document representation. This captures word-order and long-range dependencies that bag-of-words models miss.

**Transformer Fine-Tuning (BERT and beyond)**: Devlin et al. (2019) introduced the fine-tuning paradigm where the `[CLS]` token representation from BERT is passed through a task-specific classification head. Fine-tuning BERT-base (110M parameters) on AG News achieves ~94.5% accuracy, roughly a 2-point improvement over the best CNN baselines. Larger models like RoBERTa and DeBERTa push this further.

### Multi-Label and Hierarchical Classification

In multi-label settings, each label receives an independent sigmoid output rather than a shared softmax, so multiple labels can be active simultaneously. Hierarchical classification introduces a label taxonomy (e.g., Science > Physics > Quantum Mechanics) and may use hierarchical loss functions or per-level classifiers to enforce consistency across the tree.

## Why It Matters

1. **Highest deployment volume**: Text classification is the most commonly deployed NLP model in industry -- every spam filter, content moderator, and intent router is a classifier.
2. **Gateway task**: Classification is typically the first NLP task engineers tackle, making it the entry point for applied NLP adoption.
3. **Modular building block**: Many complex systems (e.g., dialogue systems, document processing pipelines) use classifiers internally for routing, filtering, or triggering downstream components.
4. **Benchmarking foundation**: Classification accuracy on standard datasets is the primary yardstick for comparing text representations and pre-trained models.
5. **Business-critical applications**: Medical coding (ICD classification), legal document triage, financial sentiment, and customer support routing all depend on robust text classification.

## Key Technical Details

- **AG News benchmark**: 4-class news classification; BERT achieves ~94.5% accuracy, linear SVM ~92%.
- **IMDB sentiment** (binary): BERT-family models reach ~95.5% accuracy; a simple BiLSTM with attention achieves ~90%.
- **SST-2 (Stanford Sentiment Treebank, binary)**: SOTA is ~97% accuracy (DeBERTa-v3).
- **SST-5 (fine-grained, 5-class)**: SOTA around ~59% accuracy, reflecting the inherent difficulty of fine-grained distinctions.
- **Training data requirements**: Naive Bayes can work with as few as 100 labeled examples per class; BERT fine-tuning typically needs 1,000+ per class for strong results, though few-shot prompting can reduce this.
- **Inference speed**: Naive Bayes/SVM classify a document in <1 ms; BERT-base takes ~10 ms on GPU per document (batch size 1).
- **Multi-label metrics**: Accuracy is replaced by micro/macro F1, subset accuracy, and Hamming loss.

## Common Misconceptions

**"More data always beats a better algorithm."** While more labeled data helps, architecture matters significantly. BERT fine-tuned on 5,000 examples often outperforms an SVM trained on 50,000, because pre-training captures distributional knowledge from billions of tokens. The pre-training data effectively acts as an enormous unlabeled dataset.

**"Text classification is a solved problem."** Accuracy on clean benchmarks is high, but real-world challenges -- domain shift, class imbalance (e.g., 0.1% fraud in transactions), adversarial inputs, and evolving label definitions -- mean production classifiers require continual monitoring and retraining.

**"Deep learning always outperforms traditional methods."** For small datasets (<1,000 examples), high-dimensional sparse features, or when interpretability is required, Naive Bayes and SVMs remain competitive. A well-tuned TF-IDF + SVM pipeline is a responsible first baseline before reaching for BERT.

**"Multi-class and multi-label are interchangeable terms."** Multi-class assigns exactly one label from k choices (softmax output). Multi-label allows zero, one, or many labels to be active simultaneously (independent sigmoid outputs). Confusing the two leads to incorrect loss functions and evaluation metrics.

## Connections to Other Concepts

- Text classification consumes the representations produced by `tf-idf.md`, `word2vec.md`, and `contextual-embeddings.md` as input features.
- `sentiment-analysis.md` is a specialized form of text classification where labels represent opinion polarity or emotion.
- `convolutional-models-for-text.md` describes the CNN architectures (Kim, 2014) that were a breakthrough for sentence-level classification.
- `long-short-term-memory.md` and `bidirectional-rnns.md` provide the recurrent building blocks for sequence-aware classification.
- `bert.md` and `transfer-learning-in-nlp.md` explain the pre-train-then-fine-tune paradigm that now dominates classification.
- Intent classification within `dialogue-systems.md` is a direct application of text classification.
- `named-entity-recognition.md` can be viewed as token-level classification, extending the document-level framing described here.

## Further Reading

- Joachims, *Text Categorization with Support Vector Machines*, 1998 -- foundational work establishing SVMs as the dominant text classification method for over a decade.
- Kim, *Convolutional Neural Networks for Sentence Classification*, 2014 -- introduced the simple yet effective single-layer CNN architecture for text.
- Devlin et al., *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding*, 2019 -- established the fine-tuning paradigm that redefined text classification baselines.
- Sun et al., *How to Fine-Tune BERT for Text Classification*, 2019 -- practical guide to fine-tuning strategies, learning rates, and layer freezing.
- Liu et al., *RoBERTa: A Robustly Optimized BERT Pretraining Approach*, 2019 -- showed that careful hyperparameter tuning and more pre-training data yield consistent gains across classification tasks.
