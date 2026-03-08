import { useState } from 'react';

const DETAILS = [
    { label: 'Branching factor tolerance', detail: 'MCTS handles branching factors of 250+ (Go), compared to ~35 for chess. This is possible because MCTS samples actions rather than enumerating them.' },
    { label: 'Simulation count', detail: 'AlphaGo used ~100,000 simulations per move; AlphaZero used ~800 simulations per move (but with a stronger network). Even 50-100 simulations provide meaningful improvement over the raw network policy.' },
    { label: 'Temperature-based action selection', detail: 'At the root, actions are selected proportionally to N(s,a)^&#123;1/&#125; where  is a temperature parameter. Early in the game  = 1 encourages exploration; later   0 selects the most-visited action deterministically.' },
    { label: 'Virtual loss', detail: 'For parallel MCTS, a "virtual loss" is subtracted when a thread begins traversing a path, discouraging other threads from following the same path. This enables efficient parallelization across many cores.' },
    { label: 'Transpositions', detail: 'Standard MCTS uses a tree, but some implementations use a directed acyclic graph (DAG) to handle transpositions -- different action sequences reaching the same state.' },
    { label: 'Dirichlet noise', detail: 'AlphaZero adds Dirichlet noise to the root prior: P\'(a) = (1 - ) P(a|s) +   _a, where   Dir() with  = 0.03 for Go, ensuring root-level exploration during self-play.' },
];

export default function ExplorerRLMonteCarloTreeSearch() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Monte Carlo Tree Search \u2014 Key Details Explorer
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
