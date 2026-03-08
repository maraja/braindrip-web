import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFRegressionDiagnostics() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'You have fit a linear regression model, obtained coefficients, and computed R^2. Can you trust the results? Regression diagnostics is the practice of systematically checking whether the model\'s assumptions hold and whether individual data points are unduly driving the results.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Residuals e_i = y_i - &#123;y&#125;_i are the primary diagnostic tool. Under correct model specification, residuals should appear as random noise with no discernible pattern. Fitted Values: Plot e_i against &#123;y&#125;_i.' },
    { emoji: '🔍', label: 'In Detail', text: 'Without diagnostics, you risk reporting confidence intervals that are too narrow, p-values that are misleading, and predictions that are unreliable. Diagnostics transform regression from a black-box procedure into a principled statistical analysis.' },
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
