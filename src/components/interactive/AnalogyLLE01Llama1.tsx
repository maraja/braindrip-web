import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01Llama1() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two students preparing for an exam. One skims through a thousand textbooks in a weekend. The other carefully reads two hundred books, taking notes, re-reading difficult passages, and connecting ideas across chapters. The second student — slower to prepare but more thorough — scores higher on the test.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LLaMA uses a standard decoder-only Transformer architecture with several modern refinements. It employs pre-normalization using RMSNorm (from Zhang and Sennrich, 2019) applied before each sub-layer rather than after, improving training stability.' },
    { emoji: '🔍', label: 'In Detail', text: 'LLaMA (Large Language Model Meta AI) was released by Hugo Touvron and colleagues at Meta AI in February 2023. It was a direct response to the Chinchilla scaling laws published by DeepMind in 2022, which had shown that most large language models — including GPT-3 — were dramatically undertrained relative to their size.' },
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
