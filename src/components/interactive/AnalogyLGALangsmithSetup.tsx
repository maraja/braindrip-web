import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGALangsmithSetup() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of LangSmith as a flight data recorder for your AI applications. Just as a black box automatically captures every parameter of a flight without the pilot doing anything special, LangSmith automatically records every LLM call, tool invocation, and agent decision once you flip it on.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The entire setup requires three environment variables:  Alternatively, set them in your shell or .env file:' },
    { emoji: '🔍', label: 'In Detail', text: 'LangSmith is the observability and evaluation platform built by LangChain specifically for LLM-powered applications. It captures the full execution trace of every request that flows through your LangChain or LangGraph application, including inputs, outputs, token counts, latency, cost estimates, and errors.' },
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
