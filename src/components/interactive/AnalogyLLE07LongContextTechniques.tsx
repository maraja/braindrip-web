import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE07LongContextTechniques() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine trying to write a book report after reading only one page at a time, forgetting the previous page as soon as you turn to the next. That was early LLMs: BERT could see 512 tokens (roughly a paragraph), GPT-3 could see 2048 (about 1.5 pages).' },
    { emoji: '⚙️', label: 'How It Works', text: 'The first bottleneck was positional encoding. Models with learned positional embeddings (GPT-2: 1024 positions, GPT-3: 2048) had a hard ceiling: no embedding existed for positions beyond the training maximum. Sinusoidal encodings theoretically generalized but degraded rapidly.' },
    { emoji: '🔍', label: 'In Detail', text: 'Long context is not just "more tokens." It enables qualitatively different applications: analyzing entire codebases, summarizing book-length documents, maintaining multi-hour conversations, processing video transcripts, and reasoning over large databases of evidence.' },
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
