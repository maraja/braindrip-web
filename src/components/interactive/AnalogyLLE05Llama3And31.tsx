import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05Llama3And31() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a group of scientists who have been freely sharing their blueprints for building bridges while the leading construction firms guard theirs as trade secrets. Each version of the public blueprint gets better, and eventually the open-source bridges become as strong as the proprietary ones.' },
    { emoji: '⚙️', label: 'How It Works', text: 'LLaMA 3 used a dense decoder-only Transformer — no Mixture of Experts. This was a deliberate choice. Meta\'s researchers evaluated MoE architectures but chose dense models for training stability, simplicity of deployment, and more predictable scaling behavior.' },
    { emoji: '🔍', label: 'In Detail', text: 'Meta released LLaMA 3 on April 18, 2024, with 8B and 70B parameter models. Three months later, on July 23, 2024, LLaMA 3.1 added the 405B variant — the largest open-weight model ever released, and the first to genuinely compete with GPT-4o and Claude 3.5 Sonnet on major benchmarks.' },
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
