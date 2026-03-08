import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCVideoTransformers() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to understand a complex scene by looking at every detail in relation to every other detail -- not just in the current moment, but across time. A detective reviewing security footage might note that a person in frame 1 is connected to a bag in frame 50 and a car in frame 100.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A video of shape T x H x W x 3 is divided into tokens. Two main strategies exist:  Frame-level patches: Each frame is independently divided into &#123;H&#125;&#123;p&#125; x &#123;W&#125;&#123;p&#125; patches of size p x p. For T frames, total tokens:  [equation]  With T=8, H=W=224, p=16: N = 8 x 14 x 14 = 1&#123;,&#125;568 tokens.' },
    { emoji: '🔍', label: 'In Detail', text: 'Video transformers extend the Vision Transformer (ViT) paradigm from images to video. The input video is divided into spatiotemporal tokens (either frame-level patches or volumetric "tubelets"), which are linearly embedded and processed through transformer encoder layers.' },
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
