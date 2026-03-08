import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFXgboostLightgbmCatboost() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'If gradient boosting is the blueprint for a race car, then XGBoost, LightGBM, and CatBoost are three high-performance builds of that car, each engineered with different design philosophies to maximize speed, accuracy, and reliability.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Introduced by Tianqi Chen in 2016, XGBoost was the first library to make gradient boosting both fast and scalable. Regularized objective. XGBoost augments the loss with explicit regularization on tree complexity:  [equation]  where J is the number of leaves, w_j are leaf weights,  penalizes tree complexity (number of leaves), and  is L2.' },
    { emoji: '🔍', label: 'In Detail', text: 'These three libraries have collectively dominated tabular machine learning since 2016, powering the majority of winning solutions on Kaggle and serving as workhorses in production systems across industry.' },
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
