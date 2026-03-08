import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFModelDeploymentAndServing() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Training a model is like writing a recipe. Deployment and serving is opening the restaurant. The recipe might be perfect, but the restaurant needs a kitchen (infrastructure), wait staff (APIs), quality control (monitoring), and the ability to handle a dinner rush (scaling).' },
    { emoji: '⚙️', label: 'How It Works', text: 'Batch Inference: Run the model on a large dataset on a schedule (hourly, daily, weekly). Predictions are stored in a database or data warehouse and served to users via lookup. Best for: Recommendations pre-computed overnight, risk scores updated daily, reports generated weekly.' },
    { emoji: '🔍', label: 'In Detail', text: 'Model deployment is the process of moving a trained model from a development environment into a production system where it makes predictions on new data. Model serving is the runtime infrastructure that executes inference requests.' },
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
