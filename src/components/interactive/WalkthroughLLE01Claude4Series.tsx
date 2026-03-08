import { useState } from 'react';

const STEPS = [
    { title: '1. Claude Sonnet 4 and Opus 4 (May 2025)', desc: 'The Claude 4 generation launched in May 2025 with two models positioned for different use cases:  Claude Opus 4 was designed as the apex model for complex, autonomous tasks.' },
    { title: '2. Claude Sonnet 4.5 (September 2025)', desc: 'Released on September 29, 2025, Claude Sonnet 4.5 was the best coding model available at the time of its launch. It achieved 77.2% on SWE-bench Verified -- the highest score on that benchmark when it shipped -- and 61.' },
    { title: '3. Claude Opus 4.5 (November 2025)', desc: 'Released on November 24, 2025, Opus 4.5 reclaimed the top position on SWE-bench Verified with an 80.9% score -- the highest any model had achieved at the time and the #1 overall ranking. Rather than simply scaling up from Sonnet 4.5, Opus 4.' },
    { title: '4. Claude 4.6 (February 2026)', desc: 'The most architecturally ambitious generation, Claude 4.6 arrived in two waves and introduced several capabilities that represented qualitative leaps. Claude Opus 4.6 (February 5, 2026) led the generation with 80.' },
    { title: '5. Computer Use: From Demonstration to Production', desc: 'One of Claude\'s most distinctive capabilities has been computer use -- the ability to interact with desktop interfaces by viewing screenshots, moving the mouse, clicking buttons, and typing. This capability launched with Claude 3.5 Sonnet in October 2024 at a modest 14.' },
    { title: '6. Reason-Based Alignment (January 2026 Constitution Update)', desc: 'Anthropic updated Claude\'s constitution in January 2026, shifting from primarily rule-based constraints to reason-based alignment. Rather than encoding specific prohibitions ("never help with X"), the updated approach trained Claude to understand the reasoning behind safety guidelines and apply.' },
];

export default function WalkthroughLLE01Claude4Series() {
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
          Claude 4 Series \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how claude 4 series works, one stage at a time.
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
