import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMedusa() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🐙', label: 'Octopus Arms', text: 'Normally a model writes with one pen, producing one token at a time. Medusa gives it multiple arms (extra prediction heads), each reaching ahead to guess a different future position simultaneously. A tree-based verification step then picks the longest correct chain. One forward pass, multiple tokens accepted — no separate draft model needed.' },
    { emoji: '🎰', label: 'Slot Machine', text: 'Each Medusa head is like a slot machine reel predicting the next token at different positions. After one pull (forward pass), you check which reels line up with what the model would have actually generated. The longest matching streak from the left becomes your output. Multiple heads mean you often accept 2-4 tokens per step instead of just one.' },
    { emoji: '🌳', label: 'Branching Paths', text: 'Medusa grows a tree of possible continuations from multiple prediction heads. Each head proposes candidates for positions +1, +2, +3 ahead. The model evaluates the whole tree in one pass using a clever attention mask, then walks down the tree to find the longest valid path. It\'s like speculative decoding but self-contained — the extra heads are part of the same model.' },
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
