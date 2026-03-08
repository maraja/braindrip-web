import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04Llama4() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine being handed the blueprints and materials for a factory that previously only the wealthiest companies could build. That has been the Llama story from the beginning — Meta releasing increasingly capable model weights for anyone to use.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Llama 4 marked Meta\'s first adoption of MoE for the Llama family, a significant architectural departure from the dense transformers used in Llama 1 through 3.1. The MoE approach allowed dramatically larger total parameter counts while keeping active parameters — and therefore inference cost — manageable.' },
    { emoji: '🔍', label: 'In Detail', text: 'Llama 4 arrived in April 2025 as two released models and one announced-but-unreleased behemoth. Llama 4 Scout (17B active / 109B total, 16 experts) was optimized for efficiency and featured a record-setting 10 million-token context window.' },
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
