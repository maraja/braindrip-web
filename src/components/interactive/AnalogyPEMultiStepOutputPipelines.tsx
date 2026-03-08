import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyPEMultiStepOutputPipelines() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of a factory assembly line with inspection stations between steps. Raw materials enter at one end. The first station cuts them to shape, an inspector checks dimensions, the second station welds components together, another inspector checks joints, and so on until the finished product emerges.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Every intermediate output in a pipeline must be reliably parseable by code. This means choosing formats that are both machine-readable and well-suited to the content:  JSON for structured data: extracted fields, classification results, numerical outputs, configuration parameters.' },
    { emoji: '🔍', label: 'In Detail', text: 'Multi-step output pipelines apply this same principle to LLM tasks. Instead of asking a single prompt to do everything — analyze a document, extract data, classify it, generate a summary, and format the report — you decompose the task into discrete steps.' },
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
