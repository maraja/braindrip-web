import { useState } from 'react';

const STEPS = [
    { title: '1. The EM Framework', desc: 'Starting from an initial parameter estimate ^&#123;(0)&#125;, EM alternates:  E-step (Expectation): Compute the expected value of the complete-data log-likelihood with respect to the posterior distribution of latent variables given the current parameters:  [equation]  This requires computing p(Z  X, ^&#123;(t)&#125;),.' },
    { title: '2. Derivation via Jensen\'s Inequality and the ELBO', desc: 'For any distribution q(Z) over latent variables, Jensen\'s inequality gives:  [equation]  The right-hand side is the Evidence Lower Bound (ELBO):  [equation]  The gap between  p(X  ) and the ELBO is exactly KL(q(Z) \\| p(Z  X, )). The E-step sets q(Z) = p(Z  X, ^&#123;(t)&#125;), closing this gap to zero.' },
    { title: '3. Convergence Properties', desc: 'EM monotonically increases the incomplete-data log-likelihood and is guaranteed to converge to a local maximum (or saddle point) of (). It does not guarantee finding the global maximum.' },
    { title: '4. Canonical Example: Gaussian Mixture Models', desc: 'A Gaussian Mixture Model (GMM) models data as arising from K Gaussian components:  [equation]  where _k are mixing weights, and  = \\&#123;_k, _k, _k\\&#125;_&#123;k=1&#125;^K. The latent variable z_i  \\&#123;1, , K\\&#125; indicates which component generated observation x_i.' },
    { title: '5. K-Means as Hard EM', desc: 'K-means clustering can be viewed as a limiting case of EM for GMMs where responsibilities are "hard" (0 or 1) rather than soft. Each point is assigned to exactly one cluster (hard E-step), and cluster centroids are updated (M-step).' },
    { title: '6. Applications Beyond GMMs', desc: 'EM is used in a wide range of models with latent variables and tractable complete-data likelihoods:  Hidden Markov Models: The Baum-Welch algorithm is EM applied to HMMs. The E-step computes forward-backward probabilities; the M-step updates transition and emission parameters.' },
];

export default function WalkthroughMLFExpectationMaximization() {
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
          Expectation-Maximization \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how expectation-maximization works, one stage at a time.
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
