import { useState } from 'react';

const STEPS = [
    { title: '1. The Forward View: $\\lambda$-Return', desc: 'The -return is a weighted average of all n-step returns:  [equation]  where G_t^&#123;(n)&#125; = R_&#123;t+1&#125; +  R_&#123;t+2&#125; +  + ^&#123;n-1&#125; R_&#123;t+n&#125; + ^n V(S_&#123;t+n&#125;) is the n-step return. The geometric weighting (1 - )^&#123;n-1&#125; sums to 1, creating a valid average.' },
    { title: '2. The Backward View: Eligibility Traces', desc: 'Computing the -return in the forward view requires waiting until the end of the episode. The backward view achieves the same result incrementally using eligibility traces.' },
    { title: '3. TD($\\lambda$) Algorithm', desc: 'At each time step:  Observe transition (S_t, A_t, R_&#123;t+1&#125;, S_&#123;t+1&#125;) Compute TD error: _t = R_&#123;t+1&#125; +  V(S_&#123;t+1&#125;) - V(S_t) Update trace: e_t(s) for all states Update all state values: V(s)  V(s) +  \\, _t \\, e_t(s) for all s  The key insight: the same TD error _t is used to update every state, but.' },
    { title: '4. SARSA($\\lambda$) and Q($\\lambda$)', desc: 'Eligibility traces extend naturally to control:  SARSA(): Maintain traces over state-action pairs (s, a):  [equation]  [equation]  Watkins\'s Q(): Combines Q-learning with traces, but cuts the trace to zero whenever a non-greedy action is taken (because Q-learning is off-policy, and the trace should.' },
    { title: '5. The Equivalence', desc: 'Sutton & Barto (2018) prove that the forward view (-return) and backward view (eligibility traces) produce identical total updates over an episode (for the offline/batch case). The backward view is computationally preferable because it updates incrementally at each step.' },
];

export default function WalkthroughRLEligibilityTraces() {
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
          Eligibility Traces \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how eligibility traces works, one stage at a time.
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
