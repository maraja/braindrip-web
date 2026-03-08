import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLRlvr() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two ways to train a student for a math exam. In the first approach (RLHF), you hire tutors to read the student\'s work and give subjective assessments: "This looks like good reasoning," or "I think this answer is probably right." In the second approach (RLVR), you have an answer key.' },
    { emoji: '⚙️', label: 'How It Works', text: 'RLVR defines domain-specific reward functions r(x, y) that return binary or graded scores based on objective verification:  Mathematical reasoning:  [equation]  The answer is extracted from the model\'s response (typically the content after "The answer is" or within a boxed expression) and compared to the known correct answer.' },
    { emoji: '🔍', label: 'In Detail', text: 'RLVR -- Reinforcement Learning with Verifiable Rewards -- uses the second approach. Instead of training a reward model to approximate human preferences, RLVR defines reward functions that can be verified programmatically: checking if a math answer equals the correct value, executing code against test cases, or validating logical proofs.' },
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
