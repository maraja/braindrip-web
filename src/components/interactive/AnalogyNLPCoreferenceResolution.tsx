import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPCoreferenceResolution() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading a novel and keeping track of who "he," "she," "the detective," and "Maria" all refer to across paragraphs and chapters. Your brain effortlessly links these different expressions to the same character.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The first step identifies candidate mentions -- spans of text that could refer to an entity. Common mention types:  Pronouns: he, she, it, they, his, their, etc. Named entities: "Barack Obama," "Google" (often from named-entity-recognition.md).' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a document D containing mentions m_1, m_2, , m_n, coreference resolution partitions these mentions into entity clusters \\&#123;E_1, E_2, , E_k\\&#125; such that all mentions within a cluster refer to the same real-world entity.' },
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
