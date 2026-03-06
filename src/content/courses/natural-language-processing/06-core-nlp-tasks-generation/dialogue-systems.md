# Dialogue Systems

**One-Line Summary**: Conversational AI systems that interact with users through natural language, ranging from task-oriented slot-filling assistants to open-domain chatbots and modern LLM-based dialogue agents.

**Prerequisites**: `sequence-to-sequence-models.md`, `text-classification.md`, `named-entity-recognition.md`, `text-generation.md`

## What Is a Dialogue System?

Imagine two very different conversations. In the first, you call an airline to rebook a flight: the agent asks structured questions (departure city, date, seat preference), looks up options in a database, and confirms your booking. In the second, you chat with a friend about movies, politics, and weekend plans -- the conversation flows freely, changes topics, and requires personality and empathy rather than database lookups.

Dialogue systems (also called conversational AI) are NLP systems that conduct multi-turn conversations with users. Task-oriented dialogue systems help users accomplish specific goals (booking flights, ordering food, troubleshooting tech issues). Open-domain dialogue systems aim to converse naturally on any topic, maintaining coherence, personality, and engagement. Modern LLM-based systems blur this boundary, handling both structured tasks and open-ended conversation within a single model.

## How It Works

### Task-Oriented Dialogue Systems

The classic architecture follows a pipeline with four components:

**1. Natural Language Understanding (NLU)**: Parses user utterances into structured intent and slot-value pairs.
- Input: "Book me a flight from Boston to Seattle next Friday"
- Intent: `book_flight`
- Slots: `{origin: Boston, destination: Seattle, date: next Friday}`

NLU typically uses a text classifier for intent detection (see `text-classification.md`) and a sequence labeler for slot filling (BIO tagging, similar to `named-entity-recognition.md`). Joint models like Slot-Gated (Goo et al., 2018) achieve 95%+ intent accuracy and 90%+ slot F1 on ATIS/SNIPS benchmarks.

**2. Dialogue State Tracking (DST)**: Maintains a running record of the user's goals across turns. The dialogue state is a set of slot-value pairs that accumulates and updates as the conversation progresses. For example, after three turns, the state might be `{origin: Boston, destination: Seattle, date: 2024-03-15, class: economy}`. Models like TRADE (Wu et al., 2019) achieved 48.6% joint goal accuracy on MultiWOZ 2.1, and later models like TripPy pushed this to 55%+.

**3. Dialogue Management (DM)**: Decides what action to take next based on the current state -- ask for a missing slot, confirm information, query the database, or complete the task. This can be rule-based (handcrafted state machines), supervised (trained on logged dialogues), or learned via reinforcement learning (where the reward is task completion).

**4. Natural Language Generation (NLG)**: Converts the system action into a natural language response. Template-based NLG fills slots into predefined templates ("Your flight from {origin} to {destination} on {date} is confirmed."). Neural NLG (e.g., SC-GPT by Peng et al., 2020) generates more natural and varied responses.

### Open-Domain Dialogue Systems

Open-domain systems must converse on any topic without a predefined task structure.

**Retrieval-Based**: Given the conversation history, retrieve the best response from a large candidate set. Models like Poly-encoder (Humeau et al., 2020) encode the context and candidate responses separately, then compute compatibility scores. Retrieval systems produce grammatically correct, on-topic responses but cannot generate novel content.

**Generative**: Generate responses token by token using a seq2seq or language model. Early models (Vinyals and Le, 2015) produced generic responses ("I don't know," "That's interesting"). DialoGPT (Zhang et al., 2020) fine-tuned GPT-2 on 147M Reddit comment chains, producing more engaging and diverse responses.

**Personality and Consistency**: Maintaining a coherent persona across a conversation is critical for user trust. The PersonaChat dataset (Zhang et al., 2018) provides 164K utterances with assigned persona descriptions. Models conditioned on persona text produce more consistent and engaging responses. Roller et al. (2021) showed that Blender (a 9.4B-parameter model combining persona, knowledge, and empathy skills) was preferred over human responses 49% of the time in A/B testing.

### Evaluation

Dialogue evaluation is notoriously difficult:

- **Task-oriented metrics**: Task completion rate (did the user achieve their goal?), slot accuracy, average number of turns to completion, and user satisfaction scores (1--5 Likert scale).
- **Open-domain automatic metrics**: Perplexity, BLEU, and distinct-n (ratio of unique n-grams, measuring diversity). However, automatic metrics correlate poorly with human judgments for open-domain dialogue.
- **Human evaluation**: Ratings of fluency, relevance, consistency, engagingness, and persona adherence. Acute-Eval (Li et al., 2019) uses pairwise comparisons ("Which response is better?") for more reliable human judgments.

### Modern LLM-Based Dialogue

Large language models (ChatGPT, Claude, Gemini) have fundamentally changed dialogue systems:

