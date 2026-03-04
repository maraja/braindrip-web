import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyContextWindow() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📋', label: 'Whiteboard', text: 'The context window is the model\'s whiteboard — its entire working memory. Everything the model can "see" at once (prompt, conversation history, generated text) must fit on this whiteboard. A 128k context window holds roughly a 300-page book. Once the whiteboard is full, the model cannot consider new information without erasing something. This fixed-size constraint is fundamental to how LLMs work.' },
    { emoji: '🔭', label: 'Telescope View', text: 'A telescope has a fixed field of view. A 4k context window is like a narrow telescope — you see detail but miss the big picture. A 1M context window is a wide-angle lens — you can take in an entire sky but each star gets less individual processing. Expanding the context window is a major engineering challenge because attention cost scales quadratically with window size.' },
    { emoji: '🍽', label: 'Dinner Table', text: 'The context window is like a dinner table with a fixed number of seats. Each token takes one seat. The prompt, system message, conversation history, and the model\'s own output all need seats. If the table seats 8,192 tokens and your prompt uses 7,000, the model only has 1,192 seats left for its response. Managing this table space is a core part of working with LLMs.' },
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
