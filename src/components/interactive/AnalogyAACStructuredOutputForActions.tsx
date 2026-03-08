import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACStructuredOutputForActions() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine asking a colleague to fill out a tax form. If you give them a blank sheet of paper and say "write down your tax information," you will get wildly inconsistent results — some write prose, others use bullet points, some miss critical fields.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest structured output mechanism is "JSON mode," offered by OpenAI, Anthropic, and other providers. When enabled, the model is guaranteed to produce valid JSON in its response. However, JSON mode only guarantees syntactic validity — the output will parse as JSON — not semantic validity.' },
    { emoji: '🔍', label: 'In Detail', text: 'Structured output for actions specifically addresses the problem of getting reliable, machine-readable outputs from LLMs when those outputs will drive tool invocations, API calls, or state changes. When the model says "I\'ll search for restaurants in Seattle," that is informative text for a human but useless for a machine.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
