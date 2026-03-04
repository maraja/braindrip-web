import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySelfPlay() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '♟', label: 'Chess Against Yourself', text: 'AlphaGo learned by playing millions of games against itself, each game making both sides stronger. Self-play for LLMs works similarly: the model generates responses, critiques them, generates improved versions, and trains on the improvements. It bootstraps its own training signal. Each iteration raises the bar, creating an upward spiral of capability without needing new human data.' },
    { emoji: '🪞', label: 'Mirror Practice', text: 'A debater practicing in front of a mirror plays both sides of the argument, getting better at anticipating and countering. Self-play lets LLMs argue with themselves: one instance proposes a solution, another critiques it, and the model learns from the exchange. This self-improvement loop can discover strategies no human explicitly taught, as long as the model can reliably evaluate quality.' },
    { emoji: '🏋️', label: 'Personal Trainer', text: 'Imagine being your own personal trainer: you do an exercise, evaluate your form, correct it, and repeat. Self-play and self-improvement let models generate outputs, score them (via a reward model or verifiable answers), and train on the best ones. The critical challenge is ensuring the self-evaluator remains accurate — if it drifts, the model can improve at the wrong things.' },
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
