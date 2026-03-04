import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyCircuitBreakers() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '⚡', label: 'Electrical Circuit Breaker', text: 'When a power surge threatens to fry your appliances, a circuit breaker trips and cuts the power. AI circuit breakers do the same: they detect when a model\'s internal representations are heading toward harmful territory and interrupt the generation. Instead of relying on the model to refuse (which can be jailbroken), they short-circuit the harmful pathway at the representation level.' },
    { emoji: '🚨', label: 'Emergency Stop Button', text: 'Industrial machines have big red emergency stop buttons that cut power regardless of what the machine is doing. Circuit breakers for LLMs work as a hard safety mechanism: they monitor the model\'s internal activations and, when patterns associated with harmful outputs are detected, force the model into a safe refusal state. This is more robust than training-based refusals because it operates at a deeper level.' },
    { emoji: '🧠', label: 'Neural Fuse', text: 'A fuse melts to break a dangerous circuit. Circuit breakers in AI train the model so that internal representations associated with harmful content are "remapped" to refusal representations. By modifying the model\'s internal geometry rather than just its output behavior, this approach resists adversarial attacks — even if an attacker finds a prompt that bypasses surface-level safety training, the circuit breaker catches it at the representation level.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
