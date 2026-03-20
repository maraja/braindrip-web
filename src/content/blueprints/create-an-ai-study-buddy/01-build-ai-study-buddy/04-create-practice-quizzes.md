# Step 4: Create Practice Quizzes

One-Line Summary: Use AI to generate multiple-choice, short-answer, and essay-style questions at varying difficulty levels using Bloom's taxonomy as a framework.

Prerequisites: Completed Step 3 with flashcards generated for at least one topic

---

## Why Practice Quizzes Beat Re-Reading

Taking a practice test is the single most effective study method according to cognitive science research. It does two things flashcards cannot: it simulates exam pressure, and it tests your ability to connect ideas across a topic rather than recall isolated facts.

## Understanding Bloom's Taxonomy for Better Questions

Bloom's taxonomy describes six levels of thinking. Most exams test across multiple levels. Knowing which level a question targets helps you study strategically:

| Level | What It Tests | Question Stems |
|-------|--------------|----------------|
| **Remember** | Recall facts | "What is...", "Name the...", "List..." |
| **Understand** | Explain ideas | "Explain why...", "Describe how...", "Summarize..." |
| **Apply** | Use knowledge in new situations | "How would you use...", "Calculate...", "Demonstrate..." |
| **Analyze** | Break down and examine | "Compare...", "What is the relationship...", "Why did..." |
| **Evaluate** | Judge and defend | "Do you agree...", "Which approach is better...", "Justify..." |
| **Create** | Produce something new | "Design...", "Propose...", "What would happen if..." |

Most introductory courses focus on Remember through Apply. Advanced courses push into Analyze through Create.

## Prompt Template: Multiple-Choice Questions

```
Based on the material I provided, create a 10-question multiple-choice quiz.

Format each question exactly like this:
[number]. [question]
a) [option]
b) [option]
c) [option]
d) [option]
Correct: [letter]
Explanation: [1-2 sentences explaining why the correct answer is right
and why the most tempting wrong answer is wrong]

Rules:
- Include 3 Remember-level, 4 Understand-level, and 3 Apply-level questions
- Make distractors (wrong answers) plausible, not obviously wrong
- Avoid "all of the above" and "none of the above"
- Each question should test a different concept
```

### Example Output

```
1. During which phase of mitosis do chromosomes align at the
   center of the cell?
a) Prophase
b) Metaphase
c) Anaphase
d) Telophase
Correct: b
Explanation: Metaphase is defined by chromosomes lining up at the
metaphase plate. Prophase (the most common wrong answer) is when
chromosomes condense, which happens before alignment.
```

## Prompt Template: Short-Answer Questions

```
Based on the material I provided, create 5 short-answer questions
that require 2-4 sentence responses.

Format each question exactly like this:
[number]. [question] (Bloom's level: [level])
Model answer: [2-4 sentence answer]
Key points to include: [bulleted list of must-mention items]

Rules:
- Include at least 2 questions at the Analyze or Evaluate level
- Questions should require connecting multiple concepts
- Model answers should be what a strong student would write
```

## Prompt Template: Essay-Style Questions

```
Based on the material I provided, create 2 essay-style questions
that could appear on an exam.

Format each question exactly like this:
[number]. [question] (Bloom's level: [level])
Suggested length: [word count]
Outline of a strong answer:
- [main point 1 with supporting detail]
- [main point 2 with supporting detail]
- [main point 3 with supporting detail]
Common mistakes to avoid: [list]

Rules:
- These should be Analyze, Evaluate, or Create level
- Require the student to synthesize multiple topics
- Include the kind of question a professor would ask, not a textbook
```

## Prompt Template: Difficulty Scaling

If you need harder or easier questions, use this follow-up prompt:

```
Those questions were [too easy / about right / too hard].
Generate 5 more questions that are one level [harder / easier]
on Bloom's taxonomy. Keep the same format.

For reference, the previous questions were at the [level] level.
I need questions at the [target level] level.
```

## Self-Grading Your Practice Quiz

After you take a practice quiz, use AI to grade your answers:

```
I just took the practice quiz you created. Here are my answers.
Please grade each one and explain what I got right, what I got
wrong, and what I should review.

Question 1: [your answer]
Question 2: [your answer]
[continue for all questions]

For each wrong answer, explain:
1. What the correct answer is and why
2. What concept I need to review
3. One specific thing I should re-read in my notes
```

## Building a Question Bank

Over time, save your best questions in a document organized by topic and difficulty. Here is a simple structure:

```
## Cell Division - Question Bank

### Remember Level
1. [question]...
2. [question]...

### Understand Level
1. [question]...

### Apply Level
1. [question]...

### Analyze Level
1. [question]...
```

This question bank becomes your go-to resource before exams. Aim for 20-30 questions per major topic, spread across difficulty levels.

## Matching Question Types to Your Exam

Ask yourself what your actual exam looks like, then weight your practice accordingly:

- **Mostly multiple choice?** Generate 70% MC, 20% short-answer, 10% conceptual
- **Essay-heavy exam?** Generate 40% essay outlines, 30% short-answer, 30% MC
- **Problem-solving exam?** Focus on Apply and Analyze level questions with worked solutions
- **Not sure?** Ask your professor or check past exams, then tell AI the format

---

[Next: Step 5 - Build Your Study Plan →](05-build-your-study-plan.md)
