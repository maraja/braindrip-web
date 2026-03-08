import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEMentalModelsForPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you need to communicate with someone, but you are not sure whether you are talking to a parrot, an employee, an actor, or a mimic. A parrot continues whatever sentence you start — it does not understand meaning, it just predicts the next likely word. An employee follows instructions — give clear directives and they execute.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most mechanistically accurate model. An LLM is fundamentally a next-token predictor trained on massive text corpora. Given a sequence of tokens, it outputs a probability distribution for the next token.' },
    { emoji: '🔍', label: 'In Detail', text: 'LLMs are complex systems that exhibit all four behaviors depending on how you interact with them. No single mental model captures the full picture. The completion engine model explains why prompt structure and word choice matter mechanically. The instruction follower model explains why explicit directives work with instruction-tuned models.' },
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
