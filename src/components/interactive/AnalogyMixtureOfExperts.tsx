import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMixtureOfExperts() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏥', label: 'Hospital Specialists', text: 'A hospital has many specialists (experts), but for each patient (token), only 2-3 relevant ones are consulted. A triage nurse (router/gating network) examines the patient and sends them to the cardiologist and neurologist, not the dermatologist. This means the hospital can have 64 specialists (massive total parameters) while each patient visit only costs 2 doctor appointments (active parameters).' },
    { emoji: '📞', label: 'Call Center', text: 'A call center has agents specializing in billing, tech support, shipping, and returns. A routing system (gating network) listens to each caller and routes them to the top 2 most relevant agents. The center has 100 agents total but only 2 handle each call. This is how MoE models have trillion-parameter capacity with the compute cost of a much smaller model.' },
    { emoji: '🍽', label: 'Food Court', text: 'A food court has many restaurants (experts), but each diner (token) only eats at 1-2 of them. The gating network is like your appetite deciding between the sushi bar and taco stand. The food court is enormous (total params), but your bill (compute) only reflects the restaurants you visited (active experts). Load balancing ensures no single restaurant gets overwhelmed.' },
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
