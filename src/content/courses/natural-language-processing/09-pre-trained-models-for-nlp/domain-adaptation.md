# Domain Adaptation

**One-Line Summary**: Domain adaptation extends general-purpose pre-trained models to specialized domains -- biomedical, scientific, financial, legal, and clinical text -- through continued pre-training on domain corpora, producing models like BioBERT, SciBERT, and FinBERT that outperform their general counterparts by 2-10% on in-domain tasks.

**Prerequisites**: `transfer-learning-in-nlp.md`, `bert.md`, `text-classification.md`, `named-entity-recognition.md`, `contextual-embeddings.md`

## What Is Domain Adaptation?

Imagine a general practitioner who decides to specialize in cardiology. They do not start medical school over from scratch -- they build on their existing medical knowledge and spend additional years focusing on heart-related cases, reading cardiology journals, and learning specialized terminology. After this focused training, they are better at diagnosing heart conditions than a general practitioner, even though both share the same foundational medical education. Domain adaptation in NLP works the same way: you take a pre-trained model with broad language understanding and give it additional exposure to text from a specific domain.

Domain adaptation addresses a critical gap in transfer learning. Models like `bert.md` are pre-trained on general-domain corpora (Wikipedia, BooksCorpus, web text) that underrepresent the vocabulary, writing style, and knowledge of specialized domains. A general BERT model encountering "The patient presented with acute myocardial infarction with ST-segment elevation" faces two problems: its WordPiece tokenizer may fragment domain-specific terms suboptimally, and its pre-trained representations may not adequately capture the semantic relationships between medical concepts. Domain adaptation solves both problems by continuing the pre-training process on in-domain text.

The result is a three-stage pipeline -- general pre-training, domain-specific pre-training, task-specific fine-tuning -- that represents the current best practice for specialized NLP applications.

## How It Works

### The Three-Stage Pipeline

```
Stage 1: General Pre-Training     (e.g., BERT on Wikipedia + BooksCorpus)
         |
Stage 2: Domain-Adaptive Pre-Training (DAPT)  (e.g., continued MLM on PubMed abstracts)
         |
Stage 3: Task-Specific Fine-Tuning (e.g., biomedical NER on BC5CDR dataset)
```

**Stage 1** produces a model with broad linguistic knowledge -- syntax, common-sense semantics, discourse structure -- from diverse general-domain text.

**Stage 2** (domain adaptation) continues the masked language modeling (or other pre-training objectives) on domain-specific text. This adjusts the model's representations to better capture domain-specific vocabulary, entity relationships, and discourse patterns. Crucially, the model retains its general linguistic knowledge while specializing.

**Stage 3** fine-tunes on the specific downstream task within the domain, exactly as described in `transfer-learning-in-nlp.md`.

### Prominent Domain-Adapted Models

**BioBERT** (Lee et al., 2020): Continued pre-training of BERT on PubMed abstracts (4.5B words) and PubMed Central full-text articles (13.5B words). BioBERT outperforms general BERT on biomedical NER (+2.8% F1 on BC5CDR-Chemical), biomedical relation extraction (+7.4% F1 on GAD), and biomedical QA (+9.6% MRR on BioASQ).

**SciBERT** (Beltagy et al., 2019): Pre-trained from scratch on 1.14M papers from Semantic Scholar (3.1B tokens), with 82% from the biomedical domain and 18% from computer science. SciBERT used a domain-specific vocabulary (scivocab) learned from the scientific corpus, which improved tokenization of scientific terms. It outperforms BERT by 1-5% across scientific NER, PICO extraction, citation intent, and relation extraction.

**FinBERT** (Araci, 2019; Yang et al., 2020): Adapted for financial text by continuing BERT's pre-training on a financial corpus (earnings calls, analyst reports, financial news). FinBERT achieves ~95% accuracy on financial sentiment analysis (Financial PhraseBank), versus ~85% for general BERT, because financial language uses terms like "bearish" and "headwinds" with domain-specific connotations.

**LegalBERT** (Chalkidis et al., 2020): Pre-trained on 12GB of legal text from EU legislation, US court opinions, and legal contracts. Improves over BERT by 1-4% on legal NER, contract clause classification, and legal judgment prediction.

