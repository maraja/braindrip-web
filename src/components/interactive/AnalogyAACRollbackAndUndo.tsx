import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACRollbackAndUndo() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine writing a document without an undo button. Every typo, every deleted paragraph, every formatting mistake is permanent. You would write incredibly carefully, incredibly slowly, and still make irreversible errors. The undo button transforms writing from a high-stakes, anxiety-inducing activity into a fluid, experimental process.' },
    { emoji: '⚙️', label: 'How It Works', text: 'For file-based operations, version control provides natural rollback. Before an agent modifies files, it creates a commit (or saves a snapshot). If the modifications are wrong, a simple git revert or restore restores the previous state.' },
    { emoji: '🔍', label: 'In Detail', text: 'When an AI agent takes actions in the real world -- modifying files, updating databases, sending messages, creating resources -- those actions have consequences. Some consequences are easily reversible (deleting a file that exists in version control). Some are difficult but possible to reverse (retracting a sent email).' },
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
