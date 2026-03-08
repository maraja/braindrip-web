import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPLanguageDiversityAndTypology() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you designed a postal system that works perfectly for addresses formatted as "123 Main Street, City, State, ZIP" -- street number, street name, city, state, code, in that exact order.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Languages vary in the default ordering of subject (S), verb (V), and object (O):  SVO (Subject-Verb-Object): English, Chinese, French, Russian, Swahili. "The cat (S) caught (V) the mouse (O)." Approximately 42% of the world\'s languages. SOV (Subject-Object-Verb): Hindi, Japanese, Korean, Turkish, Persian, Basque.' },
    { emoji: '🔍', label: 'In Detail', text: 'Linguistic typology is the systematic study of structural properties across languages. It classifies languages along dimensions like word order (how subjects, verbs, and objects are arranged), morphological type (how much information is packed into a single word), and writing system (how language is visually represented).' },
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
