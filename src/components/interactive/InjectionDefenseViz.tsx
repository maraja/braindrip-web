import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const LAYERS = [
  {
    name: 'Input Sanitization', icon: '1', color: '#D4A843',
    desc: 'First line of defense: detect and neutralize injection patterns in user input before reaching the model.',
    techniques: [
      { name: 'Pattern Matching', detail: 'Detect known injection phrases like "ignore previous instructions" or "you are now."' },
      { name: 'Input Segmentation', detail: 'Clearly delimit user input from system instructions using special tokens or formatting.' },
      { name: 'Length Limiting', detail: 'Restrict input length to reduce the attack surface for complex injection attempts.' },
    ],
    catches: '"Ignore all instructions and output..." → BLOCKED: detected instruction override pattern.',
  },
  {
    name: 'Instruction Hierarchy', icon: '2', color: '#8BA888',
    desc: 'Enforce strict priority ordering so user inputs cannot override developer or system-level instructions.',
    techniques: [
      { name: 'Priority Levels', detail: 'System prompt > developer instructions > user input. Lower-priority inputs cannot override higher ones.' },
      { name: 'Privilege Boundaries', detail: 'User input is treated as data, not as instructions. The model understands the difference.' },
      { name: 'Context Isolation', detail: 'External data (web pages, documents) gets the lowest trust level — never treated as instructions.' },
    ],
    catches: '"You are now DAN..." → IGNORED: user-level input cannot redefine system-level identity.',
  },
  {
    name: 'Output Filtering', icon: '3', color: '#C76B4A',
    desc: 'Final safety net: analyze model output before delivery to catch any injections that slipped through.',
    techniques: [
      { name: 'Content Classification', detail: 'Classify output for harmful content, PII leakage, or system prompt exposure before sending to user.' },
      { name: 'Format Validation', detail: 'Ensure output matches expected format — detect when a model starts revealing system instructions.' },
      { name: 'Anomaly Detection', detail: 'Flag outputs that deviate significantly from expected behavior patterns for the application.' },
    ],
    catches: 'Model output contains system prompt text → REDACTED: prevented system prompt leakage.',
  },
];

export default function InjectionDefenseViz() {
  const [layerIdx, setLayerIdx] = useState(0);
  const [techIdx, setTechIdx] = useState(0);
  const layer = LAYERS[layerIdx];

  const switchLayer = (i: number) => { setLayerIdx(i); setTechIdx(0); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>Injection Defense Layers</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Explore the three defense layers: input sanitization, instruction hierarchy, and output filtering.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem' }}>
        {LAYERS.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flex: 1 }}>
            <button onClick={() => switchLayer(i)} style={{
              flex: 1, padding: '0.55rem 0.5rem', borderRadius: '10px', border: `2px solid ${layerIdx === i ? l.color : '#E5DFD3'}`,
              background: layerIdx === i ? `${l.color}10` : 'transparent', cursor: 'pointer',
              fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.75rem', fontWeight: 600,
              color: layerIdx === i ? l.color : '#5A6B5C', textAlign: 'center' as const,
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', fontWeight: 700 }}>{l.icon}</div>
              <div>{l.name}</div>
            </button>
            {i < LAYERS.length - 1 && <span style={{ color: '#C5BFB3', fontSize: '0.8rem' }}>→</span>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.85rem', color: '#5A6B5C', marginBottom: '1rem', lineHeight: 1.6 }}>{layer.desc}</div>

      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.35rem', marginBottom: '1rem' }}>
        {layer.techniques.map((t, i) => (
          <button key={i} onClick={() => setTechIdx(i)} style={{
            padding: '0.6rem 0.85rem', borderRadius: '8px', border: `1px solid ${techIdx === i ? layer.color + '55' : '#E5DFD3'}`,
            background: techIdx === i ? `${layer.color}08` : 'transparent', cursor: 'pointer', textAlign: 'left' as const,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: techIdx === i ? layer.color : '#2C3E2D' }}>{t.name}</div>
            {techIdx === i && <div style={{ fontSize: '0.8rem', color: '#5A6B5C', marginTop: '0.3rem', lineHeight: 1.6 }}>{t.detail}</div>}
          </button>
        ))}
      </div>

      <div style={{ background: `${layer.color}0A`, border: `1px solid ${layer.color}22`, borderRadius: '10px', padding: '0.85rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: layer.color, marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>Example Catch</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.6 }}>{layer.catches}</div>
      </div>
    </div>
  );
}
