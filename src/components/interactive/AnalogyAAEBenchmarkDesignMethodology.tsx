import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEBenchmarkDesignMethodology() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine designing a driving test. You need to decide which maneuvers to include (parallel parking? highway merging? night driving?), where the test takes place (closed course or real roads?), how to score it (binary pass/fail or graded?), and how to prevent people from memorizing the route.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The foundation of any benchmark is its task set. Critical decisions include:  Real vs. synthetic tasks: Real tasks (like SWE-bench\'s GitHub issues) have high ecological validity but come with contamination risk and messy edge cases.' },
    { emoji: '🔍', label: 'In Detail', text: 'A well-designed benchmark produces scores that are meaningful, reliable, and actionable. A poorly designed one produces numbers that mislead -- rewarding gaming over genuine capability, saturating before the problem is solved, or measuring something different from what it claims.' },
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
