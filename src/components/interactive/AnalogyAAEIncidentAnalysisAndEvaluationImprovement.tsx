import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEIncidentAnalysisAndEvaluationImprovement() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of aviation safety. Every plane crash, every near-miss, every mechanical anomaly is meticulously investigated, classified, and fed back into training programs, maintenance procedures, and aircraft design. The aviation industry does not just fix the broken plane -- it asks "why didn\'t our existing safety systems prevent this?' },
    { emoji: '⚙️', label: 'How It Works', text: 'Structured post-incident analysis follows a consistent process, ideally completed within 48 hours of incident detection while details are fresh. Root cause identification traces the failure back to its origin.' },
    { emoji: '🔍', label: 'In Detail', text: 'Incident analysis for AI agents follows the same philosophy. When an agent fails in production -- providing dangerous medical advice, executing an irreversible action incorrectly, hallucinating a critical fact -- the response should go far beyond patching the immediate problem.' },
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
