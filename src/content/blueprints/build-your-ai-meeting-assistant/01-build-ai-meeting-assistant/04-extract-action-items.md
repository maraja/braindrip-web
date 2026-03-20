# Step 4: Extract Action Items

One-Line Summary: Use AI to pull action items from meeting transcripts with clear owners, deadlines, and priority levels, then organize them in your task tracker.

Prerequisites: Steps 1-3 completed, a meeting transcript or summary, access to a task tracking tool (Notion, Todoist, Asana, or a simple spreadsheet)

---

## Why Action Items Get Lost

Meetings generate commitments constantly. Someone says "I'll look into that," another person agrees to "send over the numbers by Friday." These promises are scattered throughout a 45-minute conversation, and unless someone is meticulously tracking them, they vanish.

AI solves this by scanning the entire transcript and catching every commitment — including the ones people made casually and might not even remember.

## The Action Item Extraction Prompt

This is your primary prompt for pulling action items from any meeting transcript.

```
Analyze this meeting transcript and extract ALL action items. An action item
is any task, commitment, promise, or follow-up that someone agreed to do or
was assigned to do.

For each action item, provide:
- **Task**: Clear, specific description of what needs to be done
- **Owner**: Who is responsible (use their name from the transcript)
- **Deadline**: When it is due (extract from transcript, or mark as "Not specified")
- **Priority**: High / Medium / Low (infer from context and urgency discussed)
- **Context**: One sentence explaining why this task matters or what it relates to

Format as a numbered list, grouped by owner.

Rules:
- Catch implicit commitments ("I'll take a look at that" = action item)
- If someone volunteers but no one confirms, flag it as "[Unconfirmed]"
- If a deadline is vague ("soon", "next week"), note the exact words used
- If ownership is unclear ("someone should..."), mark owner as "[Unassigned]"
- Distinguish between action items and general discussion topics

Here is the transcript:
[PASTE TRANSCRIPT HERE]
```

## Example Output

Here is what the AI might produce from a product planning meeting:

```
## Action Items by Owner

### Sarah (Product Manager)
1. **Write the PRD for the notification feature**
   - Deadline: Friday, March 20
   - Priority: High
   - Context: Needed before engineering can start Sprint 15 planning

2. **Schedule a follow-up with the design team on the onboarding flow**
   - Deadline: "Early next week"
   - Priority: Medium
   - Context: Design raised concerns about the current flow during review

### Mike (Engineering Lead)
1. **Investigate the API rate limiting issue reported by QA**
   - Deadline: Not specified
   - Priority: High
   - Context: Blocking QA testing on the integration module

2. **Provide effort estimates for the three proposed features**
   - Deadline: Before Thursday's prioritization meeting
   - Priority: High
   - Context: Team needs estimates to finalize the Sprint 15 backlog

### Unassigned
1. **Update the staging environment with the latest database migration**
   - Deadline: Not specified
   - Priority: Medium
   - Context: Mike mentioned "someone should do this" but no one volunteered
```

## Advanced: Action Items with Accountability

For teams that need stricter tracking, use this enhanced prompt:

```
Extract action items from this transcript and format them for project tracking.

For each item provide:
| # | Task | Owner | Deadline | Priority | Dependencies | Success Criteria |

Rules for each column:
- Task: Start with a verb. Be specific enough that someone could complete
  it without re-reading the transcript.
- Owner: Single person. If multiple people, pick the primary and list
  others as dependencies.
- Deadline: Exact date if stated. If vague, convert to a date
  (e.g., "next week" → week of [date]).
- Priority: High (blocks others or has a hard deadline), Medium (important
  but flexible), Low (nice-to-have or exploratory).
- Dependencies: Other action items or people this task depends on.
- Success Criteria: How will we know this is done?

Also create a "Decisions Log" section listing any decisions made that
provide context for the action items.

Transcript:
[PASTE TRANSCRIPT HERE]
```

## Moving Action Items to Your Task Tracker

Once AI extracts your action items, move them into the tool your team already uses.

### Notion

1. Create a **Meeting Action Items** database with columns: Task, Owner, Deadline, Priority, Status, Source Meeting
2. After each meeting, add the extracted items as new entries
3. Use Notion's filter views to see "My items" or "Overdue items"

### Todoist

1. Create a project called "Meeting Action Items" (or one per recurring meeting)
2. Add each action item as a task with the due date and priority level
3. Use labels to tag items by meeting or project
4. Assign tasks to team members if you are on Todoist Business

### Asana

1. Create a project for meeting follow-ups
2. Add each action item as a task, assign the owner, and set the due date
3. Use sections to group by meeting date
4. Use Asana's timeline view to spot deadline conflicts

### Simple Spreadsheet

If you want to keep it lightweight, a Google Sheet works:

| Task | Owner | Deadline | Priority | Status | Meeting Date |
|------|-------|----------|----------|--------|-------------|
| Write PRD for notifications | Sarah | Mar 20 | High | In Progress | Mar 18 |
| Investigate API rate limiting | Mike | Not set | High | Not Started | Mar 18 |

## The Weekly Review Prompt

At the end of each week, review your accumulated action items. Paste your task list into AI with this prompt:

```
Here is my team's action item list from this week's meetings. Review it and:

1. **Flag overdue items** — anything past its deadline
2. **Identify conflicts** — items assigned to the same person with
   overlapping deadlines
3. **Spot missing owners** — any unassigned items that need someone
4. **Suggest priorities** — if any Low items should be elevated based on
   dependencies
5. **Draft a status update** I can send to my team summarizing what is
   done, in progress, and at risk

Action items:
[PASTE YOUR TASK LIST HERE]
```

## Tips for Better Action Item Extraction

**Be explicit in meetings.** The clearer people are, the better AI extraction works. Encourage phrases like:
- "I will [specific task] by [specific date]"
- "Sarah, can you own [specific deliverable]?"
- "Let's mark this as a follow-up for next week's meeting"

**Run extraction on the transcript, not the summary.** Summaries may condense or omit casual commitments. The full transcript catches everything.

**Cross-reference with your summary.** Compare the action items against your Step 3 summary to make sure nothing was missed.

## Checklist

- [ ] Action item extraction prompt saved and accessible
- [ ] Test extraction run on a real or sample transcript
- [ ] Task tracker set up with appropriate columns (Owner, Deadline, Priority, Status)
- [ ] First batch of action items moved into your tracker
- [ ] Weekly review prompt saved for end-of-week check-ins

Your meetings now produce structured action items that feed directly into your project management workflow. Next, we will tackle the final piece: getting follow-up emails out the door fast.

---

[Next: Step 5 - Automate Follow-Ups →](05-automate-follow-ups.md)
