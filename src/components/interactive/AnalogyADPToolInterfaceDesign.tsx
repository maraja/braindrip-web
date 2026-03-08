import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyADPToolInterfaceDesign() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about designing a TV remote control. A good remote has clearly labeled buttons (Play, Pause, Volume Up), each button does exactly one thing, and the labels match what happens. A bad remote has 80 unlabeled buttons, some that do multiple things depending on context, and a manual you need to read before pressing anything.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Tool names are the model\'s first signal about what a tool does. Use the verb_noun pattern consistently:  Naming rules: 2-4 words, underscore-separated. Start with a verb: get, search, create, update, delete, list, calculate, send, validate.' },
    { emoji: '🔍', label: 'In Detail', text: 'LLMs interact with tools the same way. The model reads the tool name, description, and parameter schema, then decides whether and how to invoke the tool. It does not have supplementary documentation, cannot ask clarifying questions about the API, and will make assumptions about anything ambiguous.' },
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
