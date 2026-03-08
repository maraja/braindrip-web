import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPInformationExtraction() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading thousands of news articles and filling in a spreadsheet with every company acquisition mentioned -- who acquired whom, for how much, and when. A human analyst would take weeks; an Information Extraction (IE) system does it in minutes.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Classical IE follows a cascade of increasingly complex subtasks:  Named Entity Recognition (NER): Identify entity mentions and classify them into types (PERSON, ORGANIZATION, LOCATION, DATE, etc.). See 05-core-nlp-tasks-analysis/named-entity-recognition.md for details.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, Information Extraction is the task of identifying specific pieces of information from natural language text and organizing them into predefined structures such as tables, knowledge bases, or templates. Unlike Information Retrieval (see information-retrieval.' },
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
