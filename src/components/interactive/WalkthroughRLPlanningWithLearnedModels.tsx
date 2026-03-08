import { useState } from 'react';

const STEPS = [
    { title: '1. Learning the Dynamics Model', desc: 'The dynamics model predicts next state and reward given current state and action:  [equation]  Training uses supervised learning on collected transitions (s_t, a_t, s_&#123;t+1&#125;, r_&#123;t+1&#125;):  [equation]  For stochastic environments, the model may predict a distribution: p_(s_&#123;t+1&#125;, r_&#123;t+1&#125; | s_t, a_t),.' },
    { title: '2. Model Predictive Control (MPC)', desc: 'At each time step, use the learned model to plan a short horizon ahead using shooting methods:  Sample N candidate action sequences of length H: \\&#123;a_0^&#123;(i)&#125;, , a_&#123;H-1&#125;^&#123;(i)&#125;\\&#125;_&#123;i=1&#125;^N Simulate each sequence through the learned model to predict returns Select the first action from the best.' },
    { title: '3. Cross-Entropy Method (CEM)', desc: 'CEM is the most popular action optimization method for MPC with learned models:  Initialize a distribution over action sequences: a_&#123;0:H-1&#125;  &#123;N&#125;(, ^2) Sample N candidate sequences Evaluate each via model rollouts, compute total predicted return Select the top-K sequences (the "elite" set) Refit .' },
    { title: '4. Model Ensembles for Uncertainty', desc: 'A single neural network model gives overconfident predictions. Ensembles of B independently trained models (typically B = 5-7) provide uncertainty estimation:  [equation]  The disagreement between ensemble members indicates epistemic uncertainty.' },
    { title: '5. Model-Based Policy Optimization (MBPO)', desc: '(2019) introduced a principled framework for combining learned models with model-free policy optimization:  Collect real data by interacting with the environment Train an ensemble dynamics model on real data Generate synthetic rollouts of length k from real states using the model Add synthetic data.' },
    { title: '6. The Compounding Error Problem', desc: 'Model errors compound exponentially over multi-step predictions:  [equation]  For a model with 1% single-step error, a 50-step rollout accumulates roughly 50% total error.' },
];

export default function WalkthroughRLPlanningWithLearnedModels() {
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
          Planning with Learned Models \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how planning with learned models works, one stage at a time.
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
