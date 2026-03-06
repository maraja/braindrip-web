# Privacy in NLP

**One-Line Summary**: Language models memorize and can regurgitate sensitive training data -- including personal identifiers, phone numbers, and medical records -- creating privacy risks that require techniques like differential privacy, federated learning, and de-identification to mitigate.

**Prerequisites**: `n-gram-language-models.md`, `gpt-for-nlp-tasks.md`, `bert.md`, `transfer-learning-in-nlp.md`, `text-generation.md`

## What Is Privacy in NLP?

Imagine a parrot that has listened to thousands of conversations in a hospital. Most of the time, it repeats generic phrases about health and wellness. But occasionally, unprompted, it recites a specific patient's name, diagnosis, and address verbatim. Large language models behave similarly: they are trained on vast text corpora and sometimes memorize and reproduce specific training examples, including personally identifiable information (PII), credit card numbers, email addresses, and private communications.

Privacy in NLP addresses the fundamental tension between training powerful language models on large, diverse datasets and protecting the sensitive information those datasets contain. The challenge is that the very properties that make models useful -- their ability to learn and recall patterns from training data -- also make them privacy risks. A model that has "seen" a person's medical records during training might reveal that information during inference, even if the model's creators never intended for it to memorize individual records.

## How It Works

### Memorization in Language Models

**Training Data Extraction**: Carlini et al. (2021) demonstrated that GPT-2 memorizes and can emit verbatim sequences from its training data. By generating text with the model and comparing outputs against the training corpus, they extracted hundreds of memorized sequences including names, phone numbers, IRC usernames, and code snippets. Approximately 0.01--1% of GPT-2's generations match training data verbatim for sequences of 50+ tokens, and this rate increases with model size.

**Memorization Scales with Model Size**: Carlini et al. (2023) showed that memorization increases log-linearly with model parameters and with data duplication. A 1.5B parameter model memorizes ~10x more sequences than a 124M parameter model. Data that appears multiple times in the training corpus is disproportionately memorized -- a sequence appearing 10 times is ~100x more likely to be extractable than one appearing once.

**Unintended Memorization**: Even in models not designed for recall, fine-tuning on sensitive data (clinical notes, emails, legal documents) can cause the model to memorize specific passages. Lehman et al. (2021) showed that clinical BERT models fine-tuned on medical records could be prompted to generate recognizable patient information fragments.

### Membership Inference Attacks

Membership inference determines whether a specific data point was in the model's training set. Shokri et al. (2017) introduced shadow model training: train multiple models on known data, then train an attack classifier to distinguish member vs. non-member behavior. For language models, this often exploits the fact that models assign higher probability (lower perplexity) to training data than to unseen data.

Carlini et al. (2022) refined this for LMs, achieving membership inference AUC of 0.65--0.85 on GPT-2-scale models. For canary sequences (known injected strings), detection rates exceed 90%. The practical implication: an adversary can determine with reasonable confidence whether a specific document was in a model's training data, violating data subject privacy.

### Differential Privacy for NLP

