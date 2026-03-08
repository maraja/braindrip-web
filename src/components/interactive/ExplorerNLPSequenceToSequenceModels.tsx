import { useState } from 'react';

const DETAILS = [
    { label: 'Sutskever et al. (2014) architecture', detail: '4-layer LSTM, 1000 hidden units, 1000-dimensional word embeddings, 160K source vocabulary, 80K target vocabulary, 384M parameters total. Trained on 12M sentence pairs (WMT English-French) using 8 GPUs for 10 days.' },
    { label: 'Input reversal trick', detail: 'Reversing the source sequence improved BLEU from 30.6 to 33.3 (+2.7 points) on English-to-French, likely because it shortens the average gradient path between corresponding input-output pairs.' },
    { label: 'BLEU scores (pre-attention)', detail: 'Sutskever et al. achieved 34.8 BLEU (with ensembles of 5 models and beam search) on WMT\'14 En-Fr, competitive with the best statistical MT system (37.0 BLEU).' },
    { label: 'Beam search width', detail: 'Widths of 2-10 are standard; beyond 10, gains are marginal. Length normalization (dividing log-probability by sequence length raised to a power alpha, typically 0.6-0.7) is essential to avoid favoring short outputs.' },
    { label: 'Vocabulary size', detail: 'A key limitation of early seq2seq models -- large vocabularies (50K-100K) were computationally expensive at the softmax. This motivated subword tokenization methods like BPE (tokenization-in-nlp.md).' },
    { label: 'Sequence length degradation', detail: 'Performance drops significantly for source sentences beyond 20-30 tokens in the basic encoder-decoder without attention.' },
];

export default function ExplorerNLPSequenceToSequenceModels() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Sequence-to-Sequence Models \u2014 Key Details Explorer
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
