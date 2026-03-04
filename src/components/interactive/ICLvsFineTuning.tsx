import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const dimensions = [
  { label: 'Setup Cost', icl: 5, ft: 85, iclText: 'Just write examples in prompt', ftText: 'Need training data, GPU hours' },
  { label: 'Speed to Deploy', icl: 95, ft: 20, iclText: 'Instant — no training needed', ftText: 'Hours to days of training' },
  { label: 'Flexibility', icl: 90, ft: 30, iclText: 'Change task by changing prompt', ftText: 'Retrain for each new task' },
  { label: 'Quality (Simple)', icl: 80, ft: 70, iclText: 'Good for simple patterns', ftText: 'Slight edge with enough data' },
  { label: 'Quality (Complex)', icl: 45, ft: 90, iclText: 'Struggles with nuance', ftText: 'Learns deep patterns' },
  { label: 'Context Limit', icl: 30, ft: 95, iclText: 'Limited by context window', ftText: 'No prompt space needed' },
];

export default function ICLvsFineTuning() {
  const [selected, setSelected] = useState(0);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>ICL vs Fine-Tuning</h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>Compare in-context learning against fine-tuning across key dimensions.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {dimensions.map((d, i) => (
          <div key={d.label} onClick={() => setSelected(i)} style={{ cursor: 'pointer', padding: '0.5rem 0.75rem', borderRadius: '8px', border: `1px solid ${selected === i ? '#C76B4A' : '#E5DFD3'}`, background: selected === i ? 'rgba(199,107,74,0.04)' : 'transparent', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2C3E2D', marginBottom: '0.35rem' }}>{d.label}</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.65rem', color: '#8BA888', width: '25px', fontFamily: "'JetBrains Mono', monospace" }}>ICL</span>
              <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${d.icl}%`, height: '100%', background: '#8BA888', borderRadius: '4px', transition: 'width 0.3s' }} />
              </div>
              <div style={{ flex: 1, background: '#E5DFD3', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${d.ft}%`, height: '100%', background: '#C76B4A', borderRadius: '4px', transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: '0.65rem', color: '#C76B4A', width: '18px', fontFamily: "'JetBrains Mono', monospace" }}>FT</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#8BA888', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>In-Context Learning</div>
          <div style={{ fontSize: '0.8rem', color: '#2C3E2D', marginTop: '0.25rem' }}>{dimensions[selected].iclText}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: '#C76B4A', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Fine-Tuning</div>
          <div style={{ fontSize: '0.8rem', color: '#2C3E2D', marginTop: '0.25rem' }}>{dimensions[selected].ftText}</div>
        </div>
      </div>
    </div>
  );
}
