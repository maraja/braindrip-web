# Step 5: Build Your Study Plan

One-Line Summary: Use AI to create a personalized study schedule based on your exam dates, topic difficulty, and available time, with spaced repetition built in.

Prerequisites: Completed Steps 3 and 4 with flashcards and practice quizzes for your topics

---

## Why a Plan Beats "I'll Just Study More"

Most students study reactively — they cram whatever feels urgent the night before. A structured plan backed by spaced repetition research means you study less total time but remember more. The key insight: reviewing material at increasing intervals (1 day, 3 days, 7 days, 14 days) is dramatically more effective than reviewing it four times in one night.

## How Spaced Repetition Works

Spaced repetition is based on the forgetting curve. After you learn something, you forget it at a predictable rate. Reviewing just before you forget resets the curve and makes the memory stronger each time.

```
Memory
Strength
  |
  |\ Review 1   Review 2       Review 3
  | \    /\        /\              /\
  |  \  /  \      /  \            /  \
  |   \/    \    /    \          /    \
  |          \  /      \        /      \________
  |           \/        \      /
  |                      \    /
  |                       \  /
  |                        \/
  +-----|-----|------|---------|---------> Time
       Day 1  Day 3  Day 7   Day 14
```

Each review makes the curve decay more slowly. After 4-5 well-spaced reviews, information moves into long-term memory.

## Step 1: Tell AI About Your Situation

Use this prompt to give AI the context it needs to build your plan:

```
I need a study plan. Here is my situation:

Exam: [subject and exam name]
Exam date: [date]
Today's date: [date]
Days until exam: [number]

Topics to cover (rate your confidence 1-5 for each):
1. [Topic] - confidence: [1-5]
2. [Topic] - confidence: [1-5]
3. [Topic] - confidence: [1-5]
4. [Topic] - confidence: [1-5]
5. [Topic] - confidence: [1-5]

Time available per day:
- Weekdays: [hours] hours
- Weekends: [hours] hours

Scheduling constraints: [anything else — work, other exams, etc.]

My study tools: flashcards in [Anki/Quizlet], practice quizzes in
[Notion/Google Docs], [anything else]
```

## Step 2: Generate the Study Schedule

Follow up with this prompt:

```
Based on my situation, create a day-by-day study schedule from
today until my exam date.

Rules:
- Prioritize low-confidence topics — they need more time and earlier starts
- Build in spaced repetition: every topic should be reviewed at least
  3 times before the exam, with increasing intervals between reviews
- Include specific activities for each session:
  "Review Chapter 5 flashcards" not just "Study Chapter 5"
- Include at least 2 full practice quiz sessions in the final week
- Build in one rest day per week
- Each study session should be [30/45/60] minutes with a 10-minute break

Format as a table:
| Day | Date | Session 1 | Session 2 | Notes |
```

### Example Output

```
| Day | Date   | Session 1 (45 min)           | Session 2 (45 min)          | Notes              |
|-----|--------|------------------------------|-----------------------------|--------------------|
| 1   | Mon    | Ch5 Cell Division: Read notes | Ch5: Generate flashcards    | New topic           |
| 2   | Tue    | Ch6 Genetics: Read notes      | Ch5: First flashcard review | Start Ch6           |
| 3   | Wed    | Ch6: Generate flashcards      | Ch7 Ecology: Read notes     | Start Ch7           |
| 4   | Thu    | Ch5: Second review + quiz     | Ch6: First flashcard review | Ch5 spaced review   |
| 5   | Fri    | Ch7: Generate flashcards      | Ch8 Evolution: Read notes   | Start Ch8           |
| 6   | Sat    | REST DAY                      | REST DAY                    | Let it consolidate  |
| 7   | Sun    | Ch5: Practice quiz (full)     | Ch6: Second review + quiz   | Week 1 review       |
```

## Step 3: Build a Review Rotation

Ask AI to create a spaced repetition rotation for your flashcard decks:

```
I have flashcard decks for these topics: [list your topics].
Create a daily flashcard review rotation that follows spaced
repetition intervals.

Rules:
- New cards: review the next day, then day 3, then day 7, then day 14
- I can review a maximum of [50/100/150] cards per day
- Prioritize cards I got wrong on the last review
- Show me which decks to review each day in a simple calendar
```

## Step 4: Set Up Your Tracking System

Create a simple tracker in Notion or Google Sheets to monitor your progress. Ask AI to design it:

```
Design a study progress tracker I can use in [Notion/Google Sheets].

Include these columns:
- Topic name
- Confidence level (1-5, updated weekly)
- Flashcard accuracy (% correct on last review)
- Quiz score (% on last practice quiz)
- Next review date
- Notes

Pre-fill it with my topics: [list topics]
Start confidence levels at: [list the levels you gave earlier]
```

## Adapting the Plan

Your plan is not set in stone. Every week, check in with AI:

```
Here is my study progress this week:
- [Topic 1]: flashcard accuracy [X]%, quiz score [X]%
- [Topic 2]: flashcard accuracy [X]%, quiz score [X]%
- [Topic 3]: I fell behind and missed 2 sessions
- [Topic 4]: feeling much more confident now

Please adjust my study plan for next week. Give more time to
topics where I'm struggling and less time to topics I've mastered.
Keep the same format as before.
```

## Common Scheduling Mistakes to Avoid

- **Starting too late** — begin at least 2 weeks before a major exam, 4 weeks for finals
- **Marathon sessions** — two 45-minute sessions beat one 3-hour session for retention
- **Skipping low-confidence topics** — these need the most repetitions, so start them first
- **No rest days** — your brain consolidates memories during rest; plan at least one day off per week
- **Ignoring the plan** — a mediocre plan you follow beats a perfect plan you ignore

---

[Next: Step 6 - Review and Iterate →](06-review-and-iterate.md)
