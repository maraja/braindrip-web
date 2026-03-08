import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEContextAssemblyPatterns() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a DJ building a setlist based on the crowd\'s energy. The DJ has a vast library of tracks, but each set is assembled in real time — reading the room, selecting tracks that match the current mood, transitioning smoothly between songs, and adapting when the energy shifts.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest context assembly pattern uses fixed templates with variable slots. The template defines the structure; variables are filled at runtime:  Static templates work well for applications with predictable context structures.' },
    { emoji: '🔍', label: 'In Detail', text: 'Context assembly works the same way. Your application has access to system prompts, user preferences, conversation histories, knowledge bases, tool definitions, and examples. At runtime — when a user sends a query — the context assembly system selects from these sources, formats the selections, and arranges them into the context window.' },
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
