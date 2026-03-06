# Pragmatics and Discourse

**One-Line Summary**: Meaning beyond the literal -- context, implicature, speech acts, Gricean maxims, and discourse coherence that determine what speakers actually communicate versus what their words technically say.

**Prerequisites**: `what-is-nlp.md`, `levels-of-linguistic-analysis.md`, `semantics.md`

## What Is Pragmatics and Discourse?

Imagine you are at a dinner party and someone says, "It's cold in here." Semantically, this is a factual statement about temperature. Pragmatically, it is a request to close the window, turn up the heat, or fetch a blanket. The gap between what is said (literal meaning) and what is meant (intended meaning) is the domain of pragmatics.

Now extend this to multiple sentences. A news article does not just string together isolated facts -- it has structure, each sentence connecting to the last through cause, contrast, elaboration, or temporal sequence. Understanding why a particular sentence appears where it does, what "it" and "they" refer to, and how the overall argument holds together is the domain of discourse analysis.

Together, pragmatics and discourse represent the highest levels of linguistic analysis. They are also, not coincidentally, the levels where NLP systems struggle the most. A chatbot that takes every utterance literally is frustrating. A summarizer that does not understand discourse structure produces incoherent output. A sarcasm detector that ignores pragmatic cues will misclassify "Oh great, another meeting" as positive sentiment.

## How It Works

### Speech Act Theory

**Speech act theory** (Austin, 1962; Searle, 1969) recognizes that utterances are not just statements of fact -- they are actions. Every utterance has three aspects:

- **Locutionary act**: The literal content ("Can you pass the salt?")
- **Illocutionary act**: The intended function (a polite request for salt)
- **Perlocutionary act**: The effect on the listener (the listener passes the salt)

Searle classified illocutionary acts into five types:
1. **Assertives**: Stating facts ("It is raining")
2. **Directives**: Requesting actions ("Please close the door")
3. **Commissives**: Making commitments ("I will finish by Friday")
4. **Expressives**: Expressing feelings ("Congratulations!")
5. **Declarations**: Creating new states of affairs ("I now pronounce you married")

For NLP, speech act classification is fundamental to dialogue systems (see `dialogue-systems.md`). A virtual assistant must distinguish "Can you book a flight?" (directive) from "Can you book flights?" (assertive/question about capability). Intent classification in task-oriented dialogue is essentially speech act recognition at scale.

### Gricean Maxims and Implicature

Paul Grice (1975) proposed that conversation is governed by a **Cooperative Principle**: speakers are expected to contribute appropriately to the exchange. This principle is operationalized through four maxims:

1. **Maxim of Quantity**: Say enough but not too much. ("Where do you live?" "France." -- sufficient for casual conversation; "42 Rue de Rivoli, 75001 Paris, France, Europe, Earth" violates by over-informing.)
2. **Maxim of Quality**: Say only what you believe to be true and can support with evidence.
3. **Maxim of Relation** (Relevance): Be relevant to the current topic.
4. **Maxim of Manner**: Be clear, brief, orderly, and unambiguous.

The power of Grice's framework lies in what happens when speakers **violate** a maxim. When someone says "Nice weather we're having" during a thunderstorm, they are obviously violating the Maxim of Quality. The listener, assuming the speaker is being cooperative, infers the speaker must mean the opposite -- sarcasm. This inferred, non-literal meaning is called a **conversational implicature**.

**Scalar implicature** is a particularly common type. When someone says "Some students passed," they literally say "at least some" but implicate "not all" -- because if all had passed, the Maxim of Quantity would have compelled them to say "All students passed." NLP systems that fail to capture scalar implicature may misinterpret hedged language in reviews, reports, and conversations.

### Presupposition

A **presupposition** is background information that a sentence takes for granted. "Have you stopped smoking?" presupposes that the addressee was previously smoking. "The king of France is bald" presupposes that France has a king. Presuppositions survive under negation: "The king of France is not bald" still presupposes that France has a king.

