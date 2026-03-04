import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const SURFACES = [
  {
    name: 'Input Layer', color: '#C76B4A', position: 'left',
    desc: 'Attacks targeting how the model receives and processes user input.',
    vectors: [
      { name: 'Prompt Injection', severity: 'Critical', detail: 'Injecting instructions that override model behavior.' },
      { name: 'Adversarial Tokens', severity: 'High', detail: 'Carefully crafted token sequences that cause misclassification.' },
      { name: 'Context Overflow', severity: 'Medium', detail: 'Overwhelming the context window to push out safety instructions.' },
      { name: 'Encoding Attacks', severity: 'Medium', detail: 'Hiding malicious content in Base64, Unicode, or other encodings.' },
    ],
  },
  {
    name: 'Model Weights', color: '#D4A843', position: 'center',
    desc: 'Attacks targeting the model parameters and architecture.',
    vectors: [
      { name: 'Data Poisoning', severity: 'Critical', detail: 'Corrupting training data to embed backdoors in model weights.' },
      { name: 'Model Extraction', severity: 'High', detail: 'Querying the model systematically to recreate its weights.' },
      { name: 'Weight Tampering', severity: 'Critical', detail: 'Directly modifying model parameters if access is obtained.' },
      { name: 'Fine-tuning Attacks', severity: 'High', detail: 'Malicious fine-tuning that removes safety training.' },
    ],
  },
  {
    name: 'Output Layer', color: '#8BA888', position: 'right',
    desc: 'Attacks exploiting model outputs and downstream processing.',
    vectors: [
      { name: 'Information Leakage', severity: 'High', detail: 'Extracting training data, PII, or system prompts from outputs.' },
      { name: 'Indirect Injection via Output', severity: 'Medium', detail: 'Model output used as input to another system, carrying injections.' },
      { name: 'Hallucination Exploitation', severity: 'Medium', detail: 'Inducing confident false outputs to mislead users.' },
      { name: 'Output Manipulation', severity: 'High', detail: 'Steering outputs to produce biased or harmful recommendations.' },
    ],
  },
  {
    name: 'Training Data', color: '#6E8B6B', position: 'bottom',
    desc: 'Attacks targeting the data pipeline and training process.',
    vectors: [
      { name: 'Training Data Extraction', severity: 'High', detail: 'Prompting the model to regurgitate memorized training examples.' },
      { name: 'Poisoning at Scale', severity: 'Critical', detail: 'Injecting malicious content into web-scraped training corpora.' },
      { name: 'Label Manipulation', severity: 'High', detail: 'Corrupting RLHF labels to weaken safety alignment.' },
      { name: 'Membership Inference', severity: 'Medium', detail: 'Determining if specific data was in the training set.' },
    ],
  },
];

const sevColors: Record<string, string> = { Critical: '#C76B4A', High: '#D4A843', Medium: '#8B9B8D' };

export default function AttackSurfaceMap() {
  const [surfIdx, setSurfIdx] = useState(0);
  const [vecIdx, setVecIdx] = useState(-1);
  const surface = SURFACES[surfIdx];

  const switchSurf = (i: number) => { setSurfIdx(i); setVecIdx(-1); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Attack Surface Map</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Explore the attack surfaces of an LLM system: input, model, output, and training data.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {SURFACES.map((s, i) => (
          <button key={i} onClick={() => switchSurf(i)} style={{
            flex: 1, padding: '0.55rem 0.25rem', borderRadius: '10px', border: `2px solid ${surfIdx === i ? s.color : '#E5DFD3'}`,
            background: surfIdx === i ? `${s.color}10` : 'transparent', cursor: 'pointer', textAlign: 'center' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.75rem', fontWeight: 600,
            color: surfIdx === i ? s.color : '#5A6B5C',
          }}>{s.name}</button>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#5A6B5C', marginBottom: '1rem', lineHeight: 1.5 }}>{surface.desc}</div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.35rem' }}>
        {surface.vectors.map((v, i) => (
          <button key={i} onClick={() => setVecIdx(vecIdx === i ? -1 : i)} style={{
            padding: '0.6rem 0.85rem', borderRadius: '8px', border: `1px solid ${vecIdx === i ? surface.color + '55' : '#E5DFD3'}`,
            background: vecIdx === i ? `${surface.color}08` : 'transparent', cursor: 'pointer', textAlign: 'left' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2C3E2D' }}>{v.name}</span>
              <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: `${sevColors[v.severity]}15`, color: sevColors[v.severity], fontWeight: 700 }}>{v.severity}</span>
            </div>
            {vecIdx === i && (
              <div style={{ fontSize: '0.8rem', color: '#5A6B5C', marginTop: '0.35rem', lineHeight: 1.6 }}>{v.detail}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
