import { useState } from 'react';

const DETAILS = [
    { label: 'Model card adoption', detail: 'Hugging Face hosts 500,000+ model cards as of 2024; Google, Meta, and OpenAI publish model cards for major releases.' },
    { label: 'Carbon footprint', detail: 'GPT-3 training ~552 tonnes CO2e; BLOOM (BigScience, 176B) reported 25 tonnes CO2e due to nuclear-powered compute -- demonstrating that energy source matters as much as compute volume.' },
    { label: 'Efficiency gains', detail: 'DistilBERT (Sanh et al., 2019) achieves 97% of BERT\'s performance with 40% fewer parameters and 60% faster inference. Quantization (INT8) reduces memory and compute by 2--4x with &lt;1% accuracy loss.' },
    { label: 'ACL ethics review', detail: '~15% of ACL 2023 submissions were flagged for ethics review; ~3% received conditional acceptance requiring ethics-related revisions.' },
    { label: 'Compute inequality', detail: 'Schwartz et al. (2020) documented that NLP research is increasingly concentrated at well-resourced institutions; the median academic lab cannot afford to train models above 1B parameters.' },
    { label: 'Watermarking', detail: 'Kirchenbauer et al. (2023) proposed statistical watermarking for LLM outputs that detects machine-generated text with &gt;99% precision at 1% false positive rate, enabling attribution.' },
];

export default function ExplorerNLPResponsibleNlpDevelopment() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Responsible NLP Development \u2014 Key Details Explorer
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