Presupposition is relevant to NLP in question answering (see `question-answering.md`) -- a system must handle questions with false presuppositions gracefully -- and in information extraction, where presupposed information is often just as important as asserted information.

### Discourse Structure

Moving beyond individual utterances, **discourse analysis** studies how multi-sentence text is organized.

**Rhetorical Structure Theory (RST)** (Mann and Thompson, 1988) represents text as a tree of discourse units connected by rhetorical relations. There are approximately 20--30 relation types, including:
- **Elaboration**: The second unit provides more detail about the first.
- **Cause**: One unit states a cause, the other an effect.
- **Contrast**: The two units present contrasting information.
- **Concession**: One unit acknowledges a potential counterargument.

An RST tree distinguishes **nuclei** (essential content) from **satellites** (supporting content). This distinction is directly useful for text summarization (see `text-summarization.md`): extracting nuclei and discarding satellites produces a coherent summary.

**Discourse parsing** -- automatically building RST trees -- achieves approximately 60--65% F1 on relation classification, well below syntactic parsing accuracy, reflecting the difficulty of the task. The RST Discourse Treebank contains approximately 385 annotated documents.

### Coherence Relations

Beyond RST, several theories model how sentences cohere into meaningful text:

**Centering Theory** (Grosz, Joshi, and Weinstein, 1995) tracks the focus of attention across sentences. The **backward-looking center** (Cb) is the entity most prominently continued from the previous sentence. Smooth topic continuity (where Cb is preserved) produces more coherent text than abrupt topic shifts.

**Hobbs' coherence relations** include Cause, Explanation, Parallel, Contrast, and Elaboration. A coherent text is one where every sentence can be linked to adjacent sentences through such relations.

For NLP, coherence is essential for text generation (see `text-generation.md`) -- models must produce text where each sentence logically follows from the previous one -- and for coherence evaluation of generated summaries and translations.

### Anaphora Resolution

**Anaphora** occurs when an expression refers back to a previously mentioned entity. The most common type is pronominal anaphora:

"**Marie Curie** was born in Warsaw. **She** moved to Paris in 1891. **The physicist** won two Nobel Prizes."

Here "She" and "The physicist" both refer to Marie Curie. Resolving these references -- determining that "She" = "Marie Curie" -- is the task of **coreference resolution** (see `coreference-resolution.md`).

Anaphora resolution requires integrating syntactic constraints (gender, number agreement), semantic knowledge (Marie Curie is a physicist), and discourse context (recency, salience). The Winograd Schema Challenge (Levesque et al., 2012) tests commonsense reasoning through pronoun resolution: "The trophy doesn't fit in the suitcase because **it** is too big." Does "it" refer to the trophy or the suitcase? Answering correctly requires world knowledge about physical objects.

## Why It Matters

1. **Dialogue systems**: Every turn in a conversation involves speech acts, implicature, and discourse context. A chatbot that ignores pragmatics cannot handle indirect requests, rhetorical questions, or conversational implicature (see `dialogue-systems.md`).
2. **Sentiment analysis**: Sarcasm, irony, and understatement are pragmatic phenomena that reverse literal sentiment. "What a wonderful experience" might be genuine or deeply sarcastic depending on context (see `sentiment-analysis.md`).
3. **Summarization**: Discourse structure determines which parts of a document are most important. RST nuclei correspond to key content; satellites can be dropped without losing coherence (see `text-summarization.md`).
4. **Machine translation**: Pragmatic conventions differ across cultures. Japanese speakers use honorifics to encode social relationships; translating "Could you kindly..." into a language without such conventions requires pragmatic adaptation.
5. **Misinformation detection**: Misleading text often exploits pragmatic mechanisms -- using presuppositions to smuggle in false claims ("Since the earth is flat...") or implicature to suggest without asserting.

## Key Technical Details

