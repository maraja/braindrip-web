# Negation and Speculation Detection

**One-Line Summary**: Negation and speculation detection identifies negated and uncertain statements in text -- determining not just what is said, but what is denied or merely hypothesized -- a capability critical for biomedical NLP, information extraction, and sentiment analysis.

**Prerequisites**: `named-entity-recognition.md`, `information-extraction.md`, `dependency-parsing.md`, `sentiment-analysis.md`, `text-classification.md`.

## What Is Negation and Speculation Detection?

Consider two medical records: "The patient has pneumonia" and "The patient does not have pneumonia." These sentences differ by only two words, yet their clinical meaning is diametrically opposite. A naive information extraction system that matches "patient" + "has" + "pneumonia" would mark both as positive findings. Now consider: "The patient may have pneumonia." This expresses uncertainty -- the diagnosis is speculated but not confirmed. Distinguishing these three states (affirmed, negated, speculated) is the core challenge of negation and speculation detection.

Think of it like reading a detective novel. The detective says: "The butler committed the murder" (assertion). "The butler did not commit the murder" (negation). "The butler might have committed the murder" (speculation). Each statement has dramatically different implications for the investigation. A system that cannot distinguish these would be a terrible detective -- and a dangerous clinical decision support tool.

Negation and speculation detection involves two sub-tasks. **Cue detection** identifies the linguistic markers that signal negation ("not," "no," "without," "denies," "absence of") or speculation ("may," "possible," "suggests," "likely," "consistent with"). **Scope resolution** determines which parts of the sentence fall under the influence of the cue. In "The patient denies chest pain or shortness of breath," the negation cue is "denies" and its scope covers both "chest pain" and "shortness of breath." Getting the scope wrong -- for instance, failing to recognize that "shortness of breath" is also negated -- leads to dangerous extraction errors.

## How It Works

### Negation Cues and Scope

**Negation cues** are the linguistic triggers that reverse the polarity of a statement. They come in several forms:

- **Adverbs and particles**: not, never, no, neither, nor, nowhere
- **Prefixes**: un-, in-/im-/ir-, dis-, non-, a- (e.g., "unremarkable," "impossible," "asymptomatic")
- **Verbs**: deny, lack, refuse, fail, exclude, rule out, absent
- **Prepositions and determiners**: without, no, absence of, free of, negative for
- **Idiomatic expressions**: "far from," "anything but," "by no means"

**Negation scope** is the portion of the sentence whose truth value is reversed by the cue. Scope resolution is challenging because it interacts with syntax and semantics in complex ways:

- "He did **not** [eat the cake or drink the wine]." -- Scope covers both disjuncts.
- "**Not** [all students] passed." -- Scope covers the quantifier, meaning some students failed.
- "He ate **not** [the cake] but the pie." -- Scope is limited to "the cake" (contrastive negation).
- "I don't think [he is coming]." -- Neg-raising: the negation semantically applies to the embedded clause, not to "think."

### Speculation and Hedge Detection

**Speculation cues** (also called hedging markers) signal that a proposition is uncertain, tentative, or conditional:

- **Modal verbs**: may, might, could, should, would
- **Adverbs**: possibly, probably, perhaps, likely, approximately
- **Adjectives**: possible, probable, potential, suspected, apparent
- **Verbs**: suggest, indicate, appear, seem, assume, hypothesize
- **Conditional constructions**: "if...then," "in the event of"
- **Epistemic phrases**: "it is possible that," "there is evidence for," "consistent with"

In scientific and medical writing, hedging is pervasive. Hyland (1998) found that approximately 1 in 5 sentences in biomedical research articles contains at least one hedge, reflecting the cautious, evidence-based nature of scientific discourse. In clinical notes, the frequency is even higher, as clinicians document differential diagnoses and uncertain findings.

### The BioScope Corpus

The BioScope corpus (Vincze et al., 2008) is the most influential annotated resource for negation and speculation detection. It contains:

- **Clinical records**: 1,954 sentences from radiology reports
- **Biomedical papers**: 11,871 sentences from the GENIA corpus (biomedical abstracts)
- **Biomedical paper full texts**: 2,670 sentences

Each sentence is annotated with negation/speculation cues and their scopes. Key statistics:

- In clinical records: approximately 13.5% of sentences contain negation, approximately 13.4% contain speculation.
- In biomedical abstracts: approximately 12.7% contain negation, approximately 17.7% contain speculation.
- Scope boundaries are marked at the token level, enabling precise evaluation of scope resolution systems.

BioScope established the standard evaluation framework: systems are scored on cue detection (precision, recall, F1) and scope resolution (exact match and token-level F1 for the scope boundaries). Top systems achieve approximately 90-95% F1 on cue detection and approximately 75-85% F1 on exact scope match, with clinical text being somewhat easier than scientific text due to more formulaic language.

