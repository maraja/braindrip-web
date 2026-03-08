import { useState } from 'react';

const STEPS = [
    { title: '1. Markov Chains and Stationary Distributions', desc: 'A Markov chain is a sequence of random variables ^&#123;(0)&#125;, ^&#123;(1)&#125;,  where the distribution of ^&#123;(t+1)&#125; depends only on ^&#123;(t)&#125;, not on earlier states. A chain has a stationary distribution () if, once the chain\'s state is distributed as , all subsequent states remain distributed as .' },
    { title: '2. The Metropolis-Hastings Algorithm', desc: 'Metropolis-Hastings (MH) is the foundational MCMC algorithm. Given current state ^&#123;(t)&#125;:  Propose a candidate \' from a proposal distribution q(\'  ^&#123;(t)&#125;).' },
    { title: '3. Gibbs Sampling', desc: 'Gibbs sampling is a special case of MH where each variable is sampled from its full conditional distribution while holding all other variables fixed:  [equation]  Every proposal is accepted ( = 1).' },
    { title: '4. Burn-In and Thinning', desc: 'Burn-in: The initial samples before the chain has converged to the stationary distribution are discarded. These early samples are influenced by the arbitrary initialization and do not represent the target posterior.' },
    { title: '5. Convergence Diagnostics', desc: 'Since we never know for certain whether a chain has converged, several diagnostics help assess convergence:  Trace plots: Visual inspection of parameter values over iterations. A converged chain should look like a "fuzzy caterpillar" with no trends or drifts.' },
    { title: '6. Hamiltonian Monte Carlo (HMC)', desc: 'HMC exploits gradient information to make large, informed moves through parameter space. It treats the negative log-posterior as a "potential energy" and introduces auxiliary "momentum" variables r:  [equation]  The algorithm simulates Hamiltonian dynamics using leapfrog integration for L steps.' },
];

export default function WalkthroughMLFMarkovChainMonteCarlo() {
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
          Markov Chain Monte Carlo \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how markov chain monte carlo works, one stage at a time.
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
