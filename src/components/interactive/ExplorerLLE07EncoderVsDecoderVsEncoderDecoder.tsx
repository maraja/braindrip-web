import { useState } from 'react';

const DETAILS = [
    { label: 'Encoder-only', detail: 'BERT (110M/340M, 2018), RoBERTa (125M/355M, 2019), DeBERTa (390M-1.5B, 2020), ModernBERT (149M/395M, 2024)' },
    { label: 'Decoder-only', detail: 'GPT-1 (117M, 2018), GPT-2 (1.5B, 2019), GPT-3 (175B, 2020), PaLM (540B, 2022), LLaMA 3 (8B-405B, 2024)' },
    { label: 'Encoder-decoder', detail: 'T5 (60M-11B, 2019), BART (140M/400M, 2019), Flan-T5 (80M-11B, 2022), UL2 (20B, 2022)' },
    { label: 'Scaling trajectory', detail: 'Largest encoder ~1.5B (DeBERTa-xxlarge); largest encoder-decoder ~20B (UL2); largest decoder-only ~1.8T (GPT-4, estimated)' },
    { label: 'Crossover point', detail: '~2020-2021, when GPT-3 demonstrated that decoder-only could handle NLU via prompting' },
    { label: 'Efficiency gap', detail: 'For embedding/retrieval tasks, a 395M encoder can match a 7B decoder (ModernBERT, 2024)' },
];

export default function ExplorerLLE07EncoderVsDecoderVsEncoderDecoder() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Encoder-Only vs Decoder-Only vs Encoder-Decoder: The Three Architecture Paradigms — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of encoder-only vs decoder-only vs encoder-decoder: the three architecture paradigms.
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
