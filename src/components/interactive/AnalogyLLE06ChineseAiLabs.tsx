import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE06ChineseAiLabs() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'The Western narrative about AI competition often reduces the Chinese side to a monolith: "China" as a single entity competing against individual US companies. In reality, by 2025, China had developed one of the world\'s most diverse and fiercely competitive AI ecosystems.' },
    { emoji: '⚙️', label: 'How It Works', text: 'DeepSeek (High-Flyer Capital, Hangzhou, founded 2023): Perhaps the most globally consequential Chinese AI lab by early 2025. Backed by the quantitative hedge fund High-Flyer, which contributed both financial resources and a culture of mathematical rigor, DeepSeek combined research ambition with engineering discipline.' },
    { emoji: '🔍', label: 'In Detail', text: 'The ecosystem was shaped by three forces. First, the enormous Chinese domestic market: over 800 million smartphone users, a pervasive super-app culture built around WeChat and Alipay, and demand for AI in Chinese language and cultural context.' },
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
