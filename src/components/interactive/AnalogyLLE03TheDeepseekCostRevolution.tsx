import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03TheDeepseekCostRevolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'For three years, the AI industry operated under a comforting assumption: building frontier AI required frontier budgets. OpenAI raised 13 billion from Microsoft. Anthropic raised 7.3 billion from Google and Amazon. Google invested billions internally in DeepMind. Meta built massive GPU clusters costing hundreds of millions.' },
    { emoji: '⚙️', label: 'How It Works', text: 'DeepSeek\'s cost advantage was not a single trick but an accumulation of innovations, each addressing a different bottleneck in the model training and serving pipeline. Multi-head Latent Attention (MLA) compressed the KV cache by 93.3%, reducing the memory required to serve each user by approximately 57x.' },
    { emoji: '🔍', label: 'In Detail', text: 'DeepSeek shattered this narrative in a span of eight months. In May 2024, V2 showed you could serve competitive AI at 1/50th the prevailing price. In December 2024, V3 matched GPT-4o and Claude 3.5 Sonnet for 5.576 million in training cost. In January 2025, R1 matched OpenAI\'s o1 reasoning model with open weights under MIT license.' },
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
