import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPPrivacyInNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a parrot that has listened to thousands of conversations in a hospital. Most of the time, it repeats generic phrases about health and wellness. But occasionally, unprompted, it recites a specific patient\'s name, diagnosis, and address verbatim.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Training Data Extraction: Carlini et al. (2021) demonstrated that GPT-2 memorizes and can emit verbatim sequences from its training data. By generating text with the model and comparing outputs against the training corpus, they extracted hundreds of memorized sequences including names, phone numbers, IRC usernames, and code snippets.' },
    { emoji: '🔍', label: 'In Detail', text: 'Privacy in NLP addresses the fundamental tension between training powerful language models on large, diverse datasets and protecting the sensitive information those datasets contain. The challenge is that the very properties that make models useful -- their ability to learn and recall patterns from training data -- also make them privacy risks.' },
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
