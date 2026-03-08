import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE02TheOSeriesEvolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of the o-series as the rapid iteration phase after a breakthrough invention. The Wright brothers\' first flight at Kitty Hawk proved powered flight was possible; what followed was a rush of refinements that made aircraft faster, more reliable, and eventually practical. o1 proved that trained reasoning worked.' },
    { emoji: '⚙️', label: 'How It Works', text: 'o1-preview, released September 12, 2024, was deliberately limited: no image input, no tool use, no structured outputs, no streaming. It was a research preview that demonstrated reasoning capability while OpenAI worked on productizing the technology.' },
    { emoji: '🔍', label: 'In Detail', text: 'The o-series also forced a naming rethink at OpenAI. Rather than continuing the GPT numbering (GPT-5 would arrive separately), the "o" prefix designated a new family optimized for deliberate reasoning, signaling that these models operated fundamentally differently from their GPT predecessors.' },
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
