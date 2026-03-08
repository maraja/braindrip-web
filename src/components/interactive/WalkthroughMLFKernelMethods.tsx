import { useState } from 'react';

const STEPS = [
    { title: '1. Feature Mapping Example', desc: 'Consider input x = (x_1, x_2)  &#123;R&#125;^2 and the polynomial mapping:  [equation]  The inner product in feature space is:  [equation]  So K(x, x\') = (x^T x\')^2 computes the inner product in the 3D feature space using only operations in the original 2D space.' },
    { title: '2. Common Kernel Functions', desc: 'Linear Kernel: [equation] No mapping at all -- this recovers the standard linear model. Useful as a baseline and when the data is already high-dimensional (e.g., text with TF-IDF).' },
    { title: '3. Mercer\'s Theorem', desc: 'Not every function of two arguments is a valid kernel. Mercer\'s theorem states that K(x, x\') is a valid kernel if and only if the kernel matrix (Gram matrix) K_&#123;ij&#125; = K(x_i, x_j) is positive semi-definite for any set of input points.' },
    { title: '4. Kernel SVM', desc: 'The SVM dual formulation depends on data only through inner products:  [equation]  Replacing x_i^T x_j with K(x_i, x_j) is all that is needed to "kernelize" the SVM.' },
    { title: '5. Kernel Ridge Regression', desc: 'Ridge regression with a kernel replaces the linear solution w = (X^T X +  I)^&#123;-1&#125; X^T y with:  [equation]  where K is the n x n kernel matrix. Predictions for a new point x^* are:  [equation]  This is known as kernel ridge regression and generalizes linear ridge regression to arbitrary nonlinear.' },
    { title: '6. Computational Cost', desc: 'The central limitation of kernel methods is computational: Kernel matrix: Computing and storing the n x n Gram matrix requires O(n^2) space and O(n^2 d) time. Training: Solving kernel SVM or kernel ridge regression costs O(n^3) (matrix inversion or QP solving).' },
];

export default function WalkthroughMLFKernelMethods() {
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
          Kernel Methods \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how kernel methods works, one stage at a time.
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
