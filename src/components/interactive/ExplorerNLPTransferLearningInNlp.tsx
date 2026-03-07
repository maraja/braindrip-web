import { useState } from 'react';

const DETAILS = [
    { label: 'Pre-training data scale', detail: 'BERT used 3.3B tokens (BooksCorpus + English Wikipedia); GPT-3 used ~300B tokens; modern models use 1-15T tokens.' },
    { label: 'Fine-tuning data requirements', detail: 'BERT fine-tuning typically needs 1K-10K labeled examples for strong performance; ULMFiT demonstrated competitive results with as few as 100 examples on IMDb.' },
    { label: 'Fine-tuning hyperparameters', detail: 'Learning rate 2e-5 to 5e-5, batch size 16-32, 3-4 epochs for BERT-style models; higher rates cause catastrophic forgetting, lower rates underfit.' },
    { label: 'Catastrophic forgetting', detail: 'The risk that fine-tuning overwrites useful pre-trained knowledge. Mitigated by low learning rates, short training, and techniques like elastic weight consolidation (EWC).' },
    { label: 'GLUE benchmark trajectory', detail: 'Pre-transfer baseline ~70, ELMo ~79, BERT-large ~82, RoBERTa ~88, DeBERTa-v3 ~91, human baseline ~87.' },
    { label: 'Compute asymmetry', detail: 'Pre-training BERT-large costs ~$10K-50K in cloud compute; fine-tuning costs $1-10. The investment is amortized across unlimited downstream tasks.' },
];

export default function ExplorerNLPTransferLearningInNlp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Transfer Learning in NLP — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of transfer learning in nlp.
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
