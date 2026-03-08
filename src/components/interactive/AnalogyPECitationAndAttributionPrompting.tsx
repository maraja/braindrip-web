import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPECitationAndAttributionPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of citation prompting like academic footnotes in a research paper. A well-cited paper allows the reader to trace any claim back to its original source, verify the interpretation, and assess the strength of the evidence. Without footnotes, the reader must trust the author\'s claims entirely.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The citation format must be unambiguous, parseable, and consistent. Common formats include:  Numbered inline citations: Each source document is assigned a number, and claims are followed by the number in brackets. Example: "Revenue increased by 15% year-over-year [1], driven primarily by expansion into Asian markets [2].' },
    { emoji: '🔍', label: 'In Detail', text: 'Attribution prompting is the practice of designing instructions that cause language models to systematically cite their sources when generating answers from retrieved context. This goes beyond simply asking the model to "cite sources" — it involves specifying citation formats, providing examples of correctly cited outputs, defining what counts as.' },
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
