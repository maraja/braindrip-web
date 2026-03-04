import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyAdamOptimizer() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '⚽', label: 'Ball Rolling Downhill', text: 'Adam is like a ball rolling downhill with momentum and adaptive speed. The momentum (first moment) keeps the ball rolling even through small bumps — it remembers past gradients. The adaptive speed (second moment) tracks how bumpy the terrain is: on rough ground (noisy gradients), it takes cautious steps; on smooth slopes, it rolls faster. This combination makes Adam the default optimizer for LLM training.' },
    { emoji: '🚗', label: 'Smart Cruise Control', text: 'Adam is a car with smart cruise control. The first moment (mean of gradients) acts like momentum — it smooths out noisy acceleration. The second moment (variance of gradients) acts like terrain awareness — on bumpy roads (high gradient variance), it slows down automatically. Each parameter gets its own cruise control settings, so rarely-updated parameters can take bigger steps than frequently-updated ones.' },
    { emoji: '🧭', label: 'Experienced Navigator', text: 'An experienced navigator does not just look at the current wind (gradient) — they remember the prevailing wind direction (momentum) and how variable the winds have been (second moment). Adam combines these: it follows the smoothed trend direction while adapting step sizes based on historical turbulence. Bias correction in the early steps prevents the navigator from overreacting when they have little data.' },
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
