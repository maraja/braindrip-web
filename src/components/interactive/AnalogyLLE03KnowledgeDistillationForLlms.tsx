import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03KnowledgeDistillationForLlms() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a master chef who has spent decades perfecting their craft. Traditional apprenticeship means watching the chef cook and trying to replicate their exact movements -- the angle of the knife, the timing of the flip.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The earliest successful LLM distillation was DistilBERT from Hugging Face (Sanh et al., October 2019). The approach was straightforward: take BERT\'s 12-layer, 110M parameter architecture, remove every other layer to create a 6-layer, 66M parameter student, and train it to match BERT\'s output distributions using a combination of three loss.' },
    { emoji: '🔍', label: 'In Detail', text: 'The concept of knowledge distillation in neural networks dates back to Hinton, Vartia, and Dean\'s 2015 paper "Distilling the Knowledge in a Neural Network," which showed that a small "student" network could learn from the soft probability outputs of a large "teacher" network rather than from hard labels alone.' },
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
