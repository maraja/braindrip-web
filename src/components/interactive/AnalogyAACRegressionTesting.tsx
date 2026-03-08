import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAACRegressionTesting() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a hospital where every time a doctor prescribes a new medication for a patient, nobody checks whether it interacts badly with the patient\'s existing medications. Eventually, a new prescription causes a dangerous interaction that would have been easily caught by checking against the existing regimen.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A regression test suite consists of representative tasks spanning the agent\'s capabilities, with defined expected outcomes. Tasks are selected to cover: core capabilities (the most common and important tasks), edge cases (boundary conditions that have caused problems before), previously fixed bugs (tasks that triggered past failures, to prevent.' },
    { emoji: '🔍', label: 'In Detail', text: 'In traditional software, regression testing is well-established: you maintain a test suite, run it after every code change, and investigate any failures. For AI agents, regression testing is both more important and more challenging.' },
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
