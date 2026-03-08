import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04QuantizationAndCompression() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a professional photographer who shoots in RAW format -- each image is 50 megabytes of pristine detail, capturing subtle gradations invisible to the human eye. Now imagine converting those images to high-quality JPEG: each file drops to 5 megabytes, and for almost any practical purpose -- printing, sharing, displaying on a screen -- the.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Neural network weights are numbers, and the precision with which you store them determines both memory usage and computational accuracy:  FP32 (32-bit float): 4 bytes per parameter. Full precision, used during training. A 70B model requires 280 GB.' },
    { emoji: '🔍', label: 'In Detail', text: 'The need for quantization grew directly from the scaling era\'s central contradiction. By 2023, the most capable models had billions to trillions of parameters, but each parameter was stored as a 16-bit or 32-bit floating-point number.' },
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
