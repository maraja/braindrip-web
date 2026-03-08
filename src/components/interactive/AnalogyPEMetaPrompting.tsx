import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEMetaPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you need to write a cover letter for a job application, but you are not a strong writer. Instead of struggling with the letter directly, you hire a writing coach. The coach does not write the letter for you -- they help you figure out what to say, how to structure it, and what tone to strike. Then you write the letter using their guidance.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Meta-prompting involves at least two LLM calls in sequence. The first call (the meta-layer) receives a high-level description of the task and generates a specific, optimized prompt for that task. The second call (the execution layer) receives the generated prompt along with the actual input and produces the final output.' },
    { emoji: '🔍', label: 'In Detail', text: 'Meta-prompting addresses a fundamental tension in prompt engineering: crafting effective prompts requires expertise, but the people who need LLM assistance often lack that expertise. By delegating prompt construction to the model itself, meta-prompting makes sophisticated prompt engineering accessible to non-experts.' },
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
