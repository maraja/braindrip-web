import { useState } from 'react';

const DETAILS = [
    { label: 'Compression LLM calls', detail: 'Each summarization costs one LLM call (typically 200-800 input tokens for the prompt + source, 100-500 output tokens for the summary). For running summaries updated every 5 turns, this is ~2 LLM calls per 10 conversation turns' },
    { label: 'Compression quality', detail: 'LLM-based summarization preserves 70-90% of task-relevant information at 10:1 compression ratios. The 10-30% loss is primarily in nuance, hedging language, and peripheral details' },
    { label: 'Lossless compression is impossible', detail: 'Unlike data compression (ZIP, gzip), semantic compression is inherently lossy. Some information is always lost. The goal is to minimize loss of decision-relevant information' },
    { label: 'Compression latency', detail: 'Summarization calls add 0.5-2 seconds of latency. For running summaries triggered every 5 turns, this latency is experienced once per 5 turns, not every turn' },
    { label: 'Optimal summary length', detail: 'For conversation history, 200-500 tokens of summary per 10 conversation turns provides a good balance of compression and information retention' },
    { label: 'Summary drift', detail: 'Over many incremental updates, running summaries can drift from the original content, emphasizing themes that were recently discussed while losing earlier themes. Periodic \"full refresh\" summarization (summarizing from raw history, not from the previous summary) corrects drift' },
];

export default function ExplorerAACMemoryCompression() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Memory Compression — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of memory compression.
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
