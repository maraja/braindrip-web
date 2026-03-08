import { useState } from 'react';

const DETAILS = [
    { label: 'Depth vs. breadth trade-off', detail: 'Deeper hierarchies (more levels) provide finer-grained decomposition but increase communication overhead and latency. Wider hierarchies (more agents per level) enable more parallelism but increase the manager\'s coordination burden. Most practical systems use 2-3 levels with 3-7 agents per manager.' },
    { label: 'Communication protocol', detail: 'Define structured formats for downward communication (task specifications) and upward communication (status reports, results, escalations). Unstructured natural language between levels leads to information loss and misinterpretation.' },
    { label: 'Shared artifacts', detail: 'Hierarchical systems often need shared artifacts (a codebase, a document, a database) that multiple workers modify. Conflict resolution — what happens when two workers edit the same file — must be handled explicitly, either through locking, merge strategies, or sequential access.' },
    { label: 'Cost scaling', detail: 'A 3-level hierarchy with 5 agents per level involves 1 + 5 + 25 = 31 agents. Even if most are short-lived, the token cost of spawning, instructing, and collecting results from all agents is substantial. Budget management across levels is essential.' },
    { label: 'Goal drift', detail: 'As instructions pass through levels, they can subtly shift. The orchestrator\'s intent may be slightly reinterpreted by the manager and further reinterpreted by the worker. Mitigate by passing the original goal description to all levels alongside the specific task.' },
    { label: 'Parallel execution within levels', detail: 'Workers under the same manager can often execute in parallel. Managers under the same orchestrator may also execute in parallel if their workstreams are independent. Exploiting this parallelism reduces total execution time.' },
];

export default function ExplorerAACHierarchicalAgentSystems() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Hierarchical Agent Systems \u2014 Key Details Explorer
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
