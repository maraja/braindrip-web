# Step 5: Draft Your Newsletter

One-Line Summary: Use AI to draft a complete newsletter issue from your summaries — including an intro, article roundup with commentary, and closing CTA — with prompt templates for consistent voice and tone.

Prerequisites: Completed Steps 1-4, your summary document from Step 4 with 5-8 article summaries and key themes

---

## Newsletter Anatomy

Before we draft, understand the structure that high-performing newsletters follow. Every issue should have these sections:

| Section | Purpose | Length |
|---------|---------|--------|
| **Subject line** | Get the email opened | 5-10 words |
| **Intro paragraph** | Hook the reader, preview what is inside | 2-4 sentences |
| **Article roundup** | Your curated summaries with commentary | 5-8 items, 1-2 paragraphs each |
| **Personal take** (optional) | Your unique perspective on a trend | 1-2 paragraphs |
| **Closing CTA** | Tell readers what to do next | 2-3 sentences |

This is not a rigid template — you can adjust it over time. But starting with a clear structure makes the AI draft much better.

## Define Your Voice

Before you prompt the AI, write down your newsletter's voice characteristics. This keeps your tone consistent across issues and prevents the AI from defaulting to generic "assistant" writing.

Fill in this template:

```
MY NEWSLETTER VOICE:
- Tone: [e.g., casual and conversational, like texting a smart friend]
- Perspective: [e.g., optimistic but skeptical of hype]
- Vocabulary: [e.g., plain English, no jargon, explain acronyms]
- Personality: [e.g., I use humor sparingly, I share personal opinions]
- I NEVER: [e.g., use corporate buzzwords, write clickbait, oversell]
```

### Example Voice Definition

```
MY NEWSLETTER VOICE:
- Tone: Friendly and direct, like explaining something to a coworker over coffee
- Perspective: Practical and slightly skeptical — I test things before recommending them
- Vocabulary: Plain English, I explain technical terms when I use them
- Personality: I'm opinionated but fair, I admit when I don't know something
- I NEVER: Use phrases like "game-changer" or "revolutionary," write walls of text, or hype things I haven't tried
```

Save this voice definition — you will include it in every drafting prompt.

## The Full Newsletter Draft Prompt

This is the main prompt that turns your summaries into a complete newsletter issue. Copy this template, fill in the bracketed sections, and paste it into Claude or ChatGPT:

```
You are helping me write issue #[NUMBER] of my newsletter "[NEWSLETTER NAME]."

MY AUDIENCE: [YOUR ONE-SENTENCE AUDIENCE DEFINITION FROM STEP 2]

MY VOICE:
[PASTE YOUR VOICE DEFINITION FROM ABOVE]

THIS WEEK'S THEMES:
[PASTE THE THEMES FROM YOUR STEP 4 SUMMARY DOCUMENT]

THIS WEEK'S ARTICLE SUMMARIES:
[PASTE ALL YOUR SUMMARIES FROM STEP 4]

MY PERSONAL NOTES:
[PASTE ANY OBSERVATIONS OR HOT TAKES YOU WROTE DOWN]

Please write a complete newsletter issue with these sections:

1. SUBJECT LINE — Write 3 options. Short, specific, curiosity-driven. No clickbait.

2. INTRO PARAGRAPH — 2-4 sentences that hook the reader. Reference the
   biggest theme of the week. Make the reader want to keep scrolling.

3. ARTICLE ROUNDUP — For each article summary, write:
   - A bold headline (not the original article title — rewrite it for my audience)
   - 1-2 paragraphs: the summary plus my commentary/opinion
   - A "Read the original" link placeholder: [LINK]
   Order the articles from most to least important.

4. QUICK HITS — Take the 2-3 least important articles and condense them
   into a bulleted list with one sentence each.

5. CLOSING — 2-3 sentences wrapping up the issue. Include a call to action
   (ask a question, request a reply, or suggest sharing the newsletter).

Write the entire issue in my voice. Do not use phrases like "dive into" or
"without further ado." Keep paragraphs short — 2-3 sentences max.
```

## The Subject Line Refinement Prompt

If you are not happy with the subject line options, use this follow-up prompt:

```
Those subject lines are too [generic/long/boring]. Give me 5 more options that:
- Are under 8 words
- Reference something specific from this issue
- Would make [YOUR AUDIENCE] curious enough to open the email
- Do NOT use question marks or ALL CAPS
```

Good subject lines are specific and create an information gap:

| Weak | Strong |
|------|--------|
| "This Week in AI" | "3 AI tools that actually save time" |
| "Weekly Update #12" | "Open-source models just got dangerous" |
| "Important Industry News" | "The quiet shift every marketer missed" |

## Edit the AI Draft

The AI draft is a starting point, not a finished product. Spend 15-20 minutes editing:

### What to Add

- **Your actual opinions** — Replace generic commentary with what you really think
- **Personal anecdotes** — "I tried this tool last week and here's what happened"
- **Specific recommendations** — "If you only read one link this week, make it this one"
- **Humor or personality** — Small touches that make your newsletter feel human

### What to Remove

- **Filler phrases** — "It's worth noting that," "Interestingly enough," "In conclusion"
- **Hedging language** — "It could potentially," "It might be interesting to" — take a stance
- **Repetitive transitions** — AI loves "Meanwhile," "On another note," "Speaking of which"
- **Over-explanation** — If your audience already knows what RSS is, do not explain it

### What to Check

- **Accuracy** — AI can get facts wrong. Verify claims against the original articles.
- **Links** — Replace all `[LINK]` placeholders with actual URLs from your curated articles.
- **Length** — Aim for a 3-5 minute read. If it takes longer, cut the weakest section.
- **Flow** — Read it from top to bottom. Does each section lead naturally to the next?

## Build a Swipe File

After a few issues, save your best intros, transitions, and CTAs in a "swipe file" — a simple document of reusable writing patterns. This makes future drafting faster and keeps your quality consistent.

Example swipe file entries:

```
GOOD INTROS:
- "Three things happened this week that will change how you [TOPIC]. Here's what matters."
- "I spent 4 hours reading about [TOPIC] so you don't have to. The short version:"
- "Everyone is talking about [BIG NEWS]. But the real story is [CONTRARIAN TAKE]."

GOOD CTAS:
- "Hit reply and tell me: [SPECIFIC QUESTION]. I read every response."
- "If this was useful, forward it to one person who'd find it helpful."
- "What should I cover next week? Reply with your vote: [OPTION A] or [OPTION B]."
```

## Your Checklist Before Moving On

Before you proceed to Step 6, confirm you have:

- [ ] Written down your voice definition
- [ ] Generated a full newsletter draft using the AI prompt template
- [ ] Edited the draft — added your opinions, removed filler, checked accuracy
- [ ] Replaced all link placeholders with real URLs
- [ ] Read the draft aloud to check for flow and natural tone

You now have a complete, edited newsletter issue. In the next step, we will format it in your email platform, add visuals, and schedule it for delivery.

---

[← Previous: Step 4 - AI-Powered Summarization](04-ai-powered-summarization.md) | [Next: Step 6 - Design and Schedule →](06-design-and-schedule.md)
