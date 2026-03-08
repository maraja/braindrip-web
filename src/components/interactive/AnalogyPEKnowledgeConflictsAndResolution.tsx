import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEKnowledgeConflictsAndResolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of knowledge conflicts like the situation when two reference books disagree on the same topic. Your chemistry textbook from 2015 says the boiling point of a compound is 178 degrees C, but a 2024 research paper reports 182 degrees C after more precise measurement. Which do you trust?' },
    { emoji: '⚙️', label: 'How It Works', text: 'The first step is instructing the model to detect and surface conflicts rather than silently resolving them:  Explicit detection instruction: "Before answering, check whether the provided sources agree on the relevant facts. If you find any contradictions between sources, explicitly identify them before providing your answer.' },
    { emoji: '🔍', label: 'In Detail', text: 'Knowledge conflicts in RAG systems arise in three forms. First, inter-context conflicts: two or more retrieved documents contradict each other on the same factual claim. Second, context-parametric conflicts: the retrieved documents contradict what the model learned during training.' },
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
