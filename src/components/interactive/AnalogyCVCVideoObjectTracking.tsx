import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCVideoObjectTracking() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine following a specific person through a crowded train station using security cameras. You see them at the entrance, and your task is to keep locating them in every subsequent frame as they walk, turn, get partially hidden behind pillars, and reappear.' },
    { emoji: '⚙️', label: 'How It Works', text: '#### Correlation Filter Trackers  Before deep learning dominated, correlation filter (CF) trackers were the standard. The target template is learned as a filter in the Fourier domain, enabling efficient tracking:  [equation]  where &#123;X&#125; is the Fourier transform of the training sample, &#123;Y&#125; is the desired Gaussian response, and  is a regularization.' },
    { emoji: '🔍', label: 'In Detail', text: 'Tracking is divided into two major paradigms:' },
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
