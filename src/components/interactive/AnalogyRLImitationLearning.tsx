import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLImitationLearning() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Teaching a child to tie their shoes, you demonstrate the motions and they copy you. You do not explain the reward function ("minimize time to secured shoe") -- you simply show them what to do. Imitation learning works the same way: given demonstrations of expert behavior, the agent learns a policy that reproduces that behavior.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Behavioral cloning (BC) treats imitation as supervised learning. Given a dataset of expert state-action pairs &#123;D&#125; = \\&#123;(s_i, a_i)\\&#125;_&#123;i=1&#125;^N collected from an expert policy ^*, BC trains a policy _ by minimizing:  [equation]  where  is a loss function -- mean squared error for continuous actions, cross-entropy for discrete actions.' },
    { emoji: '🔍', label: 'In Detail', text: 'This sounds like a straightforward supervised learning problem: map observations to actions. And in its simplest form -- behavioral cloning -- it is exactly that. But the transition from static prediction to sequential decision-making introduces a subtle compounding error problem that makes naive imitation catastrophically fragile.' },
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
