import { useState } from 'react';

const STEPS = [
    { title: '1. The Evidence Lower Bound (ELBO)', desc: 'Direct minimization of KL(q \\| p(  D)) is impossible because it requires evaluating p(  D), which is exactly what we cannot compute. However, we can decompose the log-evidence:  [equation]  where the ELBO is:  [equation]  Since  p(D) is a constant with respect to q, minimizing the KL divergence is.' },
    { title: '2. The Direction of KL Divergence', desc: 'VI minimizes KL(q \\ q) (the "forward KL" or "inclusive KL"). This choice has important consequences:  Reverse KL (KL(q \\| p)): The approximation q tends to be mode-seeking.' },
    { title: '3. Mean-Field Approximation', desc: 'The most common variational family is the mean-field family, where the approximate posterior fully factorizes over parameters:  [equation]  Each factor q_j is optimized independently.' },
    { title: '4. Coordinate Ascent Variational Inference (CAVI)', desc: 'Under the mean-field assumption, the optimal update for each factor q_j is:  [equation]  where &#123;E&#125;_&#123;q_&#123;-j&#125;&#125; denotes the expectation with respect to all factors except q_j. CAVI iterates through the factors, updating each in turn while holding the others fixed.' },
    { title: '5. Stochastic Variational Inference (SVI)', desc: 'CAVI requires processing the entire dataset at each iteration, which is impractical for large-scale data. Stochastic Variational Inference (Hoffman et al., 2013) uses stochastic optimization: at each step, subsample a minibatch of data, compute a noisy gradient of the ELBO, and take a gradient step.' },
    { title: '6. The Reparameterization Trick', desc: 'For continuous latent variables with differentiable densities, the reparameterization trick enables low-variance gradient estimates. Instead of sampling   q_() directly, we write:  [equation]  where g is a differentiable function and p() is a fixed, simple distribution (e.g., &#123;N&#125;(0, I)).' },
];

export default function WalkthroughMLFVariationalInference() {
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
          Variational Inference \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how variational inference works, one stage at a time.
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
