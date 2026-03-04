import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const vocabulary = ['cat', 'dog', 'pet', 'kitten', 'animal', 'fur', 'paw', 'tiger'];

function softmaxWithTemp(logits: number[], temp: number): number[] {
  const scaled = logits.map(l => l / temp);
  const max = Math.max(...scaled);
  const exps = scaled.map(s => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

const teacherLogits = [4.5, 3.8, 3.2, 2.9, 2.1, 1.0, 0.5, -0.3];

export default function DistillationPipelineViz() {
  const [temperature, setTemperature] = useState(3.0);
  const [showStudent, setShowStudent] = useState(false);

  const hardLabels = softmaxWithTemp(teacherLogits, 1.0);
  const softLabels = softmaxWithTemp(teacherLogits, temperature);
  const studentLogits = [3.8, 3.2, 2.5, 2.0, 1.5, 0.8, 0.3, -0.5];
  const studentSoft = softmaxWithTemp(studentLogits, temperature);
  const maxProb = Math.max(...softLabels, ...(showStudent ? studentSoft : [0]));

  const entropy = (probs: number[]) => -probs.reduce((s, p) => s + (p > 0 ? p * Math.log2(p) : 0), 0);
  const hardEntropy = entropy(hardLabels);
  const softEntropy = entropy(softLabels);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>&#9654;</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Knowledge Distillation Pipeline
        </h3>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' as const }}>
        <div style={{ flex: '1 1 55%', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' as const, padding: '0.8rem', background: 'rgba(199,107,74,0.08)', borderRadius: '12px', border: '1px solid rgba(199,107,74,0.2)', flex: 1 }}>
            <div style={{ fontSize: '2rem' }}>&#129302;</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C76B4A' }}>Teacher</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#7A6F5E' }}>70B params</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
            <div style={{ fontSize: '1.2rem', color: '#D4A843' }}>&rarr;</div>
            <div style={{ fontSize: '0.6rem', color: '#7A6F5E', textAlign: 'center' as const }}>soft<br />labels</div>
          </div>
          <div style={{ textAlign: 'center' as const, padding: '0.8rem', background: showStudent ? 'rgba(139,168,136,0.08)' : '#EDE9DF', borderRadius: '12px', border: `1px solid ${showStudent ? 'rgba(139,168,136,0.2)' : '#E5DFD3'}`, flex: 1, transition: 'all 0.3s' }}>
            <div style={{ fontSize: '1.5rem' }}>&#129302;</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: showStudent ? '#8BA888' : '#C5BFB3' }}>Student</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#7A6F5E' }}>7B params</div>
          </div>
        </div>
        <div style={{ flex: '1 1 35%' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#D4A843', marginBottom: '0.4rem' }}>Distillation Temperature</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.3rem', fontWeight: 700, color: '#2C3E2D' }}>T = {temperature.toFixed(1)}</div>
          <input type="range" min={1} max={10} step={0.5} value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#D4A843' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#7A6F5E' }}>
            <span>T=1 (hard)</span>
            <span>T=10 (very soft)</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#7A6F5E', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Probability Distributions</span>
        <button onClick={() => setShowStudent(!showStudent)} style={{ padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid #8BA888', background: showStudent ? 'rgba(139,168,136,0.12)' : 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', color: '#2C3E2D' }}>
          {showStudent ? 'Hide' : 'Show'} Student
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' as const }}>
        <div style={{ flex: '1 1 45%' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#7A6F5E', marginBottom: '0.3rem' }}>Hard Labels (T=1)</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.2rem', height: '80px' }}>
            {vocabulary.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
                <div style={{ fontSize: '0.5rem', color: '#7A6F5E', fontFamily: "'JetBrains Mono', monospace" }}>{(hardLabels[i] * 100).toFixed(0)}%</div>
                <div style={{ width: '100%', height: `${(hardLabels[i] / Math.max(...hardLabels)) * 65}px`, background: '#C76B4A', borderRadius: '3px 3px 0 0', transition: 'height 0.3s' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {vocabulary.map((v, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' as const, fontSize: '0.5rem', color: '#7A6F5E', fontFamily: "'JetBrains Mono', monospace", transform: 'rotate(-35deg)', transformOrigin: 'top center', marginTop: '0.2rem' }}>{v}</div>
            ))}
          </div>
        </div>

        <div style={{ flex: '1 1 45%' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#D4A843', marginBottom: '0.3rem' }}>Soft Labels (T={temperature.toFixed(1)})</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.2rem', height: '80px' }}>
            {vocabulary.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
                <div style={{ fontSize: '0.5rem', color: '#7A6F5E', fontFamily: "'JetBrains Mono', monospace" }}>{(softLabels[i] * 100).toFixed(0)}%</div>
                <div style={{ width: '100%', height: `${(softLabels[i] / maxProb) * 65}px`, background: '#D4A843', borderRadius: '3px 3px 0 0', transition: 'height 0.3s', position: 'relative' }}>
                  {showStudent && <div style={{ position: 'absolute', width: '60%', left: '20%', bottom: 0, height: `${(studentSoft[i] / maxProb) * 65}px`, background: '#8BA888', borderRadius: '2px 2px 0 0', transition: 'height 0.3s' }} />}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {vocabulary.map((v, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' as const, fontSize: '0.5rem', color: '#7A6F5E', fontFamily: "'JetBrains Mono', monospace", transform: 'rotate(-35deg)', transformOrigin: 'top center', marginTop: '0.2rem' }}>{v}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginTop: '1.5rem' }}>
        <div style={{ padding: '0.6rem', background: 'rgba(199,107,74,0.08)', borderRadius: '8px', textAlign: 'center' as const }}>
          <div style={{ fontSize: '0.6rem', color: '#7A6F5E', textTransform: 'uppercase' as const }}>Hard Entropy</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', fontWeight: 700, color: '#C76B4A' }}>{hardEntropy.toFixed(2)} bits</div>
          <div style={{ fontSize: '0.6rem', color: '#7A6F5E' }}>Less information</div>
        </div>
        <div style={{ padding: '0.6rem', background: 'rgba(212,168,67,0.08)', borderRadius: '8px', textAlign: 'center' as const }}>
          <div style={{ fontSize: '0.6rem', color: '#7A6F5E', textTransform: 'uppercase' as const }}>Soft Entropy</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', fontWeight: 700, color: '#D4A843' }}>{softEntropy.toFixed(2)} bits</div>
          <div style={{ fontSize: '0.6rem', color: '#7A6F5E' }}>More information</div>
        </div>
        <div style={{ padding: '0.6rem', background: 'rgba(139,168,136,0.08)', borderRadius: '8px', textAlign: 'center' as const }}>
          <div style={{ fontSize: '0.6rem', color: '#7A6F5E', textTransform: 'uppercase' as const }}>Info Gain</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', fontWeight: 700, color: '#8BA888' }}>+{((softEntropy / hardEntropy - 1) * 100).toFixed(0)}%</div>
          <div style={{ fontSize: '0.6rem', color: '#7A6F5E' }}>From soft labels</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(139,168,136,0.08)', borderRadius: '10px', border: '1px solid rgba(139,168,136,0.15)', fontSize: '0.78rem', color: '#7A6F5E', lineHeight: 1.5 }}>
        <strong style={{ color: '#2C3E2D' }}>Key insight:</strong> Higher temperature reveals the teacher's "dark knowledge" -- the relationships between classes that hard labels discard. "Cat" is more similar to "kitten" than "tiger," and soft labels preserve this.
      </div>
    </div>
  );
}
