import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEMarkdownAndRichTextOutput() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine giving typesetting instructions to a newspaper layout editor. You specify "this is a headline," "this is a bulleted list," "this goes in a two-column table," and "this is a pull quote." The editor follows your instructions to produce a visually structured page.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The most reliable approach to markdown formatting is specifying the exact section structure in your prompt. Rather than asking the model to "format nicely," define the skeleton:  ` Structure your response with these exact sections:' },
    { emoji: '🔍', label: 'In Detail', text: 'LLMs naturally produce markdown because their training data is saturated with it — GitHub READMEs, Stack Overflow answers, documentation sites, and blog posts all use markdown extensively. This means models are remarkably good at markdown formatting when given clear guidance, but they also have strong default habits that can be hard to override.' },
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
