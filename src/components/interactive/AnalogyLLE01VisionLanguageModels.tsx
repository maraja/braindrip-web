import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01VisionLanguageModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'A vision-language model (VLM) is an AI system that can process both images and text, enabling tasks like describing images, answering questions about visual content, and reasoning about what it sees. Think of it as giving a language model eyes.' },
    { emoji: '⚙️', label: 'How It Works', text: 'CLIP (Contrastive Language-Image Pre-training, Radford et al., January 2021) was the conceptual breakthrough. OpenAI trained a vision encoder (ViT-L/14) and a text encoder jointly on 400 million image-text pairs scraped from the internet.' },
    { emoji: '🔍', label: 'In Detail', text: 'The challenge is fundamental: images are grids of pixels (continuous, spatial, high-dimensional) while language is sequences of tokens (discrete, sequential, symbolic). Bridging these two modalities requires learning a shared representation where visual concepts and their linguistic descriptions occupy the same space.' },
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
