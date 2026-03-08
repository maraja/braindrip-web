import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCDetr() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have 100 assistants in a room, each holding an empty card. You show them a photo and ask each assistant to either write down one object (class + location) or write "no object." They can see each other\'s cards (self-attention) and the photo (cross-attention), so they coordinate to avoid duplicates.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Backbone: A ResNet (e.g., ResNet-50) extracts features, producing a feature map f  &#123;R&#125;^&#123;C x H x W&#125; (typically C = 2048, reduced to d = 256 via 1 x 1 conv). Transformer Encoder: The flattened feature map (HW tokens of dimension d) is processed by 6 self-attention layers with fixed sinusoidal positional encodings.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, DETR (Carion et al., 2020) feeds CNN features into a transformer encoder, then uses a transformer decoder with N learned object queries (typically N = 100) to predict N detection outputs in parallel.' },
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
