import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPDataToTextGeneration() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a sports broadcaster reading a box score. The raw data says "Lakers 112, Celtics 108; LeBron James: 31 pts, 8 reb, 6 ast." The broadcaster transforms this into: "The Lakers edged out the Celtics 112--108 in a thriller, led by LeBron James\'s dominant 31-point performance with 8 rebounds and 6 assists.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The oldest and most reliable approach fills in predefined templates with values from the data:  Strengths: Zero hallucination risk, predictable output, easy to maintain, and fast at inference. Production systems in weather reporting (WeatherGov) and financial reporting still rely on templates.' },
    { emoji: '🔍', label: 'In Detail', text: 'Data-to-text generation (D2T) is the task of automatically producing natural language text from structured data inputs -- tables, knowledge graph triples, spreadsheets, or database records. Unlike open-ended text generation, D2T is grounded: every claim in the output should be verifiable against the input data.' },
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
