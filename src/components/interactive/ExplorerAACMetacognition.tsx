import { useState } from 'react';

const DETAILS = [
    { label: 'Calibration measurement', detail: 'Compare the agent\'s stated confidence (e.g., "I\'m 80% sure") with actual accuracy. Well-calibrated agents are right 80% of the time when they say 80%. LLMs tend to be overconfident; explicit calibration prompting helps' },
    { label: 'Abstention rate', detail: 'The percentage of questions where the agent declines to answer or defers to a human. Too low suggests insufficient metacognition; too high suggests excessive caution. Optimal rates depend on the domain (medical: high abstention; general knowledge: lower)' },
    { label: 'Implementation via system prompts', detail: '"Before answering, consider: (1) Do I have reliable knowledge about this topic? (2) Is the question ambiguous? (3) Could my answer cause harm if wrong? If any answer is concerning, communicate your uncertainty."' },
    { label: 'Metacognitive overhead', detail: 'Adding explicit confidence assessment costs 50-200 tokens per response. This is negligible compared to the cost of recovering from confident errors' },
    { label: 'Dunning-Kruger in LLMs', detail: 'LLMs sometimes exhibit the inverse of the Dunning-Kruger effect: they are less confident on topics they actually know well (because they are aware of nuances) and more confident on topics they know less about (because they are unaware of what they are missing)' },
    { label: 'Calibration degrades with pressure', detail: 'When prompted to "always provide an answer" or "be helpful," models become less calibrated. Metacognitive prompting must explicitly give the model permission to express uncertainty' },
];

export default function ExplorerAACMetacognition() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Metacognition \u2014 Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DETAILS.map((d, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} style={{
            textAlign: 'left' as const, background: open === i ? '#F0EBE1' : '#FDFBF7', border: '1px solid #E5DFD3',
            borderRadius: '10px', padding: '0.875rem 1rem', cursor: 'pointer', width: '100%', transition: 'background 0.2s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '0.95rem', fontWeight: 600, color: '#2C3E2D' }}>
                {d.label}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#7A8B7C', transform: open === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }}>
                &#9654;
              </span>
            </div>
            {open === i && (
              <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: '0.5rem 0 0 0' }}>
                {d.detail}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
