import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyGradientClipping() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🎚', label: 'Volume Limiter', text: 'Gradient clipping is like a volume limiter on a speaker. Normally, gradients are the "volume" of weight updates. If a batch produces an unusually loud gradient (exploding gradient), the limiter kicks in and caps it to a maximum volume. The direction of the gradient is preserved — only the magnitude is reduced. This prevents a single bad batch from destroying the model.' },
    { emoji: '🌊', label: 'Flood Gates', text: 'Imagine a dam with flood gates. Normal water flow (gradients) passes through freely. But when a sudden flood (gradient explosion) arrives, the gates engage and limit the flow to a safe maximum. Gradient clipping works the same way: if the gradient norm exceeds a threshold (commonly 1.0), all gradients are scaled down proportionally so the total norm equals the threshold.' },
    { emoji: '🏃', label: 'Speed Governor', text: 'A speed governor on an engine limits top speed regardless of how hard you press the accelerator. Gradient clipping is a speed governor for training: it limits how large a single update step can be. Without it, a rare outlier batch could produce enormous gradients that catapult weights into a bad region, causing loss to spike and training to destabilize or diverge entirely.' },
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
