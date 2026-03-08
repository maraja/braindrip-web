import { useState } from 'react';

const STEPS = [
    { title: '1. State-Value Function $V^\\pi(s)$', desc: 'The state-value function under policy  gives the expected return starting from state s and following  thereafter:  [equation]  This answers: "How good is it to be in state s if I follow policy ?"' },
    { title: '2. Action-Value Function $Q^\\pi(s, a)$', desc: 'The action-value function (or Q-function) under policy  gives the expected return starting from state s, taking action a, and following  thereafter:  [equation]  This answers: "How good is it to take action a in state s and then follow policy ?"  &lt;!' },
    { title: '3. Relationship Between V and Q', desc: 'The two value functions are intimately connected:  [equation]  The state-value is the policy-weighted average of the action-values. Conversely:  [equation]  The action-value equals the immediate reward plus the discounted value of the next state, averaged over transition uncertainty.' },
    { title: '4. The Advantage Function', desc: 'The advantage function measures how much better action a is compared to the average action under :  [equation]  Key properties: _a (a  s) A^(s, a) = 0 (the advantage is zero on average). A^(s, a) &gt; 0 means action a is better than the policy\'s average.' },
    { title: '5. Optimal Value Functions', desc: 'The optimal state-value function V^*(s) is the maximum value achievable from state s under any policy:  [equation]  The optimal action-value function Q^*(s, a) is the maximum expected return achievable starting from (s, a):  [equation]  Once Q^* is known, the optimal policy is immediately.' },
    { title: '6. Computing Value Functions', desc: 'For small state spaces, V and Q are stored as tables (arrays). V requires [equation]V^(s)  &#123;1&#125;&#123;N(s)&#125; _&#123;i=1&#125;^&#123;N(s)&#125; G_t^&#123;(i)&#125;[equation]V(S_t)  V(S_t) +  [ R_&#123;t+1&#125; +  V(S_&#123;t+1&#125;) - V(S_t) ]$  The term _t = R_&#123;t+1&#125; +  V(S_&#123;t+1&#125;) - V(S_t)$ is called the TD error.' },
];

export default function WalkthroughRLValueFunctions() {
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
          Value Functions \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how value functions works, one stage at a time.
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
