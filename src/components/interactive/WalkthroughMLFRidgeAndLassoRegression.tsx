import { useState } from 'react';

const STEPS = [
    { title: '1. Ridge Regression (L2 Penalty)', desc: 'Ridge regression minimizes the penalized objective:  [equation]  where   0 is the regularization parameter. The closed-form solution is:  [equation]  The addition of  I to X^TX ensures invertibility regardless of multicollinearity.' },
    { title: '2. Lasso Regression (L1 Penalty)', desc: 'The Lasso (Least Absolute Shrinkage and Selection Operator) replaces the _2 penalty with an _1 penalty:  [equation]  where \\. Unlike Ridge, the Lasso has no closed-form solution and requires iterative algorithms such as coordinate descent or ISTA (Iterative Shrinkage-Thresholding Algorithm).' },
    { title: '3. Geometric Interpretation', desc: 'The regularization objectives can be rewritten as constrained optimization problems:  Ridge: Minimize \\_2^2  t Lasso: Minimize \\_1  t  Geometrically, the OLS solution lies at the center of elliptical contours of the loss function.' },
    { title: '4. Elastic Net', desc: 'The Elastic Net combines both penalties:  [equation]  Or equivalently, with a mixing parameter   [0,1]:  [equation]  Elastic Net inherits Lasso\'s sparsity while resolving its tendency to arbitrarily select one variable from a group of highly correlated predictors.' },
    { title: '5. The Regularization Path', desc: 'As  varies from 0 to , the coefficients trace out a regularization path. For Ridge, each coefficient shrinks smoothly and monotonically toward zero.' },
    { title: '6. Coordinate Descent for Lasso', desc: 'The most widely used algorithm for Lasso is coordinate descent. It cycles through each coefficient _j and applies the soft-thresholding operator:  [equation]  where &#123;y&#125;_i^&#123;(-j)&#125; is the prediction excluding predictor j, and the soft-thresholding operator is:  [equation]  When   , the coefficient is.' },
];

export default function WalkthroughMLFRidgeAndLassoRegression() {
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
          Ridge and Lasso Regression \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how ridge and lasso regression works, one stage at a time.
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
