import { useState } from 'react';

const STEPS = [
    { title: '1. The Chain Rule for Compositions', desc: 'For a composite function L = L(f(g(x))), the chain rule gives:  [equation]  In a neural network with L layers, the loss depends on the parameters through a chain of compositions. Backpropagation evaluates this chain from right to left (output to input), accumulating products of local Jacobians.' },
    { title: '2. Forward Pass', desc: 'Given input x, the forward pass computes and caches all intermediate quantities:  [equation]  for l = 1, , L, followed by the loss &#123;L&#125; = Loss(h^&#123;(L)&#125;, y).' },
    { title: '3. Backward Pass', desc: 'Starting from &#123; &#123;L&#125;&#125;&#123; h^&#123;(L)&#125;&#125;, we propagate gradients backward. At each layer l:  [equation]  [equation]  [equation]  [equation]  The symbol  denotes elementwise multiplication.' },
    { title: '4. Worked Example: Two-Layer Network', desc: 'Consider a network with one hidden layer, ReLU activation, and mean squared error loss. Input x  &#123;R&#125;, hidden unit h = (0, w_1 x + b_1), output &#123;y&#125; = w_2 h + b_2, loss &#123;L&#125; = &#123;1&#125;&#123;2&#125;(&#123;y&#125; - y)^2.' },
    { title: '5. Computational Graphs and Automatic Differentiation', desc: 'Modern frameworks (PyTorch, JAX, TensorFlow) implement backpropagation through automatic differentiation (autodiff). Each operation records itself on a computational graph during the forward pass.' },
    { title: '6. Vanishing and Exploding Gradients', desc: 'When gradients propagate through many layers, they are repeatedly multiplied by weight matrices and activation derivatives. If these factors are consistently less than 1, gradients vanish (shrink exponentially).' },
];

export default function WalkthroughMLFBackpropagation() {
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
          Backpropagation \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how backpropagation works, one stage at a time.
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
