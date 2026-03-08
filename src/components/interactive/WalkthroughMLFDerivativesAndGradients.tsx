import { useState } from 'react';

const STEPS = [
    { title: '1. Partial Derivatives', desc: 'For f: &#123;R&#125;^n  &#123;R&#125;, the partial derivative with respect to x_i measures how f changes when only x_i varies:  [equation]' },
    { title: '2. The Gradient Vector', desc: 'The gradient collects all partial derivatives into a single vector:  [equation]  Two critical properties: (1)  f points in the direction of steepest ascent, and (2)  f is orthogonal to level sets of f (the contours where f is constant).' },
    { title: '3. Directional Derivatives', desc: 'The rate of change of f in an arbitrary direction u (unit vector) is:  [equation]  This is maximized when u is parallel to  f (confirming the steepest ascent interpretation) and zero when u is perpendicular to it.' },
    { title: '4. The Chain Rule', desc: 'The chain rule is the single most important calculus result for ML. If y = f(g(x)), then:  [equation]  In the multivariate case, if y = f(g(x)) where f: &#123;R&#125;^m  &#123;R&#125;^p and g: &#123;R&#125;^n  &#123;R&#125;^m:  [equation]  This is a product of Jacobian matrices.' },
    { title: '5. The Jacobian Matrix', desc: 'For a vector-valued function f: &#123;R&#125;^n  &#123;R&#125;^m, the Jacobian J  &#123;R&#125;^&#123;m x n&#125; collects all first-order partial derivatives:  [equation]  The Jacobian generalizes the gradient to functions with vector outputs.' },
    { title: '6. The Hessian Matrix', desc: 'For f: &#123;R&#125;^n  &#123;R&#125;, the Hessian H  &#123;R&#125;^&#123;n x n&#125; contains all second-order partial derivatives:  [equation]  The Hessian encodes the curvature of f. If H is positive definite at a critical point, that point is a local minimum.' },
];

export default function WalkthroughMLFDerivativesAndGradients() {
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
          Derivatives and Gradients \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how derivatives and gradients works, one stage at a time.
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
