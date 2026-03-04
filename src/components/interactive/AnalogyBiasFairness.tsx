import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyBiasFairness() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🪞', label: 'Funhouse Mirror', text: 'Training data is a mirror of society — including its prejudices, stereotypes, and underrepresentation. The model reflects these patterns back, often amplifying them like a funhouse mirror. If resumes of men are labeled "hired" more often in training data, the model learns that bias. Fairness work aims to identify and correct these distortions so the model reflects reality more equitably.' },
    { emoji: '🍲', label: 'Recipe Ingredients', text: 'If your soup ingredients are imbalanced (too much salt, not enough herbs), the soup will be imbalanced. Training data is the ingredients, and bias is the imbalance. If certain demographics are underrepresented, stereotyped, or associated with negative contexts in the data, the model absorbs those associations. Fixing bias requires examining the ingredients (data), the recipe (training), and the taste (evaluation).' },
    { emoji: '📐', label: 'Crooked Foundation', text: 'Building on a crooked foundation means everything above is tilted. Training data with historical biases creates a crooked foundation — the model\'s outputs systematically disadvantage certain groups. Fairness interventions happen at every level: curating more balanced data, adjusting the training objective, post-processing outputs, and rigorously auditing for disparate impact across demographic groups.' },
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
