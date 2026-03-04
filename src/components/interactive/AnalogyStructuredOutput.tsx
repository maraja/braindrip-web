import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyStructuredOutput() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📋', label: 'Tax Form', text: 'A tax form has specific boxes for name, income, deductions — you can\'t just write a paragraph. Structured output forces the LLM to fill in a predefined schema (JSON, XML, etc.) instead of producing free-form text. This makes outputs machine-parseable and reliable, essential for integrating LLMs into software systems that expect data in specific formats.' },
    { emoji: '🧩', label: 'Puzzle Pieces', text: 'Software systems are like puzzles — each piece needs a specific shape to connect. Structured output ensures the LLM produces pieces that fit: JSON objects with required fields, typed values, and valid enums. Without it, you\'re hoping the model\'s free-text response can be parsed correctly. With it (via constrained decoding or function calling), the output is guaranteed to be valid.' },
    { emoji: '📐', label: 'Blueprint Standards', text: 'Architects must submit blueprints in standardized formats so builders can read them. Structured output is the LLM equivalent — instead of prose, the model outputs data in a defined schema that downstream code can reliably consume. Whether enforced via JSON mode, tool calling, or grammar-constrained decoding, it bridges the gap between natural language AI and structured software.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
