import { useState } from 'react';

const DETAILS = [
    { label: 'ELMo improvements', detail: 'Adding ELMo features improved SQuAD by 4.7% (F1), SNLI by 1.0%, SRL by 3.2%, NER by 2.1%, and SST-5 by 1.0% over previous state-of-the-art (2018).' },
    { label: 'BERT improvements', detail: 'BERT-large pushed SQuAD 2.0 F1 from 66.3% to 83.1%, MNLI accuracy from 80.6% to 86.7%, and CoNLL-2003 NER F1 from 92.0% to 92.8%.' },
    { label: 'Context window', detail: 'ELMo processes one sentence at a time. BERT-base handles 512 tokens. Longformer extends to 4,096 tokens. Modern models handle 8,192-128,000+ tokens.' },
    { label: 'Embedding dimensionality', detail: 'ELMo produces 1024-dimensional vectors (512 forward + 512 backward). BERT-base produces 768-dimensional vectors. BERT-large produces 1024-dimensional vectors.' },
    { label: 'Anisotropy problem', detail: 'Contextual embeddings tend to occupy a narrow cone in vector space (high anisotropy), making raw cosine similarity unreliable without normalization or fine-tuning (see sentence-embeddings.md for solutions).' },
    { label: 'Computational cost', detail: 'BERT-base inference requires ~22 GFLOPs per 512-token input. ELMo requires ~14 GFLOPs. For comparison, a GloVe lookup requires essentially zero computation.' },
];

export default function ExplorerNLPContextualEmbeddings() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Contextual Embeddings \u2014 Key Details Explorer
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
