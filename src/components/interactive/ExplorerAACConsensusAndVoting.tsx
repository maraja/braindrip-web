import { useState } from 'react';

const DETAILS = [
    { label: 'Optimal N (number of voters)', detail: '3-7 voters provide the best cost-accuracy trade-off for most tasks. Beyond 7, marginal accuracy gains diminish while cost scales linearly. Use odd numbers to avoid ties.' },
    { label: 'Temperature for self-consistency', detail: 'Higher temperature (0.7-1.0) produces more diverse samples, improving the voting effect. Temperature 0 (greedy) produces identical samples, making voting pointless. The optimal temperature depends on the task and model.' },
    { label: 'Error correlation', detail: 'The voting advantage degrades as error correlation increases. If all agents make the same mistake (due to shared training data or similar prompts), voting cannot correct it. Maximizing diversity — different prompts, different models, different reasoning approaches — improves error independence.' },
    { label: 'Cost', detail: 'N-sample voting costs N times the inference of a single sample. For production systems, this means 3-7x the API cost. This is justified for high-stakes decisions and can be mitigated by using cheaper models for voting and reserving expensive models for tie-breaking.' },
    { label: 'Tie-breaking', detail: 'When no majority exists (e.g., 5 agents produce 5 different answers), strategies include: pick the answer with the most detailed reasoning, consult a separate judge model, ask a human, or increase N. Ties are more common for genuinely ambiguous questions.' },
    { label: 'Latency', detail: 'Voting samples can be generated in parallel, so wall-clock latency is similar to a single sample (assuming the API supports concurrent requests). This makes voting a pure cost trade-off, not a latency trade-off.' },
];

export default function ExplorerAACConsensusAndVoting() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Consensus and Voting \u2014 Key Details Explorer
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
