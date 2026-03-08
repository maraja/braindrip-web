import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05Qwen3AndOpenFrontier() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'By early 2025, the open-weight community had two dominant model families: Meta\'s LLaMA and Alibaba\'s Qwen. Qwen 3, released in April-May 2025, represented Alibaba\'s most ambitious bid yet for frontier status.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Qwen 3 offered two architecture families to serve different deployment scenarios. The dense models ranged from 0.6B to 32B parameters, with each size trained from scratch on up to 36 trillion tokens.' },
    { emoji: '🔍', label: 'In Detail', text: 'Qwen 3 also represented a philosophical shift for the series. Previous Qwen generations competed primarily on benchmark scores against LLaMA and other open models. Qwen 3 competed on paradigm. By incorporating the hybrid thinking approach pioneered by Anthropic\'s Claude 3.' },
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
