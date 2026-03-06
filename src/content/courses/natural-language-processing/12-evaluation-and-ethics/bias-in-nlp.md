# Bias in NLP

**One-Line Summary**: NLP systems absorb, reproduce, and often amplify societal biases present in training data, annotation practices, and modeling decisions, leading to systematic disadvantages for underrepresented groups.

**Prerequisites**: `word2vec.md`, `contextual-embeddings.md`, `text-classification.md`, `named-entity-recognition.md`, `coreference-resolution.md`, `data-annotation-and-labeling.md`

## What Is Bias in NLP?

Imagine a mirror that does not reflect reality faithfully but instead exaggerates certain features -- making some people appear larger and others smaller. NLP systems act like this distorted mirror: they are trained on text written by humans, which encodes centuries of social stereotypes, power imbalances, and cultural assumptions. The systems then reflect these biases back at scale, embedded in translations, search results, hiring tools, and content recommendations -- often more rigidly than the source data, because statistical models amplify patterns they encounter frequently.

Bias in NLP refers to systematic and unfair disparities in how models represent, process, or generate text related to different demographic groups. It is not merely about individual errors but about patterns: a sentiment classifier that systematically rates African American Vernacular English (AAVE) as more negative, a machine translation system that defaults male pronouns for doctors and female pronouns for nurses, or a toxicity detector that flags innocuous mentions of minority identities as toxic. These are not random mistakes -- they are learned patterns from biased data producing biased outputs.

## How It Works

### Sources of Bias

**Training Data Bias**: Language models learn from web text, books, and news articles that reflect historical and ongoing societal biases. Common Crawl, a frequent pre-training source, over-represents English, Western perspectives, and majority viewpoints. Wikipedia, another major source, has ~80% male biography subjects. Models trained on these corpora internalize the statistical associations they contain.

**Annotation Bias**: Human annotators bring their own perspectives. Sap et al. (2019) showed that annotators labeled AAVE tweets as 2.2x more likely to be "offensive" than equivalent Standard American English tweets. Annotation guidelines that fail to account for dialectal variation or cultural context embed annotator demographics into gold labels.

**Modeling Bias**: Algorithmic choices -- architecture, objective function, decoding strategy -- can amplify bias beyond what exists in data. Zhao et al. (2017) demonstrated that structured prediction models amplify gender bias by 5--10% compared to the bias present in training data alone, because the model learns to exploit spurious correlations.

**Evaluation Bias**: Benchmarks that primarily test on Standard English from Western sources create incentive structures that optimize for majority populations while neglecting minority dialects, languages, and cultural contexts.

### Types of Bias

**Gender Bias**: The most extensively studied form. Bolukbasi et al. (2016) famously showed that Word2Vec embeddings encode the analogy "man is to computer programmer as woman is to homemaker." In MT systems, gender-neutral languages (Turkish, Finnish, Hungarian) translated into English produce stereotypical gender assignments: "O bir doktor" (Turkish, gender-neutral "they are a doctor") becomes "He is a doctor" while "O bir hemsire" ("they are a nurse") becomes "She is a nurse."

**Racial Bias**: Blodgett et al. (2020) documented that language identification systems misclassify AAVE as non-English at rates 2--4x higher than Standard American English. Toxicity classifiers like Perspective API show elevated false-positive rates on text containing identity terms for Black, Muslim, and LGBTQ+ individuals. Name-based biases in NER systems produce lower F1 scores on names common in African American, Hispanic, and Asian communities.

**Cultural and Geographic Bias**: NLP systems trained on predominantly Western data perform poorly on concepts, named entities, and writing conventions from non-Western cultures. Coreference resolution systems struggle with kinship terms in languages with complex family structures. Sentiment lexicons assign negative polarity to culturally neutral terms from non-Western contexts.