The SEM 2012 shared task (Morante and Blanco, 2012) extended evaluation to general-domain text from Conan Doyle stories, revealing that negation in literary text is more diverse and challenging than in biomedical text.

### Rule-Based Approaches

**NegEx** (Chapman et al., 2001) is the foundational rule-based negation detection system for clinical text. It uses a simple but effective approach:

1. Define a list of negation trigger phrases ("no," "denies," "without," "no evidence of," etc.).
2. Define a window (default: 5 tokens before and 6 tokens after the trigger).
3. Any medical concept found within the window is marked as negated.
4. Pseudo-negation phrases ("no change," "not only") are excluded via a separate list.

Despite its simplicity, NegEx achieves approximately 84% positive predictive value and approximately 78% sensitivity on clinical text. Its successor, ConText (Harkema et al., 2009), extended NegEx to also handle speculation ("possible," "differential includes") and temporal status (historical vs. current findings), providing a more complete clinical NLP framework.

**NegBio** (Peng et al., 2018) improved upon NegEx by using dependency parse trees rather than surface-level patterns. By traversing syntactic dependencies from a negation cue, NegBio can more accurately determine whether a medical concept falls within the negation's scope, handling longer-range negation and complex sentence structures.

### Neural Scope Resolution

Modern approaches frame scope resolution as a sequence labeling task: given a sentence with an identified cue, label each token as inside or outside the cue's scope.

**BiLSTM-CRF models** (Fancellu et al., 2016) treat scope resolution analogously to named entity recognition, using bidirectional LSTMs to encode context and a CRF layer to enforce consistent scope boundaries. These achieve approximately 80-85% F1 on BioScope scope resolution.

**BERT-based models** (Khandelwal and Sawant, 2020) fine-tune pre-trained transformers for scope resolution, encoding the cue position through special tokens or feature embeddings. BERT-based approaches achieve approximately 85-90% F1 on BioScope, with the primary errors occurring at scope boundaries for complex syntactic constructions. NegBERT (Khandelwal and Sawant, 2020) specifically fine-tunes BERT for negation cue detection and scope resolution, achieving state-of-the-art results across multiple datasets.

**Multi-task learning**: Joint training on negation and speculation detection improves both tasks, as they share linguistic mechanisms (both involve modifying the certainty or truth status of propositions). Systems trained jointly achieve approximately 2-3% F1 improvement over single-task models.

### Why This Matters for Information Extraction and Sentiment Analysis

**Information extraction**: A system extracting drug-disease relationships from biomedical literature must distinguish "Drug X treats Disease Y" (positive finding) from "Drug X does not treat Disease Y" (negated finding) and "Drug X may treat Disease Y" (speculative finding). Without negation detection, extraction systems produce dangerously misleading results. Chapman et al. (2001) found that approximately 60% of conditions mentioned in clinical reports are negated -- ignoring negation means the majority of extracted conditions would be incorrectly classified.

**Sentiment analysis**: "This movie is not bad" is positive, not negative -- despite containing the word "bad." "This product might have quality issues" expresses concern, not a definitive complaint. Negation and speculation shift the polarity and intensity of sentiment in ways that bag-of-words models miss entirely. Handling negation is cited as one of the primary challenges in sentiment analysis research (see `sentiment-analysis.md`).

**Fact verification**: Determining whether a document supports or contradicts a claim requires distinguishing affirmed, negated, and speculated information. A document stating "There is no evidence of fraud" does not support the claim "Fraud was committed" -- but a system that ignores negation might treat the co-occurrence as supporting evidence.

## Why It Matters

1. **Patient safety**: In clinical NLP, failing to detect negation can cause a system to incorrectly assert that a patient has a condition they were explicitly tested negative for -- a potentially life-threatening error.
2. **Drug safety surveillance (pharmacovigilance)**: Adverse drug event extraction from medical records and literature requires distinguishing actual adverse events from negated or speculative mentions.
3. **Accurate information extraction**: Approximately 60% of medical conditions in clinical reports are mentioned in negated contexts. Ignoring this would overwhelm extraction systems with false positives.
4. **Robust sentiment analysis**: Negation handling is essential for correctly interpreting reviews, social media, and customer feedback where negated sentiment words are common.
5. **Scientific literature mining**: Biomedical text mining must distinguish confirmed findings from hypotheses, negative results, and speculations to avoid propagating unverified claims.

## Key Technical Details

