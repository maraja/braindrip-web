import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE06UlmfitAndTransferLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you\'re training a new doctor. You don\'t start from zero — first they learn general biology (pre-training), then they study the medical specialty they\'ll practice (domain adaptation), and finally they learn the specific procedures of their hospital (task-specific training).' },
    { emoji: '⚙️', label: 'How It Works', text: 'A 3-layer AWD-LSTM (ASGD Weight-Dropped LSTM, from Merity et al., 2017) was pre-trained on Wikitext-103 — approximately 28,595 Wikipedia articles totaling 103 million tokens. The model learned to predict the next word, developing general English language understanding. This base model was trained once and shared for all downstream tasks.' },
    { emoji: '🔍', label: 'In Detail', text: 'Computer vision had enjoyed transfer learning since 2012: pre-train a CNN on ImageNet, then fine-tune on your specific task. This recipe was so effective that it became the default approach for nearly every vision task. But NLP was stuck.' },
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
