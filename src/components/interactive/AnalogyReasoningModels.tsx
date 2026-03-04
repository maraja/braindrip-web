import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyReasoningModels() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🤔', label: 'Show Your Work', text: 'In school, showing your work on math problems often gets partial credit and catches errors. Reasoning models (o1, o3, R1, Claude with extended thinking) are trained to "show their work" in an internal chain of thought before giving an answer. They explore approaches, verify steps, backtrack on mistakes, and build up to a solution — spending more tokens thinking to get harder problems right.' },
    { emoji: '🧗', label: 'Rock Climber', text: 'A regular model is like jumping straight at the top of a wall. A reasoning model is like a rock climber who plans each handhold, tests it, adjusts if it doesn\'t work, and methodically works upward. The extended "thinking" process — sometimes hundreds or thousands of tokens of internal reasoning — lets these models solve problems that require multi-step logic, mathematical proofs, or complex planning.' },
    { emoji: '♟️', label: 'Chess Engine', text: 'A chess engine doesn\'t just pick the first "good-looking" move — it explores many possible move sequences, evaluates positions, and picks the best path. Reasoning models similarly explore multiple reasoning paths during inference, trained via reinforcement learning to develop effective search strategies. They learn when to explore alternatives, when to verify, and when to backtrack — turning raw intelligence into systematic problem-solving.' },
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
