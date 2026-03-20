# Step 3: AI-Powered Summaries

One-Line Summary: Use AI prompt templates to transform raw meeting transcripts into structured, scannable summaries tailored to different meeting types.

Prerequisites: Steps 1-2 completed, a transcript from a real or test meeting, access to Claude or ChatGPT

---

## From Wall of Text to Useful Notes

A raw transcript is valuable but hard to read. It contains filler words, tangents, crosstalk, and no structure. Your goal in this step: **turn any transcript into a clean, structured summary in under 2 minutes.**

The secret is having the right prompt templates ready to go. You paste your transcript, use the appropriate prompt, and get back a formatted summary you can share with your team.

## The Universal Meeting Summary Prompt

This prompt works for any meeting type. Copy it and keep it somewhere accessible (a note, a text expander, or a Notion template).

```
You are a professional meeting note-taker. I will provide a meeting transcript.
Analyze it and produce a structured summary with these sections:

## Meeting Summary
- Meeting type: [identify the type: standup, planning, strategy, client call, 1-on-1, etc.]
- Date: [extract from context or state "not specified"]
- Attendees: [list all speakers identified in the transcript]
- Duration: [estimate based on transcript length]

## Key Decisions
List every decision that was made or agreed upon. Be specific.

## Discussion Points
Summarize the main topics discussed in 2-3 sentences each.
Group related topics together.

## Open Questions
List any questions that were raised but not resolved.

## Action Items
List every commitment or task mentioned, with the person responsible if stated.

## Context & Background
Note any important context mentioned that would help someone who was not
in the meeting understand the discussions.

Rules:
- Be concise but do not omit important details
- Use the speakers' actual names when identified
- Flag any conflicting statements or unclear commitments
- If something is ambiguous in the transcript, note it as "[unclear]"

Here is the transcript:
[PASTE TRANSCRIPT HERE]
```

## Meeting-Specific Prompt Templates

Different meetings need different emphasis. Use these specialized templates for better results.

### Daily Standup / Sync

```
Summarize this standup meeting transcript. For each participant, extract:

1. **What they completed** since last standup
2. **What they are working on** today
3. **Any blockers** they mentioned

Format as a table:
| Person | Completed | Working On | Blockers |

Then add a "Team Blockers" section listing anything that needs escalation
or cross-team help.

Transcript:
[PASTE TRANSCRIPT HERE]
```

### Strategy / Planning Meeting

```
Summarize this strategy meeting transcript with these sections:

## Objective
What was this meeting trying to decide or plan?

## Options Discussed
List each option or approach that was proposed, with:
- Who proposed it
- Key arguments for and against
- Estimated impact or effort if mentioned

## Decision Reached
What was the final decision? If no decision was reached, state what the
next steps are to reach one.

## Strategic Implications
What does this decision mean for the team/project/company going forward?

## Risks & Concerns
List any risks, concerns, or dissenting opinions that were raised.

## Next Steps
Who needs to do what, and by when?

Transcript:
[PASTE TRANSCRIPT HERE]
```

### Client / External Meeting

```
Summarize this client meeting transcript with these sections:

## Meeting Overview
Brief 2-3 sentence summary of the meeting purpose and outcome.

## Client Requests
List everything the client asked for, requested, or expressed interest in.
Mark each as: [New Request], [Follow-up], or [Clarification].

## Commitments We Made
List every promise, timeline, or deliverable we committed to.
Include who on our team made the commitment.

## Client Sentiment
Assess the overall tone: positive, neutral, concerned, or frustrated.
Note specific moments that indicate satisfaction or dissatisfaction.

## Internal Follow-Ups (Do Not Share with Client)
What do we need to discuss or resolve internally before the next touchpoint?

## Next Meeting / Touchpoint
When is the next interaction scheduled, and what should we prepare?

Transcript:
[PASTE TRANSCRIPT HERE]
```

## How to Use These Prompts

1. **Copy your transcript** from Otter, Fireflies, or your platform
2. **Open Claude or ChatGPT** in a new conversation
3. **Paste the appropriate prompt template** from above
4. **Replace `[PASTE TRANSCRIPT HERE]`** with your actual transcript
5. **Review the output** and make any corrections (names, dates, specific details)
6. **Save the summary** in your documentation tool (Notion, Google Docs, etc.)

**Important:** For long meetings (over 60 minutes), the transcript may exceed the AI's input limit. In that case, split the transcript into chunks and summarize each chunk separately, then ask the AI to combine them into a single summary.

## Improving Your Results

**Add context before the transcript.** The more the AI knows, the better the summary:

```
Context: This is a weekly product planning meeting for our mobile app team.
The team is in Sprint 14, working toward a v2.0 launch in March.
Key people: Sarah (PM), Mike (Engineering Lead), Lisa (Design), Tom (QA).

Transcript:
[PASTE TRANSCRIPT HERE]
```

**Iterate on the output.** After getting the initial summary, you can ask follow-up questions:
- "Expand on the discussion about the timeline delay"
- "Were there any disagreements about the feature priority?"
- "What was the exact wording of the commitment Sarah made to the client?"

## Storing Your Summaries

Create a consistent location for your meeting notes. A simple structure in Notion or Google Docs:

```
Meeting Notes/
├── 2026-03-18 - Weekly Product Sync
├── 2026-03-17 - Client Call - Acme Corp
├── 2026-03-15 - Sprint Retrospective
└── 2026-03-14 - Strategy Review - Q2 Planning
```

Name files with the date first so they sort chronologically. Include the meeting type and any relevant project or client name.

## Checklist

- [ ] Universal summary prompt saved and accessible
- [ ] At least one meeting-specific prompt template saved
- [ ] Test summary generated from a real or sample transcript
- [ ] Documentation location set up (Notion page, Google Drive folder, etc.)
- [ ] Summary reviewed and validated against your memory of the meeting

You now have AI-generated meeting summaries. Next, we will extract the action items into a format that actually drives follow-through.

---

[Next: Step 4 - Extract Action Items →](04-extract-action-items.md)