**ClinicalBERT** (Alsentzer et al., 2019): Adapted from BioBERT using clinical notes from the MIMIC-III database (roughly 2M notes). Clinical text is drastically different from biomedical literature -- full of abbreviations, misspellings, fragmented sentences, and negation patterns. ClinicalBERT improves hospital readmission prediction and clinical NER over both BERT and BioBERT.

### Domain-Specific Vocabulary

A critical decision in domain adaptation is whether to use the general vocabulary or learn a new one:

- **Reuse general vocabulary** (BioBERT approach): Simpler, initializes from pre-trained embeddings, but domain terms are over-tokenized. "Hydroxychloroquine" might be split into 5+ subword tokens.
- **Learn domain vocabulary** (SciBERT approach): Better tokenization of domain terms (fewer subword splits), but requires pre-training from scratch since the embedding matrix cannot be initialized from the general model.
- **Hybrid approach**: Extend the general vocabulary with the most frequent domain terms, initializing new tokens randomly while keeping existing embeddings.

Empirically, the vocabulary choice has a smaller effect (0.5-1%) than the continued pre-training itself (2-10%), suggesting that representation adaptation matters more than tokenization.

### How Much Domain Data Is Needed?

Gururangan et al. (2020) in "Don't Stop Pretraining" systematically studied this question:

- **Domain-Adaptive Pre-Training (DAPT)**: Even 50M tokens of domain text yields meaningful improvements. Benefits saturate around 500M-1B tokens for most domains.
- **Task-Adaptive Pre-Training (TAPT)**: Continued pre-training on just the unlabeled task data (often only 50K-500K tokens) provides additional gains of 0.5-2%, stacking with DAPT.
- **Combined DAPT + TAPT**: The most effective approach, with improvements of 2-8% over vanilla BERT across biomedical, CS, news, and review domains.

The diminishing returns curve suggests that a domain corpus of 500M-2B tokens captures most of the benefit, making domain adaptation accessible even for domains with limited text.

### When Domain Adaptation Helps Most

Domain adaptation provides the largest gains when:
1. **Vocabulary mismatch is high**: Domains with extensive specialized terminology (biomedical, legal, chemical) benefit most.
2. **Writing style differs significantly**: Clinical notes, legal contracts, and scientific papers have very different structures from Wikipedia.
3. **Labeled data is scarce**: Domain adaptation is especially valuable when fine-tuning data is limited, as it provides a better initialization.
4. **General model performance is poor**: If general BERT already scores 95%+ on a domain task, the ceiling for improvement is low.

Conversely, domain adaptation provides minimal benefit when the domain text closely resembles the general pre-training corpus (e.g., news text for a model pre-trained on Common Crawl) or when abundant labeled data compensates for the domain gap.

## Why It Matters

1. **Unlocks specialized NLP**: Many of the highest-value NLP applications (clinical decision support, drug discovery, legal analytics, financial risk) require domain-specific language understanding that general models lack.
2. **Data-efficient for scarce labels**: In domains where labeled data costs $100+ per annotation (medical, legal), domain adaptation reduces the labeled data needed for fine-tuning by up to 50%.
3. **Accessible technique**: Domain adaptation requires only unlabeled domain text and a pre-trained model -- no new architecture, no new training procedure, just continued MLM. This makes it accessible to domain experts without deep ML expertise.
4. **Stacks with other techniques**: Domain adaptation combines naturally with task-adaptive pre-training, few-shot prompting (see `prompt-based-nlp.md`), and parameter-efficient fine-tuning (see `llm-concepts/06-parameter-efficient-fine-tuning/full-vs-peft-fine-tuning.md`).
5. **Production deployment**: Domain-adapted models are widely deployed in healthcare (clinical NER, ICD coding), finance (sentiment analysis, risk assessment), and legal (contract review, case prediction).

## Key Technical Details

