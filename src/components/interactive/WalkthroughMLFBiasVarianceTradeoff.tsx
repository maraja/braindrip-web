import { useState } from 'react';

const STEPS = [
    { title: '1. The Decomposition', desc: 'Consider a regression setting where we want to predict y = f(x) + , with  being noise with &#123;E&#125;[] = 0 and Var() = ^2. Let &#123;f&#125;(x) be the model trained on a particular training set &#123;D&#125;.' },
    { title: '2. Deriving the Decomposition', desc: 'Starting from the expected squared error and letting &#123;f&#125;(x) = &#123;E&#125;_&#123;&#123;D&#125;&#125;[&#123;f&#125;(x)]:  [equation]  [equation]  Since  is independent of &#123;f&#125; and has zero mean, the cross term vanishes:  [equation]  Now decompose the first term by adding and subtracting &#123;f&#125;:  [equation]  This yields Bias^2 + Variance,.' },
    { title: '3. Model Complexity and the Tradeoff', desc: 'As model complexity increases:  Bias decreases: More flexible models can approximate the true function more closely. Variance increases: More flexible models are more sensitive to the specific training data.' },
    { title: '4. Concrete Example: Polynomial Regression', desc: 'Fitting a polynomial of degree d to noisy data from a true cubic function:  d = 1 (linear): High bias (cannot capture curvature), low variance. The line is similar regardless of which training points you sample.' },
    { title: '5. The Bullseye Diagram', desc: 'Visualize four scenarios on a dart board:  Low bias, low variance: Darts clustered tightly around the center. Ideal but hard to achieve.' },
    { title: '6. Quantitative Example', desc: 'Suppose the true function is f(x) = (x) and we observe y = (x) +  with   &#123;N&#125;(0, 0.1). We fit models of varying complexity across 100 different training sets of size n = 30:  The cubic model achieves the lowest total error.' },
];

export default function WalkthroughMLFBiasVarianceTradeoff() {
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
          Bias-Variance Tradeoff \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how bias-variance tradeoff works, one stage at a time.
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
