import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03AlignmentMethodEvolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'A raw pre-trained language model is like a brilliant but uncooperative expert — it has vast knowledge but will ramble, refuse to answer, or produce harmful content unpredictably. Alignment is the process of teaching the model to behave as a helpful, honest, and harmless assistant.' },
    { emoji: '⚙️', label: 'How It Works', text: 'InstructGPT (Ouyang et al., January 2022) established the RLHF paradigm in three stages. Stage 1: Supervised Fine-Tuning (SFT) on human-written demonstrations of ideal assistant behavior. Human contractors wrote example responses to prompts, showing the model what a good assistant looks like.' },
    { emoji: '🔍', label: 'In Detail', text: 'The story of alignment methods is a story of simplification: from a three-stage pipeline requiring teams of human annotators, to elegant mathematical reformulations that need only a list of preferred responses, to fully automated systems where correctness itself is the reward signal.' },
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
