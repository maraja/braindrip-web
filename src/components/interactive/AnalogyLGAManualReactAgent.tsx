import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAManualReactAgent() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'If create_react_agent is buying a car off the lot, building a manual ReAct agent is assembling one in your garage. You pick every component: the engine (LLM node), the transmission (conditional routing), and the drivetrain (tool execution). The result is the same reason-act-observe loop, but you control every bolt.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The add_messages reducer ensures new messages are appended to the list rather than replacing it. This is what accumulates the conversation history across loop iterations.' },
    { emoji: '🔍', label: 'In Detail', text: 'This matters because real-world agents rarely stay simple. You may need to inject a validation step between the LLM and tool execution, add a human approval gate, or branch into entirely different subgraphs depending on context. The manual approach gives you those extension points from the start.' },
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
