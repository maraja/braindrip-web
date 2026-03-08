import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyRLActorCriticMethods() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a figure skater and her coach. The skater (the actor) performs routines and makes real-time decisions about jumps, spins, and footwork. The coach (the critic) watches each move and provides immediate feedback: "that triple axel was above your average -- do more of that" or "that spin was below your usual standard -- adjust your technique.' },
    { emoji: '⚙️', label: 'How It Works', text: 'REINFORCE uses the full Monte Carlo return G_t to weight the policy gradient. Actor-critic replaces this with a bootstrapped target based on the TD error:  [equation]  The TD error _t is an unbiased estimate of the advantage A(s_t, a_t) when V_ = V^ (the true value function). The policy gradient becomes:  [equation]' },
    { emoji: '🔍', label: 'In Detail', text: 'In RL terms, the actor is a parameterized policy _(a|s) that selects actions. The critic is a learned value function V_(s) (or Q_(s,a)) that evaluates how good the current situation is. The critic\'s feedback replaces the noisy Monte Carlo returns used in REINFORCE with lower-variance, bootstrapped estimates.' },
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
