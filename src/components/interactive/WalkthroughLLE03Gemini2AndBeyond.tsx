import { useState } from 'react';

const STEPS = [
    { title: '1. Gemini 2.0 Flash (December 2024)', desc: 'The 2.x era launched with Gemini 2.0 Flash, an experimental model built for agentic workloads. Its key innovations were native tool use — the ability to call Google Search, execute code, and invoke external functions as first-class operations — and real-time multimodal streaming, enabling.' },
    { title: '2. Gemini 2.0 Flash Thinking (December 2024)', desc: 'Released alongside standard Flash, the "Thinking" variant introduced visible reasoning traces — the model\'s chain-of-thought process exposed to the user.' },
    { title: '3. Gemini 2.5 Pro (March 2025)', desc: 'The flagship of the 2.x generation, Gemini 2.5 Pro was positioned as a "thinking model" — a native reasoner that could dynamically allocate inference compute to problem difficulty.' },
    { title: '4. Gemini 2.5 Flash (May 2025, GA Mid-2025)', desc: 'Perhaps the most strategically significant release, 2.5 Flash combined thinking capabilities with aggressive cost optimization. It achieved the best cost-performance ratio of any frontier model: near-Pro-level quality at a fraction of the inference cost.' },
    { title: '5. Gemini 2.5 Flash-Lite (Preview, Mid-2025)', desc: 'Google expanded the 2.5 Flash family downward with Flash-Lite, a new preview model offering the lowest latency and cost in the entire 2.5 lineup. Flash-Lite targeted the highest-throughput use cases — classification, routing, extraction, and other tasks where speed and cost matter more than maximum.' },
    { title: '6. Gemini 2.5 Flash Native Audio (Mid-2025)', desc: 'Also arriving in mid-2025, Gemini 2.5 Flash Native Audio was an enhanced variant specifically optimized for building live voice agents. By processing audio natively rather than through a transcription-then-reasoning pipeline, it enabled lower-latency, more natural voice interactions — a critical.' },
];

export default function WalkthroughLLE03Gemini2AndBeyond() {
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
          Gemini 2.x and 3: Google\'s Agent Era \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how gemini 2.x and 3: google\'s agent era works, one stage at a time.
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
