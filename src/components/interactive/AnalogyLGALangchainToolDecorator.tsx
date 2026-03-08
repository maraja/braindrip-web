import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGALangchainToolDecorator() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of the @tool decorator as a translator badge you pin onto a Python function. Without it, your function is just code that Python can run. With it, the function gains a machine-readable "name tag" that tells an LLM what it does, what inputs it expects, and what it returns — much like how a restaurant menu describes each dish so a customer can.' },
    { emoji: '⚙️', label: 'How It Works', text: 'After decoration, multiply is no longer a plain function — it is a StructuredTool instance with .name, .description, and .args_schema attributes.' },
    { emoji: '🔍', label: 'In Detail', text: 'The decorator inspects three things automatically: the function\'s name (becomes the tool name), the docstring (becomes the description the LLM reads to decide when to use the tool), and the type hints on parameters (become the JSON schema that validates inputs).' },
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
