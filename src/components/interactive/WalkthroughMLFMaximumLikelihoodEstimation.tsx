import { useState } from 'react';

const STEPS = [
    { title: '1. The Likelihood Function', desc: 'The likelihood function &#123;L&#125;() is the joint probability of the observed data, viewed as a function of the parameters:  [equation]  The product arises from assuming the observations are independent and identically distributed (i.i.d.).' },
    { title: '2. The Log-Likelihood', desc: 'Products of many small probabilities cause numerical underflow. Taking the logarithm converts products to sums and is monotonic, so the maximizer is unchanged:  [equation]  The negative log-likelihood (NLL) -() is the quantity minimized in practice, turning maximum likelihood into a minimization.' },
    { title: '3. MLE for a Gaussian Distribution', desc: 'Given x_1, , x_n  &#123;N&#125;(, ^2), the log-likelihood is:  [equation]  Setting &#123; &#125;&#123; &#125; = 0:  [equation]  Setting &#123; &#125;&#123; ^2&#125; = 0:  [equation]  Note that &#123;&#125;^2_&#123;MLE&#125; divides by n, not n-1, making it a biased estimator (it systematically underestimates the true variance). This bias vanishes as n  .' },
    { title: '4. MLE for a Bernoulli Distribution', desc: 'Given x_1, , x_n  Bernoulli(p) where x_i  \\&#123;0, 1\\&#125;:  [equation]  Setting &#123; &#125;&#123; p&#125; = 0:  [equation]  This log-likelihood is precisely the negative binary cross-entropy loss. When you train a logistic regression model by minimizing binary cross-entropy, you are performing MLE under a Bernoulli model.' },
    { title: '5. Connection to Cross-Entropy Loss', desc: 'For a classification model with predicted probabilities q(yx):  [equation]  For one-hot encoded labels (p puts all mass on the true class), this becomes - q(y_&#123;true&#125;|x) -- exactly the negative log-likelihood. Minimizing cross-entropy loss is MLE.' },
    { title: '6. Regularity Conditions and Properties', desc: 'Under regularity conditions (the parameter space is open, the model is identifiable, the log-likelihood is sufficiently smooth), MLE has several attractive asymptotic properties:  Consistency: &#123;&#125;_&#123;MLE&#125; &#123;p&#125; _&#123;true&#125; as n  .' },
];

export default function WalkthroughMLFMaximumLikelihoodEstimation() {
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
          Maximum Likelihood Estimation \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how maximum likelihood estimation works, one stage at a time.
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
