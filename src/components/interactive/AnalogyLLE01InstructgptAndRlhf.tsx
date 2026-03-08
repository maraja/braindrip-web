import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01InstructgptAndRlhf() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you have a brilliant but socially unaware colleague who has memorized every book in the library. Ask them a question, and they might recite a relevant passage, start a tangentially related monologue, or respond in a language you did not request. They know everything but cannot figure out what you actually want.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The process began with human labelers (a team of approximately 40 contractors) writing demonstrations of desired model behavior. Given prompts submitted to the OpenAI API, labelers wrote ideal responses — helpful, honest, and harmless completions. The base GPT-3 model was then fine-tuned on these demonstrations using standard supervised learning.' },
    { emoji: '🔍', label: 'In Detail', text: 'Published in March 2022 by Long Ouyang and over 30 co-authors at OpenAI, "Training language models to follow instructions with human feedback" was one of the most consequential papers in the history of AI.' },
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
