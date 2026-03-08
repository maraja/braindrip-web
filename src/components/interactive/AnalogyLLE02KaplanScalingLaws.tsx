import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02KaplanScalingLaws() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are a civil engineer in the 1800s, and someone hands you a set of equations that precisely predict how tall a building can be based on the strength of your steel, the depth of your foundation, and your budget. Before these equations, architecture was part science, part guesswork. After them, you could plan with confidence.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The paper identified three key scaling relationships, each following the form L(x) = (x_0 / x)^alpha, where L is the cross-entropy loss and x is the scaling variable:  Model size (N): Loss scales as a power law with the number of non-embedding parameters. The exponent alpha_N was approximately 0.' },
    { emoji: '🔍', label: 'In Detail', text: 'Published in January 2020 by Jared Kaplan and colleagues at OpenAI, the paper "Scaling Laws for Neural Language Models" was one of the most consequential empirical studies in the history of deep learning. The team systematically trained hundreds of language models, varying size from 768 parameters to over 1.' },
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
