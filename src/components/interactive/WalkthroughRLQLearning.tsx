import { useState } from 'react';

const STEPS = [
    { title: '1. The Q-Learning Update Rule', desc: 'After taking action A_t in state S_t, observing reward R_&#123;t+1&#125; and next state S_&#123;t+1&#125;, Q-learning updates:  [equation]  The critical term is _a Q(S_&#123;t+1&#125;, a). Rather than using the Q-value of whatever action was actually selected next, Q-learning uses the Q-value of the best action.' },
    { title: '2. Relationship to Bellman Optimality', desc: 'The Q-learning update is a stochastic approximation to the Bellman optimality equation for action-values:  [equation]  Each observed transition (S_t, A_t, R_&#123;t+1&#125;, S_&#123;t+1&#125;) provides a single sample of this expectation, and the Q-learning update moves the estimate toward this sample.' },
    { title: '3. The Off-Policy Advantage', desc: 'Because Q-learning always targets the greedy policy, the behavior policy used for data collection is decoupled from the policy being learned. This means:  The agent can explore aggressively (e.g., with high ) without corrupting the learned Q-values.' },
    { title: '4. Convergence Conditions', desc: 'Q-learning converges to Q^* with probability 1 provided two conditions hold:  Sufficient exploration: All state-action pairs are visited infinitely often. Robbins-Monro step sizes: The learning rate schedule satisfies _t _t(s, a) =  and _t _t^2(s, a) &lt;  for all (s, a).' },
    { title: '5. The Cliff-Walking Example', desc: 'The cliff-walking gridworld is the canonical illustration of Q-learning\'s character. An agent must navigate from start to goal along a cliff edge.' },
    { title: '6. Maximization Bias', desc: 'Q-learning suffers from maximization bias: the  operator systematically overestimates Q-values when estimates are noisy. Consider a state where all true Q-values equal zero but estimates have random noise.' },
];

export default function WalkthroughRLQLearning() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive Walkthrough</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Q-Learning \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how q-learning works, one stage at a time.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= step ? '#C76B4A' : '#E5DFD3',
            border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#2C3E2D', margin: '0 0 0.4rem 0' }}>
          {current.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: 0 }}>
          {current.desc}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #E5DFD3',
          background: step === 0 ? '#F5F0E8' : '#FDFBF7', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontSize: '0.8rem', cursor: step === 0 ? 'default' : 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          &#8592; Previous
        </button>
        <span style={{ fontSize: '0.75rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>
          {step + 1} / {STEPS.length}
        </span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1} style={{
          padding: '0.4rem 1rem', borderRadius: '6px',
          border: `1px solid ${step === STEPS.length - 1 ? '#E5DFD3' : '#C76B4A'}`,
          background: step === STEPS.length - 1 ? '#F5F0E8' : 'rgba(199, 107, 74, 0.08)',
          color: step === STEPS.length - 1 ? '#B0A898' : '#C76B4A',
          fontSize: '0.8rem', fontWeight: 500, cursor: step === STEPS.length - 1 ? 'default' : 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          Next &#8594;
        </button>
      </div>
    </div>
  );
}
