import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03Gemini2AndBeyond() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a company that owns the world\'s best search engine, the most popular email and document suite, the dominant mobile operating system, and a leading cloud platform — and then builds an AI that can use all of them natively. That is Google\'s strategic position with Gemini, and the arc from 2.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The 2.x era launched with Gemini 2.0 Flash, an experimental model built for agentic workloads. Its key innovations were native tool use — the ability to call Google Search, execute code, and invoke external functions as first-class operations — and real-time multimodal streaming, enabling low-latency audio and video interactions.' },
    { emoji: '🔍', label: 'In Detail', text: 'The Gemini arc from December 2024 through December 2025 tells a story of relentless iteration. Where OpenAI released a single flagship model every 12-18 months and Anthropic maintained a carefully tiered lineup, Google shipped at a pace that sometimes blurred the line between research preview and production release.' },
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
