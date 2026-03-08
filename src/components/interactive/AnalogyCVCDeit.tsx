import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCDeit() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a student who learns not by attending every lecture but by studying a brilliant tutor\'s solved examples. The student doesn\'t need access to the entire library -- just the tutor\'s guidance and clever study habits are enough.' },
    { emoji: '⚙️', label: 'How It Works', text: 'DeiT introduces a dedicated distillation token alongside the standard class token. Both are prepended to the patch sequence:  [equation]  The class token is trained with the standard cross-entropy loss against ground-truth labels. The distillation token is trained to match the teacher\'s output.' },
    { emoji: '🔍', label: 'In Detail', text: 'DeiT was introduced by Touvron et al. (2021) at Facebook AI Research. The key contribution is not a new architecture but a training strategy that makes ViT practical for researchers who only have access to ImageNet-1K (1.28 million images). DeiT-B achieves 83.' },
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
