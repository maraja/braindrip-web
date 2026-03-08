import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPMachineTranslationApproaches() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine three generations of translators. The grandparent meticulously consults grammar books and bilingual dictionaries, applying rules to convert each sentence piece by piece -- accurate but slow and brittle.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Rule-Based MT (RBMT) encodes linguistic knowledge manually. Three architectures emerged:  Direct Transfer: Word-by-word replacement using bilingual dictionaries with minimal structural adjustment. The simplest approach, producing outputs like translating "The house is big" to French as "La maison est grand" (missing gender agreement).' },
    { emoji: '🔍', label: 'In Detail', text: 'Machine translation (MT) automates the conversion of text from a source language to a target language. It is one of the oldest problems in AI (Warren Weaver\'s 1949 memorandum), one of the most commercially impactful (Google Translate serves over 500 million users), and one of the most technically demanding -- requiring the system to handle.' },
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
