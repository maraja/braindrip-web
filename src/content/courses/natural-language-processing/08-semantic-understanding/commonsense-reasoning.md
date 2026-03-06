# Commonsense Reasoning

**One-Line Summary**: Commonsense reasoning is the ability to draw on implicit world knowledge that humans take for granted -- physical intuitions, social conventions, and causal expectations -- to understand and reason about language.

**Prerequisites**: `semantics.md`, `pragmatics-and-discourse.md`, `knowledge-graphs-for-nlp.md`, `bert.md`, `natural-language-inference.md`.

## What Is Commonsense Reasoning?

Consider the sentence "He put the trophy in the suitcase because it was small." What does "it" refer to -- the trophy or the suitcase? Humans resolve this instantly: the trophy was small (so it fit in the suitcase). Now change one word: "He put the trophy in the suitcase because it was large." Now "it" refers to the suitcase (because a large container can accommodate the trophy). No grammar rule or dictionary lookup helps here. You need to know that objects go inside containers, that size determines what fits where, and that "because" signals a causal explanation. This is commonsense reasoning.

Commonsense knowledge is the vast body of background information that humans acquire through everyday experience and never bother to state explicitly. We know that water is wet, that people eat when hungry, that dropped objects fall, that insults cause anger, and that dead people do not attend meetings. This knowledge is so obvious to humans that it is rarely written down -- which creates a fundamental challenge for NLP systems that learn from text. Machines face a version of the "reporting bias" problem: text corpora over-represent surprising or noteworthy facts and under-represent the mundane truths that underpin daily reasoning.

Commonsense reasoning is considered one of the grand challenges of AI. As early as 1959, McCarthy identified the commonsense knowledge problem as central to building intelligent systems. Decades later, despite the impressive capabilities of large language models, commonsense remains a persistent weak point, especially when reasoning requires combining multiple pieces of implicit knowledge or handling novel situations.

## How It Works

### Types of Commonsense Knowledge

**Physical/Naive Physics Commonsense**: Understanding of the physical world -- gravity, object permanence, material properties, spatial relationships. "You cannot fit an elephant in a car." "Ice cream melts in the sun." "A glass dropped on concrete will break." These intuitions, formalized as "naive physics" by Hayes (1979), are trivial for humans but challenging for models that have never interacted with the physical world.

**Social/Interpersonal Commonsense**: Understanding human behavior, emotions, motivations, and social norms. "If someone receives a gift, they will likely feel happy." "Cutting in line will annoy others." "People typically sleep at night." Social commonsense is essential for dialogue systems, story understanding, and sentiment analysis, and is highly culture-dependent.

**Temporal Commonsense**: Understanding typical durations, sequences, and frequencies. "Cooking dinner takes minutes to hours, not days." "You brush your teeth before going to sleep." "A semester lasts a few months." Temporal commonsense overlaps with the domain covered in `temporal-reasoning.md` but focuses on default expectations rather than explicit temporal expressions.

**Causal Commonsense**: Understanding cause-effect relationships. "Watering a plant helps it grow." "Studying improves exam performance." "Running a red light can cause an accident." Causal reasoning requires connecting actions to their typical consequences and understanding preconditions for events.

**Taxonomic/Categorical Commonsense**: Understanding category membership, properties, and typical attributes. "Dogs have four legs." "Bananas are yellow." "Doctors work in hospitals." This overlaps with knowledge bases and ontologies but extends to prototypical rather than definitional properties.

### Knowledge Bases for Commonsense

**ConceptNet** (Speer et al., 2017): A multilingual knowledge graph containing over 21 million edges connecting concepts via 34 relations types (IsA, HasA, UsedFor, CapableOf, Causes, MotivatedByGoal, etc.). Built from crowd-sourced data (Open Mind Common Sense project), expert resources, and games with a purpose. ConceptNet provides structured commonsense that can be queried or embedded. ConceptNet Numberbatch combines ConceptNet with distributional word embeddings, achieving strong results on word relatedness benchmarks.

**ATOMIC** (Sap et al., 2019): A knowledge graph focused on inferential commonsense about everyday events and their causes and effects. ATOMIC contains 877K inferential knowledge triples organized around 9 if-then relation types:

- **Causes**: xIntent (why X does this), xNeed (what X needed to do before)
- **Effects**: xWant (what X wants after), xEffect (effect on X), xReact (how X feels)
- **Agent-related**: oWant, oEffect, oReact (same for other people involved)

ATOMIC2020 expands to 1.33 million triples covering physical, social, and event-centered commonsense.

**GLUCOSE** (Mostafazadeh et al., 2020): Provides semi-structured causal explanations for stories across 10 dimensions of commonsense (motivation, emotion, enabling state, causal chain, etc.).

### Benchmarks

