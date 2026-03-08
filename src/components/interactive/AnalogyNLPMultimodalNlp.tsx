import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPMultimodalNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine describing a photograph to someone who cannot see it. You must translate visual information -- spatial relationships, colors, actions, emotions, context -- into language. Now imagine the reverse: understanding a caption well enough to pick the correct image from thousands of candidates.' },
    { emoji: '⚙️', label: 'How It Works', text: 'CLIP (Radford et al., 2021, OpenAI) learns a shared embedding space for images and text via contrastive learning. The architecture is simple:  An image encoder (ViT-L/14 or ResNet) maps images to vectors. A text encoder (Transformer) maps captions to vectors.' },
    { emoji: '🔍', label: 'In Detail', text: 'Multimodal NLP extends natural language processing beyond text to incorporate other information channels -- primarily vision (images, video), but also audio, structured data, sensor readings, and more.' },
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
