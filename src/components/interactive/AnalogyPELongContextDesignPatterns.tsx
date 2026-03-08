import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPELongContextDesignPatterns() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of organizing a filing cabinet. A small filing cabinet with two drawers works intuitively — you can find anything quickly because there is not much to search through. But a room-sized filing system with 50 cabinets and hundreds of drawers requires an entirely different organizational strategy.' },
    { emoji: '⚙️', label: 'How It Works', text: 'When placing many documents in a long context, ordering strategy becomes critical. The lost-in-the-middle effect is amplified in long contexts — documents placed in the 40K-80K token range of a 128K context receive significantly less attention than those at the beginning or end.' },
    { emoji: '🔍', label: 'In Detail', text: 'Long-context LLM design faces the same paradox. Models now support 128K, 200K, and even 1M+ token context windows, allowing entire codebases, book-length documents, and extensive knowledge bases to be included. But more context does not automatically mean better performance.' },
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
