import { useState } from 'react';

const DETAILS = [
    { label: 'Resolution matters', detail: 'Anthropic recommends scaling screenshots to specific resolutions (1024x768, 1280x800) that balance detail with token cost. Higher resolution improves coordinate accuracy but increases latency and cost.' },
    { label: 'Coordinate prediction accuracy', detail: 'is typically within 5-15 pixels. For small targets (checkboxes, small buttons), this can cause misclicks. Some implementations use a two-pass approach: coarse localization then fine-grained clicking.' },
    { label: 'Latency per action', detail: '2-5 seconds for the LLM call plus 0.5-2 seconds for UI response. A 20-step task takes 50-140 seconds. This is 10-50x slower than API-based automation.' },
    { label: 'Token cost per action', detail: 'each screenshot is 1,000-2,000 tokens (depending on resolution and detail level). A 30-action task with screenshots consumes 30,000-60,000 image tokens plus text tokens.' },
    { label: 'Sandbox environments', detail: '(Docker containers, VMs) isolate agent actions from the host system, preventing accidental damage to the user\'s actual computer' },
    { label: 'Accessibility tree alternatives', detail: 'instead of screenshots, some agents parse the HTML DOM or OS accessibility tree (UI elements with roles, labels, and positions), which is faster and more precise but less general' },
];

export default function ExplorerAACComputerUseAgents() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Computer Use Agents — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of computer use agents.
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
