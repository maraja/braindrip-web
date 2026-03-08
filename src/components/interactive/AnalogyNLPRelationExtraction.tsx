import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPRelationExtraction() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine reading a biography and mentally noting facts: "born in Pretoria," "founded Tesla," "married to (person)." You are extracting relations -- structured facts connecting two entities through a defined relationship type.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Pipeline approach: First run NER to identify entity mentions, then classify the relation for each entity pair. This is simpler to implement and debug but suffers from error propagation -- NER mistakes cannot be recovered by the relation classifier. Joint extraction: Simultaneously identify entities and their relations using a single model.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a sentence s and two entity mentions e_1 and e_2 (identified by named-entity-recognition.md), relation extraction assigns a label r  R  \\&#123;NONE\\&#125;, where R is a set of predefined relation types such as born-in, works-for, part-of, capital-of, founded-by, spouse-of, and located-in. A triple (e_1, r, e_2) represents the extracted fact.' },
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
