import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyModelRouting() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🏥', label: 'Hospital Triage', text: 'An ER nurse triages patients: minor cuts go to the clinic, serious cases to specialists, critical cases to the top surgeon. Model routing does the same for queries — simple questions go to a cheap, fast small model; complex reasoning tasks go to a powerful (expensive) large model. A lightweight classifier decides which model handles each request, optimizing the cost-quality tradeoff.' },
    { emoji: '📞', label: 'Call Routing', text: 'A phone system routes "check my balance" to an automated bot and "dispute a charge" to a human agent. Model routing classifies incoming prompts by difficulty and routes them to the appropriate model tier. Easy queries (80% of traffic) go to a fast 7B model for pennies; hard queries go to GPT-4-class models. Overall costs drop dramatically with minimal quality loss.' },
    { emoji: '🚗', label: 'Right Vehicle', text: 'You don\'t drive a semi-truck to pick up groceries or a Smart car to haul lumber. Model routing picks the right-sized model for each task. A router (which can be a small classifier, an LLM, or even simple rules) evaluates the query complexity and dispatches it to the most cost-efficient model that can handle it well. It\'s about matching capability to need.' },
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
