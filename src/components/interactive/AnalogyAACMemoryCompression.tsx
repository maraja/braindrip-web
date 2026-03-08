import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACMemoryCompression() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how a historian writes about a decade of events. They do not reproduce every newspaper article, every speech, every meeting transcript from the 2010s. Instead, they compress: major events are described in paragraphs, minor events in sentences, and most events are omitted entirely.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most straightforward compression technique: use an LLM to generate a summary of a block of conversation or memory content. Single-pass summarization: Take a block of text (e.g., 5000 tokens of conversation history) and produce a summary (e.g., 500 tokens):  Compression ratio: Typical ratios are 5:1 to 20:1.' },
    { emoji: '🔍', label: 'In Detail', text: 'Memory compression for agents is the same principle applied to information stored in and retrieved from memory systems. As agents operate over long conversations or many sessions, the accumulated information far exceeds what fits in the context window.' },
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
