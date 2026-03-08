import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04Qwen1And2() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'The Qwen series (short for Tongyi Qianwen, meaning "seeking answers from a thousand questions") represents Alibaba Cloud\'s sustained investment in building a competitive open-weight language model family.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Qwen 1 launched in August 2023 with 7B and 14B parameter models, later expanding to a 72B flagship. Trained on approximately 3 trillion tokens of Chinese and English text sourced from web crawls, books, code repositories, and curated datasets, it established a standard dense Transformer architecture.' },
    { emoji: '🔍', label: 'In Detail', text: 'What distinguished Qwen from many competitors was not a single flashy breakthrough but relentless, methodical improvement. Each version trained on more data, supported more languages, offered more size variants, and integrated more deeply with the open-source tooling ecosystem.' },
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
