import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCImageNoiseAndDenoising() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to listen to a friend speak at a loud concert. Their voice (the signal) is mixed with crowd noise, music, and reverberations. You can still understand them if the noise is mild, but as it gets louder, words become garbled.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Gaussian (additive white) noise: Each pixel is corrupted by an independent sample from &#123;N&#125;(0, ^2). This models thermal noise in the sensor\'s electronics and readout circuitry. The noise level is characterized by  (standard deviation).' },
    { emoji: '🔍', label: 'In Detail', text: 'where [m, n] is the noise component. The goal of denoising is to estimate I_&#123;clean&#125; from I_&#123;observed&#125;.' },
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
