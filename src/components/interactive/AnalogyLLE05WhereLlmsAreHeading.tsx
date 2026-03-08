import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05WhereLlmsAreHeading() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine standing at the edge of a rapidly advancing frontier. Behind you: a clear history of scaling laws, benchmark improvements, and architectural innovations stretching from 2017 to 2025. Ahead: a landscape where models act autonomously, reason through novel problems, process all sensory modalities, and are available to anyone for nearly free.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most visible trajectory is the shift from models that generate text to models that take action. Claude Code, GPT-5\'s integrated tool use, Gemini\'s Project Astra and Mariner, and specialized coding agents like Jules represent the leading edge.' },
    { emoji: '🔍', label: 'In Detail', text: 'This file synthesizes the major threads of the LLM evolution story into forward-looking trajectories. It is not prediction — the history of AI is littered with confident predictions that aged poorly. It is an attempt to identify the most consequential open questions and the trends most likely to shape the next phase of the field.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
