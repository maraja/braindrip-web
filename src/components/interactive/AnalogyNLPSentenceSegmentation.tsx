import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPSentenceSegmentation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading a novel printed without any paragraph breaks or capital letters after periods. You would need to mentally reconstruct where each sentence ends and the next begins, relying on grammar, meaning, and punctuation conventions.' },
    { emoji: '⚙️', label: 'How It Works', text: '#### Simple Regex Splitting  The baseline approach uses a regular expression to split on sentence-ending punctuation followed by whitespace and a capital letter:  This handles clean, formal text but fails on abbreviations ("Dr. Smith"), acronyms ("U.S.A."), ellipses ("Wait... What?' },
    { emoji: '🔍', label: 'In Detail', text: 'This may sound trivial -- "just split on periods" -- but consider: "Dr. Smith earned $3.5M from U.S. operations in Jan. 2024." That single sentence contains six periods, and only the last one marks a sentence boundary.' },
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
