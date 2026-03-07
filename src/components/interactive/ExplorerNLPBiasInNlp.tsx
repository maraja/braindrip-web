import { useState } from 'react';

const DETAILS = [
    { label: 'WEAT effect sizes', detail: 'Gender bias (male/female vs. career/family) d = 1.81 in GloVe; racial bias (European/African American names vs. pleasant/unpleasant) d = 1.41.' },
    { label: 'MT gender accuracy', detail: 'Google Translate achieved only ~50% accuracy on gender-neutral-to-English pronoun translation for stereotypically gendered occupations (tested on Turkish, Hungarian, Finnish) as of 2020.' },
    { label: 'Toxicity detector false positives', detail: 'Perspective API flags \"I am a gay man\" as 76% likely toxic vs. \"I am a straight man\" at 17% (Dixon et al., 2018).' },
    { label: 'NER performance gap', detail: 'Mishra et al. (2020) found F1 score differences of 5--15 percentage points between majority and minority name sets across standard NER systems.' },
    { label: 'Bias amplification', detail: 'Zhao et al. (2017) measured that a model trained on image captions amplified cooking=female bias from 33% in data to 68% in model predictions.' },
    { label: 'Debiasing trade-offs', detail: 'Hard debiasing (Bolukbasi et al., 2016) reduces WEAT gender effect size from 1.81 to ~0.08 but does not eliminate downstream task bias (Gonen and Goldberg, 2019).' },
];

export default function ExplorerNLPBiasInNlp() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Bias in NLP — Key Details Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Click each card to explore the technical details of bias in nlp.
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
