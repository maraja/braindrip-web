import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE09MistralLargeAndEnterprise() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a garage band that released a debut album so good it disrupted the entire music industry, and then within a year had signed a major label deal, opened a recording studio, hired a full orchestra, and was releasing albums across every genre. That is Mistral AI\'s trajectory in 2024.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Mistral Large 2 was the company\'s flagship: a 123 billion parameter dense Transformer with a 128K token context window. It supported over 80 programming languages and featured strong multilingual capabilities across English, French, German, Spanish, Italian, Portuguese, Arabic, Hindi, Russian, Chinese, Japanese, and Korean.' },
    { emoji: '🔍', label: 'In Detail', text: 'Mistral AI\'s 2024 expansion was driven by an aggressive fundraising trajectory. The company raised a 385 million Euro Series A in December 2023 and a 600 million Series B by June 2024, reaching a 6 billion valuation.' },
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
