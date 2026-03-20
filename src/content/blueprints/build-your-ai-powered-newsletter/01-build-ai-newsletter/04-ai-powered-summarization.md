# Step 4: AI-Powered Summarization

One-Line Summary: Use Claude or ChatGPT to summarize your curated articles into concise briefs, extract key takeaways, and prepare the raw material for your newsletter draft.

Prerequisites: Completed Steps 1-3, a free Claude or ChatGPT account, 5-8 curated articles saved from your Feedly board

---

## The Summarization Workflow

After curating your articles in Step 3, you have 5-8 full-length articles saved. Most of your readers do not have time to read all of them — that is where you add value. You will use AI to create one-paragraph summaries that capture the essence of each article.

The workflow is simple:

1. Open each curated article in your browser
2. Copy the article text
3. Paste it into Claude or ChatGPT with a summarization prompt
4. Collect the summaries in a single document

This takes about 15-20 minutes for a full issue's worth of articles.

## Choose Your AI Tool

Both Claude and ChatGPT work well for this task. Here is a quick comparison:

| Feature | Claude | ChatGPT |
|---------|--------|---------|
| **Free tier** | Yes — claude.ai | Yes — chatgpt.com |
| **Summary quality** | Excellent at following specific format instructions | Excellent general summarization |
| **Tone matching** | Very strong at maintaining consistent voice | Good with detailed instructions |
| **Context length** | Handles very long articles well | Handles long articles well |
| **Best for** | Nuanced summaries, consistent formatting | Quick summaries, general use |

**Our recommendation:** Try both with the same article and see which output you prefer. You can always switch later.

## The Single-Article Summary Prompt

Use this prompt template to summarize one article at a time. Copy it, replace the bracketed sections, and paste it into your AI tool:

```
I'm writing a newsletter about [YOUR NICHE] for [YOUR AUDIENCE].

Summarize the following article in exactly one paragraph (3-5 sentences).
Include:
- What happened or what the article is about
- Why it matters to my audience
- One specific takeaway or action item

Keep the tone [conversational/professional/casual] and avoid jargon.

Article title: [PASTE TITLE]
Article source: [PASTE SOURCE NAME]
Article text:

[PASTE THE FULL ARTICLE TEXT HERE]
```

### Example Output

For an AI tools newsletter, the output might look like:

> **OpenAI announced GPT-5 with native tool use** (The Verge) — OpenAI released GPT-5 this week with built-in support for calling external tools like web search and code execution without needing plugins. For marketing teams, this means AI assistants can now pull live data and generate reports in a single conversation instead of requiring multiple tools. If you are building AI workflows, start testing GPT-5's tool-use feature with your existing prompts to see if it can replace any manual steps.

## The Batch Summary Prompt

If your articles are short to medium length, you can summarize multiple articles in one prompt. This is faster but works best with articles under 2,000 words each:

```
I'm writing a weekly newsletter about [YOUR NICHE] for [YOUR AUDIENCE].

Summarize each of the following articles in one paragraph (3-5 sentences each).
For each summary, include:
- A bold title with the source in parentheses
- What the article covers
- Why it matters to my readers
- One actionable takeaway

Format each summary as a bullet point. Keep the tone [conversational/professional].

---

ARTICLE 1:
Title: [TITLE]
Source: [SOURCE]
Text: [PASTE TEXT]

---

ARTICLE 2:
Title: [TITLE]
Source: [SOURCE]
Text: [PASTE TEXT]

---

[CONTINUE FOR ALL ARTICLES]
```

## The Key Takeaways Prompt

Beyond summaries, you can ask AI to extract the overarching themes across all your articles. This is useful for writing your newsletter's intro paragraph:

```
Here are the summaries from this week's articles for my [YOUR NICHE] newsletter:

[PASTE ALL YOUR SUMMARIES]

Based on these summaries, identify:
1. The 2-3 biggest themes or trends this week
2. One surprising or contrarian finding
3. A one-sentence "bottom line" that ties everything together

Keep it concise — I'll use this to write my newsletter's opening paragraph.
```

### Example Output

> **This week's themes:** (1) Major AI companies are shifting from chat interfaces to agentic tool use, (2) open-source models are closing the quality gap with commercial APIs, (3) regulation discussions are moving from theory to actual legislation. **Surprise finding:** The most-shared article this week was not about a new model launch but about a practical workflow optimization. **Bottom line:** The AI industry is maturing from "look what's possible" to "here's how to get work done."

## Tips for Better Summaries

- **Include the source name** — Your readers want to know where the information comes from. It builds trust.
- **Always add "why it matters"** — Raw summaries are boring. The value you add is context and relevance.
- **Ask for action items** — Readers love knowing what to do with the information. "Try this," "watch for this," or "ignore this" are all useful.
- **Keep a consistent format** — Use the same summary structure every week so readers know what to expect.
- **Edit the AI output** — AI summaries are a starting point. Add your own perspective, fix any inaccuracies, and adjust the tone.

## Organize Your Summaries

Create a simple document (Google Docs, Notion, or even a plain text file) called **"Issue [Number] - Summaries"** and collect all your summaries there. Structure it like this:

```
ISSUE #12 — Week of March 17, 2026
=====================================

SUMMARIES:
-----------
1. [Summary of Article 1]
2. [Summary of Article 2]
3. [Summary of Article 3]
4. [Summary of Article 4]
5. [Summary of Article 5]

THEMES THIS WEEK:
------------------
[Output from the Key Takeaways prompt]

NOTES:
------
[Any personal observations or hot takes you want to include]
```

This document becomes the input for Step 5, where you will draft the full newsletter issue.

## Your Checklist Before Moving On

Before you proceed to Step 5, confirm you have:

- [ ] Summarized all 5-8 curated articles using the prompt templates above
- [ ] Extracted key themes and takeaways across all articles
- [ ] Organized everything in a single summary document
- [ ] Added your own notes or observations where you have something to say

You now have all the raw material for your newsletter issue. In the next step, we will use AI to draft the complete newsletter from these summaries.

---

[← Previous: Step 3 - Set Up Content Curation](03-set-up-content-curation.md) | [Next: Step 5 - Draft Your Newsletter →](05-draft-your-newsletter.md)
