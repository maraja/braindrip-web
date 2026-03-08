import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEPromptOptimizationTechniques() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are developing a recipe for a complex dish. You have ten ingredients, and the result tastes pretty good but not great. How do you improve it? You do not change all ten ingredients at once — you would have no idea what helped or hurt.' },
    { emoji: '⚙️', label: 'How It Works', text: 'An ablation study measures the contribution of each prompt component by removing it and observing the impact on eval scores. Start with the full prompt and establish a baseline score.' },
    { emoji: '🔍', label: 'In Detail', text: 'Most prompts start as a rough draft and improve through iteration. But unstructured iteration — changing multiple things at once, evaluating by gut feel, never reverting failed experiments — wastes time and frequently leads to local optima where the prompt is "good enough" but far from optimal.' },
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
