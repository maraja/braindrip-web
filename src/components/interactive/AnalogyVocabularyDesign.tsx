import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyVocabularyDesign() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🧰', label: 'Toolbox', text: 'Vocabulary design is like choosing tools for a toolbox. Too few tools (small vocab) and you need multiple steps for simple tasks — "unbreakable" requires 3 tokens. Too many tools (huge vocab) and most gather dust while the toolbox becomes unwieldy. The sweet spot (32k-128k tokens) gives you efficient single-token access to common words while keeping the embedding table manageable.' },
    { emoji: '🗺', label: 'City Map', text: 'Designing a vocabulary is like deciding which landmarks to put on a city map. Include too few and people cannot navigate. Include every park bench and the map becomes useless. You want major roads (common words), neighborhood names (subwords), and enough detail for any destination (character fallbacks). Multilingual models need maps that cover Tokyo and Paris equally well.' },
    { emoji: '🎨', label: 'Paint Palette', text: 'A painter chooses their palette carefully. Too few colors and you cannot paint subtle gradients. Too many and mixing becomes chaotic. Vocabulary design balances token granularity (colors) with efficiency. Each token in the vocabulary gets its own embedding vector (a learned position in meaning-space), so vocabulary size directly determines the embedding table size — often billions of parameters.' },
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
