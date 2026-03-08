import { useState } from 'react';

const STEPS = [
    { title: '1. o1-preview to o1 Full (September-December 2024)', desc: 'o1-preview, released September 12, 2024, was deliberately limited: no image input, no tool use, no structured outputs, no streaming. It was a research preview that demonstrated reasoning capability while OpenAI worked on productizing the technology.' },
    { title: '2. o3-mini: Efficient Reasoning (January 2025)', desc: 'o3-mini, released January 31, 2025, was a pivotal moment in the o-series evolution. It demonstrated that reasoning capabilities could be compressed into a smaller, faster model without catastrophic quality loss.' },
    { title: '3. o3: The Capability Leap (April 2025)', desc: 'o3, released April 16, 2025, represented the largest single capability jump in the series. It achieved a 2530 Elo rating on Codeforces, placing it at the expert competitive programming level.' },
    { title: '4. o4-mini: Compact Frontier Reasoning (April 2025)', desc: 'Released alongside o3 on April 16, 2025, o4-mini was a compact reasoning model that achieved remarkable efficiency. It scored 93.4% on AIME 2025 and 93.4% on GPQA Diamond, rivaling or exceeding the full o3 on several benchmarks.' },
    { title: '5. o3-pro: Maximum Reliability (June 2025)', desc: 'o3-pro was a variant of o3 designed to think longer and provide the most reliable, thoroughly reasoned responses. Available as an option in ChatGPT for Pro subscribers, o3-pro allocated significantly more inference compute per query than standard o3, targeting use cases where accuracy was paramount.' },
    { title: '6. Absorption into GPT-5: The End of the Separate o-Series (August-December 2025)', desc: 'The o-series ultimately proved to be a transitional product line. On August 7, 2025, OpenAI released GPT-5, which unified the GPT and o-series lines into a single model.' },
];

export default function WalkthroughLLE02TheOSeriesEvolution() {
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
          The o-Series Evolution: o1 to o4-mini (and Beyond) \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how the o-series evolution: o1 to o4-mini (and beyond) works, one stage at a time.
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
