import { useState } from 'react';

const DETAILS = [
    { label: 'Atomic action boundaries', detail: 'Each agent action should be an atomic unit that can be independently rolled back. If an action involves multiple sub-steps (create file, write content, set permissions), they should be wrapped together so rollback reverts all sub-steps or none.' },
    { label: 'Rollback time window', detail: 'Rollback becomes harder over time as dependent actions accumulate. A file change that happened 5 minutes ago is easy to revert; one from 3 weeks ago may have downstream dependencies. Systems should define a rollback window (typically 1-24 hours) within which rollback is guaranteed to be safe.' },
    { label: 'Irreversibility classification', detail: 'Each tool should be tagged with its reversibility: fully reversible (file write with version control), partially reversible (email with recall capability), or irreversible (financial transaction, social media post).' },
    { label: 'Compensating action registry', detail: 'For each forward action type, the system maintains a registered compensating action. This registry is checked at deployment time to ensure all agent actions have defined rollback paths. Actions without compensating actions are flagged as irreversible.' },
    { label: 'State consistency verification', detail: 'After rollback, the system verifies that the state is actually consistent. A rollback might succeed technically but leave related systems out of sync. Post-rollback verification checks cross-system consistency.' },
    { label: 'Rollback testing', detail: 'Rollback mechanisms must be tested regularly. A rollback path that has never been executed may not work when needed. Include rollback scenarios in integration tests.' },
];

export default function ExplorerAACRollbackAndUndo() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Rollback and Undo \u2014 Key Details Explorer
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