**Winograd Schema Challenge (WSC)** (Levesque et al., 2012): Pairs of sentences differing by one or two words that change a pronoun's referent, requiring world knowledge to resolve. Example: "The city council refused the demonstrators a permit because they feared/advocated violence." With "feared," "they" = council; with "advocated," "they" = demonstrators. The original WSC contains 273 problems. SuperGLUE includes a binary version (WSC273). GPT-3 (175B) achieved approximately 88% on WSC, though the extent to which this reflects genuine reasoning vs. statistical patterns is debated.

**WinoGrande** (Sakaguchi et al., 2020): A scaled-up version with 44,000 problems generated via crowdsourcing and filtered with adversarial algorithms to remove exploitable biases. RoBERTa-large achieves approximately 79% (vs. human performance of approximately 94%), showing significant room for improvement.

**PIQA (Physical Intuition QA)** (Bisk et al., 2020): 20,000 multiple-choice questions testing physical commonsense. Example: "To separate egg whites from the yolk, you can (A) use a water bottle to suction the yolk, (B) use a fork to scoop the yolk." RoBERTa-large achieves approximately 79%; humans achieve approximately 95%.

**HellaSwag** (Zellers et al., 2019): 70,000 problems requiring predicting the most plausible continuation of an event description. Created using adversarial filtering against BERT, making it resistant to simple surface-level exploitation. BERT-large achieves only approximately 47% (vs. 95% human); GPT-3 achieves approximately 79%.

**CommonsenseQA** (Talmor et al., 2019): 12,102 5-way multiple-choice questions requiring commonsense knowledge, generated using ConceptNet subgraphs. RoBERTa-large achieves approximately 72%; humans achieve approximately 89%.

**CommonsenseQA 2.0** and **Rainbow** (Lourie et al., 2021) provide unified benchmarks combining multiple commonsense tasks.

### Why LLMs Struggle with Commonsense

Despite achieving impressive performance on many benchmarks, LLMs face several systematic challenges with commonsense:

1. **Reporting bias**: Text corpora under-represent obvious facts. "The sky is blue" appears far less frequently than unusual sky colors, because writers do not state what everyone already knows. Models learn from what is written, not what is true.

2. **Distributional vs. grounded knowledge**: LLMs learn statistical patterns over text. Physical commonsense (weight, size, temperature) often requires embodied experience that text alone does not fully convey. A model may learn "elephants are large" from text but lack the continuous physical intuition that guides human reasoning about size.

3. **Combinatorial reasoning**: Many commonsense problems require combining multiple facts. "Can you use a hammer to cut paper?" requires knowing that hammers are blunt, that cutting requires a sharp edge, and that these are incompatible -- a chain of reasoning that may never appear as a single training example.

4. **Negation and exceptions**: Commonsense has defaults that admit exceptions. "Birds can fly" is generally true but penguins and ostriches cannot. Models struggle with this prototype-based reasoning, often treating defaults as absolutes.

5. **Sensitivity to framing**: Models show brittle performance when commonsense problems are rephrased. A model that correctly answers a Winograd schema may fail on a paraphrased version, suggesting pattern matching rather than robust understanding.

### Current Approaches

**Knowledge-augmented models**: Injecting structured commonsense knowledge into neural models. KagNet (Lin et al., 2019) grounds QA in ConceptNet subgraphs. COMET (Bosselut et al., 2019) trains a GPT-2 model on ATOMIC to generate commonsense inferences, effectively creating a "neural knowledge base" that can produce new commonsense triples not present in the original graph.

**Multi-task pre-training**: Training models on multiple commonsense tasks simultaneously. UnifiedQA (Khashabi et al., 2020) trains T5 on diverse QA formats, improving commonsense reasoning through cross-task transfer.

**Chain-of-thought prompting**: Wei et al. (2022) showed that prompting LLMs to "think step by step" significantly improves performance on commonsense reasoning tasks. For example, GPT-3.5 improves from approximately 60% to approximately 74% on CommonsenseQA with chain-of-thought prompting. This suggests models contain commonsense knowledge that is better accessed through structured reasoning.

**Scaling**: Larger models generally perform better on commonsense benchmarks. GPT-4 achieves approximately 85% on HellaSwag and approximately 81% on WinoGrande. However, scaling alone does not fully solve the problem, particularly for tasks requiring physical intuition or novel combinations of knowledge.

## Why It Matters

1. **Dialogue and assistant systems**: Conversational AI must understand implicit context. "It is cold in here" implies a request to close a window or adjust the thermostat -- an inference requiring social and physical commonsense.
2. **Story understanding and generation**: Narratives rely on unstated causal chains and character motivations that require commonsense to follow or produce coherently.
3. **Robotic and embodied AI**: Agents operating in physical environments need naive physics and spatial commonsense for planning and interaction.
4. **Fact verification and misinformation detection**: Implausible claims ("The sun orbits the Earth") can be flagged using commonsense priors before consulting evidence.
5. **Measuring genuine understanding**: Commonsense benchmarks serve as stress tests for whether models achieve genuine language understanding or rely on surface statistical patterns.

