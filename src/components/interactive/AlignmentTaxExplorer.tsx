import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const CATEGORIES = [
  {
    name: 'Helpfulness',
    icon: '★',
    benchmarks: [
      { name: 'MT-Bench', base: 58, sft: 79, rlhf: 89 },
      { name: 'AlpacaEval', base: 32, sft: 71, rlhf: 88 },
      { name: 'Chatbot Arena', base: 41, sft: 68, rlhf: 85 },
    ],
    insight: 'Alignment dramatically improves helpfulness. RLHF models are preferred by humans 2-3x more than base models on open-ended tasks.',
  },
  {
    name: 'Safety',
    icon: '◆',
    benchmarks: [
      { name: 'ToxiGen', base: 42, sft: 78, rlhf: 94 },
      { name: 'HarmBench', base: 35, sft: 72, rlhf: 91 },
      { name: 'BBQ Bias', base: 51, sft: 70, rlhf: 86 },
    ],
    insight: 'Safety scores improve significantly. The RLHF model refuses harmful requests while the base model readily complies, yielding large safety gains.',
  },
  {
    name: 'Raw Knowledge',
    icon: '◇',
    benchmarks: [
      { name: 'MMLU', base: 78, sft: 76, rlhf: 75 },
      { name: 'ARC-C', base: 72, sft: 71, rlhf: 70 },
      { name: 'TriviaQA', base: 84, sft: 81, rlhf: 79 },
    ],
    insight: 'This is the "alignment tax." Pure knowledge benchmarks show slight degradation (1-5 pts) because RLHF optimizes for human preference rather than raw accuracy.',
  },
  {
    name: 'Reasoning',
    icon: '▲',
    benchmarks: [
      { name: 'GSM8K', base: 68, sft: 70, rlhf: 72 },
      { name: 'HumanEval', base: 52, sft: 55, rlhf: 58 },
      { name: 'BBH', base: 64, sft: 63, rlhf: 65 },
    ],
    insight: 'Reasoning ability is mostly preserved. RLHF can even slightly improve it when the reward model values step-by-step thinking and correct final answers.',
  },
];

const MODELS = [
  { key: 'base' as const, label: 'Base Model', color: '#8BA888' },
  { key: 'sft' as const, label: '+ SFT', color: '#D4A843' },
  { key: 'rlhf' as const, label: '+ RLHF', color: '#C76B4A' },
];

export default function AlignmentTaxExplorer() {
  const [catIdx, setCatIdx] = useState(0);
  const [visibleModels, setVisibleModels] = useState<Set<string>>(new Set(['base', 'sft', 'rlhf']));
  const cat = CATEGORIES[catIdx];

  const toggleModel = (key: string) => {
    const next = new Set(visibleModels);
    if (next.has(key)) { if (next.size > 1) next.delete(key); }
    else next.add(key);
    setVisibleModels(next);
  };

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Alignment Tax Explorer
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Explore performance tradeoffs across alignment stages. Toggle categories and models.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map((c, i) => (
          <button key={c.name} onClick={() => setCatIdx(i)} style={{
            padding: '0.35rem 0.7rem', borderRadius: '6px',
            border: `1px solid ${catIdx === i ? '#C76B4A' : '#E5DFD3'}`,
            background: catIdx === i ? 'rgba(199, 107, 74, 0.08)' : 'transparent',
            color: catIdx === i ? '#C76B4A' : '#5A6B5C',
            fontWeight: catIdx === i ? 600 : 400,
            fontSize: '0.78rem', cursor: 'pointer',
          }}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {MODELS.map(m => (
          <button key={m.key} onClick={() => toggleModel(m.key)} style={{
            padding: '0.3rem 0.6rem', borderRadius: '6px',
            border: `1px solid ${visibleModels.has(m.key) ? m.color : '#E5DFD3'}`,
            background: visibleModels.has(m.key) ? `${m.color}15` : 'transparent',
            color: visibleModels.has(m.key) ? m.color : '#AAA',
            fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
        {cat.benchmarks.map(bench => (
          <div key={bench.name} style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.35rem' }}>{bench.name}</div>
            {MODELS.map(m => visibleModels.has(m.key) && (
              <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.6rem', color: m.color, width: '55px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{m.label.replace('+ ', '')}</span>
                <div style={{ flex: 1, height: '10px', background: '#E5DFD3', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${bench[m.key]}%`, height: '100%', background: m.color, borderRadius: '5px', transition: 'width 0.5s ease' }} />
                </div>
                <span style={{ fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D', fontWeight: 600, width: '28px', textAlign: 'right' }}>{bench[m.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ background: cat.name === 'Raw Knowledge' ? 'rgba(199, 107, 74, 0.06)' : 'rgba(139, 168, 136, 0.06)', border: `1px solid ${cat.name === 'Raw Knowledge' ? '#C76B4A' : '#8BA888'}`, borderRadius: '8px', padding: '0.6rem 0.75rem' }}>
        <div style={{ fontSize: '0.65rem', color: cat.name === 'Raw Knowledge' ? '#C76B4A' : '#8BA888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.2rem' }}>
          {cat.name === 'Raw Knowledge' ? 'Alignment Tax' : 'Alignment Gain'}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#5A6B5C', lineHeight: 1.55 }}>{cat.insight}</div>
      </div>
    </div>
  );
}
