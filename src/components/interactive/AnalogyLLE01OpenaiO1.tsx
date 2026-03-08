import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01OpenaiO1() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a student who has been taught not just facts, but how to think through problems step by step before writing down an answer. Previous language models were like students who blurted out the first thing that came to mind.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Unlike previous models fine-tuned with RLHF on human preferences for helpfulness and harmlessness, o1 was trained with reinforcement learning specifically to produce effective reasoning chains. The model learns a "reasoning policy" that determines how to break down problems, verify intermediate steps, try alternative approaches, and catch errors.' },
    { emoji: '🔍', label: 'In Detail', text: 'The motivation was clear. GPT-4 was remarkably capable but still struggled with multi-step reasoning, complex math, and scientific problems that required sustained logical chains. Chain-of-thought prompting helped, but it was a hack layered on top of a model that had not been trained to reason.' },
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
