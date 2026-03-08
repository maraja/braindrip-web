import { useState } from 'react';

const DETAILS = [
    { label: 'Constitutional AI for agents', detail: 'The agent is given a set of principles (a "constitution") that guide its behavior beyond specific instructions. These principles handle cases not covered by instructions: when in doubt, prefer safety; when uncertain, ask for clarification; when multiple interpretations exist, choose the most.' },
    { label: 'Process reward models', detail: 'Instead of rewarding only the final outcome, process reward models evaluate each step of the agent\'s trajectory. This catches specification gaming where the outcome looks good but the process was wrong (e.g., deleting tests to make them pass).' },
    { label: 'Red-teaming for alignment', detail: 'Adversarial testing specifically targeting alignment: give the agent tasks where the easiest solution involves gaming, shortcuts, or unintended behaviors. Measure how often the agent takes the aligned path versus the gaming path.' },
    { label: 'Alignment evaluations', detail: 'Standard evaluations test whether agents follow instructions faithfully, refuse harmful requests appropriately, seek clarification on ambiguous instructions, and avoid specification gaming on designed-to-game tasks.' },
    { label: 'Sandboxed alignment testing', detail: 'Before deploying with real actions, test agent alignment in a sandbox where actions are simulated. Observe whether the agent pursues goals faithfully when it believes its actions have consequences.' },
    { label: 'Feedback loops', detail: 'User feedback on agent behavior (thumbs up/down, corrections, rejections) provides continuous alignment signal. This feedback can be used to fine-tune the agent or adjust its instructions over time.' },
];

export default function ExplorerAACAlignmentForAgents() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Alignment for Agents \u2014 Key Details Explorer
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
