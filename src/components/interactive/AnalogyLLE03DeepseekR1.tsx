import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE03DeepseekR1() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine discovering that a student could teach themselves to solve calculus problems just by being told whether their final answers were right or wrong, without any worked examples or step-by-step instruction. That is essentially what DeepSeek-R1-Zero demonstrated.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most scientifically remarkable result was R1-Zero. Starting from the DeepSeek-V3 base model (671B MoE, 37B active parameters), the team applied Group Relative Policy Optimization (GRPO) with only a simple reward: correctness of the final answer for math and coding problems.' },
    { emoji: '🔍', label: 'In Detail', text: 'The significance went beyond the technical achievement. While OpenAI kept o1\'s methods proprietary and its weights closed, DeepSeek released R1 under the MIT license with full weights, a detailed technical report, and distilled versions ranging from 1.5B to 70B parameters.' },
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
