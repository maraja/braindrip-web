import { useState } from 'react';

const DETAILS = [
    { label: 'SWE-bench', detail: 'uses Docker containers with pre-configured Python environments, specific library versions, and repository snapshots. Each instance takes 30-120 seconds to set up, and evaluation runs the test patch in the container' },
    { label: 'WebArena', detail: 'runs self-hosted instances of GitLab, Reddit (a clone), a shopping site, OpenStreetMap, and a CMS on a single server using Docker Compose. Total setup requires ~16GB RAM and takes 30 minutes' },
    { label: 'OSWorld', detail: 'provides VirtualBox VMs running Ubuntu, Windows, or macOS, with pre-configured applications and file states for 369 computer use tasks' },
    { label: 'GAIA', detail: '(General AI Assistants) tests multi-step, multi-tool tasks at three difficulty levels, requiring web search, file analysis, and reasoning. Level 1 tasks: ~90% human accuracy, ~30% best agent accuracy. Level 3 tasks: ~95% human accuracy, ~0-5% best agent accuracy' },
    { label: 'Environment fidelity', detail: 'higher fidelity (more realistic simulation) improves transfer to real deployment but increases setup cost and complexity. The right fidelity level depends on the agent\'s task domain' },
    { label: 'Evaluation metrics', detail: 'vary by benchmark: SWE-bench uses binary pass/fail (test patch passes or not), WebArena uses task completion rate (binary per task), OSWorld uses success rate with partial credit for multi-step tasks' },
];

export default function ExplorerAACSimulationEnvironments() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Simulation Environments — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of simulation environments.
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
