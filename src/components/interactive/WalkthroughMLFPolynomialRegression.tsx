import { useState } from 'react';

const STEPS = [
    { title: '1. Polynomial Feature Expansion', desc: 'Given the original feature matrix X  &#123;R&#125;^&#123;n x p&#125;, we construct an expanded matrix  that includes all polynomial terms up to degree d. For a single feature, the mapping is:  [equation]  For multiple features x_1, x_2, a degree-2 expansion includes:  [equation]  The number of features in a full.' },
    { title: '2. Still Linear in Parameters', desc: 'A critical insight: despite modeling nonlinear relationships in the original features, polynomial regression is linear in parameters. The coefficient vector &#123;&#125; enters the model linearly, so the OLS closed-form solution applies directly:  [equation]  This means all the statistical machinery of.' },
    { title: '3. Interaction Terms', desc: 'Beyond pure powers, interaction terms capture how the effect of one predictor depends on another. For predictors x_1 and x_2:  [equation]  Here _3 represents the change in the slope of y with respect to x_1 per unit change in x_2.' },
    { title: '4. Overfitting with High-Degree Polynomials', desc: 'Polynomial regression vividly illustrates the bias-variance tradeoff:  Low degree (d = 1): High bias, the model cannot capture curvature. Moderate degree (d = 2 or 3): Often the sweet spot -- enough flexibility without excess variance.' },
    { title: '5. Choosing Polynomial Degree via Cross-Validation', desc: 'The degree d is a hyperparameter. The standard approach:  For each candidate d  \\&#123;1, 2, 3, , d_&#123;max&#125;\\&#125;, construct the polynomial features.' },
    { title: '6. Comparison with Other Nonlinear Approaches', desc: 'Polynomial regression is not the only way to model nonlinearity:  Splines (piecewise polynomials): Fit low-degree polynomials on local intervals joined at knots. They avoid the wild oscillations of high-degree global polynomials.' },
];

export default function WalkthroughMLFPolynomialRegression() {
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
          Polynomial Regression \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how polynomial regression works, one stage at a time.
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
