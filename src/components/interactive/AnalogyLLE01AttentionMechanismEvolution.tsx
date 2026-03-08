import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01AttentionMechanismEvolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a classroom where every student takes their own complete set of notes for every lecture. That is Multi-Head Attention — thorough but expensive. Now imagine pairs of students sharing notes, then whole study groups sharing a single set, and finally the entire class compressing all notes into a slim cheat sheet that somehow captures.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Vaswani et al.\'s "Attention Is All You Need" introduced MHA with 8 heads, each computing its own Q, K, and V projections from the input. For a model with dimension d_model = 512 and 8 heads, each head operates on d_k = d_v = 64 dimensions.' },
    { emoji: '🔍', label: 'In Detail', text: 'Attention is the core operation of the Transformer. It determines how each token in a sequence "looks at" every other token to decide what information to gather. The original Multi-Head Attention (MHA) formulation gave each head its own Query, Key, and Value projections — maximally expressive but maximally memory-hungry.' },
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
