import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04Palm() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine an orchestra where every musician is world-class, but they have never rehearsed together. Now imagine building a concert hall and a conductor system that lets 6,144 musicians play in perfect synchrony for the first time.' },
    { emoji: '⚙️', label: 'How It Works', text: 'PaLM uses a standard decoder-only Transformer with several important modifications. The most significant was parallel attention and feedforward computation: instead of computing attention and then the feedforward layer sequentially (as in standard Transformers), PaLM computes them in parallel and sums the results.' },
    { emoji: '🔍', label: 'In Detail', text: 'Published in April 2022 by Aakanksha Chowdhery and over 70 co-authors at Google, PaLM (Pathways Language Model) was the largest dense Transformer language model ever trained at the time, with 540 billion parameters.' },
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
