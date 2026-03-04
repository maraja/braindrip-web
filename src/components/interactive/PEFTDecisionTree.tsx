import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

type Step = { question: string; options: { label: string; next: string }[] };
type Rec = { name: string; color: string; why: string; pros: string[]; cons: string[] };

const STEPS: Record<string, Step> = {
  start: { question: 'How much GPU memory do you have?', options: [
    { label: '80+ GB (A100/H100)', next: 'tasks_high' },
    { label: '24-48 GB (3090/4090/A6000)', next: 'tasks_mid' },
    { label: '< 24 GB (consumer GPU)', next: 'data_low' },
  ]},
  tasks_high: { question: 'How large is your fine-tuning dataset?', options: [
    { label: '100K+ examples', next: 'rec_full' },
    { label: '1K-100K examples', next: 'multi_high' },
    { label: '< 1K examples', next: 'rec_prompt' },
  ]},
  multi_high: { question: 'Do you need to serve multiple task-specific models?', options: [
    { label: 'Yes, many tasks from one base', next: 'rec_lora' },
    { label: 'No, single task', next: 'rec_full' },
  ]},
  tasks_mid: { question: 'Do you need to serve multiple tasks from one base model?', options: [
    { label: 'Yes', next: 'rec_lora' },
    { label: 'No, single task', next: 'data_mid' },
  ]},
  data_mid: { question: 'How large is your dataset?', options: [
    { label: '10K+ examples', next: 'rec_lora' },
    { label: '< 10K examples', next: 'rec_adapter' },
  ]},
  data_low: { question: 'What model size are you targeting?', options: [
    { label: '7B-13B parameters', next: 'rec_qlora' },
    { label: '70B+ parameters', next: 'rec_qlora70' },
    { label: 'Any size, minimal tuning', next: 'rec_prompt' },
  ]},
};

const RECS: Record<string, Rec> = {
  rec_full: { name: 'Full Fine-Tuning', color: '#2C3E2D', why: 'With ample GPU memory and data, full fine-tuning achieves the best performance.',
    pros: ['Maximum performance', 'Full parameter adaptation'], cons: ['High memory cost', 'One model per task'] },
  rec_lora: { name: 'LoRA', color: '#C76B4A', why: 'LoRA provides near-full-FT quality while enabling efficient multi-task serving with adapter swapping.',
    pros: ['~0.1% params trainable', 'Hot-swappable adapters', 'Near-full-FT quality'], cons: ['Slight quality gap on some tasks', 'Rank selection needed'] },
  rec_qlora: { name: 'QLoRA', color: '#D4A843', why: 'QLoRA combines 4-bit quantization with LoRA, letting you fine-tune large models on consumer GPUs.',
    pros: ['4-bit base model weights', 'Fits 7-13B on 16GB', 'Good quality'], cons: ['Slower training than LoRA', 'Quantization overhead'] },
  rec_qlora70: { name: 'QLoRA (Multi-GPU)', color: '#D4A843', why: 'Even 70B models can be fine-tuned with QLoRA using model parallelism across consumer GPUs.',
    pros: ['Enables 70B fine-tuning', 'NF4 quantization'], cons: ['Requires multi-GPU setup', 'Slower convergence'] },
  rec_adapter: { name: 'Adapter Layers', color: '#8BA888', why: 'Adapters are ideal for moderate compute with smaller datasets, inserting lightweight bottleneck layers.',
    pros: ['Composable', 'Well-studied', 'Small footprint'], cons: ['Adds inference latency', 'Less flexible than LoRA'] },
  rec_prompt: { name: 'Prompt Tuning', color: '#6E8B6B', why: 'With very little data, prompt tuning learns soft tokens without touching model weights at all.',
    pros: ['Fewest trainable params', 'No weight changes', 'Extremely fast'], cons: ['Lower quality ceiling', 'Hard to interpret'] },
};

export default function PEFTDecisionTree() {
  const [path, setPath] = useState<string[]>(['start']);
  const [choices, setChoices] = useState<string[]>([]);
  const current = path[path.length - 1];
  const step = STEPS[current];
  const rec = RECS[current];

  const choose = (optLabel: string, next: string) => {
    setPath([...path, next]);
    setChoices([...choices, optLabel]);
  };

  const reset = () => { setPath(['start']); setChoices([]); };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          PEFT Method Decision Tree
        </h3>
      </div>

      {choices.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.4rem', marginBottom: '1rem' }}>
          {choices.map((c, i) => (
            <span key={i} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', background: 'rgba(139,168,136,0.12)', borderRadius: '12px', color: '#2C3E2D' }}>
              {c} {i < choices.length - 1 ? '→' : ''}
            </span>
          ))}
        </div>
      )}

      {step ? (
        <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '1.25rem' }}>
          <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.1rem', color: '#2C3E2D', marginBottom: '1rem', fontWeight: 600 }}>
            {step.question}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
            {step.options.map(opt => (
              <button key={opt.label} onClick={() => choose(opt.label, opt.next)} style={{
                padding: '0.75rem 1rem', background: '#FDFBF7', border: '1.5px solid #E5DFD3', borderRadius: '8px',
                cursor: 'pointer', textAlign: 'left' as const, fontSize: '0.9rem', color: '#2C3E2D', transition: 'all 0.2s',
                fontFamily: "'Source Sans 3', system-ui, sans-serif",
              }} onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = '#8BA888'; (e.target as HTMLElement).style.background = 'rgba(139,168,136,0.06)'; }}
                 onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = '#E5DFD3'; (e.target as HTMLElement).style.background = '#FDFBF7'; }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : rec ? (
        <div style={{ background: `${rec.color}11`, borderRadius: '10px', padding: '1.25rem', border: `1.5px solid ${rec.color}33` }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: rec.color, marginBottom: '0.5rem' }}>Recommended</div>
          <div style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.25rem', color: '#2C3E2D', fontWeight: 700, marginBottom: '0.5rem' }}>{rec.name}</div>
          <p style={{ color: '#5A6B5C', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1rem' }}>{rec.why}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.4rem' }}>Pros</div>
              {rec.pros.map(p => <div key={p} style={{ fontSize: '0.8rem', color: '#2C3E2D', padding: '0.15rem 0' }}>+ {p}</div>)}
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C76B4A', marginBottom: '0.4rem' }}>Cons</div>
              {rec.cons.map(c => <div key={c} style={{ fontSize: '0.8rem', color: '#5A6B5C', padding: '0.15rem 0' }}>- {c}</div>)}
            </div>
          </div>
          <button onClick={reset} style={{
            marginTop: '1rem', padding: '0.5rem 1.2rem', background: '#FDFBF7', border: '1.5px solid #E5DFD3', borderRadius: '8px',
            cursor: 'pointer', fontSize: '0.85rem', color: '#2C3E2D', fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>Start Over</button>
        </div>
      ) : null}
    </div>
  );
}
