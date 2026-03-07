import { useState } from 'react';

const DETAILS = [
    { label: 'Source independence heuristic', detail: 'Two sources are considered independent if they have different authors, different publication dates, and neither cites the other. The agent can use metadata comparison and text similarity to assess independence.' },
    { label: 'Temporal precedence', detail: 'When sources conflict, more recent information generally takes precedence for facts that change over time (prices, personnel, regulations) but not for historical facts. The agent must distinguish between time-sensitive and time-stable claims.' },
    { label: 'Authority scoring', detail: 'Sources are rated by authority based on domain (peer-reviewed journals > news articles > blog posts), institutional affiliation, and track record. Authority scores are domain-specific -- a medical journal is authoritative for health claims but not for legal questions.' },
    { label: 'Fact extraction', detail: 'Before verification, individual claims must be extracted from retrieved passages. An LLM decomposes passages into atomic facts (single claims that can be independently verified), each of which is then checked against other sources.' },
    { label: 'Verification prompting', detail: 'The agent uses structured prompts that explicitly ask: \"What sources support this claim? Do any sources contradict it? How confident should we be?\" This deliberate prompting produces more careful verification than implicit reasoning.' },
    { label: 'Graceful degradation', detail: 'When verification is impossible (single source, no corroboration available), the agent transparently states the limitation rather than presenting unverified information as fact.' },
];

export default function ExplorerAACSourceVerification() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Source Verification — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of source verification.
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
