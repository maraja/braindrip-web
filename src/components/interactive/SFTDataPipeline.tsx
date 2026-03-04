import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const FORMATS = [
  {
    name: 'Single-Turn',
    desc: 'One instruction, one response',
    instruction: 'Explain what photosynthesis is in simple terms.',
    response: 'Photosynthesis is the process by which plants convert sunlight, water, and carbon dioxide into glucose and oxygen. Think of it as a plant making its own food using sunlight as energy.',
    loss: 0.342,
    tokens: 48,
  },
  {
    name: 'Multi-Turn',
    desc: 'Conversational back-and-forth',
    instruction: 'User: What is gravity?\nAssistant: Gravity is a fundamental force that attracts objects with mass toward each other.\nUser: Why don\'t we float away?',
    response: 'Earth\'s gravity is strong enough to keep us grounded because of its large mass. The force decreases with distance, but at the surface, it accelerates objects at 9.8 m/s².',
    loss: 0.287,
    tokens: 92,
  },
  {
    name: 'System Prompt',
    desc: 'System context + user query',
    instruction: '[System] You are a helpful chemistry tutor. Be concise.\n[User] What is a covalent bond?',
    response: 'A covalent bond forms when two atoms share one or more pairs of electrons. Example: in H₂O, oxygen shares electrons with two hydrogen atoms.',
    loss: 0.198,
    tokens: 64,
  },
];

const stages = ['Pre-trained Model', 'Training Pairs', 'Fine-tuned Model'];

export default function SFTDataPipeline() {
  const [format, setFormat] = useState(0);
  const [activeStage, setActiveStage] = useState(1);
  const f = FORMATS[format];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          SFT Data Pipeline
        </h3>
      </div>

      {/* Pipeline Flow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {stages.map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveStage(i)}
              style={{
                padding: '0.6rem 1rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: activeStage === i ? '#2C3E2D' : 'rgba(139, 168, 136, 0.15)',
                color: activeStage === i ? '#FDFBF7' : '#2C3E2D',
                fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.85rem', fontWeight: 600,
              }}
            >{s}</button>
            {i < 2 && <span style={{ color: '#8BA888', fontSize: '1.2rem' }}>→</span>}
          </div>
        ))}
      </div>

      {/* Stage Detail */}
      {activeStage === 0 && (
        <div style={{ background: 'rgba(139, 168, 136, 0.08)', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧠</div>
          <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>Base Model (Pre-trained)</div>
          <div style={{ fontSize: '0.85rem', color: '#6B7B6E' }}>Trained on massive text corpora via next-token prediction. Knows language, but doesn't follow instructions reliably.</div>
        </div>
      )}

      {activeStage === 1 && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {FORMATS.map((fm, i) => (
              <button key={fm.name} onClick={() => setFormat(i)} style={{
                padding: '0.4rem 0.8rem', borderRadius: '8px', border: format === i ? '2px solid #C76B4A' : '1px solid #E5DFD3',
                background: format === i ? 'rgba(199, 107, 74, 0.08)' : 'transparent', cursor: 'pointer',
                fontFamily: "'Source Sans 3', system-ui, sans-serif", fontSize: '0.8rem', fontWeight: 600,
                color: format === i ? '#C76B4A' : '#2C3E2D',
              }}>{fm.name}</button>
            ))}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6B7B6E', marginBottom: '0.8rem' }}>{f.desc}</div>
          <div style={{ background: 'rgba(44, 62, 45, 0.04)', borderRadius: '10px', padding: '1rem', marginBottom: '0.6rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#8BA888', marginBottom: '0.4rem' }}>Instruction</div>
            <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.5 }}>{f.instruction}</pre>
          </div>
          <div style={{ background: 'rgba(199, 107, 74, 0.05)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#C76B4A', marginBottom: '0.4rem' }}>Target Response</div>
            <pre style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: '#2C3E2D', whiteSpace: 'pre-wrap', margin: 0, lineHeight: 1.5 }}>{f.response}</pre>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.8rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#6B7B6E' }}>Loss: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: '#C76B4A' }}>{f.loss}</span></div>
            <div style={{ fontSize: '0.8rem', color: '#6B7B6E' }}>Tokens: <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: '#2C3E2D' }}>{f.tokens}</span></div>
          </div>
        </div>
      )}

      {activeStage === 2 && (
        <div style={{ background: 'rgba(212, 168, 67, 0.08)', borderRadius: '10px', padding: '1.2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
          <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, color: '#2C3E2D', marginBottom: '0.3rem' }}>Fine-tuned Model</div>
          <div style={{ fontSize: '0.85rem', color: '#6B7B6E', marginBottom: '0.8rem' }}>Follows instructions, produces structured responses, and adapts tone based on system prompts.</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {[['Instruction Following', '+82%'], ['Format Adherence', '+74%'], ['Helpfulness', '+61%']].map(([label, val]) => (
              <div key={label}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: '#8BA888' }}>{val}</div>
                <div style={{ fontSize: '0.7rem', color: '#6B7B6E' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
