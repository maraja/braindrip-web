import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEPromptVersioningAndManagement() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think about how software releases are managed. No serious engineering team deploys code by editing files on a production server and hoping for the best. They use version control (Git), write changelogs, run automated tests, deploy through staging environments, monitor for regressions, and have rollback procedures when something goes wrong.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Prompts should be stored in version control (Git) alongside the application code, or in a dedicated prompt registry that provides versioning functionality. Each prompt version should have a unique identifier, a timestamp, an author, and a description of changes.' },
    { emoji: '🔍', label: 'In Detail', text: 'In practice, most teams manage prompts far less carefully than their code. Prompts live in config files, database rows, or hard-coded strings, with changes tracked informally in Slack messages or not tracked at all.' },
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
