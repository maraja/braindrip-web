import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const ACTIONS = [
  { label: 'Detailed, accurate answer', initial: 0.25, reward: 0.9 },
  { label: 'Brief but correct answer', initial: 0.30, reward: 0.5 },
  { label: 'Verbose, partially wrong', initial: 0.25, reward: -0.3 },
  { label: 'Refuses to answer', initial: 0.20, reward: -0.8 },
];

const CLIP_EPSILON = 0.2;

export default function PolicyGradientViz() {
  const [step, setStep] = useState(0);
  const [clipEnabled, setClipEnabled] = useState(true);

  const baseline = ACTIONS.reduce((s, a) => s + a.initial * a.reward, 0);
  const advantages = ACTIONS.map(a => a.reward - baseline);

  const computePolicy = (steps: number, clip: boolean) => {
    let probs = ACTIONS.map(a => a.initial);
    for (let s = 0; s < steps; s++) {
      const lr = 0.35;
      let rawProbs = probs.map((p, i) => {
        let ratio = 1 + lr * advantages[i];
        if (clip) {
          ratio = Math.max(1 - CLIP_EPSILON, Math.min(1 + CLIP_EPSILON, ratio));
        }
        return p * ratio;
      });
      const total = rawProbs.reduce((s, v) => s + v, 0);
      probs = rawProbs.map(p => p / total);
    }
    return probs;
  };

  const policy = computePolicy(step, clipEnabled);
  const unclippedPolicy = computePolicy(step, false);

  const maxProb = Math.max(...policy, ...unclippedPolicy);
  const barScale = 85 / Math.max(maxProb, 0.01);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          PPO Policy Gradient Update
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Watch how PPO shifts the policy toward high-reward actions and clips large updates.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', color: '#5A6B5C', marginBottom: '0.3rem' }}>
            Training Step: <strong style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A' }}>{step}</strong>
          </div>
          <input type="range" min={0} max={8} value={step} onChange={e => setStep(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#C76B4A', cursor: 'pointer' }} />
        </div>
        <button onClick={() => setClipEnabled(!clipEnabled)} style={{
          padding: '0.35rem 0.7rem', borderRadius: '6px',
          border: `1px solid ${clipEnabled ? '#D4A843' : '#E5DFD3'}`,
          background: clipEnabled ? 'rgba(212, 168, 67, 0.08)' : 'transparent',
          color: clipEnabled ? '#D4A843' : '#7A8B7C',
          fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          Clip: {clipEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
        {ACTIONS.map((action, i) => {
          const clipped = clipEnabled && step > 0 && Math.abs(policy[i] - unclippedPolicy[i]) > 0.005;
          return (
            <div key={action.label} style={{ marginBottom: i < ACTIONS.length - 1 ? '0.85rem' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#2C3E2D', fontWeight: 500 }}>{action.label}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.6rem', color: action.reward > 0 ? '#8BA888' : '#C76B4A', fontFamily: "'JetBrains Mono', monospace" }}>
                    r={action.reward > 0 ? '+' : ''}{action.reward.toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: advantages[i] > 0 ? '#8BA888' : '#C76B4A', fontFamily: "'JetBrains Mono', monospace" }}>
                    A={advantages[i] > 0 ? '+' : ''}{advantages[i].toFixed(2)}
                  </span>
                </div>
              </div>
              <div style={{ position: 'relative', height: '18px', background: '#E5DFD3', borderRadius: '4px', overflow: 'hidden' }}>
                {!clipEnabled && step > 0 && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: `${unclippedPolicy[i] * barScale}%`, height: '100%',
                    background: 'rgba(199, 107, 74, 0.15)', borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }} />
                )}
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: `${policy[i] * barScale}%`, height: '100%',
                  background: advantages[i] >= 0 ? '#8BA888' : '#C76B4A',
                  borderRadius: '4px', transition: 'width 0.4s ease',
                  opacity: 0.8,
                }} />
                {step === 0 && (
                  <div style={{
                    position: 'absolute', top: 0,
                    left: `${action.initial * barScale}%`,
                    width: '2px', height: '100%', background: '#7A8B7C',
                  }} />
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.15rem' }}>
                <span style={{ fontSize: '0.62rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>
                  {(policy[i] * 100).toFixed(1)}%
                  {step > 0 && (() => {
                    const diff = policy[i] - action.initial;
                    return diff !== 0 ? ` (${diff > 0 ? '+' : ''}${(diff * 100).toFixed(1)})` : '';
                  })()}
                </span>
                {clipped && (
                  <span style={{ fontSize: '0.58rem', color: '#D4A843', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>CLIPPED</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600 }}>Clip Range</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4A843', fontFamily: "'JetBrains Mono', monospace" }}>
            [{(1 - CLIP_EPSILON).toFixed(1)}, {(1 + CLIP_EPSILON).toFixed(1)}]
          </div>
        </div>
        <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 600 }}>Expected Reward</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8BA888', fontFamily: "'JetBrains Mono', monospace" }}>
            {policy.reduce((s, p, i) => s + p * ACTIONS[i].reward, 0).toFixed(3)}
          </div>
        </div>
      </div>

      {step > 3 && !clipEnabled && (
        <div style={{ marginTop: '0.75rem', background: 'rgba(199, 107, 74, 0.06)', border: '1px solid #C76B4A', borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#C76B4A', fontWeight: 600 }}>
            Without clipping, the policy collapses toward a single action. PPO's clip prevents this catastrophic update.
          </div>
        </div>
      )}
    </div>
  );
}
