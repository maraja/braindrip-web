import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFAutomatedFeatureEngineering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Manual feature engineering is the craft of a skilled practitioner who understands both the data domain and the model\'s inductive biases. But what happens when you have hundreds of tables, thousands of columns, and a deadline of days rather than months?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Deep Feature Synthesis (DFS), implemented in the open-source library Featuretools, is the most systematic approach to automated feature engineering for relational data. It works by:  Defining entities and relationships. The user specifies a set of tables (entities) and the foreign-key relationships between them (e.g.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, automated feature engineering is the algorithmic search over the space of possible feature transformations and compositions. Given raw data tables, an automated system applies a vocabulary of primitive operations (aggregations, transforms, joins) to synthesize candidate features, then filters them for relevance to the prediction task.' },
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
