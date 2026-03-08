import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGAWhatIsLanggraph() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of LangGraph as a railroad switching yard. Each track section (node) performs a specific job — loading cargo, inspecting cars, coupling engines — and the switches (edges) determine which track a train follows next. The shared manifest traveling with the train (state) keeps every station informed about what has happened so far.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every LangGraph application is built from three pieces:  State — a shared data object (typically a TypedDict) that flows through the graph. Nodes — Python functions that read state, do work, and return updates. Edges — connections that determine which node runs next.' },
    { emoji: '🔍', label: 'In Detail', text: 'LangGraph is a Python (and TypeScript) framework built by the LangChain team for constructing stateful, multi-step AI agent applications. While it shares a parent organization with LangChain, it is a standalone library — you can use it without importing anything from langchain.' },
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
