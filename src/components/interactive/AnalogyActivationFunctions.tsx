import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyActivationFunctions() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🚦', label: 'Traffic Light', text: 'An activation function is like a traffic light deciding which signals pass through. ReLU is a simple red/green: negative signals get stopped (zeroed), positive ones pass freely. GELU is a smarter traffic controller that lets most positive signals through but occasionally lets small negatives pass too, creating smoother traffic flow.' },
    { emoji: '🚪', label: 'Doorway Filter', text: 'Imagine a bouncer at a club door. A strict bouncer (ReLU) blocks anyone below a threshold — zero means "no entry." A lenient bouncer (GELU/SiLU) uses a probability: mostly blocks negatives but sometimes lets borderline cases in. Without any bouncer (linear), the network could not learn anything beyond straight lines.' },
    { emoji: '🎚', label: 'Volume Knob', text: 'Activation functions are like volume knobs with personality. A linear function is a knob that just scales uniformly — boring. ReLU is a knob that mutes everything below zero. SiLU/Swish is a smooth knob that gently curves near zero. These nonlinear "knobs" give neural networks the ability to model complex, curved decision boundaries.' },
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
