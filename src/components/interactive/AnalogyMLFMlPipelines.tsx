import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFMlPipelines() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of an ML pipeline like an assembly line in a factory. Raw materials (data) enter at one end, pass through a sequence of processing stations (transformations, feature engineering, training), and a finished product (deployed model) exits at the other end.' },
    { emoji: '⚙️', label: 'How It Works', text: 'A production ML pipeline typically consists of six stages:  Data Ingestion -- Pull data from databases, APIs, data lakes, or streaming sources. This stage handles schema validation and initial quality checks. Data Validation -- Verify statistical properties of incoming data.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, an ML pipeline is a directed acyclic graph (DAG) of computational steps that transforms raw data into a trained, validated, and deployable model. Each node in the DAG represents an idempotent operation with defined inputs and outputs, enabling reproducibility, automation, and auditability.' },
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