- NegEx achieves approximately 84% PPV and approximately 78% sensitivity on clinical negation detection using simple lexical patterns.
- BioScope contains approximately 16,495 sentences annotated for negation and speculation cues and scopes across clinical and biomedical text.
- In clinical reports, approximately 60% of medical conditions are mentioned in negated contexts (Chapman et al., 2001).
- In biomedical abstracts, approximately 17.7% of sentences contain speculation markers (BioScope statistics).
- BERT-based scope resolution achieves approximately 85-90% F1 on BioScope, compared to approximately 80-85% for BiLSTM-CRF models.
- The SEM 2012 shared task reported best cue detection F1 of approximately 93% and best scope resolution F1 of approximately 73% on Conan Doyle stories.
- ConText extends NegEx to cover negation, speculation, and temporal status with similar rule-based efficiency.
- Multi-task training on negation + speculation jointly improves both by approximately 2-3% F1 over single-task training.

## Common Misconceptions

**"Negation detection is just looking for the word 'not.'"**
Negation in natural language is expressed through dozens of mechanisms: prefixes (un-, in-, dis-), verbs (deny, lack, rule out), determiners (no, neither), prepositions (without), and idiomatic expressions (far from, anything but). Clinical text uses domain-specific cues (unremarkable, negative for, free of). The word "not" accounts for only a fraction of all negation instances.

**"Negation always reverses the meaning of the next word."**
Negation scope can extend over complex syntactic spans. In "There is no evidence of metastasis or recurrence," the negation scopes over both "metastasis" and "recurrence." Determining scope boundaries requires syntactic analysis, not simple proximity heuristics.

**"Speculation is just weak negation."**
Speculation and negation are fundamentally different. "The patient does not have cancer" (negation) means the absence of cancer. "The patient may have cancer" (speculation) means the presence is uncertain. A speculated condition still requires follow-up testing; a negated condition typically does not. Conflating them leads to different downstream errors.

**"This only matters for biomedical text."**
While biomedical NLP has driven most negation and speculation research, these phenomena are critical in every domain. Legal text ("The defendant did not enter the building"), financial reports ("The company is unlikely to meet projections"), social media sentiment ("I don't hate this song"), and news ("Officials denied the reports") all require negation and speculation handling.

**"Modern language models handle negation automatically."**
Large language models have improved negation understanding but still make systematic errors. Studies show that BERT-based models struggle with multi-hop negation ("It is not true that he did not attend"), double negation, and negation interacting with quantifiers ("Not all students passed" vs. "All students did not pass"). Explicit negation modeling remains necessary for high-stakes applications.

## Connections to Other Concepts

- `sentiment-analysis.md` depends on negation detection to correctly interpret shifted polarity ("not bad" = positive).
- `information-extraction.md` requires distinguishing affirmed from negated and speculative entities and relations.
- `named-entity-recognition.md` identifies the entities whose assertion status (affirmed, negated, speculated) must be determined.
- `dependency-parsing.md` provides the syntactic structure essential for accurate scope resolution.
- `relation-extraction.md` must handle negated relations ("X is not associated with Y") to avoid false positive extractions.
- `temporal-reasoning.md` intersects in clinical NLP, where events on a patient timeline may be negated or speculative.
- `textual-entailment.md` and `natural-language-inference.md` require negation understanding for contradiction detection.
- `aspect-based-sentiment-analysis.md` must handle negation at the aspect level ("The food was not bad but the service was terrible").
- `domain-adaptation.md` is relevant because negation patterns differ significantly between clinical, biomedical, news, and social media text.

## Further Reading

- Chapman, W. et al., "A Simple Algorithm for Identifying Negated Findings and Diseases in Discharge Summaries," 2001 -- NegEx, the foundational clinical negation detection algorithm.
- Vincze, V. et al., "The BioScope Corpus: Biomedical Texts Annotated for Uncertainty, Negation and Their Scopes," 2008 -- The standard annotated corpus for negation and speculation research.
- Morante, R. and Blanco, E., "*SEM 2012 Shared Task: Resolving the Scope and Focus of Negation," 2012 -- Extending negation evaluation to general-domain text.
- Harkema, H. et al., "ConText: An Algorithm for Determining Negation, Experiencer, and Temporal Status from Clinical Reports," 2009 -- Extending NegEx to cover speculation and temporal status.
- Khandelwal, A. and Sawant, S., "NegBERT: A Transfer Learning Approach for Negation Detection and Scope Resolution," 2020 -- BERT-based approach achieving state-of-the-art negation scope resolution.
- Fancellu, F., Lopez, A., and Webber, B., "Neural Networks for Negation Scope Detection," 2016 -- First neural sequence-labeling approach to negation scope resolution.
- Peng, Y. et al., "NegBio: A High-Performance Tool for Negation and Uncertainty Detection in Radiology Reports," 2018 -- Dependency-parse-based negation detection for clinical text.
