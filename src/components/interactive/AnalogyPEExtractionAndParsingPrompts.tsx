import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEExtractionAndParsingPrompts() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine scanning a printed page and circling specific pieces of information with a highlighter — the person\'s name in yellow, the date in green, the dollar amount in pink. You are not creating new information; you are finding and marking what already exists.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every extraction task begins with defining what to extract. The schema specifies field names, types, descriptions, and whether each field is required or optional. A well-designed schema for extracting contact information might look like:  Field descriptions are critical — they resolve ambiguity.' },
    { emoji: '🔍', label: 'In Detail', text: 'Extraction is fundamentally different from generation. In generation, the model creates new text that did not exist before. In extraction, every piece of output should be directly traceable to something in the input.' },
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
