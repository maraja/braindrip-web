import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyScalableOversight() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '👩‍⚖️', label: 'Judicial System', text: 'A single judge can\'t oversee every dispute in a nation, so we build a judicial system: lower courts, appeals, precedents, and rules that scale oversight. Scalable oversight asks: how do we supervise AI systems that are too capable for any single human to fully evaluate? Techniques like debate (two AIs argue, human judges), recursive reward modeling, and constitutional AI attempt to scale human judgment beyond direct evaluation.' },
    { emoji: '🏗️', label: 'Building Inspection Hierarchy', text: 'As buildings get taller and more complex, a single inspector can\'t check everything. You need specialized inspectors, sampling strategies, automated sensors, and hierarchical review. Scalable oversight faces the same challenge for AI: as models become superhuman at certain tasks, we need new methods to verify their outputs — using AI assistants to help evaluate AI, structured decomposition, and market-based verification.' },
    { emoji: '📋', label: 'Audit & Compliance', text: 'Large companies are audited through sampling, automated checks, and process verification — not by reviewing every transaction. Scalable oversight applies similar thinking to AI: we can\'t review every model output, but we can create processes where AI helps humans oversee AI, where models explain their reasoning for spot-checks, and where the oversight system scales with the AI\'s capabilities.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
