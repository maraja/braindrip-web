import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAERealWorldVsSyntheticBenchmarks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine two approaches to testing whether a self-driving car can navigate city streets. Approach one: record real drives through actual cities and replay them as evaluation scenarios, with all the unpredictability, construction zones, and jaywalking pedestrians that entails.' },
    { emoji: '⚙️', label: 'How It Works', text: 'SWE-bench is the canonical example. Tasks come directly from merged pull requests on popular Python repositories. The process:  Scrape merged PRs from repositories with good test coverage Extract the issue description, pre-fix codebase snapshot, and post-fix tests Validate that the issue is solvable from the description alone Package as a.' },
    { emoji: '🔍', label: 'In Detail', text: 'Real-world benchmarks draw tasks from naturally occurring data. SWE-bench pulls from actual GitHub issues. GAIA uses questions answerable through real web research. Cline Bench uses snapshots of genuine software projects. These benchmarks inherit the complexity, ambiguity, and distribution of actual work.' },
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
