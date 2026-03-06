# Low-Resource NLP

**One-Line Summary**: Techniques for building effective NLP systems when labeled data is scarce -- from few-shot and zero-shot learning to active learning and cross-lingual transfer -- addressing the reality that most languages and domains lack sufficient annotated data.

**Prerequisites**: `transfer-learning-in-nlp.md`, `bert.md`, `text-classification.md`, `named-entity-recognition.md`, `multilingual-nlp.md`

## What Is Low-Resource NLP?

Imagine you are a doctor arriving in a remote village where no medical records exist, no lab equipment is available, and the few local health workers speak a language you do not know. You must still diagnose patients. You draw on your training from well-equipped hospitals (transfer learning), ask the most informative questions first (active learning), learn from the patterns in even tiny amounts of data (few-shot learning), and collaborate with local experts who can translate your knowledge (cross-lingual transfer). Low-resource NLP faces an analogous challenge.

Low-resource NLP encompasses the methods and strategies for building NLP systems in settings where labeled training data is scarce or unavailable. This includes low-resource languages (the vast majority of the world's 7,000+ languages), specialized domains (medical, legal, scientific text in niche areas), and emerging tasks without established benchmarks.

The challenge is compounded: low-resource languages typically also lack preprocessing tools (tokenizers, morphological analyzers), trained annotators who speak the language, evaluation benchmarks to measure progress, and sometimes even standardized orthography. This "compound effect" means that building NLP for Yoruba or Quechua is not merely a data scarcity problem -- it is a tooling, expertise, and infrastructure scarcity problem.

## How It Works

### Zero-Shot Cross-Lingual Transfer

The most impactful approach for low-resource languages: train a model on labeled data in a high-resource language (typically English) and apply it directly to a target language using a multilingual model as the bridge.

**How it works**: Fine-tune a multilingual transformer (see `multilingual-transformers.md`) like XLM-R on English-labeled data for a task (NER, sentiment, NLI). At inference, feed in target-language text. The shared multilingual representation space enables transfer without any target-language labels.

**Typical performance**: 60--80% of fully supervised target-language performance, depending on language similarity and task complexity. On XNLI, XLM-R achieves 81% on English vs. 72% on Swahili (zero-shot), a gap of 9 points. On WikiANN NER, zero-shot transfer from English to Yoruba achieves F1 of approximately 50%, compared to 85%+ for English supervised.

**Data requirement**: 0 labeled examples in the target language. Requires only a pre-trained multilingual model and source-language task data.

### Few-Shot Learning

Train models from very small labeled datasets, typically 8--256 examples per class.

**Pattern-exploiting training (PET)**: Schick and Schutze (2021) reformulate classification as cloze tasks. For sentiment, "This movie was ___" with verbalizers mapping "great" to positive and "terrible" to negative. With only 10 labeled examples per class, PET achieves within 5% of full supervision on several English benchmarks.

**Prototypical Networks**: Compute a class prototype as the mean embedding of the few support examples, then classify query examples by nearest prototype in embedding space. Effective for NER with 5--20 labeled entities per type.

**Prompt-based approaches**: Leveraging `prompt-based-nlp.md` techniques, large language models can perform tasks with 0--32 demonstrations in the prompt context (in-context learning). GPT-3 with 32 examples achieves 80--90% of fine-tuned BERT performance on many classification tasks (Brown et al., 2020).

**Data requirement**: 8--256 labeled examples per class, depending on method and task.

### Active Learning

Strategically select which examples to annotate to maximize model improvement per labeled example.

**Uncertainty sampling**: Label examples where the model is least confident. For a classifier outputting probabilities, select x = argmax H(y|x), where H is entropy. This focuses annotation effort on the decision boundary.

**Query-by-committee**: Train an ensemble of models and select examples where they disagree most.

**Diversity sampling**: Ensure selected examples cover the input space, avoiding redundant annotations.

**Typical savings**: Active learning achieves the same performance as random sampling with 25--50% fewer labeled examples. Settles (2009) showed that for text classification, active learning reaches 95% of full-data accuracy with only 30% of the labels.

**Data requirement**: Typically 100--1,000 labeled examples, strategically chosen, to match the performance of 1,000--10,000 randomly selected labels.

### Self-Training

Use a model's own predictions on unlabeled data as pseudo-labels to expand the training set.

1. Train an initial model on the small labeled set.
2. Apply the model to a large unlabeled corpus.
3. Select high-confidence predictions (e.g., probability > 0.9) as pseudo-labels.
4. Retrain the model on labeled + pseudo-labeled data.
5. Iterate.

Self-training with BERT-based models (Xie et al., 2020) improves text classification accuracy by 3--8% on benchmarks when starting from 20--100 labeled examples. The key risk is confirmation bias: errors in pseudo-labels propagate and amplify through iterations.

**Data requirement**: 20--100 labeled examples + large unlabeled corpus (10K+ examples).

### Label Propagation and Semi-Supervised Learning

Spread labels from a few labeled examples to unlabeled examples through a graph structure (label propagation) or consistency-based regularization.

**Label propagation**: Build a k-NN graph over all examples (labeled and unlabeled). Iteratively propagate labels along graph edges weighted by feature similarity. Effective when the class structure aligns with feature-space clusters.

**UDA (Unsupervised Data Augmentation)**: Xie et al. (2020) enforce consistency between a model's predictions on clean text and augmented text, using only a few labeled examples plus a large unlabeled corpus. With 20 labeled examples on IMDb sentiment, UDA achieves 95.8% accuracy -- nearly matching the 95.9% from 25,000 labeled examples.

### Annotation Projection Across Languages

Transfer annotations from a high-resource language to a low-resource language using parallel corpora and word alignment.

1. Annotate English text with NER tags (e.g., using an English NER model).
2. Align the English text with its target-language translation using word alignments from statistical MT tools (GIZA++) or cross-lingual embeddings.
3. Project English entity tags onto aligned target-language words.
4. Train a target-language NER model on the projected annotations.

This approach introduces noise from both alignment errors and annotation errors but provides a viable path when no target-language annotations exist. Yarowsky et al. (2001) demonstrated the approach across 8 languages for POS tagging and NER, achieving 80--90% of supervised accuracy.

**Data requirement**: Parallel corpus (even 10K sentence pairs help), plus a high-resource-language task model.

## Why It Matters

1. **Majority of the world**: Over 6,500 languages are low-resource. NLP that only works for high-resource languages serves a minority of the world's linguistic diversity.
2. **Specialized domains**: Even in English, medical, legal, and scientific subdomains often lack sufficient labeled data for specific tasks.
3. **Cost reduction**: Active learning and few-shot methods reduce annotation costs by 50--90%, making NLP feasible for organizations without large annotation budgets.
4. **Rapid prototyping**: Low-resource techniques enable building a working system in days rather than months, allowing faster iteration and deployment.
5. **Equity**: Extending NLP capabilities to underserved languages and communities is both a social good and a commercial opportunity.

## Key Technical Details

- Zero-shot cross-lingual transfer with XLM-R: 0 target-language labels needed; achieves 60--80% of supervised performance.
- Few-shot with PET: 10 labels per class achieves within 5% of full supervision on English benchmarks.
- GPT-3 in-context learning: 32 labeled examples in the prompt achieves 80--90% of fine-tuned BERT for classification.
- Active learning: Typically needs 25--50% fewer labels than random sampling to reach equivalent performance.
- Self-training: 20--100 labeled examples + large unlabeled corpus yields 3--8% accuracy improvement.
- UDA: 20 labeled examples on IMDb achieve 95.8% accuracy (vs. 95.9% with 25K labels).
- Annotation projection: Achieves 80--90% of supervised accuracy for NER and POS tagging with parallel corpora.
- The compound effect: For truly low-resource languages, the absence of tools, annotators, and evaluation data makes every technique harder to apply and harder to evaluate.
- MasakhaNER (Adelani et al., 2021) created NER benchmarks for 10 African languages, revealing that zero-shot transfer from English achieves only 40--60% F1 compared to 70--85% with even small in-language training sets.

## Common Misconceptions

- **"Low-resource just means not enough labeled data."** The compound effect is critical: low-resource languages also lack tokenizers, pretrained models, annotators, evaluation data, and often a standardized writing system. Data scarcity is the most visible symptom of a deeper infrastructure gap.

- **"Zero-shot transfer eliminates the need for target-language data."** Zero-shot performance varies enormously by language. For languages typologically distant from English or underrepresented in multilingual pre-training data, zero-shot transfer may perform only marginally above random. Even 50--100 labeled examples in the target language can improve performance by 10--20 F1 points.

- **"Data augmentation can replace real labeled data."** Augmentation amplifies existing signal but cannot create signal from nothing. With 0 labeled examples, augmentation is impossible. With very few examples (5--10), augmentation helps but cannot match the quality of even modest real annotations (100--500 examples).

- **"You just need a bigger pretrained model."** While larger multilingual models help, they disproportionately benefit languages already well-represented in pre-training data. Scaling mBERT to XLM-R improved English XNLI by 5 points but Swahili by only 2 points.

## Connections to Other Concepts

- **`multilingual-transformers.md`**: The backbone for zero-shot cross-lingual transfer, the most widely used low-resource technique.
- **`multilingual-nlp.md`**: Low-resource NLP is a central challenge within the broader multilingual NLP field.
- **`data-augmentation-for-nlp.md`**: Augmentation techniques multiply the value of scarce labeled data.
- **`cross-lingual-word-embeddings.md`**: Enable cross-lingual transfer for languages not covered by multilingual transformers.
- **`machine-translation-approaches.md`**: MT enables translate-train and translate-test approaches and provides parallel data for annotation projection.
- **`cross-lingual-transfer.md`**: Detailed treatment of how models transfer task knowledge across languages.
- **`prompt-based-nlp.md`**: Prompt-based methods are particularly effective in few-shot settings.
- **`data-annotation-and-labeling.md`**: Understanding annotation processes is key to designing efficient active learning strategies.
- **`text-classification.md`**: Classification tasks are the most common testbed for low-resource techniques.

## Further Reading

- Hedderich et al., "A Survey on Recent Approaches for Natural Language Processing in Low-Resource Scenarios" (2021) -- Comprehensive survey covering data augmentation, transfer, and semi-supervised methods.
- Schick and Schutze, "Exploiting Cloze-Questions for Few-Shot Text Classification and Natural Language Inference" (2021) -- The PET method for few-shot NLP via pattern exploitation.
- Xie et al., "Unsupervised Data Augmentation for Consistency Training" (2020) -- UDA demonstrating near-full-supervision performance with 20 labeled examples.
- Adelani et al., "MasakhaNER: Named Entity Recognition for African Languages" (2021) -- Benchmark revealing the gap between zero-shot transfer and in-language supervision for African languages.
- Settles, "Active Learning Literature Survey" (2009) -- Foundational survey on active learning strategies and their application to NLP.
- Yarowsky et al., "Inducing Multilingual Text Analysis Tools via Robust Projection Across Aligned Corpora" (2001) -- Pioneering work on cross-lingual annotation projection.
