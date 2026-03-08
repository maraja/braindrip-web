import { useState } from 'react';

const STEPS = [
    { title: '1. Architecture Overview', desc: 'StyleGAN replaces the traditional generator input with a constant learned tensor 4 x 4 x 512 and introduces three new components:  Mapping Network f: An 8-layer MLP that maps the input noise z  &#123;R&#125;^&#123;512&#125; to an intermediate latent space w  &#123;W&#125;  &#123;R&#125;^&#123;512&#125;.' },
    { title: '2. Style Mixing', desc: 'Because styles are injected independently at each layer, using different w vectors at different resolutions (style mixing) allows compositing coarse features from one latent code with fine features from another. Coarse styles (4x4 -- 8x8) control pose, face shape, and glasses.' },
    { title: '3. $\\mathcal&#123;W&#125;$ vs $\\mathcal&#123;Z&#125;$ Space', desc: 'The intermediate latent space &#123;W&#125; is empirically more disentangled than the input space &#123;Z&#125;. Linear interpolation in &#123;W&#125; produces smoother, more semantically meaningful transitions.' },
    { title: '4. StyleGAN2 Improvements', desc: '(2020) addressed several artifacts:  Droplet artifacts: Caused by AdaIN normalizing away useful signal. Fixed by replacing AdaIN with weight demodulation -- modulating convolution weights directly instead of feature statistics.' },
    { title: '5. StyleGAN3', desc: '(2021) tackled texture sticking -- fine details that stay fixed in screen coordinates rather than moving with objects during latent space animation. The solution involved alias-free signal processing: carefully filtered nonlinearities and upsampling to ensure strict equivariance to continuous.' },
    { title: '6. GAN Inversion', desc: 'GAN inversion -- projecting a real image into StyleGAN\'s latent space -- enables editing real photographs. Three main approaches exist:  Optimization-based: Directly optimize w to minimize \\ plus perceptual loss.' },
];

export default function WalkthroughCVCStylegan() {
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
          StyleGAN \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how stylegan works, one stage at a time.
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
