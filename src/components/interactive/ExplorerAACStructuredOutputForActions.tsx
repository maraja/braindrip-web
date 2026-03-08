import { useState } from 'react';

const DETAILS = [
    { label: 'Schema complexity limits', detail: 'Constrained decoding slows down as schema complexity increases. Deeply nested schemas (4+ levels), large enums (100+ values), or complex oneOf/anyOf patterns can degrade generation speed by 2-5x.' },
    { label: 'Pydantic v2 performance', detail: 'Pydantic v2 (Rust-based core) validates JSON 5-50x faster than Pydantic v1. For high-throughput agent systems, this difference matters. Always use v2 for new projects.' },
    { label: 'Recursive schemas', detail: 'Some providers do not support recursive JSON schemas (where a type references itself). This limits the ability to represent tree structures or recursive plans in constrained output.' },
    { label: 'Streaming compatibility', detail: 'Structured output can be streamed token-by-token, but the consumer cannot parse until the JSON is complete (or uses a streaming JSON parser that handles partial documents). OpenAI supports partial JSON streaming for structured outputs.' },
    { label: 'Default values and optional fields', detail: 'Optional fields in the schema may or may not be included in the output. Design schemas so that missing optional fields have sensible defaults, and validate with Pydantic\'s default mechanisms.' },
    { label: 'Token overhead', detail: 'Structured JSON output uses more tokens than equivalent free-text (field names, braces, quotes add up). A structured response is typically 20-40% more tokens than a free-text response conveying the same information.' },
];

export default function ExplorerAACStructuredOutputForActions() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Structured Output for Actions \u2014 Key Details Explorer
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
