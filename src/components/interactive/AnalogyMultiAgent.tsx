import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMultiAgent() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎬', label: 'Film Crew', text: 'A single person can\'t make a movie, but a crew can: director, cinematographer, editor, sound designer. Multi-agent systems assign different LLM "agents" specialized roles — one writes code, another reviews it, a third writes tests, a fourth manages the project. They communicate, critique each other\'s work, and produce better results than any single agent could alone.' },
    { emoji: '🏥', label: 'Medical Team', text: 'A complex diagnosis involves a team: a GP evaluates symptoms, a radiologist reads scans, a specialist provides expertise, and they all confer. Multi-agent systems work the same way — each agent has different expertise, tools, or perspectives. They debate, verify each other\'s reasoning, and reach consensus. The diversity of perspectives catches errors a single model would miss.' },
    { emoji: '🏢', label: 'Company Departments', text: 'A company has R&D, marketing, legal, and finance — each with specialized knowledge. Multi-agent systems create a similar division of labor: a researcher agent gathers information, an analyst agent processes it, a writer agent drafts the output, and a critic agent reviews quality. Orchestration patterns (sequential, hierarchical, debate) determine how these departments collaborate.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
