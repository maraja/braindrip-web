import { useState } from 'react';

const DETAILS = [
    { label: 'Headless vs. headed browsers', detail: 'Headless browsers (no visible window) are faster and server-friendly. Headed browsers are needed for debugging and for sites that detect headless mode. Playwright supports both with a single flag.' },
    { label: 'Playwright vs. Puppeteer', detail: 'Playwright supports Chromium, Firefox, and WebKit; Puppeteer supports only Chromium. Playwright has built-in auto-wait for elements, better TypeScript support, and is the current community preference for agent use.' },
    { label: 'Screenshot resolution trade-offs', detail: 'Higher resolution screenshots give the LLM more detail but cost more tokens. Common resolutions are 1280x720 or 1920x1080. Some systems downscale or crop to regions of interest.' },
    { label: 'Accessibility tree as an alternative', detail: 'Instead of raw DOM or screenshots, some approaches extract the accessibility tree (a11y tree) of the page — a simplified, semantic representation designed for screen readers. This is more compact than raw HTML and more structured than screenshots.' },
    { label: 'Token cost of screenshots', detail: 'A single screenshot at 1280x720 consumes approximately 1,000-1,500 tokens with vision models. A multi-step browsing session with 10-20 screenshots can cost 15,000-30,000 tokens in images alone.' },
    { label: 'Session management', detail: 'Agents must maintain browser context (cookies, local storage) across multiple page navigations within a task. Playwright\'s browser contexts provide isolated sessions.' },
];

export default function ExplorerAACBrowserAutomation() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Browser Automation — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of browser automation.
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
