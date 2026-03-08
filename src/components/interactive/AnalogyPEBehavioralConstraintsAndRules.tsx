import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEBehavioralConstraintsAndRules() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about traffic laws. "Drive safely" is a well-intentioned instruction, but it is vague and unenforceable. "Do not exceed 65 mph on highways," "Stop at red lights," and "Yield to pedestrians in crosswalks" are specific rules that produce predictable, measurable compliance.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Constraints framed positively ("always cite your sources") are followed more reliably than negatively framed equivalents ("don\'t make claims without sources"). This is partly because positive framing tells the model what to do (a clear generation target) rather than what not to do (an infinite space of prohibited behaviors).' },
    { emoji: '🔍', label: 'In Detail', text: 'Behavioral constraints are the rules and boundaries embedded in a system prompt that define what the model must do, must not do, and how it should handle edge cases. They are the most operationally critical component of a system prompt because they directly determine whether the application behaves safely, consistently, and in alignment with.' },
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
