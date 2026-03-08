import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCVisionTransformer() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine cutting a photograph into a grid of small squares, then reading those squares left-to-right, top-to-bottom like words in a sentence. A language model could then "read" the image the same way it reads text.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Given a 224 x 224 x 3 image and patch size P = 16:  [equation]  Each patch is flattened to a vector of length 16 x 16 x 3 = 768 and projected through a linear layer E  &#123;R&#125;^&#123;768 x D&#125; to produce the patch embedding. This linear projection is equivalent to a single convolutional layer with kernel size and stride both equal to P.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, an image x  &#123;R&#125;^&#123;H x W x C&#125; is reshaped into a sequence of N = HW / P^2 flattened patches, each of size P x P x C. Each patch is linearly projected into a D-dimensional embedding. A learnable class token [&#123;CLS&#125;] is prepended, and learnable 1D positional embeddings are added before the sequence enters L layers of multi-head self-attention.' },
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
