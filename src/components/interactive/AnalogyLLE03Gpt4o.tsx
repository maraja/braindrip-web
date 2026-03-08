import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03Gpt4o() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine the difference between a translator who speaks three languages natively versus one who learned them separately and mentally converts between them. The native speaker thinks fluidly across languages; the other pauses to translate.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The defining innovation of GPT-4o was end-to-end multimodal training. Rather than using separate models for different modalities (a vision encoder, a language model, a speech recognizer, and a speech synthesizer) and stitching them together, GPT-4o was trained as a single model across all modalities simultaneously.' },
    { emoji: '🔍', label: 'In Detail', text: 'OpenAI announced GPT-4o on May 13, 2024, in a live demonstration that emphasized real-time voice interaction. The "o" stood for "omni" — a model that could see, hear, speak, and think through a single architecture. The timing was strategic: Anthropic\'s Claude 3 Opus had just dethroned GPT-4 on key benchmarks (see 01-claude-3-family.' },
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