**Socioeconomic Bias**: Models trained on formal text underperform on text from lower-socioeconomic communities, which may use non-standard orthography, code-switching, or informal registers. Automated essay scoring systems have been shown to correlate with socioeconomic background rather than writing quality.

### Measurement Methods

**Word Embedding Association Test (WEAT)**: Caliskan et al. (2017) adapted the Implicit Association Test from psychology to word embeddings. WEAT measures the differential association of two sets of target words (e.g., European American names vs. African American names) with two sets of attribute words (e.g., pleasant vs. unpleasant). Effect sizes (Cohen's d) of 1.0--1.9 were found for racial and gender associations in GloVe embeddings, comparable to human IAT results.

**Sentence Embedding Association Test (SEAT)**: May et al. (2019) extended WEAT to sentence encoders and contextual embeddings like `bert.md` and `contextual-embeddings.md`, measuring bias in full sentence representations rather than isolated words.

**Counterfactual Evaluation**: Swapping identity terms (e.g., replacing "he" with "she," or "John" with "Jamal") and measuring output changes. Significant output variation on identity swaps indicates bias. Lu et al. (2020) used this approach to measure gender bias in coreference resolution and found accuracy disparities of 10--20% between male and female pronouns in stereotypical contexts.

**Disaggregated Evaluation**: Breaking overall performance metrics into subgroup-specific metrics. A classifier with 92% overall accuracy might achieve 95% on Standard English but only 82% on AAVE, revealing hidden disparities masked by aggregate numbers.

### Debiasing Techniques

**Embedding Debiasing**: Bolukbasi et al. (2016) proposed identifying a "gender subspace" in embedding space via PCA and projecting gender-neutral words (e.g., "doctor," "nurse") away from this subspace. This reduces gender analogy bias by ~70% while preserving embedding utility. However, Gonen and Goldberg (2019) showed that debiased embeddings still cluster gender-stereotyped words together, suggesting the bias is not removed but merely hidden from the analogy test.

**Data Augmentation**: Counterfactual data augmentation (CDA) duplicates training examples with swapped identity terms, balancing the representation of different groups. Zhao et al. (2018) showed CDA reduces gender bias in coreference resolution by 30--40% with minimal accuracy loss.

**Constrained Decoding**: Adding constraints during generation to ensure equitable gender pronoun distribution or preventing stereotypical completions. This is a post-hoc fix that does not address root causes.

**Adversarial Training**: Training the model to perform well on the primary task while simultaneously being unable to predict protected attributes from its internal representations. This encourages demographic-invariant representations.

## Why It Matters

1. **Real-world harm**: Biased NLP systems in hiring, criminal justice, healthcare, and lending can deny opportunities to already marginalized groups, creating feedback loops that deepen inequality.
2. **Scale of impact**: When Google Translate serves billions of queries daily, a systematic gender bias in pronoun assignment affects millions of users' perceptions and information access.
3. **Legal and regulatory risk**: The EU AI Act, US EEOC guidelines, and similar regulations increasingly require bias audits for AI systems used in high-stakes decisions.
4. **Trust and adoption**: Users from underserved communities who experience biased outputs lose trust in NLP systems, creating adoption gaps that widen the digital divide.
5. **Scientific validity**: Models that rely on spurious demographic correlations rather than genuine linguistic features have lower generalization and robustness.

## Key Technical Details

- **WEAT effect sizes**: Gender bias (male/female vs. career/family) d = 1.81 in GloVe; racial bias (European/African American names vs. pleasant/unpleasant) d = 1.41.
- **MT gender accuracy**: Google Translate achieved only ~50% accuracy on gender-neutral-to-English pronoun translation for stereotypically gendered occupations (tested on Turkish, Hungarian, Finnish) as of 2020.
- **Toxicity detector false positives**: Perspective API flags "I am a gay man" as 76% likely toxic vs. "I am a straight man" at 17% (Dixon et al., 2018).
- **NER performance gap**: Mishra et al. (2020) found F1 score differences of 5--15 percentage points between majority and minority name sets across standard NER systems.
- **Bias amplification**: Zhao et al. (2017) measured that a model trained on image captions amplified cooking=female bias from 33% in data to 68% in model predictions.
- **Debiasing trade-offs**: Hard debiasing (Bolukbasi et al., 2016) reduces WEAT gender effect size from 1.81 to ~0.08 but does not eliminate downstream task bias (Gonen and Goldberg, 2019).

## Common Misconceptions

**"Bias is just a data problem -- get better data and it goes away."** While training data is the primary source, bias also enters through annotation schemes, model architectures, evaluation benchmarks, and deployment contexts. Even with perfectly balanced data, models can learn to exploit proxy variables (zip code as a proxy for race, writing style as a proxy for socioeconomic status). Addressing bias requires intervention at every stage of the ML pipeline.

**"Debiasing embeddings solves NLP bias."** Bolukbasi-style debiasing reduces performance on bias benchmarks like WEAT but does not eliminate bias from downstream tasks. Gonen and Goldberg (2019) showed that debiased embeddings still cluster stereotypical words together -- the bias is cosmetically removed from one test while persisting in the representation's deeper structure.

**"Bias only affects marginalized groups."** Bias also produces inaccurate representations of majority groups (e.g., reinforcing stereotypes about men being unemotional or aggressive). While the harm is disproportionate for marginalized groups, biased models are less accurate for everyone because they rely on stereotypical shortcuts rather than genuine linguistic understanding.

**"We can objectively define and eliminate all bias."** Bias is inherently tied to social values that differ across cultures and contexts. What counts as "biased" depends on the application -- a gender-balanced pronoun distribution may be appropriate for a general-purpose translator but inappropriate for translating a text about a specific historical figure. Bias mitigation requires ongoing, context-sensitive human judgment.

## Connections to Other Concepts

- `word2vec.md` and `glove.md` are the embeddings where gender and racial bias were first systematically measured (Bolukbasi et al., 2016; Caliskan et al., 2017).
- `contextual-embeddings.md` and `bert.md` also exhibit bias, measured via SEAT and template-based probing.
- `coreference-resolution.md` is a task where gender bias is particularly impactful (the WinoBias benchmark specifically measures this).
- `named-entity-recognition.md` shows performance disparities across name demographics.
- `machine-translation.md` reveals gender bias through pronoun defaults when translating from gender-neutral languages.
- `fairness-in-nlp.md` addresses the formal frameworks for defining and mitigating the biases documented here.
- `data-annotation-and-labeling.md` covers annotator bias as a source of systematic errors in training labels.
- `sentiment-analysis.md` and `text-classification.md` are downstream tasks where bias manifests as differential accuracy across demographic groups.
- `responsible-nlp-development.md` provides practical guidelines for auditing and documenting bias.

## Further Reading

- Bolukbasi et al., *Man Is to Computer Programmer as Woman Is to Homemaker? Debiasing Word Embeddings*, 2016 -- the landmark paper demonstrating and partially mitigating gender bias in word embeddings.
- Caliskan et al., *Semantics Derived Automatically from Language Corpora Contain Human-Like Biases*, 2017 -- introduced WEAT and showed that statistical word associations mirror human implicit biases.
- Blodgett et al., *Language (Technology) Is Power: A Critical Survey of Bias in NLP*, 2020 -- a comprehensive critical review categorizing bias research and its limitations.
- Bender et al., *On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?*, 2021 -- examines the environmental and social costs of large language models including bias propagation.
- Gonen and Goldberg, *Lipstick on a Pig: Debiasing Methods Cover Up Systematic Gender Biases in Word Embeddings but Do Not Remove Them*, 2019 -- showed that standard debiasing methods are superficial.
- Sap et al., *The Risk of Racial Bias in Hate Speech Detection*, 2019 -- demonstrated how annotator racial bias enters toxicity labels for AAVE text.
