import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCClip() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a bilingual translator who has read 400 million photo captions in two languages -- images and English. After enough exposure, the translator can look at any new photo and immediately describe it in English, or hear a description and pick the matching photo from a lineup.' },
    { emoji: '⚙️', label: 'How It Works', text: 'CLIP uses two parallel encoders:  Image encoder: Either a modified ResNet (ResNet-50, ResNet-50x4, ResNet-50x16, ResNet-50x64) or a Vision Transformer (ViT-B/32, ViT-B/16, ViT-L/14). The best-performing variant uses ViT-L/14 at 336px resolution.' },
    { emoji: '🔍', label: 'In Detail', text: 'Technically, CLIP consists of two encoders -- one for images (either a ResNet or Vision Transformer) and one for text (a Transformer) -- trained jointly so that matching image-text pairs have high cosine similarity while non-matching pairs are pushed apart.' },
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
