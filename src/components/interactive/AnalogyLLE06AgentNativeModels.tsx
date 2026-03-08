import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE06AgentNativeModels() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine the difference between someone who can describe in perfect detail how to cook a meal and someone who can actually walk into a kitchen and prepare it — reading recipes, adjusting for available ingredients, tasting and correcting, cleaning up when something spills. Early LLMs were the former: brilliant describers, hopeless executors.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Traditional LLMs are trained on text sequences — predict the next token. Agent-native models are trained on action-observation sequences: the model generates an action (call a function, click a button, execute a command), observes the result, and generates the next action based on that feedback.' },
    { emoji: '🔍', label: 'In Detail', text: 'The shift began in late 2024 and accelerated through 2025 into early 2026. The catalyst was a recognition that the most valuable AI applications required not conversation but completion — finishing tasks, not just discussing them. Writing code that compiles and passes tests. Filling out forms across multiple websites.' },
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
