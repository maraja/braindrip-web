import { useState } from 'react';

const DETAILS = [
    { label: 'WebArena scores', detail: '(as of early 2025): best agents achieve ~35-42% task success rate using GPT-4o or Claude Sonnet with accessibility tree observation. Human performance is ~78% (not 100% due to ambiguous task descriptions)' },
    { label: 'Accessibility tree representation', detail: 'typically uses a linearized format: [button] Submit Order [id=42], [input] Email Address [id=17] [value=""], reducing a complex HTML page to 500-2,000 tokens of structured element descriptions' },
    { label: 'Set-of-Marks (SoM) prompting', detail: 'overlays numeric labels on interactive elements in the screenshot, allowing the agent to reference elements by number rather than pixel coordinates. This significantly improves click accuracy' },
    { label: 'Action history', detail: '(the sequence of previous actions) is included in the prompt to maintain context. Typical history window: last 5-10 actions with their observations' },
    { label: 'Error recovery patterns', detail: 'agents should detect failed actions (clicking a button that did nothing, navigating to a 404 page) and attempt alternative approaches (different button, different navigation path)' },
    { label: 'Dynamic content', detail: '(JavaScript-rendered elements, AJAX-loaded content, infinite scroll) requires the agent to wait for rendering before observing the page, adding latency and complexity' },
];

export default function ExplorerAACWebNavigationAgents() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Web Navigation Agents \u2014 Key Details Explorer
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
