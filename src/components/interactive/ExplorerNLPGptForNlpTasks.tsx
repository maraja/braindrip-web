import { useState } from 'react';

const DETAILS = [
    { label: 'GPT-1', detail: '12 layers, 768 hidden, 12 heads, 117M parameters, trained on BooksCorpus (~800M tokens).' },
    { label: 'GPT-2', detail: '48 layers, 1600 hidden, 25 heads, 1.5B parameters, trained on WebText (~40GB).' },
    { label: 'GPT-3', detail: '96 layers, 12288 hidden, 96 heads, 175B parameters, trained on ~300B tokens (filtered Common Crawl + books + Wikipedia).' },
    { label: 'GPT-3 training cost', detail: 'Estimated $4.6M (in 2020 cloud compute prices), ~3,640 petaflop-days.' },
    { label: 'In-context learning examples', detail: 'GPT-3 few-shot (32 examples) on SuperGLUE: 71.8 (vs. fine-tuned BERT-large: 82.1, fine-tuned T5-11B: 89.3).' },
    { label: 'Translation', detail: 'GPT-3 few-shot on WMT\'14 En-Fr: 32.6 BLEU; supervised SOTA at the time: ~45 BLEU.' },
];

export default function ExplorerNLPGptForNlpTasks() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          GPT for NLP Tasks \u2014 Key Details Explorer
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
