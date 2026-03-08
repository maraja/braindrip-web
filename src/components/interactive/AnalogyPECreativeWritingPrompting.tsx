import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPECreativeWritingPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of creative writing prompting like directing an actor. A good director does not read every line with the exact inflection they want and ask the actor to mimic it — that produces wooden, lifeless performance.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Style has multiple independent dimensions that should be specified separately:  Tone: The emotional quality of the writing. "Write in a melancholic but not despairing tone — the sadness of autumn, not the despair of loss." Tone specifications with analogies or comparisons are more effective than single adjectives.' },
    { emoji: '🔍', label: 'In Detail', text: 'Creative writing prompting is the practice of instructing language models to produce fiction, poetry, marketing copy, dialogue, and other creative text while maintaining specific stylistic properties.' },
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
