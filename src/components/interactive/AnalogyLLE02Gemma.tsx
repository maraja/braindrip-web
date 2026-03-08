import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02Gemma() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of Gemini as Google\'s luxury flagship sedan -- powerful, packed with features, but only available through Google\'s showroom. Gemma is Google taking the same engineering blueprints and building a series of compact, efficient vehicles that anyone can own, modify, and drive wherever they want.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The initial release included two sizes: 2B and 7B parameters. These were dense Transformer models (no Mixture of Experts) trained on 2 trillion tokens for Gemma-2B and 6 trillion tokens for Gemma-7B.' },
    { emoji: '🔍', label: 'In Detail', text: 'Before Gemma, Google\'s position in the open-weight landscape was conspicuously absent. Meta had LLaMA, Microsoft had Phi, Mistral had its eponymous models, but Google -- the company that invented the Transformer architecture -- had kept its model weights locked behind API walls. This was increasingly untenable.' },
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
