import { useState } from 'react';

const DETAILS = [
    { label: 'Token budget', detail: 'System prompts should typically consume 10-20% of the total context window. For a 128K-token window, that means 12,800-25,600 tokens. Exceeding this leaves insufficient room for conversation history and user input.' },
    { label: 'Ordering principle', detail: 'Critical rules should be placed at the top (primacy effect) and bottom (recency effect) of the system prompt. Context and reference material should be placed in the middle.' },
    { label: 'Numbered lists vs. prose', detail: 'Behavioral constraints formatted as numbered lists show 15-20% better compliance than the same rules written in prose paragraphs.' },
    { label: 'Example count', detail: '1-3 embedded examples are optimal. More than 3 examples consume excessive tokens with diminishing returns on behavior shaping.' },
    { label: 'Role definition impact', detail: 'Specific role definitions improve domain accuracy by 5-15% compared to generic \"You are a helpful assistant\" prompts.' },
    { label: 'Format compliance', detail: 'Explicit output format instructions (with examples) achieve 85-95% compliance with modern instruction-tuned models.' },
];

export default function ExplorerPESystemPromptAnatomy() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          System Prompt Anatomy — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of system prompt anatomy.
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
