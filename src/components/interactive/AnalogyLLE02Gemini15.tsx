import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02Gemini15() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you could hand a librarian not just a single book and ask a question, but the entire shelf — a thousand books at once — and they could recall any detail from any page instantly. That is what Gemini 1.5 achieved with its million-token context window. While other frontier models were processing the equivalent of a long essay, Gemini 1.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Unlike dense models where every parameter activates for every token, Gemini 1.5 uses a Mixture of Experts design. The model contains many "expert" sub-networks, but for any given input, only a fraction of them activate. This means the total parameter count can be very large (providing capacity) while the active compute per token remains manageable.' },
    { emoji: '🔍', label: 'In Detail', text: 'Google had been playing catch-up in the LLM race since ChatGPT\'s November 2022 launch. The original Gemini 1.0 (December 2023) was Google\'s answer to GPT-4, but its reception was mixed — benchmark controversies and a botched demo video had damaged credibility. Google DeepMind needed a clear, undeniable technical advantage.' },
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
