import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyAAEToolUseBenchmarks() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine hiring a contractor and evaluating them not just on whether the house got built, but on whether they picked the right tools for each job -- using a level instead of eyeballing it, choosing the correct drill bit for each material, knowing when to call in a specialist.' },
    { emoji: '⚙️', label: 'How It Works', text: 'tau-bench (Yao et al., 2024) evaluates tool-augmented agents in dynamic, conversational settings across three domains:  Retail: Order management, returns processing, product lookup, inventory checking Airline: Flight booking, seat selection, itinerary changes, loyalty program management Telecom: Plan changes, billing inquiries, service activation,.' },
    { emoji: '🔍', label: 'In Detail', text: 'Tool use is the capability that separates language models from agents. A language model can discuss how to query a database; an agent actually invokes the query, interprets the results, and acts on them.' },
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
