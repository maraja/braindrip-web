import { useState } from 'react';

const STEPS = [
    { title: '1. Bellman Expectation Equation for $V^\\pi$', desc: 'Starting from the definition of the state-value function and using the recursive structure of the return (G_t = R_&#123;t+1&#125; +  G_&#123;t+1&#125;):  [equation]  Expanding the expectation over actions and next states:  [equation]  This says: the value of state s under policy  equals the expected immediate reward.' },
    { title: '2. Bellman Expectation Equation for $Q^\\pi$', desc: 'Similarly, for the action-value function:  [equation]  This decomposes Q^ into the immediate reward plus the discounted Q-value of the next state-action pair, weighted by the policy at s\'.' },
    { title: '3. The Four Bellman Equations (Summary)', desc: '&lt;!-- Recommended visual: Backup diagrams showing V -&gt; Q -&gt; V and Q -&gt; V -&gt; Q relationships      Source: Sutton & Barto (2018), Figures 3.4 and 3.5 --&gt;' },
    { title: '4. Bellman Optimality Equations', desc: 'The Bellman optimality equation for V^* replaces the policy average with a maximization:  [equation]  For Q^*:  [equation]  The key difference: the expectation equations use  to weight actions, while the optimality equations use .' },
    { title: '5. Derivation Sketch', desc: 'Starting from V^(s) = &#123;E&#125;_[G_t  S_t = s]:  Substitute G_t = R_&#123;t+1&#125; +  G_&#123;t+1&#125; Apply the law of total expectation, conditioning on A_t and S_&#123;t+1&#125; Use the Markov property: &#123;E&#125;[G_&#123;t+1&#125;  S_&#123;t+1&#125; = s\'] = V^(s\') The result is the Bellman expectation equation  For the optimality equation, replace the.' },
    { title: '6. Matrix Form (Finite MDPs)', desc: 'For a finite MDP with n =  states, the Bellman expectation equation for V^ is a linear system:  [equation]  where v^  &#123;R&#125;^n, r^  &#123;R&#125;^n is the expected reward vector, and P^  &#123;R&#125;^&#123;n x n&#125; is the state transition matrix under .' },
];

export default function WalkthroughRLBellmanEquations() {
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
          Bellman Equations \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how bellman equations works, one stage at a time.
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
