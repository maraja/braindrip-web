import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEChunkingForContextQuality() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of chunking like cutting a pizza. Cut the slices too small and the toppings fall off — you get fragments with no coherent meaning. Cut them too large and they are unwieldy — you waste context window space on irrelevant material. The ideal slice gives you a complete, self-contained portion that is satisfying on its own.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Fixed-size chunking splits documents at regular token or character intervals (e.g., every 512 tokens). This is simple and predictable but often breaks mid-sentence or mid-paragraph, producing fragments that lack coherence. A chunk that starts with "...' },
    { emoji: '🔍', label: 'In Detail', text: 'Chunking is the process of splitting source documents into smaller segments for embedding and retrieval. While chunking is often discussed purely as a retrieval problem (does the right chunk get found?), it is equally a generation quality problem.' },
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
