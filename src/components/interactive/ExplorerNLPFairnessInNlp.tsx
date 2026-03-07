import { useState } from 'react';

const DETAILS = [
    { label: 'WinoBias gap', detail: 'BERT-based coreference systems show 81% accuracy on pro-stereotypical examples vs. 63% on anti-stereotypical examples -- an 18-point gap.' },
    { label: 'CrowS-Pairs', detail: 'GPT-2 shows stereotypical preference in 56.4% of gender pairs, 62.3% of race pairs, and 66.7% of religion pairs.' },
    { label: 'StereoSet ideal scores', detail: 'A perfectly fair LM would score SS = 50% (no stereotypical preference) with LMS near 100% (high language quality). BERT scores SS ~60% and LMS ~84%.' },
    { label: 'Threshold adjustment cost', detail: 'Post-processing to achieve equalized odds typically reduces overall accuracy by 0.5--2% while reducing group-level TPR disparity from 10--15% to <2%.' },
    { label: 'Adversarial debiasing overhead', detail: 'Adds ~20--30% training time and requires careful hyperparameter tuning; Elazar and Goldberg (2018) showed that adversarial training often fails to fully remove demographic information from representations.' },
    { label: 'Impossibility in practice', detail: 'For a toxicity classifier where hate speech prevalence differs by 3x across demographic mentions, satisfying both equalized odds and predictive parity is mathematically impossible.' },
];

export default function ExplorerNLPFairnessInNlp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Fairness in NLP — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of fairness in nlp.
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
