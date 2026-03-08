import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE06Llama32Multimodal() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a family of vehicles that started as sedans — reliable, powerful, but limited to paved roads. Then the manufacturer releases an update: the same family now includes an SUV that handles off-road terrain (images and documents), plus two ultralight motorcycles that can go anywhere, even places without gas stations (on-device, no internet.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The multimodal models (11B and 90B) used a vision adapter architecture rather than training from scratch as a natively multimodal model. The approach involved three components: a pre-trained image encoder based on a SigLIP-style architecture (a contrastive vision-language model), cross-attention layers that allowed the language model to attend to.' },
    { emoji: '🔍', label: 'In Detail', text: 'Meta released LLaMA 3.2 on September 25, 2024, at the Meta Connect event. It was a four-model release: two text-only models (1B and 3B parameters) designed for edge and mobile deployment, and two vision-language models (11B and 90B parameters) that could understand images alongside text.' },
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
