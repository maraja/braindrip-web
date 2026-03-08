import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAESweBenchDeepDive() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine giving a junior developer a bug report from a real open-source project and asking them to produce a working patch -- with no guidance beyond the issue description and the codebase itself. That is essentially what SWE-bench asks of AI agents.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Each SWE-bench instance consists of:  Repository snapshot -- the codebase checked out at the commit just before the fix Issue description -- the original GitHub issue text (sometimes with additional context) Gold patch -- the human-authored pull request diff (used only to identify relevant tests, not shown to the agent) Test specification -- tests.' },
    { emoji: '🔍', label: 'In Detail', text: 'SWE-bench, introduced by Jimenez et al. at Princeton in 2024, draws tasks from actual GitHub issues across 12 popular Python repositories (Django, Flask, scikit-learn, sympy, matplotlib, and others). Each task provides the agent with the repository at a specific commit, the text of an issue or bug report, and expects a code patch as output.' },
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
