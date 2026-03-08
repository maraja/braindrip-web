import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPLowResourceNlp() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you are a doctor arriving in a remote village where no medical records exist, no lab equipment is available, and the few local health workers speak a language you do not know. You must still diagnose patients.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most impactful approach for low-resource languages: train a model on labeled data in a high-resource language (typically English) and apply it directly to a target language using a multilingual model as the bridge. How it works: Fine-tune a multilingual transformer (see multilingual-transformers.' },
    { emoji: '🔍', label: 'In Detail', text: 'Low-resource NLP encompasses the methods and strategies for building NLP systems in settings where labeled training data is scarce or unavailable. This includes low-resource languages (the vast majority of the world\'s 7,000+ languages), specialized domains (medical, legal, scientific text in niche areas), and emerging tasks without established.' },
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
