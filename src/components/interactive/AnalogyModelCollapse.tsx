import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyModelCollapse() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📠', label: 'Photocopy of Photocopy', text: 'Copy a document, then copy the copy, then copy that copy. Each generation loses detail and amplifies artifacts. Model collapse is the same: if Model B trains on Model A\'s outputs, and Model C trains on Model B\'s outputs, each generation loses the tail of the distribution. Rare but important patterns vanish, and the model converges to a narrow, repetitive version of language.' },
    { emoji: '🧬', label: 'Inbreeding', text: 'In biology, inbreeding reduces genetic diversity and amplifies defects. Model collapse is intellectual inbreeding: when AI-generated text dominates future training data, the model\'s "gene pool" narrows. It forgets rare expressions, minority perspectives, and unusual but valid patterns. Each generation is less diverse than the last, eventually producing bland, homogeneous outputs.' },
    { emoji: '🎨', label: 'Fading Palette', text: 'Imagine a painter who can only mix colors from their previous paintings, never from nature. Each generation of paintings loses subtle colors until only a few dominant hues remain. Model collapse works identically: training on synthetic data causes the model to progressively lose the "rare colors" (low-probability but real text patterns) of human language, converging to a limited palette.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
