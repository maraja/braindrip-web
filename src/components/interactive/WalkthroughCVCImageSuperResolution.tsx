import { useState } from 'react';

const STEPS = [
    { title: '1. SRCNN: The Pioneer', desc: '(2014) introduced the first deep learning SR method. SRCNN is a shallow 3-layer CNN applied to a bicubic-upsampled input:  Patch extraction: 9 x 9 conv, 64 filters Nonlinear mapping: 1 x 1 conv, 32 filters Reconstruction: 5 x 5 conv, 1 filter (or 3 for RGB)  Trained with MSE loss: &#123;L&#125; =.' },
    { title: '2. Sub-Pixel Convolution', desc: '(2016) introduced an efficient upsampling strategy: instead of upsampling the input first, operate entirely at low resolution and use a sub-pixel shuffle (pixel shuffle) layer to rearrange r^2 channels into spatial dimensions:  [equation]  This is computationally cheaper than transposed.' },
    { title: '3. EDSR and Deeper Networks', desc: '(2017) proposed Enhanced Deep Super-Resolution (EDSR), removing batch normalization from residual blocks (saving ~40% memory) and scaling residual connections by 0.1. With 32 residual blocks and 256 filters, EDSR achieved 32.46 dB PSNR on Set5 at 4x, a significant jump over earlier methods.' },
    { title: '4. SRGAN: Perceptual Super-Resolution', desc: '(2017) recognized that MSE-optimized models produce high PSNR but perceptually blurry results. SRGAN introduced:  Perceptual loss (content loss): Compare VGG-19 features instead of pixels:  [equation]  where _j is the j-th layer feature map of a pretrained VGG-19.' },
    { title: '5. ESRGAN', desc: '(2018) improved SRGAN with: Residual-in-Residual Dense Blocks (RRDB): Dense connections without batch normalization. Relativistic discriminator: D predicts whether a real image is "more realistic" than a fake one, rather than absolute real/fake.' },
    { title: '6. Real-ESRGAN: Handling Real-World Degradation', desc: 'Classical SR assumes a simple bicubic downsampling degradation. Real images suffer from blur, noise, compression artifacts, and ringing -- simultaneously.' },
];

export default function WalkthroughCVCImageSuperResolution() {
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
          Image Super-Resolution \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how image super-resolution works, one stage at a time.
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
