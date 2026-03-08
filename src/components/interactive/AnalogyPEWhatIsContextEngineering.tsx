import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEWhatIsContextEngineering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine curating a museum exhibit. You have a vast archive of artifacts, documents, photographs, and interactive displays, but the exhibit hall has limited floor space. What you include, what you exclude, and how you arrange everything determines whether visitors leave informed and inspired or confused and overwhelmed.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The context window is a fixed-size resource measured in tokens. Every piece of information — system prompt, conversation history, retrieved documents, tool results, examples — competes for space in this resource. Context engineering treats the context window as a budget to be allocated strategically, not a container to be filled to capacity.' },
    { emoji: '🔍', label: 'In Detail', text: 'Context engineering is this curatorial discipline applied to LLMs. As Andrej Karpathy framed it, context engineering is "the art of filling the context window with the right information at the right time.' },
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
