import { useState } from 'react';

const DETAILS = [
    { label: 'Memory importance scoring', detail: 'uses the LLM to rate each observation on a 1-10 scale. Calibrating this scale is important: if everything is rated 8+, the recency and relevance signals dominate; if everything is rated 3-, important events are not distinguished from mundane ones' },
    { label: 'Retrieval scoring formula', detail: 'score = alpha  recency + beta  importance + gamma * relevance, where alpha, beta, gamma are tunable weights. Park et al. used equal weights (alpha = beta = gamma = 1) with normalized component scores' },
    { label: 'Reflection frequency', detail: 'triggered when the cumulative importance of new memories since the last reflection exceeds a threshold (e.g., 150 importance points). Too-frequent reflection wastes tokens; too-rare reflection fails to generate useful abstractions' },
    { label: 'Planning granularity', detail: 'top-level plans are 5-8 items spanning the day; each is decomposed into 30-60 minute blocks; each block may be further decomposed into specific actions. Plans are stored in the memory stream and revised when circumstances change' },
    { label: 'Token cost per agent per day', detail: 'simulating one agent\'s full day (plan generation, ~50 observations, ~5 conversations, 1-2 reflections) costs approximately 50K-200K tokens, or 0.15-3.00 depending on model' },
    { label: '25-agent simulation cost', detail: 'Park et al.\'s 2-day simulation with 25 agents consumed approximately 6,000 LLM calls. At current pricing, this would cost $50-300 depending on model selection' },
];

export default function ExplorerAACGenerativeAgents() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Generative Agents \u2014 Key Details Explorer
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
