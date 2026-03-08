import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPECodeGenerationPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of code generation prompting like giving an architect both the blueprint requirements AND the building codes. You would not just say "design me a house" — you would specify the number of rooms, the lot dimensions, the local building codes, the climate zone, seismic requirements, and the budget.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Precise environment specification eliminates an entire category of errors:  Weak prompt: "Write a function to parse JSON." Strong prompt: "Write a Python 3.11 function using the standard library json module. The function should parse a JSON string and return a typed dictionary. Use type hints compatible with Python 3.' },
    { emoji: '🔍', label: 'In Detail', text: 'Code generation prompting is the discipline of structuring instructions to produce working, maintainable, production-quality code. This is distinct from general text generation because code has an objective correctness standard: it either compiles and passes tests or it does not.' },
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
