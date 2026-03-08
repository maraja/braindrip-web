import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEJudgeCalibrationAndValidation() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you buy a kitchen scale. Before trusting it for precise baking, you place a known 500g weight on it. If it reads 480g, you know it has a systematic bias and can either adjust the scale or account for the offset. If it reads 500g today but 520g tomorrow, you know it is unreliable.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The core calibration process:  Assemble a calibration set: 100-500 agent outputs with expert human annotations. Multiple human raters (at least 3) should score each output to establish a reliable ground truth. Run the automated judge on the same outputs, blind to human scores.' },
    { emoji: '🔍', label: 'In Detail', text: 'Judge calibration is that verification step for automated evaluators. An LLM-as-Judge or Agent-as-Judge produces scores, but how do you know those scores are meaningful? Calibration measures the alignment between automated judge scores and human expert judgments.' },
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
