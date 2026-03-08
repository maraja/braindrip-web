import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPDataAugmentationForNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are learning to identify bird species from photographs, but you only have 20 photos of each species. A clever teacher flips the images horizontally, adjusts the brightness, crops them differently, and even photographs toy models of the birds from new angles.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Back-translation is the most consistently effective augmentation technique for NLP. The procedure:  Take a labeled example: (x, y) where x is text and y is the label. Translate x to a pivot language using a forward MT model: x\' = MT_&#123;en-&gt;fr&#125;(x).' },
    { emoji: '🔍', label: 'In Detail', text: 'Data augmentation is the set of techniques that create additional training examples from existing labeled data without collecting new annotations. In computer vision, this is straightforward -- rotate, flip, crop, adjust color. In NLP, augmentation is harder because even small changes to text can alter meaning ("I like this movie" vs.' },
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
