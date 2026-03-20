# Step 5: Automate Follow-Ups

One-Line Summary: Use AI to draft follow-up emails tailored to each recipient and audience — team members, clients, and executives — with meeting summaries and their specific action items.

Prerequisites: Steps 1-4 completed, a meeting summary and extracted action items from a real or test meeting

---

## The Follow-Up Problem

You just left a 45-minute meeting. You have a summary and action items. Now you need to:

- Send a recap to everyone who attended
- Send a separate summary to stakeholders who were not there
- Send the client a polished version without internal details
- Give your manager a concise executive brief

Writing four different emails from scratch takes 20-30 minutes. With the right prompts, AI drafts all of them in under 2 minutes.

## The Team Follow-Up Prompt

This is your go-to prompt for internal team recaps. Paste your summary and action items from Steps 3 and 4.

```
Draft a follow-up email for the team members who attended this meeting.

Tone: Professional but friendly. Keep it concise and scannable.

Include:
1. A 2-3 sentence summary of the meeting
2. Key decisions made (bulleted list)
3. Action items formatted as a table: Owner | Task | Deadline
4. Any open questions or items for the next meeting
5. Date/time of the next meeting if mentioned

Do NOT include: lengthy background context (they were there) or
excessive pleasantries.

Subject line: Concise and descriptive, starting with the meeting name.

Meeting summary:
[PASTE SUMMARY FROM STEP 3]

Action items:
[PASTE ACTION ITEMS FROM STEP 4]
```

### Example Output

```
Subject: Product Sync (Mar 18) — Recap & Action Items

Hi team,

Quick recap from today's product sync. We aligned on the Sprint 15
scope and decided to prioritize the notification feature over the
dashboard redesign based on customer feedback data.

**Key Decisions:**
- Notification feature moves to Sprint 15 (dashboard pushed to Sprint 16)
- QA will start regression testing on Wednesday
- Design review for onboarding flow moved to next Tuesday

**Action Items:**
| Owner  | Task                              | Deadline  |
|--------|-----------------------------------|-----------|
| Sarah  | Write PRD for notifications       | Mar 20    |
| Mike   | API rate limiting investigation   | Mar 19    |
| Mike   | Effort estimates for 3 features   | Mar 20    |
| Lisa   | Onboarding flow mockups v2        | Mar 24    |

**Open for next meeting:**
- Finalize QA test plan for notifications
- Review customer feedback dashboard metrics

Next sync: Thursday, March 20 at 10am.

Best,
[Your name]
```

## The Client Follow-Up Prompt

Client emails require a different tone and must exclude internal discussions.

```
Draft a follow-up email to our client after this meeting.

Tone: Professional, confident, and clear. Convey that we are organized
and on top of next steps.

Include:
1. Thank them for their time
2. Brief summary of what was discussed (3-4 sentences max)
3. What we committed to delivering, with timelines
4. What we need from them (if anything), with clear asks
5. Next steps and when they will hear from us again

Do NOT include:
- Internal team discussions, concerns, or disagreements
- Technical implementation details they do not need to know
- Uncertain timelines — only include dates we are confident about
- Action items assigned to our internal team (only mention deliverables)

Client name: [CLIENT NAME]
Client company: [COMPANY]
Our company: [YOUR COMPANY]

Meeting summary:
[PASTE SUMMARY FROM STEP 3]

Action items:
[PASTE ACTION ITEMS FROM STEP 4]
```

## The Executive Brief Prompt

For your manager or skip-level who needs the headlines without the details.

```
Draft a brief executive summary email about this meeting.

Tone: Direct, concise, no fluff. Executives want signal, not noise.

Format:
- Subject line: [Meeting type] — [One key takeaway]
- 3-5 bullet points max covering:
  * The most important decision or outcome
  * Any risks, blockers, or escalations that need attention
  * Timeline changes or budget implications
  * What you need from them (if anything)
- Total email length: under 150 words

Do NOT include: granular action items, detailed discussion points,
or background context they already know.

Recipient: [NAME, TITLE]

Meeting summary:
[PASTE SUMMARY FROM STEP 3]
```

### Example Output

```
Subject: Product Sync — Notifications prioritized over dashboard redesign

Hi David,

Three things from today's product sync:

• We are prioritizing the notification feature for Sprint 15 based
  on customer feedback. Dashboard redesign moves to Sprint 16.
• QA flagged an API rate limiting issue that could delay integration
  testing. Mike is investigating — will escalate if it is not
  resolved by Wednesday.
• Sprint 15 scope is set. On track for the v2.0 milestone in April.

No action needed from you. Will flag if the QA blocker escalates.

Best,
[Your name]
```

## The Per-Person Action Item Email

When you need to send each person their specific tasks after a meeting with many action items.

```
I need to send individual follow-up emails to each team member with
only their specific action items. Draft a separate short email for
each person.

For each email:
- Friendly, 2-3 sentence opener referencing the meeting
- Their specific action items in a numbered list with deadlines
- A note about any dependencies (who they need something from, or
  who is waiting on them)
- Keep each email under 100 words

Team action items:
[PASTE ACTION ITEMS FROM STEP 4]
```

## Batch Processing Multiple Follow-Ups

After a meeting, you can generate all your follow-ups in a single AI conversation:

1. **Start the conversation** by pasting your full summary and action items
2. **Ask for the team recap email** using the team prompt
3. **Then ask for the client email** — the AI already has the context
4. **Then ask for the executive brief** — same conversation, no re-pasting
5. **Then ask for individual action item emails** if needed

This takes 3-5 minutes total and produces all the emails you need.

## Personalizing the Tone

If you want emails that sound like you (not like AI), add this to any prompt:

```
Write in this style:
- I use short sentences and paragraphs
- I start emails with "Hi [name]," not "Dear" or "Hello"
- I sign off with "Best," or "Thanks,"
- I use bullet points instead of long paragraphs
- I am direct but warm — no corporate jargon
```

Or paste a sample email you have written before and tell the AI: "Match this writing style."

## Checklist

- [ ] Team follow-up prompt saved and tested
- [ ] Client follow-up prompt saved and tested
- [ ] Executive brief prompt saved and tested
- [ ] At least one complete set of follow-up emails generated from a real meeting
- [ ] Emails reviewed, personalized, and sent

You now have the full toolkit: transcription, summaries, action items, and follow-up emails. In the final step, we will connect everything into a repeatable workflow you can run on autopilot.

---

[Next: Step 6 - Build Your Workflow →](06-build-your-workflow.md)
