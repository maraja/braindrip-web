import { useState } from 'react';

const STEPS = [
    { title: '1. The Sigmoid Function', desc: 'The sigmoid (z) has several useful properties: Its output is always in (0, 1), suitable for probabilities. It is monotonically increasing: higher scores mean higher probability.' },
    { title: '2. Log-Odds Interpretation', desc: 'Logistic regression is linear in log-odds space. The log-odds (logit) of the positive class is:  [equation]  This means each feature x_j contributes additively to the log-odds.' },
    { title: '3. Decision Boundary', desc: 'The model predicts class 1 when P(y=1  x)  0.5, which occurs when w^T x + b  0. This defines a hyperplane in feature space.' },
    { title: '4. Cross-Entropy Loss Derivation', desc: 'Given training data \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^n with y_i  \\&#123;0,1\\&#125;, the likelihood of the data under the model is:  [equation]  where &#123;p&#125;_i = (w^T x_i + b). Taking the negative log-likelihood gives the binary cross-entropy loss:  [equation]  This loss is convex in w and b, guaranteeing that gradient.' },
    { title: '5. Gradient Descent for Logistic Regression', desc: 'The gradient of the cross-entropy loss with respect to the weights is:  [equation]  This has the same form as the gradient for linear regression with MSE loss, but with &#123;p&#125;_i replacing &#123;y&#125;_i.' },
    { title: '6. Regularized Logistic Regression', desc: 'To prevent overfitting, we add a penalty to the loss:  L2 regularization (Ridge): &#123;L&#125; + &#123;&#125;&#123;2&#125; \\_2^2 -- shrinks weights toward zero. L1 regularization (Lasso): &#123;L&#125; +  \\_1 -- encourages sparse weights, performing implicit feature selection.' },
];

export default function WalkthroughMLFLogisticRegression() {
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
          Logistic Regression \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how logistic regression works, one stage at a time.
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
