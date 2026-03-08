import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACAutonomousCodingAgents() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a junior developer who never sleeps, never gets frustrated, reads documentation instantly, and can try a hundred different approaches in the time a human tries one. They are not as creative as your best senior engineer, but they handle the grunt work -- bug fixes, test writing, refactoring, boilerplate -- with remarkable consistency.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The core execution pattern: (1) Understand -- read the issue description, explore relevant source files, understand the codebase structure. (2) Plan -- decide which files to modify and what changes to make. (3) Edit -- make the code changes using file editing tools.' },
    { emoji: '🔍', label: 'In Detail', text: 'Coding is an ideal domain for agents because it has a tight feedback loop with objective evaluation. When an agent writes code, it can run the tests immediately and get unambiguous feedback: the tests pass or they do not. This is fundamentally different from, say, a writing agent where quality is subjective.' },
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
