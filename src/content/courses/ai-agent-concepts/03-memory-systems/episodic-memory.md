# Episodic Memory

**One-Line Summary**: Episodic memory stores records of past interactions, task attempts, and experiences, enabling agents to learn from previous successes and failures and to retrieve relevant episodes that inform current decision-making.

**Prerequisites**: Memory architecture overview, long-term persistent memory, reflection and self-critique

## What Is Episodic Memory?

Imagine an experienced emergency room doctor. When a patient presents with a particular combination of symptoms, the doctor does not only rely on textbook knowledge (semantic memory). They also recall specific past patients: "I saw a similar case three months ago -- a 45-year-old with the same chest pain pattern. It turned out to be pericarditis, not a heart attack. The key differentiator was the positional nature of the pain." This recall of a specific past episode -- with its context, decisions, and outcomes -- directly informs the current diagnosis. The doctor is not applying a general rule but drawing on a concrete remembered experience.

Episodic memory for AI agents works the same way. It stores records of specific past interactions: what task was attempted, what approach was taken, what happened at each step, what the outcome was, and what was learned. When the agent faces a new task, it retrieves episodes that are similar to the current situation and uses them to inform its approach. This is fundamentally different from semantic memory (general facts) or procedural memory (skills): episodic memory is about specific, situated experiences with their full context.

