# Step 6: Build Your Workflow

One-Line Summary: Connect transcription, summaries, action items, and follow-ups into a repeatable system that runs after every meeting.

Prerequisites: Steps 1–5 complete, at least one meeting processed end-to-end

---

## The Complete Pipeline

Here is the full workflow you have built:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Meeting    │────►│  Transcript  │────►│   Summary +  │────►│  Follow-Up   │
│  Recording   │     │  (Auto)      │     │  Action Items │     │   Emails     │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
   Otter/Fireflies     Paste into AI       Paste into AI        Send to team
```

Let's turn this into a system that takes under 10 minutes per meeting.

## Your Post-Meeting Checklist

Run through this after every meeting:

| Step | Tool | Time |
|------|------|------|
| 1. Grab transcript | Otter.ai / Fireflies / Zoom | 1 min |
| 2. Generate summary | Claude / ChatGPT | 2 min |
| 3. Extract action items | Claude / ChatGPT | 2 min |
| 4. Add actions to tracker | Notion / Todoist / Asana | 2 min |
| 5. Draft and send follow-up | Claude / ChatGPT + email | 3 min |

**Total: ~10 minutes** vs. 30–45 minutes doing it manually.

## Automate with Zapier or Make

### Zapier Workflow

```
Trigger: New transcript available in Otter.ai
Action 1: Send transcript to ChatGPT/Claude — generate summary
Action 2: Send transcript to ChatGPT/Claude — extract action items
Action 3: Create tasks in Todoist/Asana from action items
Action 4: Create a page in Notion with the summary
Action 5: Draft email in Gmail with summary + action items
```

### Make (Integromat) Workflow

```
Trigger: Webhook from Fireflies.ai (new transcript)
Module 1: OpenAI/Claude — summarize transcript
Module 2: OpenAI/Claude — extract action items as JSON
Module 3: Iterator — loop through action items
Module 4: Create task in project management tool per item
Module 5: Compose and send follow-up email via Gmail
```

Even without automation tools, the manual process with saved prompt templates is fast enough for most teams.

## Build a Meeting Knowledge Base

Over time, your meeting summaries become a searchable archive. Set this up in Notion or Google Docs:

### Notion Database Structure

| Property | Type | Purpose |
|----------|------|---------|
| Meeting Title | Title | What was discussed |
| Date | Date | When it happened |
| Type | Select | Standup / Strategy / Client / 1:1 |
| Attendees | Multi-select | Who was there |
| Summary | Rich text | AI-generated summary |
| Action Items | Relation | Linked to Action Items database |
| Transcript | Toggle block | Full transcript (collapsed) |

### Prompt for Searching Past Meetings

When you need to recall what was decided, paste recent summaries and ask:

```
Here are my meeting summaries from the past month:

[PASTE SUMMARIES]

What decisions were made about [TOPIC]?
Who was assigned ownership?
What is the current status based on the most recent meeting?
```

## Templates for Different Meeting Types

Save these prompt templates so anyone on your team can use them:

### Standup / Daily Sync
```
Summarize this standup in 3 sections:
- What was completed yesterday
- What is planned for today
- Blockers that need attention

Keep it under 150 words. Use bullet points.
```

### Client Call
```
Summarize this client call with these sections:
- Client requests and feedback
- Commitments we made (with owners)
- Open questions to follow up on
- Next meeting date and agenda items

Tone: professional, concise.
```

### Strategy / Planning
```
Summarize this strategy meeting:
- Key decisions made
- Options that were considered but rejected (and why)
- Action items with owners and deadlines
- Topics deferred to future meetings

Be thorough — this will be our reference document.
```

## Tips for Long-Term Success

1. **Be consistent** — Process every meeting, even short ones. The archive becomes more valuable over time.
2. **Tag and categorize** — Always add meeting type and attendees so you can search later.
3. **Share summaries quickly** — Send follow-ups within 1 hour while context is fresh.
4. **Review weekly** — Scan your action item tracker every Monday to catch anything that slipped.
5. **Iterate on prompts** — If summaries miss important details, refine your templates.

## Your Meeting Assistant Is Live

You now have:

- Automatic meeting transcription
- AI-powered summaries tailored to meeting type
- Action item extraction with owners and deadlines
- Follow-up emails drafted in seconds
- A searchable meeting knowledge base

No more "what did we decide in that meeting last month?" — it is all in your system.

Start using it for your next meeting.
