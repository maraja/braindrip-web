import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFRandomForests() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Suppose you are assembling a panel of experts to diagnose a complex case. If all experts have the same training background, they will make the same mistakes. But if each expert specializes in different aspects -- one focuses on symptoms, another on lab results, a third on patient history -- their collective judgment is far more reliable because.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For b = 1, 2, , B:    - Draw a bootstrap sample D^&#123;*&#125;_b of size n from the training data D. - Grow a decision tree T_b on D^&#123;*&#125;_b, but at each internal node:      - Select m features uniformly at random from the full set of p features. - Choose the best split among only those m features.' },
    { emoji: '🔍', label: 'In Detail', text: 'Random Forests, introduced by Leo Breiman in 2001, operationalize exactly this idea. They extend bagging by training each decision tree not only on a different bootstrap sample but also by restricting each split to a random subset of features.' },
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
