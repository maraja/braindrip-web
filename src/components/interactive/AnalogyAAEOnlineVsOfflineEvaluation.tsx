import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEOnlineVsOfflineEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of it like testing a new hire. Offline evaluation is the interview process: standardized questions, controlled conditions, a quiet conference room. You learn a lot, but you cannot fully predict how the candidate will perform in the chaos of actual work.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Offline evaluation pipelines typically follow a standardized pattern. A curated dataset of input-output pairs (or input-trajectory pairs for agentic systems) is maintained in version control. Each candidate agent version runs against this dataset in a sandboxed environment with mocked or recorded external dependencies.' },
    { emoji: '🔍', label: 'In Detail', text: 'Offline evaluation runs agents against pre-collected, fixed datasets in a controlled environment before deployment. Inputs, expected outputs, and environmental conditions are known and reproducible. You can run the same evaluation hundreds of times, compare results across model versions, and catch regressions with high confidence.' },
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
