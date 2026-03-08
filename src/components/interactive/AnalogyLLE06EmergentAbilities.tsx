import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE06EmergentAbilities() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine heating water. Temperature rises gradually, and nothing dramatic happens — until 100 degrees Celsius, when the water suddenly boils. The transition from liquid to gas is not gradual; it is a phase transition that emerges from the underlying physics at a critical threshold.' },
    { emoji: '⚙️', label: 'How It Works', text: 'defined an emergent ability as "an ability that is not present in smaller models but is present in larger models." Critically, this is measured at the task level, not at the level of training loss. Training loss decreases smoothly with scale (as Kaplan showed), but individual task performance can be discontinuous.' },
    { emoji: '🔍', label: 'In Detail', text: 'The concept was formally introduced in Wei et al.\'s 2022 paper "Emergent Abilities of Large Language Models," which surveyed results from GPT-3, PaLM, LaMDA, and other model families.' },
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
