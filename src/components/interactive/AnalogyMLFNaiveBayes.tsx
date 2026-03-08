import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFNaiveBayes() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a doctor diagnosing a patient. She considers each symptom -- fever, cough, headache -- and mentally updates her belief about the disease. She treats each symptom as independent evidence, even though fever and headache often co-occur.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Naive Bayes requires two things: Class priors P(y = c): estimated as the fraction of training examples in class c. Likelihoods P(x_j  y = c): estimated differently depending on the feature type, giving rise to different Naive Bayes variants.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a feature vector x = (x_1, x_2, , x_d) and a class label y, Bayes\' theorem states:' },
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
