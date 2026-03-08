import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE01Claude4Series() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a highly capable colleague who not only gives excellent advice but can actually sit down at your computer and do the work -- writing code, navigating applications, testing solutions, and coordinating with other specialists when a task requires multiple skill sets.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The Claude 4 generation launched in May 2025 with two models positioned for different use cases:  Claude Opus 4 was designed as the apex model for complex, autonomous tasks. Its standout capability was sustained agentic performance: the ability to work independently for extended periods -- writing code, running tests, debugging, and iterating --.' },
    { emoji: '🔍', label: 'In Detail', text: 'Anthropic\'s trajectory from Claude 3 to Claude 4 reflects a philosophical evolution as much as a technical one. Claude 3 (March 2024) established the Haiku/Sonnet/Opus tiering and demonstrated that safety and capability weren\'t zero-sum. But the 2025 generations dramatically raised the bar on what "capable" meant.' },
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
