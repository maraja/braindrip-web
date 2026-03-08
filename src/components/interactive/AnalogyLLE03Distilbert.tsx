import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03Distilbert() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a master chef who has spent decades developing an extraordinary intuition for flavor combinations, timing, and technique. Now imagine that chef training an apprentice — not by having the apprentice repeat the decades of experience, but by having the apprentice watch the chef work and learn to replicate the chef\'s judgments directly.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Knowledge distillation, introduced by Hinton et al. (2015), is based on a key insight: a trained model\'s output probability distribution contains far more information than hard labels. When BERT predicts a masked token, it does not just output "cat" — it outputs a probability distribution like &#123;cat: 0.7, kitten: 0.15, dog: 0.05, ...&#125;.' },
    { emoji: '🔍', label: 'In Detail', text: 'This is knowledge distillation: training a smaller "student" model to mimic the behavior of a larger "teacher" model. In October 2019, Victor Sanh, Lysandre Debut, Julien Chaumond, and Thomas Wolf at Hugging Face published DistilBERT — a distilled version of BERT that cut the model nearly in half while preserving the vast majority of its.' },
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
