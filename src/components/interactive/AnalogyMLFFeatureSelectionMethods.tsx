import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFFeatureSelectionMethods() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are packing for a week-long trip but can only bring a carry-on bag. You must choose the items that provide the most utility while leaving behind anything redundant or useless.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A practical pipeline often chains approaches: use filters to reduce from thousands of features to hundreds, then apply embedded or wrapper methods for the final selection.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a dataset with p features \\&#123;X_1, X_2, , X_p\\&#125; and a target y, feature selection seeks a subset S  \\&#123;1, , p\\&#125; of size  = k  p that maximizes some criterion of model quality -- accuracy, information gain, or generalization performance -- while discarding features that are noisy, redundant, or irrelevant.' },
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
