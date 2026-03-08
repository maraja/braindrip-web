import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCPoolingLayers() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of summarizing a long paragraph by extracting one key sentence from each section. Pooling does something similar to feature maps: it divides the spatial grid into non-overlapping (or overlapping) windows and distills each window into a single value.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Selects the maximum value within each window:  [equation]  where &#123;R&#125; is the pooling region. Max pooling preserves the strongest activation, making it effective for detecting whether a feature is present somewhere within the window. The standard configuration in most CNNs is 2 x 2 max pooling with stride 2, which halves each spatial dimension.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a feature map F of size H x W, a pooling operation with window size k x k and stride s produces an output of size:' },
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
