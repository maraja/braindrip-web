import { useState } from 'react';

const STEPS = [
    { title: '1. Knowledge-Based Approaches', desc: 'The Lesk Algorithm (1986)  The original Lesk algorithm disambiguates a word by comparing dictionary definitions (glosses) of its senses to the glosses of surrounding words. The sense whose gloss shares the most words with neighboring glosses wins.' },
    { title: '2. Supervised WSD', desc: 'Supervised WSD trains classifiers on sense-annotated corpora. The most influential annotated resource is SemCor, containing approximately 226,000 sense-tagged word instances from the Brown Corpus.' },
    { title: '3. Useful Heuristics', desc: 'One sense per discourse: Within a single coherent document, a polysemous word almost always retains the same sense throughout. Gale, Church, and Yarowsky (1992) found this held approximately 98% of the time in their corpus studies.' },
    { title: '4. Most Frequent Sense Baseline', desc: 'The most frequent sense (MFS) baseline simply assigns every instance of a word its most common sense according to a reference corpus (typically SemCor). Despite its simplicity, MFS is notoriously difficult to beat -- it achieves approximately 65% F1 on the ALL-WORDS evaluation tasks in SemEval.' },
    { title: '5. Contextual Embeddings and WSD', desc: 'The advent of contextual embeddings from models like ELMo, BERT, and subsequent transformers has transformed WSD. Because these models produce different vector representations for the same word in different contexts, they implicitly perform sense disambiguation.' },
    { title: '6. Evaluation: Senseval and SemEval', desc: 'WSD has been systematically evaluated through shared tasks since Senseval-1 (1998). The series evolved into SemEval (Semantic Evaluation), which broadened to cover many semantic tasks.' },
];

export default function WalkthroughNLPWordSenseDisambiguation() {
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
          Word Sense Disambiguation \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how word sense disambiguation works, one stage at a time.
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
