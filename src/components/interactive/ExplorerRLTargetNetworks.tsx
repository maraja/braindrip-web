import { useState } from 'react';

const DETAILS = [
    { label: 'Hard update frequency', detail: 'DQN uses $C = 10{,}000$ gradient steps. Values too small (e.g., $C = 100$) provide insufficient stability; values too large (e.g., $C = 100{,}000$) cause the target to lag excessively behind the learned value.' },
    { label: 'Soft update rate', detail: '$\\tau = 0.005$ is standard for continuous-control algorithms (DDPG, TD3, SAC). Larger $\\tau$ values track faster but provide less stability.' },
    { label: 'Hard vs. soft', detail: 'Hard updates are simpler but create discontinuities when the target network suddenly jumps. Soft updates are smoother but add a hyperparameter. In practice, soft updates are preferred for continuous-action domains; hard updates remain common for discrete-action domains.' },
    { label: 'Memory cost', detail: 'Target networks double the model\'s parameter memory. For DQN\'s ~1.7M parameters this is negligible; for large models it can matter.' },
    { label: 'No gradient through targets', detail: 'The target $y = r + \\gamma \\max_{a\'} Q(s\', a\'; \\mathbf{w}^-)$ is treated as a constant during backpropagation. Gradients flow through $Q(s, a; \\mathbf{w})$ only.' },
    { label: 'Initialization', detail: 'The target network is initialized as an exact copy of the online network at the start of training.' },
];

export default function ExplorerRLTargetNetworks() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Target Networks — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of target networks.
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
