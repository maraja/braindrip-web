import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEZeroShotChainOfThought() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are in a job interview and the interviewer asks you a complex brainteaser. If they simply say "What\'s your answer?", you might blurt out something hasty. But if they say "Walk me through your reasoning," you naturally slow down, structure your thoughts, and work through the problem piece by piece.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Zero-shot-CoT typically operates in two stages. In the first stage, the original question is augmented with the trigger phrase "Let\'s think step by step" and the model generates a reasoning trace. In the second stage, the reasoning trace is concatenated with a follow-up prompt like "Therefore, the answer is:" to extract the final answer.' },
    { emoji: '🔍', label: 'In Detail', text: 'Introduced by Kojima et al. (2022), zero-shot-CoT was a surprising finding. The original chain-of-thought work by Wei et al. required carefully constructed few-shot examples with reasoning traces -- a labor-intensive process. Kojima et al. discovered that a single sentence could achieve a substantial fraction of that benefit.' },
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
