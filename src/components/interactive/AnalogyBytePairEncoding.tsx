import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyBytePairEncoding() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📱', label: 'Text Shortcuts', text: 'BPE is like how texters create shortcuts: if "lol" appears often, it becomes one symbol. BPE starts with individual characters, then repeatedly merges the most frequent adjacent pair into a new symbol. After thousands of merges, "t"+"h"+"e" becomes "the" (one token), while rare words stay as character pieces. The merge order is the vocabulary.' },
    { emoji: '🏗', label: 'Building Blocks', text: 'Start with the smallest blocks (individual bytes/characters). Look at your entire training corpus and find which two blocks appear next to each other most often — say "t" and "h." Glue them into "th." Repeat: "th"+"e" becomes "the." Keep merging until you hit your target vocabulary size. The result: common words are single tokens, rare words decompose into known pieces.' },
    { emoji: '🗜', label: 'ZIP Compression', text: 'BPE was originally a compression algorithm. It is like a dictionary-based compressor that finds repeated patterns and replaces them with shorter codes. The most frequent byte pairs get merged first (best compression). Applied to text, this creates a vocabulary where common subwords are single tokens and the total sequence length is minimized — exactly what makes models efficient.' },
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