**Differential Privacy (DP)** provides a mathematical guarantee that any single training example has limited influence on the model's behavior. Formally, a mechanism M satisfies (epsilon, delta)-DP if for any two datasets D and D' differing by one record, and any set of outcomes S: P(M(D) in S) <= exp(epsilon) * P(M(D') in S) + delta.

**DP-SGD (Differentially Private Stochastic Gradient Descent)**: Abadi et al. (2016) introduced DP-SGD, which clips per-example gradients to bound their norm, then adds calibrated Gaussian noise. The privacy budget (epsilon) accumulates over training steps. Applied to NLP:

- McMahan et al. (2018) trained next-word prediction models with DP-SGD at epsilon = 8.9, achieving within 2--5% of non-private baseline perplexity on mobile keyboard prediction.
- Li et al. (2022) fine-tuned GPT-2 with DP at epsilon = 3, showing 8--15% accuracy drops on downstream tasks compared to non-private fine-tuning.
- The privacy-utility trade-off is steep: epsilon < 1 (strong privacy) typically degrades task performance by 15--30%, making practical deployment challenging.

**Private Fine-Tuning**: Because pre-training on public data does not require DP protection, a common strategy is to pre-train without DP on public text and then privately fine-tune on sensitive data. Yu et al. (2022) showed this approach achieves reasonable utility at epsilon = 1--3 for classification tasks, compared to catastrophic utility loss when applying DP to the entire training pipeline.

### Federated Learning for Text

Federated learning trains models without centralizing raw data. Each device (phone, hospital server) trains on its local data, sends only gradient updates to a central server, and the server aggregates updates to improve the global model. McMahan et al. (2017) introduced Federated Averaging for language modeling.

**Applications in NLP**: Google's Gboard keyboard prediction uses federated learning to improve autocomplete from user typing patterns without uploading text to servers. Each phone trains a local model update on the user's typed text, the updates are aggregated via secure aggregation, and the improved model is pushed back to devices.

**Challenges**: Federated learning for NLP faces non-IID data (each user has unique vocabulary and style), communication efficiency (gradient updates for 100M+ parameter models are large), and the need to combine FL with differential privacy (federated DP) for formal guarantees. Kairouz et al. (2021) provide a comprehensive survey of these challenges.

### De-Identification

**Clinical Text De-Identification**: Removing or replacing PHI (Protected Health Information) from medical records before use. The HIPAA Safe Harbor standard requires removing 18 categories of identifiers (names, dates, locations, etc.). NER-based systems (see `named-entity-recognition.md`) trained on annotated clinical text achieve 95--98% recall on standard PHI categories, but rare identifiers (unique occupations, family relationships) remain challenging.

**Legal Text Redaction**: Anonymizing court documents, contracts, and filings while preserving legal reasoning. Named entities, dates, and financial figures must be consistently replaced (e.g., all mentions of "John Smith" become "PERSON_1") to maintain document coherence.

**Limitations**: De-identification is not foolproof. Unique combinations of quasi-identifiers (age + zip code + diagnosis) can re-identify individuals even after removing direct identifiers. Sweeney (2000) famously showed that 87% of US citizens are uniquely identifiable by zip code + birth date + gender alone.

### GDPR and the Right to Be Forgotten

The EU General Data Protection Regulation grants individuals the right to have their data deleted. For trained models, this creates a paradox: how do you "delete" a data point that has been absorbed into billions of parameters? **Machine unlearning** is an emerging field addressing this. Bourtoule et al. (2021) proposed SISA (Sharded, Isolated, Sliced, Aggregated) training, which partitions training data so that unlearning a data point requires retraining only one shard. For large language models, exact unlearning remains computationally infeasible, and approximate methods are an active research area.

## Why It Matters

1. **Legal compliance**: GDPR, HIPAA, CCPA, and similar regulations impose strict requirements on handling personal data, with fines up to 4% of global annual revenue for GDPR violations.
2. **Patient safety**: Clinical NLP systems that leak patient information violate medical confidentiality and can cause tangible harm to individuals.
3. **Model deployment**: Organizations cannot deploy language models trained on sensitive data without privacy guarantees, limiting the potential of NLP in healthcare, legal, and financial domains.
4. **Trust**: Users who learn that their messages, search queries, or documents were memorized by a model lose trust in the service, affecting adoption and willingness to provide data.
5. **Dual-use risk**: Memorization enables targeted extraction attacks where adversaries deliberately probe models to extract information about specific individuals.

## Key Technical Details

- **GPT-2 memorization**: Carlini et al. (2021) extracted 604 unique memorized training sequences of 256+ tokens from GPT-2 (1.5B parameters) using 600,000 generated samples.
- **Memorization scaling**: Doubling model parameters increases extractable memorized content by ~1.5x (Carlini et al., 2023).
- **DP-SGD overhead**: DP training is 2--10x slower than non-private training due to per-example gradient clipping and noise addition. Memory overhead is ~2x because per-example gradients cannot be batched as efficiently.
- **Privacy-utility frontier**: For BERT fine-tuning on GLUE tasks, epsilon = 8 yields ~3% accuracy loss; epsilon = 1 yields ~10--15% accuracy loss; epsilon = 0.1 is typically impractical.
- **De-identification benchmarks**: The 2014 i2b2/UTHealth de-identification shared task top system achieved 92.6% strict F1 on PHI entities; modern transformer-based systems achieve 96--98%.
- **Federated learning communication**: A single round of federated averaging for a 110M parameter BERT model transmits ~440MB per device, making communication compression essential.
- **Machine unlearning**: Exact unlearning via SISA requires retraining one shard (~5--20% of training cost) vs. full retraining; approximate unlearning methods are 100--1000x cheaper but lack formal guarantees.

## Common Misconceptions

**"Only models trained on private data have privacy issues."** Models trained on "public" web data still memorize personal information -- email addresses, phone numbers, and home addresses posted online without the individual's awareness or consent. Carlini et al.'s GPT-2 extraction targeted a model trained on publicly scraped web text, not private data.

**"Differential privacy makes models useless."** While the privacy-utility trade-off is real, recent advances in private fine-tuning (pre-train publicly, fine-tune privately) achieve reasonable utility at practical privacy budgets (epsilon = 3--8). For classification tasks, the accuracy gap is often 2--5%, not the 15--30% seen in full private training.

**"De-identification completely protects privacy."** Even perfect de-identification of direct identifiers leaves re-identification risk from quasi-identifier combinations. Narrative text in clinical notes often contains implicit identifying information ("the mayor of Springfield who underwent surgery in March") that rule-based systems miss.

**"Federated learning inherently guarantees privacy."** Raw federated learning without differential privacy leaks information through gradient updates. Zhu et al. (2019) demonstrated that individual training examples can be reconstructed from shared gradients in certain settings. Federated learning provides a privacy improvement over centralized training but requires additional mechanisms (secure aggregation, DP noise) for formal guarantees.

## Connections to Other Concepts

- `gpt-for-nlp-tasks.md` and `text-generation.md` describe the autoregressive models most susceptible to training data extraction via sampling.
- `bert.md` and `transfer-learning-in-nlp.md` relate through the pre-train-publicly-then-fine-tune-privately paradigm that makes DP practical.
- `named-entity-recognition.md` provides the core technology for de-identification systems that detect PII in text.
- `bias-in-nlp.md` intersects with privacy through the tension between collecting demographic data for bias auditing and protecting individual privacy.
- `fairness-in-nlp.md` faces the challenge that demographic attributes needed for fairness evaluation may be private information.
- `responsible-nlp-development.md` covers the documentation practices (datasheets, model cards) that should include privacy impact assessments.
- `domain-adaptation.md` is relevant because fine-tuning on sensitive domain data (medical, legal) is where privacy risks are most acute.
- `nlp-for-social-good.md` describes healthcare and legal applications where privacy is a prerequisite for deployment.

## Further Reading

- Carlini et al., *Extracting Training Data from Large Language Models*, 2021 -- the landmark paper demonstrating that GPT-2 memorizes and leaks verbatim training sequences.
- Abadi et al., *Deep Learning with Differential Privacy*, 2016 -- introduced DP-SGD, the foundational algorithm for private neural network training.
- McMahan et al., *Learning Differentially Private Recurrent Language Models*, 2018 -- applied DP to language modeling with practical privacy budgets.
- McMahan et al., *Communication-Efficient Learning of Deep Networks from Decentralized Data*, 2017 -- introduced Federated Averaging, the standard federated learning algorithm.
- Bourtoule et al., *Machine Unlearning*, 2021 -- proposed the SISA framework for efficient removal of training data influence from models.
- Carlini et al., *Quantifying Memorization Across Neural Language Models*, 2023 -- systematic study of how memorization scales with model size and data duplication.