## Key Technical Details

- ConceptNet 5.7 contains over 21 million edges across 34 relation types, covering multiple languages.
- ATOMIC contains 877K inferential triples; ATOMIC2020 expands to 1.33 million triples across physical, social, and event commonsense.
- WinoGrande: 44,000 problems; human accuracy approximately 94%, RoBERTa-large approximately 79%.
- PIQA: 20,000 questions; human accuracy approximately 95%, RoBERTa-large approximately 79%.
- HellaSwag: 70,000 problems; human accuracy approximately 95%, BERT-large approximately 47%, GPT-3 approximately 79%.
- CommonsenseQA: 12,102 questions; human accuracy approximately 89%, RoBERTa-large approximately 72%.
- COMET generates novel commonsense triples with approximately 77% human-rated accuracy, effectively scaling commonsense knowledge beyond existing resources.
- Chain-of-thought prompting improves LLM commonsense reasoning by 10-15 percentage points on average.

## Common Misconceptions

**"LLMs have solved commonsense reasoning because they perform well on benchmarks."**
Benchmark saturation can be misleading. Models often exploit surface patterns rather than performing genuine reasoning. Performance on adversarially constructed benchmarks like WinoGrande and HellaSwag is substantially lower than on easier sets, and models remain brittle to paraphrasing and novel scenarios.

**"Commonsense knowledge can be fully captured in a knowledge graph."**
Knowledge graphs like ConceptNet capture structured commonsense but cannot represent the full richness of human experience. Much commonsense is continuous (degrees of similarity, approximate magnitudes), context-dependent, and combinatorial in ways that resist discrete graph representation.

**"More training data will eventually teach models all commonsense."**
Reporting bias means that text corpora systematically under-represent obvious facts. No amount of additional text will fully convey physical intuitions that require embodied experience. Complementary approaches -- knowledge bases, simulation, multimodal training -- are likely necessary.

**"Commonsense is universal across cultures."**
Social commonsense is highly culture-dependent. Norms about politeness, personal space, gift-giving, and gender roles vary dramatically across cultures. Models trained predominantly on English-language text inherit Western cultural commonsense, which may not transfer to other contexts (see `bias-in-nlp.md`).

## Connections to Other Concepts

- `knowledge-graphs-for-nlp.md` covers the structured knowledge representations (ConceptNet, ATOMIC) that provide commonsense knowledge to NLP systems.
- `natural-language-inference.md` and `textual-entailment.md` require commonsense for non-trivial inference beyond lexical matching.
- `coreference-resolution.md` depends on commonsense for resolving pronouns in Winograd-style examples.
- `temporal-reasoning.md` overlaps with temporal commonsense about typical durations and event sequences.
- `word-sense-disambiguation.md` sometimes requires world knowledge to select the correct sense.
- `pragmatics-and-discourse.md` covers the implicit communication (implicature, presupposition) that requires commonsense to decode.
- `question-answering.md` depends on commonsense when answers require inference beyond the given passage.
- `bert.md` and `gpt-for-nlp-tasks.md` describe the pre-trained models evaluated on commonsense benchmarks.

## Further Reading

- Levesque, H., Davis, E., and Morgenstern, L., "The Winograd Schema Challenge," 2012 -- The foundational commonsense benchmark based on pronoun resolution requiring world knowledge.
- Sap, M. et al., "ATOMIC: An Atlas of Machine Commonsense for If-Then Reasoning," 2019 -- Inferential knowledge graph for everyday event reasoning.
- Speer, R., Chin, J., and Havasi, C., "ConceptNet 5.5: An Open Multilingual Graph of General Knowledge," 2017 -- The most widely used commonsense knowledge graph.
- Zellers, R. et al., "HellaSwag: Can a Machine Really Finish Your Sentence?" 2019 -- Adversarially constructed commonsense benchmark exposing model brittleness.
- Talmor, A. et al., "CommonsenseQA: A Question Answering Challenge Targeting World Knowledge," 2019 -- QA benchmark systematically requiring commonsense reasoning.
- Bosselut, A. et al., "COMET: Commonsense Transformers for Automatic Knowledge Graph Construction," 2019 -- Neural generation of commonsense knowledge triples.
- Davis, E. and Marcus, G., "Commonsense Reasoning and Commonsense Knowledge in Artificial Intelligence," Communications of the ACM, 2015 -- Comprehensive survey of the commonsense challenge in AI.
