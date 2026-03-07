import { useState } from 'react';

const DETAILS = [
    { label: 'Perplexity-task correlation', detail: 'Chen et al. (2019) found a logarithmic relationship between LM perplexity and downstream task performance -- gains from reducing perplexity show diminishing returns on tasks.' },
    { label: 'Embedding dimension trade-off', detail: 'Yin and Shen (2018) found intrinsic benchmarks favor higher dimensions (300--500), while downstream tasks often plateau at 100--300 dimensions.' },
    { label: 'GLUE baseline', detail: 'A random baseline scores ~45 on GLUE; BERT-base scores ~79; human performance is ~87. On SuperGLUE, BERT-large scores ~69 while human performance is ~90.' },
    { label: 'Probing accuracy', detail: 'Linear probes on BERT-base achieve ~85% accuracy on part-of-speech tagging, ~70% on tree depth prediction, and ~62% on top-constituent identification from frozen representations alone.' },
    { label: 'Evaluation speed', detail: 'Intrinsic benchmarks (word similarity, analogies) run in seconds on CPU. Extrinsic evaluation (fine-tuning BERT on MNLI) takes ~1 hour on a single GPU.' },
    { label: 'Modern trend', detail: 'The proportion of NLP papers reporting only intrinsic results dropped from ~35% in 2015 to ~10% by 2023, reflecting the community\'s shift toward extrinsic evaluation.' },
];

export default function ExplorerNLPIntrinsicVsExtrinsicEvaluation() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Intrinsic vs. Extrinsic Evaluation — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of intrinsic vs. extrinsic evaluation.
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
