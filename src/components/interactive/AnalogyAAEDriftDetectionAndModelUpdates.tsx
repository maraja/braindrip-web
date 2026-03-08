import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEDriftDetectionAndModelUpdates() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine you own a sailboat that performs perfectly on its first voyage. You change nothing -- same sails, same hull, same rigging. But over the following months, performance subtly degrades. Barnacles accumulate on the hull. Currents shift with the season. The harbor where you dock is reconfigured.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Understanding what causes drift is essential to detecting and responding to it. Model provider updates are the most common and most frustrating source of drift. When your agent calls an LLM API (OpenAI, Anthropic, Google), the model behind that endpoint can change without notice.' },
    { emoji: '🔍', label: 'In Detail', text: 'Drift detection is the practice of continuously monitoring for performance changes that occur without deliberate code modifications. In traditional software, if you do not change the code, behavior does not change. In AI agent systems, this guarantee does not hold. The model behind your API endpoint gets updated.' },
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
