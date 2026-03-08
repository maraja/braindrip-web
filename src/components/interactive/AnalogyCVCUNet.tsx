import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCUNet() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are examining a microscope slide and need to outline every cell boundary. You first zoom out to understand the overall tissue structure (encoder), then zoom back in to trace exact edges (decoder).' },
    { emoji: '⚙️', label: 'How It Works', text: 'The network has two symmetric paths:  Contracting path (encoder): Repeated blocks of two 3x3 convolutions (each followed by ReLU), then 2x2 max pooling with stride 2. Each downsampling step doubles the number of feature channels: 64 -&gt; 128 -&gt; 256 -&gt; 512 -&gt; 1024. Four downsampling steps reduce spatial resolution by 16x.' },
    { emoji: '🔍', label: 'In Detail', text: 'U-Net was introduced by Ronneberger, Fischer, and Brox (2015) specifically for biomedical image segmentation, where labeled data is scarce (sometimes only 30 annotated images) but pixel-perfect accuracy is critical. Its architecture became the single most influential design in medical imaging and has been adapted across dozens of domains.' },
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
