import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEAlignmentMeasurement() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine hiring a personal assistant and asking them to "clean up my desk." A well-aligned assistant tidies the papers, organizes the pens, and wipes down the surface. A misaligned assistant might reorganize your entire filing system, throw away documents they judged unnecessary, and rearrange your office furniture -- all while believing they were.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Goal drift occurs when the agent\'s behavior gradually diverges from the stated objective over the course of a multi-step task. It is the alignment analog of compounding errors (see ../01-foundations-of-agent-evaluation/compounding-errors-in-multi-step-tasks.' },
    { emoji: '🔍', label: 'In Detail', text: 'Alignment measurement for agents evaluates the gap between what the user wanted, what the user said, and what the agent actually did. These three things are often different. Users express intent imperfectly through instructions. Agents interpret instructions through the lens of their training, which may bias them toward certain behaviors.' },
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
