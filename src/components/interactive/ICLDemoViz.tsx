import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const examples = [
  { input: 'happy', output: 'glad' },
  { input: 'sad', output: 'unhappy' },
  { input: 'fast', output: 'quick' },
  { input: 'big', output: 'large' },
  { input: 'cold', output: 'chilly' },
];

const accuracies = [15, 42, 68, 84, 93, 97];

export default function ICLDemoViz() {
  const [numExamples, setNumExamples] = useState(2);
  const testWord = 'brave';
  const answers = ['???', 'bold?', 'courageous', 'courageous', 'courageous', 'courageous'];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>In-Context Learning Demo</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>See how adding more examples in the prompt teaches the model without updating weights.</p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.78rem', color: '#5A6B5C', fontWeight: 600 }}>Number of examples: {numExamples}</label>
        <input type="range" min={0} max={5} value={numExamples} onChange={e => setNumExamples(+e.target.value)}
          style={{ width: '100%', accentColor: '#C76B4A', marginTop: '0.3rem' }} />
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem' }}>
        <div style={{ color: '#7A8B7C', marginBottom: '0.5rem' }}>Prompt:</div>
        {examples.slice(0, numExamples).map((ex, i) => (
          <div key={i} style={{ color: '#2C3E2D', marginBottom: '0.25rem' }}>
            <span style={{ color: '#8BA888' }}>"{ex.input}"</span> → <span style={{ color: '#C76B4A' }}>"{ex.output}"</span>
          </div>
        ))}
        <div style={{ borderTop: '1px dashed #D4C5A9', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
          <span style={{ color: '#8BA888' }}>"{testWord}"</span> → <span style={{ color: '#D4A843', fontWeight: 700 }}>"{answers[numExamples]}"</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.7rem', color: '#7A8B7C', marginBottom: '0.3rem' }}>Accuracy with {numExamples} examples</div>
          <div style={{ background: '#E5DFD3', borderRadius: '6px', height: '18px', overflow: 'hidden' }}>
            <div style={{ width: `${accuracies[numExamples]}%`, height: '100%', background: accuracies[numExamples] > 80 ? '#8BA888' : '#D4A843', borderRadius: '6px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#2C3E2D' }}>{accuracies[numExamples]}%</span>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.6rem 0.8rem', background: numExamples === 0 ? 'rgba(199,107,74,0.08)' : 'rgba(139,168,136,0.08)', borderRadius: '6px', fontSize: '0.78rem', color: '#5A6B5C' }}>
        {numExamples === 0 ? 'Zero-shot: model must rely on pre-trained knowledge alone.' :
         numExamples <= 2 ? `Few-shot (${numExamples}): model begins to infer the synonym pattern.` :
         `Many-shot (${numExamples}): model clearly learns the task from examples. No weight updates needed!`}
      </div>
    </div>
  );
}
