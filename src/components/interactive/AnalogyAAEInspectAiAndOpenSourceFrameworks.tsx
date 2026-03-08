import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEInspectAiAndOpenSourceFrameworks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of Inspect AI as a laboratory workbench for AI agent evaluation. Just as a well-designed lab has standardized equipment -- beakers, pipettes, centrifuges -- that researchers combine in different ways to run experiments, Inspect AI provides standardized building blocks that evaluators compose to assess any agent behavior.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Inspect AI decomposes every evaluation into four composable primitives:  Tasks define what to evaluate. A Task bundles together a dataset, a solver pipeline, and one or more scorers. Tasks are the top-level unit of evaluation -- you run a Task, and you get back scored results.' },
    { emoji: '🔍', label: 'In Detail', text: 'Inspect AI was developed by the UK AI Safety Institute (AISI) as a MIT-licensed framework for evaluating large language models and AI agents. It has become the de facto standard for safety evaluation, adopted by organizations including METR (Model Evaluation and Threat Research) and Apollo Research.' },
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
