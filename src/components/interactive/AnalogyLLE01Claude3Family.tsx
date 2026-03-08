import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01Claude3Family() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a car manufacturer that has been selling a single sedan, and then overnight reveals an entire lineup — an economy hatchback, a mid-range SUV, and a luxury sports car — all sharing the same engine platform but tuned for different drivers.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Claude 3 Haiku was the speed specialist: the fastest and cheapest model in the family, designed for near-instant responses on straightforward tasks. It excelled at customer service automation, content moderation, and high-volume API calls where cost per token matters more than peak intelligence.' },
    { emoji: '🔍', label: 'In Detail', text: 'Before Claude 3, the frontier model market was essentially a one-horse race. OpenAI\'s GPT-4, released in March 2023, had dominated benchmarks and mindshare for nearly a year. Anthropic\'s previous Claude 2 models were capable but consistently trailed GPT-4 on the most demanding evaluations. Google\'s Gemini 1.' },
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
