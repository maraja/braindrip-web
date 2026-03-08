import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyCVCZeroShotClassification() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how you can recognize a pangolin even if you have never seen one in person -- someone describes it as "an armored mammal covered in overlapping scales that rolls into a ball," and you match that description against what you see.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Traditional classifiers learn a weight vector w_c for each class from labeled data. In zero-shot classification, the text encoder generates t_c from a natural language description of class c, effectively replacing w_c with a semantically meaningful prototype.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, zero-shot classification is the task of assigning an image x to one of C categories \\&#123;y_1, , y_C\\&#125; when none of these categories appeared in the training set. The model has learned a mapping from images and text into a shared embedding space during pretraining (typically on image-caption pairs), and at inference time it computes:' },
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
