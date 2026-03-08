import { useState } from 'react';

const STEPS = [
    { title: '1. C3D: The Pioneer', desc: 'C3D (Tran et al., 2015) was the first successful deep 3D CNN for video. Key design choices:  All convolution kernels: 3 x 3 x 3 (found optimal over k_t  \\&#123;1, 3, 5, 7\\&#125;) Architecture: 8 convolutional layers, 5 max-pooling layers, 2 fully connected layers Input: 16-frame clips at 112 x 112 Trained on.' },
    { title: '2. I3D: Inflating 2D into 3D', desc: 'Inflated 3D ConvNets (I3D) by Carreira and Zisserman (2017) addressed C3D\'s limitations by "inflating" proven 2D architectures. The key insight: a 2D kernel of size k x k pretrained on ImageNet can be expanded to k x k x k by repeating the weights along the temporal dimension and dividing by.' },
    { title: '3. R(2+1)D: Factorized 3D Convolutions', desc: '(2018) showed that a 3 x 3 x 3 3D convolution can be factorized into a spatial 1 x 3 x 3 convolution followed by a temporal 3 x 1 x 1 convolution. Benefits:  Doubles the number of nonlinearities (ReLU between the two operations) Reduces parameters while maintaining the receptive field Easier to.' },
    { title: '4. SlowFast Networks', desc: 'Feichtenhofer et al. (2019) proposed processing video at two temporal resolutions simultaneously:  Slow pathway: Operates at low frame rate (T=4 or 8 frames, stride =16).' },
    { title: '5. Computational Considerations', desc: 'A single 3D convolution layer with C_&#123;in&#125; input channels, C_&#123;out&#125; output channels, and kernel k_t x k_h x k_w has:  [equation]  The FLOPs scale as:  [equation]  For a 3 x 3 x 3 kernel, this is 3x the cost of a 3 x 3 2D convolution -- and that multiplier compounds across all layers.' },
];

export default function WalkthroughCVC3dConvolutions() {
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
          3D Convolutions \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how 3d convolutions works, one stage at a time.
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
