import { useState } from 'react';

const STEPS = [
    { title: '1. The Naive Inception Module', desc: 'The basic idea applies multiple filter sizes in parallel:  The problem: if the input has 256 channels and each branch outputs 256 channels, concatenation yields 4 x 256 = 1024 channels. The 5 x 5 convolution alone on 256 input channels producing 256 output channels requires 5^2 x 256 x 256  1.' },
    { title: '2. The Inception Module with Dimensionality Reduction', desc: 'The solution is inserting 1 x 1 convolutions before the expensive 3 x 3 and 5 x 5 branches to reduce channel depth:  The 1 x 1 convolutions (called "bottleneck" layers) reduce the channel dimension before the expensive spatial convolutions.' },
    { title: '3. GoogLeNet Architecture', desc: 'GoogLeNet stacks 9 Inception modules in sequence:  Input: 224 x 224 x 3 Stem: Two conv layers + max pool (conventional layers to reduce resolution early). Inception 3a--3b: Two modules at 28 x 28 resolution.' },
    { title: '4. Auxiliary Classifiers', desc: 'GoogLeNet added two auxiliary classification heads branching off intermediate layers (at Inception 4a and 4d). These compute a loss weighted at 0.3 and add it to the final loss, combating vanishing gradients in the early layers.' },
    { title: '5. Inception v2 and v3', desc: 'refined the architecture through several principles:  Factorized convolutions: Replace 5 x 5 convolutions with two stacked 3 x 3 convolutions (same receptive field, 28% fewer parameters). Asymmetric factorization: Replace n x n convolutions with 1 x n followed by n x 1 convolutions.' },
    { title: '6. Inception v4 and Inception-ResNet', desc: 'Inception v4 combined Inception modules with residual connections. Inception-ResNet-v2 achieved 3.1% top-5 error, showing that Inception and residual learning are complementary.' },
];

export default function WalkthroughCVCInception() {
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
          Inception (GoogLeNet) \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how inception (googlenet) works, one stage at a time.
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
