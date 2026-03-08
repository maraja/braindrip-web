import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05Electra() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two approaches to learning vocabulary. In the first (BERT\'s approach), you are given sentences with some words blacked out and must guess the missing words. You only learn from the blanked positions — the remaining 85% of the sentence teaches you nothing directly.' },
    { emoji: '⚙️', label: 'How It Works', text: 'ELECTRA uses two models: a small generator and the main discriminator. The generator is a small masked language model (typically 1/4 to 1/3 the size of the discriminator). It receives the input with some tokens masked (using standard MLM masking at 15%) and predicts replacements for the masked positions.' },
    { emoji: '🔍', label: 'In Detail', text: 'This is ELECTRA\'s core insight: instead of predicting masked tokens (which wastes 85% of each training example), train the model to detect replaced tokens (which uses 100% of each training example). The result is a dramatically more sample-efficient pre-training approach.' },
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
