import { useState } from 'react';

const STEPS = [
    { title: '1. Forward Diffusion Process', desc: 'Given a data point x_0, the forward process produces a sequence x_1, x_2, , x_T by adding noise at each step:  [equation]  where _t  (0, 1) is a noise schedule. A key property allows sampling x_t directly from x_0:  [equation]  where _t = 1 - _t and &#123;&#125;_t = _&#123;s=1&#125;^&#123;t&#125; _s.' },
    { title: '2. Reverse Process (DDPM)', desc: '(2020) parameterize the reverse process as:  [equation]  The network predicts the noise _(x_t, t) added at step t, and the mean is computed as:  [equation]  The training objective simplifies to:  [equation]  This is remarkably simple: sample a timestep t, add noise to a training image, and train.' },
    { title: '3. Score Matching Perspective', desc: 'Song and Ermon (2019) showed an equivalent formulation via score matching. The score function _x  p(x) points toward high-density regions.' },
    { title: '4. Noise Schedules', desc: 'Linear (DDPM): _t linearly increases from _1 = 10^&#123;-4&#125; to _T = 0.02 over T = 1000 steps. Cosine (Nichol and Dhariwal, 2021): &#123;&#125;_t = ^2(&#123;t/T + s&#125;&#123;1 + s&#125;  &#123;&#125;&#123;2&#125;) with s = 0.008.' },
    { title: '5. Accelerated Sampling', desc: 'The original DDPM requires 1000 denoising steps. Faster alternatives:  DDIM (Song et al., 2020): Deterministic sampling with a non-Markovian process.' },
    { title: '6. Classifier-Free Guidance', desc: 'Ho and Salimans (2022) introduced a technique to trade diversity for quality without a separate classifier. During training, the condition c (e.g., class label or text) is randomly dropped with probability p = 0.1, training both conditional and unconditional models simultaneously.' },
];

export default function WalkthroughCVCDiffusionModels() {
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
          Diffusion Models \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how diffusion models works, one stage at a time.
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
