import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySelfReflection() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🪞', label: 'Proofreading Your Essay', text: 'After writing a first draft, a good writer re-reads it critically: "Is this argument convincing? Did I miss anything? Is this accurate?" Self-reflection has the LLM do exactly this — evaluate its own output, identify weaknesses, and revise. Techniques like Reflexion store the critique in memory so the model improves across attempts, learning from its own mistakes.' },
    { emoji: '🏗️', label: 'Building Inspector', text: 'After a builder finishes a floor, an inspector checks for code violations before continuing. Self-reflection is the model acting as its own inspector — reviewing its reasoning for logical errors, hallucinations, or missed requirements. If problems are found, it goes back and fixes them. This catch-and-correct loop dramatically improves output quality, especially on complex multi-step tasks.' },
    { emoji: '♟️', label: 'Chess Post-Mortem', text: 'After a chess game, players analyze their moves: "Move 12 was a mistake because..." This post-mortem improves future play. LLM self-reflection works the same way — the model evaluates its output ("I assumed X but didn\'t verify it"), generates actionable feedback, and uses that feedback to produce a better response. Each reflection cycle refines the answer toward correctness.' },
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
