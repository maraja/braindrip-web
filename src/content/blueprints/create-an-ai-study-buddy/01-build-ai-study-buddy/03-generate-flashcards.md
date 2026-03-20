# Step 3: Generate Flashcards

One-Line Summary: Use AI prompt templates to generate effective flashcards from your material, then export them to Anki or Quizlet for spaced repetition practice.

Prerequisites: Completed Step 2 with at least one topic's material organized and ready

---

## Why Flashcards Work

Flashcards use active recall — instead of passively re-reading your notes, you force your brain to retrieve the answer. Research consistently shows this is one of the most effective study techniques. The challenge is that making good flashcards by hand takes a long time. AI solves that problem.

## Types of Flashcards

Different material calls for different card types. Use a mix for the best results:

| Card Type | Front | Back | Best For |
|-----------|-------|------|----------|
| **Definition** | Term or concept | Definition and example | Vocabulary, key terms |
| **Concept** | Question about a concept | Explanation | Understanding processes, theories |
| **Application** | Scenario or problem | Solution with reasoning | Applying knowledge to new situations |
| **Comparison** | "Compare X and Y" | Key similarities and differences | Distinguishing related concepts |
| **Image-based** | Diagram description | Labels or explanations | Anatomy, geography, architecture |

## Prompt Template: Definition Cards

Paste your material, then use this prompt:

```
Based on the material I provided, generate 15 definition-style flashcards.

Format each card exactly like this:
Q: [term or concept as a question]
A: [clear, concise definition + one concrete example]

Rules:
- Keep answers to 2-3 sentences maximum
- Include one specific example in each answer
- Focus on terms that are most likely to appear on an exam
- Avoid cards that are too obvious or trivial
```

### Example Output

```
Q: What is mitosis?
A: Mitosis is the process of cell division that produces two
genetically identical daughter cells from one parent cell.
Example: Skin cells divide through mitosis to repair a cut.

Q: What happens during metaphase?
A: During metaphase, chromosomes align along the metaphase plate
(the cell's equator) and spindle fibers attach to the centromeres
of each chromosome. Example: Think of chromosomes lining up
single-file at the middle of the cell like students in a hallway.
```

## Prompt Template: Concept Cards

```
Based on the material I provided, generate 10 concept flashcards
that test understanding, not just memorization.

Format each card exactly like this:
Q: [question that requires explaining a concept or process]
A: [explanation in 2-4 sentences]

Rules:
- Questions should start with "Why," "How," or "Explain"
- Answers should demonstrate understanding, not just repeat definitions
- Include cause-and-effect relationships where relevant
```

## Prompt Template: Application Cards

```
Based on the material I provided, generate 10 application flashcards
that present a scenario and ask the student to apply their knowledge.

Format each card exactly like this:
Q: [realistic scenario or problem]
A: [solution with brief reasoning]

Rules:
- Scenarios should be realistic and specific
- The answer should explain WHY, not just WHAT
- These should be harder than definition cards
```

## Prompt Template: Comparison Cards

```
Based on the material I provided, identify 5 pairs of concepts
that are commonly confused or compared. Create a flashcard for each pair.

Format each card exactly like this:
Q: Compare [Concept A] and [Concept B]
A: Similarities: [1-2 points]. Differences: [2-3 key differences].
   Remember: [one memorable distinction]
```

## Refining Your Cards

After AI generates cards, review them quickly:

- **Delete** cards that test trivial information you already know
- **Edit** cards where the answer is too long (aim for under 3 sentences)
- **Flag** cards where you are not sure the AI got the answer right — verify these against your textbook
- **Add** cards for important topics the AI missed

Ask AI to improve specific cards:

```
This flashcard answer is too long. Shorten it to 2 sentences
while keeping the key information:
[paste the card]
```

## Export to Anki

Anki uses a simple text import format. Ask AI to reformat your cards:

```
Reformat all the flashcards you just created into Anki import format.
Use a tab character to separate the front and back of each card.
Put each card on its own line. Do not include any numbering or labels.

Example format:
What is mitosis?	Mitosis is cell division producing two identical daughter cells. Example: skin cells dividing to heal a wound.
```

Save the output as a `.txt` file, then in Anki: File > Import > select your file > set the separator to Tab.

## Export to Quizlet

For Quizlet, ask AI to format the cards with a custom separator:

```
Reformat all flashcards for Quizlet import.
Separate the term and definition with a semicolon.
Put each card on its own line.

Example format:
What is mitosis?;Mitosis is cell division producing two identical daughter cells.
```

In Quizlet: Create Set > Import > paste the text > set "Between term and definition" to semicolon.

## How Many Cards to Make

A good target per topic:

- **10-15 definition cards** for key vocabulary
- **5-10 concept cards** for understanding
- **5-10 application cards** for exam prep
- **3-5 comparison cards** for commonly confused topics

That gives you 25-40 cards per major topic. For a midterm covering 5 topics, that is 125-200 cards total — enough to study effectively without being overwhelming.

---

[Next: Step 4 - Create Practice Quizzes →](04-create-practice-quizzes.md)
