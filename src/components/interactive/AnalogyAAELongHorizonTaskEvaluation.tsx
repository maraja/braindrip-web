import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAELongHorizonTaskEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider the difference between evaluating a sprinter and a marathon runner. For the sprinter, you need a stopwatch and a finish line. For the marathon runner, you need intermediate checkpoints, pacing analysis, nutrition strategy assessment, injury monitoring, and adaptation to changing weather conditions.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Context persistence across sessions. Long tasks inevitably span multiple agent invocations. Between sessions, the agent must maintain relevant context: what has been accomplished, what approaches were tried, what remains to be done.' },
    { emoji: '🔍', label: 'In Detail', text: 'Most current agent benchmarks test tasks completable in seconds to minutes: answer a question, write a function, navigate a website. But the highest-value agent applications involve tasks spanning much longer timeframes -- conducting a multi-day research project, maintaining a codebase over weeks, monitoring a system for anomalies over months.' },
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