- **BioBERT pre-training**: ~23 days on 8 NVIDIA V100 GPUs for biomedical domain adaptation; used the same vocabulary as BERT.
- **SciBERT pre-training**: ~1 week on a single TPU v3-8; learned a new 31K-token vocabulary from scientific text.
- **Typical DAPT budget**: 50M-1B tokens of domain text, trained for 12.5K-100K steps with the same MLM objective and hyperparameters as original pre-training.
- **Performance gains**: Biomedical NER +2-5% F1, financial sentiment +5-10% accuracy, legal classification +1-4% F1, clinical tasks +2-8% F1.
- **Cost**: Domain adaptation of BERT-base costs roughly $50-500 in cloud compute, depending on corpus size and training duration -- far less than pre-training from scratch.
- **TAPT data size**: The unlabeled text of the task dataset itself (typically 50K-500K tokens) -- essentially free additional pre-training data.
- **Catastrophic forgetting risk**: Continued pre-training too aggressively can degrade general-domain performance. Using a low learning rate (1e-5 to 2e-5) and limited training steps mitigates this.

## Common Misconceptions

**"Domain adaptation requires pre-training from scratch."** The whole point of domain adaptation is to avoid pre-training from scratch. Starting from a general pre-trained model and continuing on domain text is 10-100x cheaper than training a new model from scratch, and performs comparably or better because the general model provides a strong linguistic foundation.

**"Any domain needs its own adapted model."** Domain adaptation is most valuable when the target domain differs substantially from the general pre-training corpus. For domains well-represented in Common Crawl or Wikipedia (e.g., sports, technology news), general models already perform well, and the cost of domain adaptation may not be justified.

**"More domain data always helps."** Returns diminish rapidly after 500M-1B tokens of domain text. Beyond this point, the marginal improvement per additional token drops close to zero. Moreover, if the domain corpus is noisy (e.g., OCR'd legal documents with many errors), more data can actually hurt.

**"Domain-adapted models cannot handle general text."** Domain adaptation fine-tunes existing representations rather than replacing them. Models like BioBERT retain most of their general-domain capabilities. However, if trained too aggressively on domain text, they can exhibit mild performance degradation on general benchmarks (typically <1% on GLUE tasks).

## Connections to Other Concepts

- `transfer-learning-in-nlp.md` provides the theoretical foundation for why domain adaptation works -- the three-stage pipeline is an extension of the pre-train-then-fine-tune paradigm.
- `bert.md` is the most common base model for domain adaptation, though GPT-style and T5-style models can also be domain-adapted.
- `t5-and-text-to-text.md` can be domain-adapted using the same continued pre-training approach (e.g., SciFive for scientific T5).
- `cross-lingual-transfer.md` addresses a related problem: adapting models across languages rather than across domains.
- `named-entity-recognition.md` and `relation-extraction.md` are among the tasks where domain adaptation yields the largest improvements.
- `text-classification.md` benefits from domain adaptation when the target domain has specialized vocabulary and class definitions.
- `prompt-based-nlp.md` can be combined with domain adaptation: a domain-adapted model responds better to domain-specific prompts.
- In the LLM Concepts collection, `llm-concepts/06-parameter-efficient-fine-tuning/full-vs-peft-fine-tuning.md` and `llm-concepts/06-parameter-efficient-fine-tuning/qlora.md` describe efficient alternatives to full domain adaptation for very large models.

## Further Reading

- Gururangan et al., *Don't Stop Pretraining: Adapt Language Models to Domains and Tasks*, 2020 -- the definitive study on domain-adaptive and task-adaptive pre-training, with systematic experiments across four domains.
- Lee et al., *BioBERT: A Pre-trained Biomedical Language Representation Model for Biomedical Text Mining*, 2020 -- pioneered continued pre-training on PubMed for biomedical NLP.
- Beltagy et al., *SciBERT: A Pretrained Language Model for Scientific Text*, 2019 -- demonstrated the value of domain-specific vocabulary and pre-training for scientific NLP.
- Chalkidis et al., *LEGAL-BERT: The Muppets Straight Out of Law School*, 2020 -- comprehensive study of domain adaptation for the legal domain.
- Alsentzer et al., *Publicly Available Clinical BERT Embeddings*, 2019 -- adapted BERT and BioBERT to clinical text from MIMIC-III, addressing the unique challenges of clinical notes.
