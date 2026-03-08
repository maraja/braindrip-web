import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPESelfAskAndDecomposition() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine an investigator working a complex case. Instead of trying to solve the whole mystery at once, they break it into smaller leads: Who was at the scene? What was the motive? What does the forensic evidence show? Each lead is investigated independently, and the answers are synthesized into a coherent theory.' },
    { emoji: '⚙️', label: 'How It Works', text: 'In a self-ask prompt, the model generates text in a structured format: "Are follow-up questions needed here: Yes." "Follow-up: [sub-question 1]" "Intermediate answer: [answer to sub-question 1]" "Follow-up: [sub-question 2]" "Intermediate answer: [answer to sub-question 2]" "So the final answer is: [synthesized answer]"  This format is established.' },
    { emoji: '🔍', label: 'In Detail', text: 'Introduced by Press et al. (2022), self-ask was designed to improve performance on multi-hop question answering -- questions that require chaining together multiple facts. For example, "What country is the birthplace of the director of the film Jaws?" requires three hops: (1) Who directed Jaws? Steven Spielberg. (2) Where was Steven Spielberg born?' },
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