*Recommended visual: A diagram showing episode storage with structured fields (timestamp, task, approach, outcome, lessons) indexed by semantic embedding, tags, and recency — see [Park et al., "Generative Agents: Interactive Simulacra of Human Behavior" (2023)](https://arxiv.org/abs/2304.03442)*

The power of episodic memory lies in its specificity. A general rule like "API calls sometimes fail" is less useful than a specific episode: "When I called the GitHub API at 2pm EST on a weekday, it rate-limited me after 30 requests in a minute. I recovered by implementing exponential backoff starting at 2 seconds." The episode contains the context (when, where), the action (what was tried), the outcome (what happened), and the lesson (what to do next time).

## How It Works

### Episode Structure

Each episode stored in memory has a consistent structure:

```
Episode #247
- Timestamp: 2024-03-15T14:22:00Z
- Task: "Refactor the authentication module to support OAuth2"
- Context: Python/Flask application, existing session-based auth
- Approach: Planned to add OAuth2 alongside existing auth, then migrate
- Key Actions:
  1. Analyzed existing auth flow in auth.py and middleware.py
  2. Added OAuth2 library (Authlib) to requirements
  3. Created oauth_provider.py with Google and GitHub providers
  4. Modified middleware to check both session and OAuth tokens
  5. Updated tests -- discovered 3 tests assumed session-only auth
- Outcome: Success after 2 iterations. First attempt broke existing tests.
- Lessons Learned:
  - Always run existing tests before modifying auth middleware
  - Authlib's Flask integration requires app context during init
  - OAuth callback URLs must be registered in provider console first
- Duration: 45 minutes
- Difficulty: Medium
- Tags: [authentication, refactoring, OAuth2, Flask, Python]
```

### Storage and Indexing

Episodes are stored in long-term memory (typically a vector database) with multiple indexing strategies:

**Semantic embedding**: The episode summary is embedded as a vector, enabling retrieval by semantic similarity. "I need to add social login" would match the OAuth2 episode above.

**Tag-based indexing**: Episodes are tagged with relevant topics, tools, and patterns. Direct tag lookup is faster and more precise than vector search for known categories.

**Outcome-based indexing**: Episodes are tagged as success or failure, enabling the agent to specifically retrieve successful approaches or failure examples to avoid.

**Temporal indexing**: Timestamp enables recency-weighted retrieval (recent episodes may be more relevant) and time-range queries ("what did I do last week?").

### Experience Replay

Borrowed from reinforcement learning, experience replay is the process of retrieving and "replaying" past episodes to inform current decisions:

1. **Situation assessment**: The agent characterizes the current task (topic, difficulty, tools needed)
2. **Episode retrieval**: The agent queries episodic memory for similar past situations (2-5 episodes)
3. **Lesson extraction**: From retrieved episodes, the agent extracts relevant lessons and approaches
4. **Informed action**: The agent incorporates these lessons into its current plan

```
[Current task]: Refactor the payment processing module to support Stripe
[Retrieved episode]: OAuth2 refactoring (Episode #247)
[Extracted lessons]:
- Run existing tests first before modifying core modules
- Add new provider alongside existing one, don't replace immediately
- Library-specific initialization may have framework requirements
[Application]: I'll first run the payment test suite, then add Stripe
alongside the existing payment processor, and carefully check Stripe
library initialization requirements for our framework.
```

### Episode Consolidation

Over time, multiple similar episodes can be consolidated into generalized lessons:

- Episodes #247, #312, #389 all involve adding new authentication providers
- Consolidated insight: "When adding a new auth provider, always: (1) run existing auth tests first, (2) add alongside existing providers rather than replacing, (3) check library-specific framework integration requirements, (4) verify callback/webhook URL configurations"

This consolidation transforms episodic memory into semantic memory: specific experiences become general knowledge.

## Why It Matters

### Enables Learning Without Fine-Tuning

Episodic memory is the primary mechanism by which agents improve over time without requiring model weight updates. Each task attempt generates an episode. Successful episodes provide templates for future similar tasks. Failed episodes provide cautionary examples. This in-context learning is immediate and requires no training pipeline.

### Prevents Repeated Mistakes

Without episodic memory, agents will make the same mistake every time they encounter the same situation. With episodic memory, the first occurrence generates a lesson, and subsequent encounters retrieve that lesson: "Last time I tried to parse this API response as JSON, but it was actually XML with a JSON content-type header. I should check the actual content before assuming JSON."

### Supports Transfer Learning Across Tasks

Episodes from one task domain can inform decisions in another. An episode about debugging a race condition in Python can inform the agent's approach to a similar concurrency issue in JavaScript. The structural similarity (concurrent access to shared state) transfers even though the specific technology differs.

## Key Technical Details

- **Episode granularity**: Store one episode per task or subtask, not per individual action. Individual actions are too fine-grained for useful retrieval; entire conversation sessions are too coarse. A single self-contained task attempt is the right unit
- **Storage overhead**: A typical episode is 200-500 tokens of text plus a 1536-dimensional embedding vector. Storing 10,000 episodes requires approximately 15MB of vector storage and 2-5MB of text
- **Retrieval count**: Loading 2-5 relevant episodes per new task is typical. More episodes increase context cost; fewer may miss relevant experiences
- **Recency bias**: Recent episodes are typically weighted higher (1.5-2x) than older episodes in retrieval scoring, on the assumption that recent experiences are more relevant to current conditions
- **Success/failure ratio**: Aim to retrieve a mix of successful and failed episodes. Successful episodes provide templates; failed episodes provide warnings. A 3:1 success-to-failure ratio is a reasonable default
- **Episode lifetime**: Not all episodes are valuable forever. Periodic review and pruning (removing episodes about deprecated tools, outdated APIs, or irrelevant contexts) maintains store quality
- **Generative Agents implementation**: Park et al. (2023) stored observations as episodes with importance scores (1-10, rated by the LLM), retrieved by a weighted combination of recency, importance, and relevance

## Common Misconceptions

- **"Episodic memory is just a chat history log."** Chat history is raw data. Episodic memory is structured, annotated, and indexed. Each episode includes extracted lessons, outcome assessments, and contextual tags that enable intelligent retrieval. Storing chat logs without this structure provides little value.

- **"Every interaction should be stored as an episode."** Routine, unremarkable interactions generate low-value episodes that clutter the memory store. Episode storage should be selective: store interactions that contain novel information, unusual outcomes, or valuable lessons. A simple "what's the weather?" exchange is not worth storing.

- **"Episodes are only useful for the exact same task."** The value of episodic memory comes from analogical reasoning: drawing lessons from similar but not identical situations. An episode about debugging a memory leak in Java is useful when debugging a memory leak in C++, because the diagnostic approach transfers.

- **"Older episodes are always less relevant."** While recency is a useful heuristic, some old episodes contain timeless lessons. An episode about a fundamental architecture decision or a subtle bug pattern may remain highly relevant years later. Importance scoring complements recency.

## Connections to Other Concepts

- `reflection-and-self-critique.md` — Reflections generated after task attempts are the primary content of episodic memory. The Reflexion architecture explicitly stores reflection text as episodes for future retrieval
- `memory-architecture-overview.md` — Episodic memory is a specific type of long-term memory in the three-layer architecture, complementing semantic memory (facts) and procedural memory (skills)
- `long-term-persistent-memory.md` — Episodic memory is implemented on top of long-term persistent storage (vector databases, document stores), using the same infrastructure with episode-specific schema
- `memory-retrieval-strategies.md` — Retrieving the right episodes requires combining recency, relevance, importance, and outcome-based scoring
- `semantic-memory.md` — Over time, episodic memories consolidate into semantic knowledge: repeated experiences become general rules and factual knowledge

## Further Reading

- Park, J., O'Brien, J., Cai, C., et al. (2023). "Generative Agents: Interactive Simulacra of Human Behavior." Implements episodic memory with importance scoring and retrieval by recency, relevance, and importance for simulated agents.
- Shinn, N., Cassano, F., Gopinath, A., et al. (2023). "Reflexion: Language Agents with Verbal Reinforcement Learning." Stores self-reflections as episodic memories that inform future task attempts, demonstrating learning through experience.
- Tulving, E. (1972). "Episodic and Semantic Memory." The foundational cognitive science paper distinguishing episodic (experiential) from semantic (factual) memory, which informs agent memory architecture design.
- Zhao, A., Huang, D., Xu, Q., et al. (2024). "ExpeL: LLM Agents Are Experiential Learners." Demonstrates agents that extract and apply insights from past experiences, consolidating episodic memory into reusable rules.
