import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPGptForNlpTasks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a prodigiously well-read author who has consumed millions of books, articles, and web pages. You hand them a few examples of a task -- say, translating English to French -- written on a notecard.' },
    { emoji: '⚙️', label: 'How It Works', text: 'GPT-1 used a 12-layer transformer decoder (117M parameters) pre-trained on BooksCorpus (7,000 unpublished books, ~800M tokens) with a standard causal language modeling objective:  Each position can only attend to positions to its left (causal masking), enforcing autoregressive generation.' },
    { emoji: '🔍', label: 'In Detail', text: 'GPT (Generative Pre-trained Transformer), developed by OpenAI, is a family of autoregressive language models built on the decoder-only transformer architecture. Unlike bert.md, which is an encoder trained with masked language modeling, GPT models predict the next token given all preceding tokens -- pure left-to-right generation.' },
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
