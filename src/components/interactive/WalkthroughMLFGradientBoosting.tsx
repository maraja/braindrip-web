import { useState } from 'react';

const STEPS = [
    { title: '1. The Gradient Boosting Framework', desc: 'We seek a function F(x) that minimizes a loss L(y, F(x)) over the training data. Gradient Boosting builds F as an additive expansion:  [equation]  where F_0(x) is an initial estimate (e.g.' },
    { title: '2. Algorithm: Gradient Boosting Machine', desc: 'Initialize: F_0(x) = _ _&#123;i=1&#125;^n L(y_i, )  For t = 1, 2, , T:  Compute pseudo-residuals (negative gradients):  [equation]  Fit a base learner h_t(x) to the pseudo-residuals \\&#123;(x_i, r_&#123;it&#125;)\\&#125;_&#123;i=1&#125;^n.' },
    { title: '3. Gradient Descent in Function Space', desc: 'The key insight -- Friedman\'s central contribution -- is interpreting this procedure as gradient descent in function space. In ordinary gradient descent, we update parameters:    -  _ L.' },
    { title: '4. Loss Functions and Their Pseudo-Residuals', desc: 'Different loss functions yield different pseudo-residuals:  For squared error, the pseudo-residuals are literally the residuals, which gives the intuitive "fit trees to residuals" description. For other losses, the pseudo-residuals point in the direction of steepest descent for each observation.' },
    { title: '5. Key Hyperparameters', desc: 'Learning rate (shrinkage) : Controls the contribution of each tree. Smaller values (0.01--0.1) require more trees but produce better generalization through regularization.' },
    { title: '6. Stochastic Gradient Boosting', desc: 'Friedman (2002) proposed training each tree on a random subsample of the training data (without replacement), typically 50--80%. This introduces randomness analogous to stochastic gradient descent:  Reduces computation per iteration Acts as regularization, reducing overfitting Often improves.' },
];

export default function WalkthroughMLFGradientBoosting() {
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
          Gradient Boosting \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how gradient boosting works, one stage at a time.
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
