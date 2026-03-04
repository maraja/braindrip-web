import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyProcessRewardModels() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📝', label: 'Step-by-Step Grading', text: 'An outcome reward model is like grading only the final answer on a math test. A process reward model grades every step of the work. "Step 1: correct. Step 2: correct. Step 3: error — you divided instead of multiplying." This step-level feedback is far more informative: the model learns exactly where reasoning went wrong, not just that the final answer was wrong.' },
    { emoji: '🗺', label: 'GPS Navigation', text: 'An outcome reward model is like only knowing if you reached your destination. A process reward model is GPS that evaluates every turn: "Good turn here, wrong turn there." PRMs provide dense, step-level rewards for reasoning chains. This helps the model learn which reasoning steps are valid and where errors creep in, dramatically improving math and logic performance over sparse outcome-only rewards.' },
    { emoji: '🏗', label: 'Building Inspector', text: 'An outcome reward model checks if the building stands (final answer correct). A process reward model inspects every floor during construction: foundation solid? Second floor level? Wiring safe? By scoring each reasoning step independently, PRMs catch errors early and credit good intermediate reasoning even when the final answer is wrong due to a late mistake. This makes credit assignment much more precise.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