- The RST Discourse Treebank (Carlson et al., 2001) annotates 385 Wall Street Journal articles with discourse structure. Inter-annotator agreement for relation labeling is approximately 78% (kappa approximately 0.66).
- State-of-the-art RST discourse parsers achieve approximately 63% F1 on relation classification, significantly below syntactic parsing performance (approximately 96% for dependencies).
- The OntoNotes 5.0 coreference dataset contains approximately 1.6 million words of annotated text across newswire, broadcast, web, and telephone speech. Current systems achieve approximately 83% F1 using the CoNLL metric on this benchmark.
- The Winograd Schema Challenge has approximately 273 examples. GPT-4-class models achieve approximately 95%+ accuracy, substantially above the approximately 60% that statistical systems achieved before the pre-trained model era.
- Sarcasm detection datasets (e.g., iSarcasm, SemEval) show that even state-of-the-art models struggle with F1 scores of approximately 55--75%, depending on the domain and definition of sarcasm.
- Grice's framework dates to his 1967 William James Lectures at Harvard, published as "Logic and Conversation" in 1975.

## Common Misconceptions

**"Pragmatics is too subjective to be computationally modeled."**
While pragmatic interpretation involves uncertainty, it is far from arbitrary. Speech act recognition, implicature computation, and presupposition projection follow systematic patterns that can be formalized and learned. Intent classification in dialogue systems is a practical, deployed example of computational pragmatics.

**"Large language models understand pragmatics because they generate contextually appropriate responses."**
LLMs produce text that often appears pragmatically competent, but probing studies show they frequently fail on scalar implicature, irony detection, and presupposition handling. Apparent pragmatic competence may reflect surface pattern matching rather than genuine reasoning about speaker intentions.

**"Discourse structure is only relevant for long documents."**
Even a two-sentence text has discourse structure: "I was hungry. I made a sandwich." implies a causal relation. Discourse coherence is relevant at every scale, from adjacent sentence pairs to multi-page documents.

**"Coreference resolution is just pronoun resolution."**
Coreference includes nominal coreference ("The president... Obama..."), bridging anaphora ("The car... the engine..."), and event coreference ("The attack... this event..."). Pronouns are the most frequent case but not the only or hardest one. See `coreference-resolution.md`.

## Connections to Other Concepts

- `levels-of-linguistic-analysis.md` positions pragmatics and discourse as the highest levels of the linguistic hierarchy.
- `semantics.md` provides the literal meaning that pragmatics builds upon and sometimes overrides.
- `ambiguity-in-language.md` covers referential ambiguity, which is resolved at the discourse level.
- `coreference-resolution.md` is the core NLP task for discourse-level reference tracking.
- `dialogue-systems.md` is the primary NLP application of speech act theory and conversational pragmatics.
- `sentiment-analysis.md` must handle pragmatic phenomena like sarcasm and irony.
- `text-summarization.md` benefits directly from discourse structure analysis.
- `text-generation.md` must produce discourse-coherent output.
- `commonsense-reasoning.md` provides the world knowledge needed for pragmatic inference.
- The sibling **LLM Concepts** collection discusses how RLHF and instruction tuning teach models pragmatic conventions (helpfulness, safety, conversational style).

## Further Reading

- Grice, H.P., "Logic and Conversation," in *Syntax and Semantics*, Vol. 3, 1975 -- The foundational paper introducing the Cooperative Principle and conversational implicature.
- Austin, J.L., *How to Do Things with Words*, 1962 -- The origin of speech act theory, showing that language is action.
- Searle, J.R., *Speech Acts: An Essay in the Philosophy of Language*, 1969 -- The systematic classification of illocutionary acts.
- Mann, W.C. and Thompson, S.A., "Rhetorical Structure Theory: Toward a Functional Theory of Text Organization," Text, 1988 -- The RST framework for discourse structure.
- Levesque, H.J. et al., "The Winograd Schema Challenge," KR, 2012 -- A benchmark testing pragmatic and commonsense reasoning through pronoun resolution.
- Grosz, B.J., Joshi, A.K., and Weinstein, S., "Centering: A Framework for Modeling the Local Coherence of Discourse," Computational Linguistics, 1995 -- The theory of attentional state in discourse that underlies many coreference systems.
