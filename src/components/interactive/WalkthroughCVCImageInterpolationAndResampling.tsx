import { useState } from 'react';

const STEPS = [
    { title: '1. Nearest-Neighbor Interpolation', desc: 'The simplest method: assign the value of the closest integer-coordinate pixel. [equation]  Kernel: A box function of width 1 centered at the origin.' },
    { title: '2. Bilinear Interpolation', desc: 'Performs linear interpolation in two directions. For a query point (x, y) surrounded by four neighbors at integer coordinates:  [equation]  where  = x - x_0,  = y - y_0, (x_0, y_0) is the top-left neighbor, and (x_1, y_1) = (x_0 + 1, y_0 + 1).' },
    { title: '3. Bicubic Interpolation', desc: 'Fits a cubic polynomial through 16 surrounding neighbors (4x4 grid). The standard cubic convolution kernel (Keys, 1981):  [equation]  where a = -0.5 (the Catmull-Rom spline, which matches the ideal sinc function through the sample points) or a = -0.' },
    { title: '4. Lanczos Interpolation', desc: 'Uses a windowed sinc kernel with support over 2a samples (typically a = 3, examining 36 neighbors in 2D):  [equation]  where sinc(t) = ( t) / ( t). The sinc function is the ideal interpolation kernel (it perfectly reconstructs bandlimited signals), but it has infinite support.' },
    { title: '5. Anti-Aliasing for Downsampling', desc: 'Interpolation methods described above are designed for upsampling (mapping to positions between existing samples). When downsampling (reducing resolution), you must first apply a low-pass filter to prevent aliasing -- the same principle as the Nyquist theorem.' },
    { title: '6. Geometric Transformations', desc: 'Interpolation is triggered whenever a geometric transformation T maps output coordinates (x\', y\') to non-integer input coordinates (x, y) = T^&#123;-1&#125;(x\', y\'). Common transformations:  All of these require interpolation at the transformed coordinates.' },
];

export default function WalkthroughCVCImageInterpolationAndResampling() {
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
          Image Interpolation and Resampling \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how image interpolation and resampling works, one stage at a time.
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
