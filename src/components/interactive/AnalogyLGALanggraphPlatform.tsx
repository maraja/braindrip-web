import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLGALanggraphPlatform() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Think of the difference between cooking at home and opening a restaurant. When you cook at home (self-hosted FastAPI), you control everything but also handle everything -- the stove, the plumbing, the health inspections.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The deployment process starts with your langgraph.json configuration file and a GitHub repository:' },
    { emoji: '🔍', label: 'In Detail', text: 'Traditional hosting platforms (Heroku, Railway, generic container services) are built for stateless, short-lived HTTP request-response cycles. AI agents are fundamentally different: they maintain state across interactions, run long-lived executions that can span minutes or hours, require persistent checkpointing, and need specialized features like.' },
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
