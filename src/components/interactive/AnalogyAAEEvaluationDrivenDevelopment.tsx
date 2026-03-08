import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEEvaluationDrivenDevelopment() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of evaluation-driven development (EDD) as test-driven development (TDD) adapted for probabilistic, non-deterministic systems. In TDD, you write a failing test, write code to make it pass, then refactor.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The evaluation-driven development cycle has four phases:  #### Phase 1: Failure Collection (Start Here)  Begin by collecting 20-50 real failure cases from your agent\'s target domain.' },
    { emoji: '🔍', label: 'In Detail', text: 'The key insight, championed by teams at Anthropic, OpenAI, and leading agent startups, is that you should not start by building a comprehensive benchmark. You should start by understanding how your agent fails in practice, then build targeted evaluations that measure whether those failures are fixed.' },
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
