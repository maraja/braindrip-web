import { useState } from 'react';

const DETAILS = [
    { label: 'PET performance', detail: 'BERT-base + PET with 32 labeled examples on Yelp Full: 53.6% accuracy, vs. standard fine-tuning with 32 examples: 40.4%, vs. fine-tuning with full dataset: 66.1%.' },
    { label: 'Prompt sensitivity', detail: 'Zhao et al. (2021) showed that GPT-3\'s accuracy on SST-2 ranges from 51% to 93% depending on prompt wording alone -- a 42-point swing from phrasing choices.' },
    { label: 'Prompt tuning convergence', detail: 'With T5-11B, prompt tuning matches full fine-tuning on SuperGLUE; with T5-Base (220M), prompt tuning lags by ~5 points, highlighting the importance of model scale.' },
    { label: 'Prefix tuning efficiency', detail: '0.1% of trainable parameters (prefix vectors) vs. 100% for full fine-tuning, with comparable performance on GPT-2-Large for table-to-text and summarization.' },
    { label: 'Verbalizer impact', detail: 'On SST-2, changing the verbalizer from {\"great\"/\"terrible\"} to {\"cat\"/\"dog\"} drops accuracy from ~90% to random chance -- demonstrating that the mapping must align with the model\'s pre-trained knowledge.' },
    { label: 'Optimal number of prompt tokens', detail: 'Lester et al. (2021) found 20-100 tokens sufficient; performance plateaus beyond ~100 tokens.' },
];

export default function ExplorerNLPPromptBasedNlp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Prompt-Based NLP — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of prompt-based nlp.
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
