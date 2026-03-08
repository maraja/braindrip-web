import { useState } from 'react';

const STEPS = [
    { title: '1. Character Classes', desc: 'Square brackets define custom character sets: [aeiou] -- any vowel [^aeiou] -- any non-vowel (negation) [a-zA-Z] -- any letter [0-9.,] -- digits, periods, commas' },
    { title: '2. Quantifiers', desc: 'lazy distinction matters in NLP: matching &lt;.&gt; on "&lt;b&gt;bold&lt;/b&gt;" greedily captures "&lt;b&gt;bold&lt;/b&gt;" (everything between the first &lt; and last &gt;), while &lt;.?&gt; lazily captures "&lt;b&gt;" (the shortest match).' },
    { title: '3. Groups and Backreferences', desc: 'Parentheses create capturing groups:  Named groups improve readability: (?P&lt;year&gt;&#123;4&#125;)-(?P&lt;month&gt;&#123;2&#125;)-(?P&lt;day&gt;&#123;2&#125;).' },
    { title: '4. Lookaheads and Lookbehinds', desc: 'Zero-width assertions that match a position without consuming characters:  Positive lookahead (?=...): +(?= dollars) matches "50" in "50 dollars" Negative lookahead (?!...): +(?! dollars) matches "50" in "50 euros" Positive lookbehind (?&lt;=...): (?&lt;=\\)+ matches "50" in "50" Negative lookbehind (?&lt;!..' },
    { title: '5. Common NLP Patterns', desc: '#### Email Extraction  #### URL Extraction  #### Phone Number Extraction (US)  #### Whitespace Normalization  #### Hashtag and Mention Extraction' },
    { title: '6. Python\'s `re` Module', desc: 'Key functions for NLP work: re.search(pattern, string) -- first match anywhere in string re.match(pattern, string) -- match at string start only re.findall(pattern, string) -- all non-overlapping matches re.sub(pattern, replacement, string) -- search and replace re.' },
];

export default function WalkthroughNLPRegularExpressionsForNlp() {
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
          Regular Expressions for NLP \u2014 Step by Step
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Walk through how regular expressions for nlp works, one stage at a time.
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
