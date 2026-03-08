import { useState } from 'react';

const STEPS = [
    { title: '1. 2023: The Chasm (17.5 MMLU Points)', desc: 'When Meta released LLaMA 1 (February 2023) with 65B parameters, it scored approximately 63.4% on MMLU. GPT-4, released the following month, scored approximately 86.4%.' },
    { title: '2. 2024: Rapid Convergence (5 MMLU Points)', desc: 'LLaMA 3.1 405B (July 2024) scored approximately 88% on MMLU, while GPT-4o sat at approximately 88.7%. The gap had collapsed to under a single point on the benchmark that had defined the frontier for four years.' },
    { title: '3. 2025: Near-Parity on Core Tasks', desc: 'By 2025, multiple open models matched or exceeded closed frontier models on specific dimensions:  Reasoning: DeepSeek R1 (January 2025) matched OpenAI o1 on mathematical and scientific reasoning benchmarks.' },
    { title: '4. Late 2025 / Early 2026: The Sub-1% Gap on Coding', desc: 'By February 2026, the open-closed gap on the most consequential benchmark — SWE-bench Verified, measuring real-world software engineering — had narrowed to a margin barely distinguishable from noise. Claude Opus 4.5 led at 80.9%, but MiniMax M2.5, an open-weight model, reached 80.' },
    { title: '5. The Drivers of Convergence', desc: 'Several factors explain why the gap closed so quickly:  Training data improvements: Open datasets like FineWeb, RedPajama, and Dolma reached trillions of tokens of curated, high-quality text. The "data moat" that closed labs once held evaporated as open data curation caught up.' },
    { title: '6. Where the Gap Persists', desc: 'Despite the convergence on benchmarks, closed models maintained meaningful advantages in several areas as of mid-2025 — though even these edges continued to erode. Multimodal capabilities — especially audio and video — remained stronger in closed models with proprietary training data.' },
];

export default function WalkthroughLLE07OpenVsClosedTheNarrowingGap() {
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
          Open vs Closed: The Narrowing Gap \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how open vs closed: the narrowing gap works, one stage at a time.
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
