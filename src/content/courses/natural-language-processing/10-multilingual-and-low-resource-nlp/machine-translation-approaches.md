# Machine Translation Approaches

**One-Line Summary**: The evolution of machine translation from hand-coded linguistic rules through statistical phrase tables to end-to-end neural models -- each paradigm shift dramatically improving quality and reducing engineering effort.

**Prerequisites**: `sequence-to-sequence-models.md`, `attention-mechanism.md`, `recurrent-neural-networks.md`, `n-gram-language-models.md`, `tokenization-in-nlp.md`

## What Is Machine Translation?

Imagine three generations of translators. The grandparent meticulously consults grammar books and bilingual dictionaries, applying rules to convert each sentence piece by piece -- accurate but slow and brittle. The parent, instead of reading grammar books, studies millions of already-translated document pairs and memorizes which phrases tend to correspond -- faster and more robust, but still stitching together fragments. The grandchild reads widely in both languages, develops a deep intuitive understanding of meaning, and produces translations that flow naturally -- sometimes brilliantly, sometimes with surprising errors no human would make.

Machine translation (MT) automates the conversion of text from a source language to a target language. It is one of the oldest problems in AI (Warren Weaver's 1949 memorandum), one of the most commercially impactful (Google Translate serves over 500 million users), and one of the most technically demanding -- requiring the system to handle semantics, syntax, pragmatics, and cultural context simultaneously.

This file covers the evolution of MT approaches in depth. For the broader context of how MT fits into multilingual NLP, see `multilingual-nlp.md` and `machine-translation.md` in the generation category.

## How It Works

### Rule-Based MT (1950s--1990s)

Rule-Based MT (RBMT) encodes linguistic knowledge manually. Three architectures emerged:

**Direct Transfer**: Word-by-word replacement using bilingual dictionaries with minimal structural adjustment. The simplest approach, producing outputs like translating "The house is big" to French as "La maison est grand" (missing gender agreement). Used in early systems like Georgetown-IBM (1954).

**Transfer-Based**: The source sentence is parsed into an intermediate syntactic representation, language-pair-specific transfer rules transform this structure, and a target-language generator produces the output. SYSTRAN, used by the European Commission for decades, exemplified this approach.

**Interlingua**: Maps the source into a language-independent meaning representation (an "interlingua"), from which any target language can be generated. Theoretically elegant -- N languages need only N analyzers and N generators rather than N^2 transfer rule sets -- but defining a universal meaning representation proved intractable. The UNL (Universal Networking Language) project attempted this at scale without commercial success.

RBMT required years of expert effort per language pair and handled idioms, ambiguity, and domain variation poorly, but it remained dominant for 40 years due to the absence of viable alternatives.

### Statistical MT (1990s--2015)

Statistical MT (SMT) replaced hand-coded rules with probabilities learned from parallel corpora.

**The Noisy Channel Model**: Brown et al. (1993) at IBM formalized MT as: given target sentence e, find the source sentence f that maximizes P(f|e) = P(e|f) * P(e). The translation model P(e|f) is learned from parallel data, and the language model P(e) ensures fluent output.

**IBM Models (1--5)**: A sequence of increasingly sophisticated alignment models. Model 1 assumes uniform alignment probabilities. Model 2 adds position-dependent alignment. Model 3 introduces fertility (one source word producing multiple target words). Models 4 and 5 handle reordering. These models were the theoretical backbone of SMT, trained using Expectation-Maximization (EM).

**Phrase-Based SMT**: Koehn et al. (2003) extended word-level alignment to phrase pairs, the breakthrough that made SMT practical. A phrase table maps source phrases to target phrases with associated probabilities. The Moses toolkit (Koehn et al., 2007) became the standard open-source SMT system. A log-linear model combines:
- Phrase translation probabilities (forward and backward)
- Lexical weighting scores
- Language model score (typically a 5-gram KenLM model)
- Distortion penalty (reordering cost)
- Word penalty

Weights were tuned via Minimum Error Rate Training (MERT) to maximize BLEU on a development set. Phrase-based SMT dominated MT from 2003 to 2016 and achieved BLEU scores of 25--35 on WMT English-German.

### Neural MT (2014--present)

**Seq2Seq with Attention**: Sutskever et al. (2014) introduced encoder-decoder RNNs for MT. The encoder reads the source sentence into a fixed-length vector; the decoder generates the target sentence from this vector. Bahdanau et al. (2015) added attention, allowing the decoder to dynamically focus on relevant source positions at each generation step. This resolved the information bottleneck and improved English-French BLEU by approximately 5 points over phrase-based SMT.

**Transformer-Based NMT**: Vaswani et al. (2017) replaced recurrence entirely with self-attention, enabling massive parallelization during training. The original Transformer achieved 28.4 BLEU on WMT 2014 English-German and 41.0 on English-French. Transformer-based NMT became the universal standard within two years.

**Google NMT (GNMT)**: Wu et al. (2016) deployed an 8-layer LSTM encoder-decoder with attention at Google, reducing translation errors by 60% relative to phrase-based SMT. This was the industrial watershed -- NMT overtook SMT in production overnight. Google reported that on some language pairs, GNMT approached "human parity," though this claim remains debated (the evaluation used a narrow news domain with bilingual raters, and subsequent studies showed significant gaps in broader domains).

### Document-Level MT

Most MT systems translate sentence-by-sentence, losing discourse coherence. Document-level MT addresses:
- **Pronoun consistency**: "She ... her ... she" across sentences requires tracking coreference across sentence boundaries.
- **Lexical cohesion**: Using the same translation for a term throughout a document (e.g., consistently translating "bank" as "banque" vs. "rive" in a financial context).
- **Discourse connectives**: "However," "therefore," and other connectives depend on cross-sentence context.

Approaches include context-aware transformers that attend to previous sentences (Voita et al., 2019) and document-level training with extended context windows. Performance improvements are modest (1--2 BLEU) but targeted discourse phenomena (pronoun translation accuracy) improve by 10--15%.

### Unsupervised MT

Lample et al. (2018) and Artetxe et al. (2018) demonstrated MT without any parallel data at all, using:
1. Cross-lingual word embeddings (see `cross-lingual-word-embeddings.md`) for initial word-by-word translation.
2. Denoising auto-encoding in each language to learn language-specific generation.
3. Back-translation to iteratively generate synthetic parallel data and improve the model.

Unsupervised NMT achieves 15--25 BLEU on closely related language pairs (English-French, English-German) -- far below supervised NMT but remarkable for requiring zero parallel data. Performance degrades sharply for distant pairs.

## Why It Matters

1. **Global communication**: MT enables cross-lingual access to information for over 500 million daily users of translation services.
2. **NLP research catalyst**: Attention mechanisms, the Transformer, subword tokenization (BPE), and back-translation all originated in MT research before spreading to the entire NLP field.
3. **Commercial impact**: Translation services, localization, multilingual customer support, and cross-border e-commerce depend on MT.
4. **Human translator augmentation**: Post-editing NMT output is 2--3x faster than translating from scratch for high-resource language pairs.
5. **Low-resource language access**: MT is the primary mechanism for bringing digital content to speakers of underserved languages, though quality varies enormously.

## Key Technical Details

- WMT (Workshop on Machine Translation) has been the primary shared task since 2006, covering dozens of language pairs with standardized test sets.
- BLEU milestones on WMT English-German: phrase-based SMT ~25 (2014), attention-based NMT ~28 (2016), Transformer ~33 (2018), current SOTA ~40+ (2024).
- Subword tokenization via BPE (Sennrich et al., 2016) with 32K--64K merge operations is standard, enabling open-vocabulary translation.
- Back-translation (Sennrich et al., 2016) generates synthetic parallel data from monolingual target text, yielding +2--4 BLEU improvements consistently.
- M2M-100 (Fan et al., 2021) supports direct translation between any pair of 100 languages using 15 billion parameters, without pivoting through English.
- NLLB (No Language Left Behind, Costa-jussa et al., 2022) extends coverage to 200 languages with 54 billion parameters, achieving over 30 BLEU on many previously unsupported pairs.
- Human parity claims remain controversial: Hassan et al. (2018) claimed parity on WMT Chinese-English news, but Laubli et al. (2018) showed human raters preferred human translations when evaluating entire documents rather than isolated sentences.

## Common Misconceptions

- **"Neural MT solved machine translation."** NMT dramatically improved quality for the roughly 20 highest-resource language pairs. For the majority of language pairs, MT quality remains poor or unavailable. Domain shift, rare terminology, and document-level coherence remain unsolved.

- **"BLEU score captures translation quality."** BLEU correlates with human judgments at the system level but poorly at the sentence level. It penalizes valid paraphrases, cannot detect critical meaning errors, and shows low correlation with human judgments for high-quality systems. Learned metrics like COMET (Rei et al., 2020) and BLEURT show 10--15% higher human correlation.

- **"Statistical MT is completely obsolete."** While NMT dominates, SMT concepts persist: phrase-table-inspired memory-augmented NMT, the noisy channel approach in reranking, and MERT-style tuning. For extremely low-resource pairs where neural models cannot train, statistical methods can still outperform NMT.

- **"More parallel data always helps."** Data quality matters enormously. Noisy web-crawled parallel data (e.g., Paracrawl) can degrade NMT performance without careful filtering. Koehn et al. (2020) showed that filtering 50% of noisy parallel data improved BLEU by 2--3 points.

## Connections to Other Concepts

- **`sequence-to-sequence-models.md`**: The encoder-decoder architecture was developed for MT and remains its backbone.
- **`attention-mechanism.md`**: Attention was invented for MT (Bahdanau et al., 2015) and is central to all modern MT systems.
- **`multilingual-nlp.md`**: MT is both a core multilingual application and a tool for cross-lingual data creation.
- **`cross-lingual-word-embeddings.md`**: Aligned embeddings enable unsupervised MT and are used for initial word-by-word translation.
- **`data-augmentation-for-nlp.md`**: Back-translation, the most effective data augmentation for MT, generates synthetic parallel data from monolingual text.
- **`low-resource-nlp.md`**: Low-resource MT is one of the most challenging and impactful applications of low-resource NLP techniques.
- **`tokenization-in-nlp.md`**: BPE subword tokenization was developed specifically for NMT to handle open vocabularies.
- **`evaluation-metrics-for-nlp.md`**: BLEU, METEOR, COMET, and other MT evaluation metrics are detailed there.

## Further Reading

- Brown et al., "The Mathematics of Statistical Machine Translation" (1993) -- The foundational IBM alignment models that launched statistical MT.
- Koehn et al., "Statistical Phrase-Based Translation" (2003) -- Phrase-based SMT, the dominant paradigm for over a decade.
- Bahdanau et al., "Neural Machine Translation by Jointly Learning to Align and Translate" (2015) -- The attention mechanism paper that transformed NMT.
- Vaswani et al., "Attention Is All You Need" (2017) -- The Transformer architecture that became the universal foundation for NMT.
- Lample et al., "Unsupervised Machine Translation Using Monolingual Corpora Only" (2018) -- Demonstrated MT without any parallel data.
- Fan et al., "Beyond English-Centric Multilingual Machine Translation" (2021) -- M2M-100 enabling direct translation between 100 language pairs.
- Costa-jussa et al., "No Language Left Behind: Scaling Human-Centered Machine Translation" (2022) -- NLLB extending MT to 200 languages.
