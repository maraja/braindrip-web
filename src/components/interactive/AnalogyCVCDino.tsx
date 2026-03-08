import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCDino() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine an apprentice painter studying a master\'s technique by observing how the master depicts the same scene from different angles and under different lighting. The apprentice never receives explicit instruction about what objects are in the scene -- just the master\'s consistent interpretations.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Both the student f_&#123;_s&#125; and teacher f_&#123;_t&#125; share the same ViT architecture. Given an image, two global crops and several local crops are generated:  Global crops: Two crops covering 50-100% of the image, resized to 224 x 224 Local crops: Multiple (typically 6-8) smaller crops covering 5-50% of the image, resized to 96 x 96  The teacher processes.' },
    { emoji: '🔍', label: 'In Detail', text: 'DINO (Self-Distillation with No Labels) was introduced by Caron et al. (2021) at Facebook AI Research. Its most striking result is that the self-attention maps of a DINO-trained ViT spontaneously learn to segment objects -- attending precisely to foreground objects without any segmentation supervision.' },
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
