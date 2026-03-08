import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCDepthwiseSeparableConvolutions() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider washing a stack of colored plates. A standard approach is to scrub each plate with a sponge that handles both the circular scrubbing motion (spatial) and the color-specific soap (channel) simultaneously.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For an input of size H x W x C_&#123;in&#125; and C_&#123;out&#125; output channels with kernel size k:  [equation]' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, a standard convolution with kernel size k x k, C_&#123;in&#125; input channels, and C_&#123;out&#125; output channels applies C_&#123;out&#125; filters, each of size k x k x C_&#123;in&#125;. A depthwise separable convolution breaks this into:' },
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
