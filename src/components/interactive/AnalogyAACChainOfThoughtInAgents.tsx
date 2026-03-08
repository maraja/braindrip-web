import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACChainOfThoughtInAgents() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of an experienced surgeon who narrates their thought process during a complex operation: "The bleeding is coming from the left hepatic artery. I need to clamp proximal to the injury before I can repair it. Let me first check the portal triad to confirm there are no anatomical variations.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most common implementation is a dedicated scratchpad section in the agent\'s prompt where it is instructed to reason before acting:  The scratchpad is consumed by the framework (parsed to extract the action) but the reasoning portion helps the model produce better actions by forcing it to think through the decision.' },
    { emoji: '🔍', label: 'In Detail', text: 'Chain-of-thought (CoT) in agents is the practice of having the agent generate explicit intermediate reasoning steps before deciding on its next action. While CoT was originally introduced by Wei et al. (2022) for single-turn question answering, its application within agent loops is distinct and more nuanced.' },
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
