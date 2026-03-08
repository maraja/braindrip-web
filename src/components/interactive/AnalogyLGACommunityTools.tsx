import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGACommunityTools() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Building every tool from scratch is like insisting on growing your own wheat before making a sandwich. The LangChain community has already built and packaged dozens of tools for common tasks — searching the web, querying Wikipedia, running Python code, calling REST APIs, and more.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Tavily returns structured results with url, content, and title fields, making them easy for the LLM to parse and cite.' },
    { emoji: '🔍', label: 'In Detail', text: 'The ecosystem is split across several packages. Core integrations live in langchain-community, while more experimental or specialized tools are in langchain-experimental. Some high-quality integrations have their own dedicated packages, like langchain-tavily for web search.' },
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
