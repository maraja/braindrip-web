import { useState } from 'react';

const STEPS = [
    { title: '1. Negation Cues and Scope', desc: 'Negation cues are the linguistic triggers that reverse the polarity of a statement. They come in several forms:  Adverbs and particles: not, never, no, neither, nor, nowhere Prefixes: un-, in-/im-/ir-, dis-, non-, a- (e.g.' },
    { title: '2. Speculation and Hedge Detection', desc: 'Speculation cues (also called hedging markers) signal that a proposition is uncertain, tentative, or conditional:  Modal verbs: may, might, could, should, would Adverbs: possibly, probably, perhaps, likely, approximately Adjectives: possible, probable, potential, suspected, apparent Verbs: suggest,.' },
    { title: '3. The BioScope Corpus', desc: 'The BioScope corpus (Vincze et al., 2008) is the most influential annotated resource for negation and speculation detection. It contains:  Clinical records: 1,954 sentences from radiology reports Biomedical papers: 11,871 sentences from the GENIA corpus (biomedical abstracts) Biomedical paper full.' },
    { title: '4. Rule-Based Approaches', desc: 'NegEx (Chapman et al., 2001) is the foundational rule-based negation detection system for clinical text. It uses a simple but effective approach:  Define a list of negation trigger phrases ("no," "denies," "without," "no evidence of," etc.).' },
    { title: '5. Neural Scope Resolution', desc: 'Modern approaches frame scope resolution as a sequence labeling task: given a sentence with an identified cue, label each token as inside or outside the cue\'s scope. BiLSTM-CRF models (Fancellu et al.' },
    { title: '6. Why This Matters for Information Extraction and Sentiment Analysis', desc: 'Information extraction: A system extracting drug-disease relationships from biomedical literature must distinguish "Drug X treats Disease Y" (positive finding) from "Drug X does not treat Disease Y" (negated finding) and "Drug X may treat Disease Y" (speculative finding).' },
];

export default function WalkthroughNLPNegationAndSpeculationDetection() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <div style={{ fontFamily: "'Source Sans 3', system-ui, sans-serif", background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: '14px', padding: '2rem', margin: '2.5rem 0' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive Walkthrough</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Negation and Speculation Detection \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how negation and speculation detection works, one stage at a time.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {STEPS.map((_, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= step ? '#C76B4A' : '#E5DFD3',
            border: 'none', cursor: 'pointer', transition: 'background 0.2s ease',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <h4 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.05rem', fontWeight: 600, color: '#2C3E2D', margin: '0 0 0.4rem 0' }}>
          {current.title}
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#5A6B5C', lineHeight: 1.6, margin: 0 }}>
          {current.desc}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
          padding: '0.4rem 1rem', borderRadius: '6px', border: '1px solid #E5DFD3',
          background: step === 0 ? '#F5F0E8' : '#FDFBF7', color: step === 0 ? '#B0A898' : '#5A6B5C',
          fontSize: '0.8rem', cursor: step === 0 ? 'default' : 'pointer', fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          &#8592; Previous
        </button>
        <span style={{ fontSize: '0.75rem', color: '#7A8B7C', fontFamily: "'JetBrains Mono', monospace" }}>
          {step + 1} / {STEPS.length}
        </span>
        <button onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))} disabled={step === STEPS.length - 1} style={{
          padding: '0.4rem 1rem', borderRadius: '6px',
          border: `1px solid ${step === STEPS.length - 1 ? '#E5DFD3' : '#C76B4A'}`,
          background: step === STEPS.length - 1 ? '#F5F0E8' : 'rgba(199, 107, 74, 0.08)',
          color: step === STEPS.length - 1 ? '#B0A898' : '#C76B4A',
          fontSize: '0.8rem', fontWeight: 500, cursor: step === STEPS.length - 1 ? 'default' : 'pointer',
          fontFamily: "'Source Sans 3', system-ui, sans-serif",
        }}>
          Next &#8594;
        </button>
      </div>
    </div>
  );
}
