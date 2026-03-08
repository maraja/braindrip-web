import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCSwinTransformer() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading a newspaper by focusing on one column at a time, then shifting your gaze half a column over to catch information that spans column boundaries. You never try to read the entire page at once -- that would be overwhelming -- but by alternating your reading window, you eventually process every cross-column connection.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Swin builds a feature pyramid analogous to a CNN backbone:  Stage 1: 4 x 4 patch embedding, producing &#123;H&#125;&#123;4&#125; x &#123;W&#125;&#123;4&#125; tokens with dimension C Stage 2: Patch merging (concatenating 2 x 2 neighboring patches and projecting), producing &#123;H&#125;&#123;8&#125; x &#123;W&#125;&#123;8&#125; tokens with dimension 2C Stage 3: &#123;H&#125;&#123;16&#125; x &#123;W&#125;&#123;16&#125; tokens, dimension 4C Stage 4: &#123;H&#125;&#123;32&#125; x &#123;W&#125;&#123;32&#125;.' },
    { emoji: '🔍', label: 'In Detail', text: 'The Swin Transformer, introduced by Liu et al. (2021) at Microsoft Research Asia, addresses two fundamental limitations of the original ViT: (1) ViT\'s quadratic complexity with image size makes it impractical for high-resolution dense prediction tasks, and (2) ViT produces single-scale features, while tasks like object detection and segmentation.' },
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
