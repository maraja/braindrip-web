import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEOutcomeVsProcessEvaluation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider two students taking a math exam. Student A gets the right answer but copied it from a neighbor. Student B shows rigorous work but makes an arithmetic error in the final step. Outcome evaluation gives Student A full marks and Student B zero. Process evaluation does the opposite. Neither alone captures the full picture.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Outcome evaluation assesses the end-state of the agent\'s execution against success criteria. Common implementations include:  Test-based verification: Run a test suite against the agent\'s output (used by SWE-bench, HumanEval) State comparison: Diff the final environment state against an expected state Constraint satisfaction: Check whether the.' },
    { emoji: '🔍', label: 'In Detail', text: 'In agent evaluation, outcome evaluation checks the final state: did the code pass the tests? Did the file get created correctly? Did the API call return the right data? Process evaluation examines the trajectory: did the agent plan before acting? Did it use tools appropriately? Did it avoid dangerous intermediate states?' },
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
