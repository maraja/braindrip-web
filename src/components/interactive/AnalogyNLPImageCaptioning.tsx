import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPImageCaptioning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine walking through a museum with a friend who asks you to describe each painting. For a simple scene -- a dog catching a frisbee in a park -- you produce a concise description almost instantly.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The foundational approach (Vinyals et al., 2015 -- "Show and Tell") treats captioning as a sequence-to-sequence problem:  Encoder: A pre-trained CNN (typically Inception, ResNet, or VGG) extracts a fixed-length visual feature vector from the image. The final fully connected layer or global average pooling layer produces a single vector (e.g.' },
    { emoji: '🔍', label: 'In Detail', text: 'Image captioning is the task of automatically generating a natural language sentence (or paragraph) that describes the visual content of an image. It sits at the intersection of computer vision (understanding what is in the image) and natural language generation (expressing that understanding fluently).' },
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
