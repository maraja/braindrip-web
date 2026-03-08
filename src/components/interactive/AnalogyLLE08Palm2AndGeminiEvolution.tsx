import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE08Palm2AndGeminiEvolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a shipbuilding company that first builds the biggest battleship in the world, then realizes the future belongs to a fleet of faster, more fuel-efficient frigates. Google\'s model strategy followed exactly this trajectory. They started by building PaLM, the largest dense Transformer ever trained.' },
    { emoji: '⚙️', label: 'How It Works', text: 'PaLM was a 540B parameter dense decoder-only Transformer, trained on 780 billion tokens across 6,144 TPU v4 chips using Google\'s Pathways system. The Pathways infrastructure was itself a major innovation: it allowed a single model to be trained across multiple TPU pods, enabling scales that were previously impractical.' },
    { emoji: '🔍', label: 'In Detail', text: 'The story begins in April 2022, when Google released PaLM (Pathways Language Model) — a 540 billion parameter dense Transformer that was the largest of its era. It achieved state-of-the-art results and showed striking emergent abilities, including chain-of-thought reasoning on math problems.' },
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
