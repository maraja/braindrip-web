import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLWhatIsReinforcementLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine teaching a dog a new trick. You don\'t show the dog a labeled dataset of "correct sit positions" (supervised learning), and you don\'t ask the dog to find hidden clusters in its behavior (unsupervised learning). Instead, you let the dog try things, and when it does something right, you give it a treat.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The interaction follows a discrete-time loop. At each timestep t:  The agent observes state S_t The agent selects action A_t according to its policy  The environment transitions to state S_&#123;t+1&#125; and emits reward R_&#123;t+1&#125; The agent updates its knowledge  This cycle generates a trajectory: S_0, A_0, R_1, S_1, A_1, R_2, S_2,   &lt;!' },
    { emoji: '🔍', label: 'In Detail', text: 'Reinforcement learning is the computational framework for learning from interaction. An agent takes actions in an environment, observes the resulting state and reward, and gradually discovers a strategy -- called a policy -- that maximizes the total reward accumulated over time.' },
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
