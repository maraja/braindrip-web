import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEInContextLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine showing someone how to fill out a tax form by giving them a completed example. You do not teach them tax law. You do not explain the reasoning behind each field. You simply hand them a filled-out form and a blank one, and they figure out the pattern: this field gets the address, this field gets the income, this field gets the calculation.' },
    { emoji: '⚙️', label: 'How It Works', text: 'GPT-3\'s paper demonstrated that a 175B-parameter language model could perform tasks with zero, one, or a few examples provided in the prompt. The key experimental setup: provide the model with examples formatted as "Input: X → Output: Y" and then a new "Input: Z → Output:" and let the model complete.' },
    { emoji: '🔍', label: 'In Detail', text: 'In-context learning is the ability of large language models to perform new tasks by conditioning on input-output examples provided in the prompt, with zero changes to the model\'s parameters. Discovered at scale by Brown et al.' },
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