- **No separate pipeline**: A single model handles NLU, state tracking, decision-making, and NLG implicitly through next-token prediction.
- **Few-shot adaptation**: New tasks can be specified via system prompts and few-shot examples, eliminating task-specific training data requirements.
- **Tool use**: LLMs can invoke external APIs (search, calculation, database lookup) during conversation, combining open-domain conversational ability with task-oriented functionality.
- **RLHF alignment**: Reinforcement learning from human feedback tunes the model to be helpful, harmless, and honest in conversation.

## Why It Matters

1. **Customer service automation**: Dialogue systems handle billions of customer interactions annually, reducing wait times and operational costs. Companies report 30--70% deflection rates for routine queries.
2. **Virtual assistants**: Siri, Alexa, Google Assistant, and their successors rely on dialogue systems for voice-based interaction.
3. **Healthcare**: Conversational agents for mental health support (Woebot), symptom checking, and medication adherence demonstrate measurable clinical benefit.
4. **Education**: Tutoring dialogue systems provide personalized instruction and Socratic questioning at scale.
5. **Accessibility**: Voice-based dialogue enables hands-free computing for users with motor disabilities and conversational interfaces for users with limited literacy.

## Key Technical Details

- **ATIS** (Airline Travel Information Systems): Classic benchmark with 5,871 utterances, 26 intents, and 129 slot labels. Small but historically important.
- **MultiWOZ** (Budzianowski et al., 2018): 10K multi-domain dialogues across 7 domains (restaurant, hotel, train, taxi, attraction, hospital, police) with 35 slot types. The standard benchmark for task-oriented dialogue, now in version 2.4 with cleaned annotations.
- **PersonaChat** (Zhang et al., 2018): 164K utterances for persona-grounded open-domain dialogue.
- End-to-end task-oriented models (e.g., SimpleTOD by Hosseini-Asl et al., 2020) frame the entire pipeline as language generation, achieving 84.4% task-informed success rate on MultiWOZ.
- The "I don't know" problem: Early seq2seq dialogue models produce safe, generic responses due to the maximum likelihood objective favoring high-frequency phrases. Nucleus sampling and diversity-promoting objectives partially address this.
- Grounded dialogue (retrieving and citing knowledge during conversation) reduces hallucination. Shuster et al. (2021) showed that retrieval-augmented dialogue produces 50% fewer hallucinated facts.

## Common Misconceptions

- **"Open-domain dialogue is harder than task-oriented dialogue."** They are hard in different ways. Task-oriented systems need reliable understanding of specific domains, robust state tracking, and integration with databases. Open-domain systems need broad knowledge, personality consistency, and engagement. Modern LLMs make open-domain conversation more feasible but still struggle with task-oriented reliability and accuracy.

- **"Passing the Turing test means solving dialogue."** The Turing test measures whether a human can distinguish machine from human conversation, but this is a poor proxy for useful dialogue. A system can "pass" by being evasive or humorous without actually being helpful, knowledgeable, or consistent.

- **"More training data always improves dialogue quality."** Training on large amounts of noisy dialogue data (e.g., Reddit) can teach models toxic, contradictory, or unhelpful patterns. Carefully curated data, human feedback, and alignment techniques matter more than raw scale for practical dialogue quality.

- **"Dialogue systems understand the conversation."** Current systems, including LLMs, maintain statistical coherence rather than true understanding. They can lose track of implicit commitments, contradict themselves across long conversations, and fail at tasks requiring genuine reasoning about the conversation state.

## Connections to Other Concepts

- **`text-classification.md`**: Intent detection in task-oriented dialogue is a text classification problem.
- **`named-entity-recognition.md`**: Slot filling uses the same BIO sequence labeling approach as NER.
- **`text-generation.md`**: Response generation uses the decoding strategies (beam search, nucleus sampling) covered there.
- **`question-answering.md`**: Knowledge-grounded dialogue incorporates QA capabilities to answer user questions within conversation.
- **`sentiment-analysis.md`**: Detecting user sentiment and emotion is essential for empathetic and adaptive dialogue.
- **`coreference-resolution.md`**: Tracking references across turns ("I want that one" -- which one?) requires coreference abilities.

## Further Reading

- Zhang et al., "Personalizing Dialogue Agents" (2018) -- PersonaChat dataset and persona-conditioned response generation.
- Budzianowski et al., "MultiWOZ -- A Large-Scale Multi-Domain Wizard-of-Oz Dataset for Task-Oriented Dialogue Modelling" (2018) -- The standard multi-domain task-oriented benchmark.
- Roller et al., "Recipes for Building an Open-Domain Chatbot" (2021) -- Blender, combining persona, knowledge, and empathy in a single large model.
- Wu et al., "Transferable Multi-Domain State Generator for Task-Oriented Dialogue Systems" (2019) -- TRADE, a generative approach to dialogue state tracking.
- Hosseini-Asl et al., "A Simple Language Model for Task-Oriented Dialogue" (2020) -- SimpleTOD, framing task-oriented dialogue as language modeling.
- Ouyang et al., "Training Language Models to Follow Instructions with Human Feedback" (2022) -- InstructGPT/RLHF, the technique behind modern LLM-based dialogue alignment.
