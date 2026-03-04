import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyTokenization() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧱', label: 'LEGO Bricks', text: 'Tokenization is like breaking a LEGO creation into its individual bricks. The sentence "unbelievable" might become ["un", "believ", "able"] — three standard bricks. The model works with these standardized pieces, not raw characters or whole words. A good tokenizer finds bricks that balance reusability (common pieces) with expressiveness (rare but useful pieces).' },
    { emoji: '🔪', label: 'Sushi Chef', text: 'A sushi chef slices a long fish into bite-sized pieces the diner can handle. Tokenization slices text into chunks the model can digest. Common words stay whole ("the" = 1 token). Rare words get sliced into subwords ("tokenization" = "token" + "ization"). This way, the model has a manageable vocabulary but can still represent any text.' },
    { emoji: '🗂', label: 'Filing System', text: 'Imagine a filing system where every document is broken into standardized index cards. Common phrases get their own card; rare words are split across multiple cards. Tokenization converts continuous text into a discrete sequence of integer IDs from a fixed dictionary. Each ID maps to a learned embedding vector — the model never sees raw text, only these numeric cards.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
