import { useState } from 'react';

const STEPS = [
    { title: '1. GP Regression', desc: 'Given training data \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^n with observation model y_i = f(x_i) +  where   &#123;N&#125;(0, _n^2), and test inputs X_*, the posterior predictive distribution is:  [equation]  with:  [equation]  [equation]  The posterior mean &#123;f&#125;_* is a weighted combination of observed outputs.' },
    { title: '2. Predictive Uncertainty', desc: 'At a test point x_*, the predictive distribution provides both a best estimate (the mean) and a calibrated uncertainty (the variance). This is invaluable for decision-making: a GP can say "I am confident here" vs "I have no idea here" -- something point-estimate models cannot do natively.' },
    { title: '3. Kernel Selection', desc: 'The kernel function encodes assumptions about the function being modeled -- its smoothness, periodicity, and length scale. Common choices include:  Radial Basis Function (RBF / Squared Exponential):  [equation]  Produces infinitely differentiable (very smooth) functions.' },
    { title: '4. GP Classification', desc: 'For classification, the likelihood is non-Gaussian (e.g., Bernoulli), so the posterior is no longer analytically tractable. Approximations such as the Laplace approximation or Expectation Propagation are used to obtain an approximate Gaussian posterior over the latent function, which is then passed.' },
    { title: '5. Computational Cost and Sparse Approximations', desc: 'The dominant cost in GP regression is inverting the n x n kernel matrix, requiring O(n^3) time and O(n^2) storage. This limits standard GPs to datasets of roughly n  10&#123;,&#125;000.' },
    { title: '6. Connection to Neural Networks', desc: 'Neal (1996) showed that a single-hidden-layer neural network with i.i.d. random weights converges to a GP as the width goes to infinity.' },
];

export default function WalkthroughMLFGaussianProcesses() {
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
          Gaussian Processes \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how gaussian processes works, one stage at a time.
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
