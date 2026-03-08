import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCGanTrainingDynamics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two chess players learning simultaneously -- each adapts to the other\'s strategy, but neither stands still. The game can spiral into cycles where neither improves, or one player dominates so completely the other cannot learn.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Mode collapse occurs when the generator maps many different noise vectors to a small set of outputs, covering only a few modes of the data distribution. In the extreme case, G produces a single image regardless of input z. This happens because the minimax game has no explicit diversity objective.' },
    { emoji: '🔍', label: 'In Detail', text: 'Understanding and stabilizing these dynamics has been one of the most active research areas in generative modeling, producing a toolbox of techniques that made high-resolution GAN synthesis practical.' },
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
