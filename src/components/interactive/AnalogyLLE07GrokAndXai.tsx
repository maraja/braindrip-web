import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE07GrokAndXai() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a tech billionaire watches the AI race from the sidelines, decides everyone is moving too slowly or too cautiously, builds the world\'s largest GPU datacenter in record time, and within two years is sitting atop the leaderboard. That is, roughly, the story of Grok and xAI.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Grok-1, released as open-weights in March 2024, was a 314 billion parameter Mixture of Experts model. It used 8 experts with a top-2 routing mechanism, meaning roughly 25% of total parameters (approximately 86B) were active for any given token. The architecture broadly followed the Transformer decoder-only pattern with MoE feedforward layers.' },
    { emoji: '🔍', label: 'In Detail', text: 'xAI was founded in July 2023, with Musk recruiting researchers from Google DeepMind, OpenAI, and other top labs. The company\'s stated mission was to "understand the true nature of the universe" — grand framing for what was, in practical terms, a sprint to build competitive large language models.' },
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
