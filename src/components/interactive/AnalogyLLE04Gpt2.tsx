import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04Gpt2() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a student who has read so much — millions of web pages, thousands of books, endless articles — that when you give them a test on a subject they\'ve never explicitly studied, they can still produce reasonable answers just by drawing on everything they\'ve absorbed.' },
    { emoji: '⚙️', label: 'How It Works', text: 'GPT-2 used the same decoder-only Transformer architecture as 02-gpt-1.md, with several refinements:  Architectural changes from GPT-1: layer normalization was moved to the input of each sub-layer (pre-norm, rather than post-norm), an additional layer normalization was added after the final self-attention block, residual layer weights were scaled.' },
    { emoji: '🔍', label: 'In Detail', text: 'In February 2019, OpenAI published "Language Models are Unsupervised Multitask Learners," introducing GPT-2 — a scaled-up version of 02-gpt-1.md with 10x more parameters and 10x more training data.' },
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
