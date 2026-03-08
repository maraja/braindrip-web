import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCMobilenet() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of designing a car for city driving. A Formula 1 car has incredible performance but is impractical for daily use -- too expensive, too wide for narrow streets, and fuel-hungry.' },
    { emoji: '⚙️', label: 'How It Works', text: 'MobileNetV1 replaces every standard convolution (except the first layer) with a depthwise separable convolution:  The architecture is a stack of 13 such depthwise separable blocks:  Width multiplier   (0, 1] scales the number of channels in every layer by factor . At  = 1.0: 4.2M params, 569M FLOPs, 70.6% top-1. At  = 0.5: 1.' },
    { emoji: '🔍', label: 'In Detail', text: 'MobileNet was introduced by Andrew Howard and colleagues at Google in 2017 (V1), with significant architectural improvements in V2 (2018) and V3 (2019). The family has become the most widely deployed CNN architecture on mobile devices.' },
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
