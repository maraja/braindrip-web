import { useState } from 'react';

const DETAILS = [
    { label: 'Observation size budgets', detail: 'A practical rule is to allocate no more than 30-40% of the context window to the current observation. For a 128K-token window, this means individual observations should be capped at roughly 40K-50K tokens. Most observations should be far smaller (500-5,000 tokens).' },
    { label: 'Tool output truncation defaults', detail: 'Claude Code truncates command outputs at 30,000 characters. LangChain defaults vary by tool but typically cap at 10,000 characters. Custom agents should enforce similar limits.' },
    { label: 'Multimodal observation costs', detail: 'A screenshot observation costs 1,000-4,000 tokens depending on image size and resolution. A 1920x1080 screenshot costs approximately 1,500 tokens with Claude\'s vision. This is comparable to 1-2 paragraphs of text.' },
    { label: 'Observation latency', detail: 'File reads complete in 1-10ms. Local command execution takes 100ms-30s. API calls take 200ms-5s. Web fetches take 500ms-10s. The observation source directly impacts loop iteration time.' },
    { label: 'Information density', detail: 'Structured observations (JSON, CSV) are more token-efficient than unstructured ones (log files, raw HTML). A JSON API response might convey in 200 tokens what a raw HTML page conveys in 5,000 tokens.' },
    { label: 'Context window utilization pattern', detail: 'Well-designed agents typically use 20-40% of the context window at the start of a task and 50-80% near the end, as observations accumulate. Crossing 80% utilization is a signal that context management (summarization, pruning) is needed.' },
];

export default function ExplorerAACEnvironmentAndObservations() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Environment and Observations — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of environment and observations.
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
