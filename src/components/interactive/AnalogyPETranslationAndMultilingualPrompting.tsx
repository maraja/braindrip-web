import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPETranslationAndMultilingualPrompting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of multilingual prompting like hiring a cultural interpreter, not just a word-for-word translator. A word-for-word translator converts "It\'s raining cats and dogs" to its literal equivalent in Japanese, producing nonsense.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Translation quality depends heavily on how precisely the target language and register are specified:  Weak prompt: "Translate this to Japanese." Strong prompt: "Translate this to Japanese (formal keigo register, appropriate for business correspondence). Maintain the professional tone. Use appropriate honorific forms.' },
    { emoji: '🔍', label: 'In Detail', text: 'Translation and multilingual prompting encompasses three related tasks: translating text between languages, generating original content in non-English languages, and operating bilingually (prompting in one language while generating in another). Each presents distinct challenges. Translation must preserve meaning, tone, and cultural appropriateness.' },
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
