import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const MODELS = [
  { name: '7B', params: 7 },
  { name: '13B', params: 13 },
  { name: '70B', params: 70 },
];
const QUANT = [
  { name: 'FP16', bpw: 16, label: 'FP16 (no quant)' },
  { name: 'INT8', bpw: 8, label: 'INT8' },
  { name: 'NF4', bpw: 4, label: 'NF4 (QLoRA)' },
];
const RANKS = [4, 8, 16, 32, 64];

export default function QLoRAMemoryCalculator() {
  const [modelIdx, setModelIdx] = useState(0);
  const [quantIdx, setQuantIdx] = useState(2);
  const [rankIdx, setRankIdx] = useState(1);
  const [batchSize, setBatchSize] = useState(4);

  const model = MODELS[modelIdx];
  const quant = QUANT[quantIdx];
  const rank = RANKS[rankIdx];

  const baseWeightsMem = (model.params * 1e9 * quant.bpw) / 8 / 1e9;
  const loraParamCount = model.params * 1e9 * 0.02 * (rank / 8);
  const loraMemFP16 = (loraParamCount * 2) / 1e9;
  const optimizerMem = (loraParamCount * 8) / 1e9;
  const activationsMem = batchSize * 0.5 * (model.params / 7);
  const totalQLoRA = baseWeightsMem + loraMemFP16 + optimizerMem + activationsMem;

  const fullFTBase = (model.params * 1e9 * 16) / 8 / 1e9;
  const fullFTOpt = (model.params * 1e9 * 8) / 1e9;
  const fullFTGrad = (model.params * 1e9 * 4) / 1e9;
  const fullFTAct = batchSize * 2 * (model.params / 7);
  const totalFullFT = fullFTBase + fullFTOpt + fullFTGrad + fullFTAct;

  const Bar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
        <span style={{ color: '#5A6B5C' }}>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#2C3E2D', fontWeight: 600 }}>{value.toFixed(1)} GB</span>
      </div>
      <div style={{ height: '12px', background: 'rgba(44,62,45,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, (value / max) * 100)}%`, background: color, borderRadius: '6px', transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );

  const maxMem = Math.max(totalFullFT, totalQLoRA, 80);

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          QLoRA Memory Calculator
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#5A6B5C', display: 'block', marginBottom: '0.3rem' }}>Model Size</label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {MODELS.map((m, i) => (
              <button key={m.name} onClick={() => setModelIdx(i)} style={{
                flex: 1, padding: '0.4rem', borderRadius: '6px', border: `1.5px solid ${i === modelIdx ? '#C76B4A' : '#E5DFD3'}`,
                background: i === modelIdx ? 'rgba(199,107,74,0.06)' : '#FDFBF7', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: i === modelIdx ? 600 : 400, color: i === modelIdx ? '#C76B4A' : '#5A6B5C',
                fontFamily: "'Source Sans 3', system-ui, sans-serif",
              }}>{m.name}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#5A6B5C', display: 'block', marginBottom: '0.3rem' }}>Quantization</label>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {QUANT.map((q, i) => (
              <button key={q.name} onClick={() => setQuantIdx(i)} style={{
                flex: 1, padding: '0.4rem', borderRadius: '6px', border: `1.5px solid ${i === quantIdx ? '#D4A843' : '#E5DFD3'}`,
                background: i === quantIdx ? 'rgba(212,168,67,0.06)' : '#FDFBF7', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: i === quantIdx ? 600 : 400, color: i === quantIdx ? '#D4A843' : '#5A6B5C',
                fontFamily: "'Source Sans 3', system-ui, sans-serif",
              }}>{q.name}</button>
            ))}
          </div>
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#5A6B5C', display: 'block', marginBottom: '0.3rem' }}>
            LoRA Rank: <strong style={{ color: '#C76B4A' }}>{rank}</strong>
          </label>
          <input type="range" min={0} max={RANKS.length - 1} value={rankIdx} onChange={e => setRankIdx(+e.target.value)}
            style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#5A6B5C', display: 'block', marginBottom: '0.3rem' }}>
            Batch Size: <strong style={{ color: '#C76B4A' }}>{batchSize}</strong>
          </label>
          <input type="range" min={1} max={16} value={batchSize} onChange={e => setBatchSize(+e.target.value)}
            style={{ width: '100%', accentColor: '#C76B4A' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(199,107,74,0.04)', borderRadius: '10px', padding: '1rem', border: '1px solid rgba(199,107,74,0.15)' }}>
          <div style={{ fontWeight: 600, color: '#C76B4A', marginBottom: '0.75rem', fontSize: '0.9rem' }}>QLoRA ({quant.name})</div>
          <Bar label="Base weights" value={baseWeightsMem} max={maxMem} color="rgba(199,107,74,0.5)" />
          <Bar label="LoRA adapters" value={loraMemFP16} max={maxMem} color="rgba(199,107,74,0.7)" />
          <Bar label="Optimizer states" value={optimizerMem} max={maxMem} color="rgba(212,168,67,0.6)" />
          <Bar label="Activations" value={activationsMem} max={maxMem} color="rgba(139,168,136,0.5)" />
          <div style={{ borderTop: '1.5px solid #E5DFD3', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2C3E2D' }}>Total</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#C76B4A', fontWeight: 700 }}>{totalQLoRA.toFixed(1)} GB</span>
          </div>
        </div>

        <div style={{ background: 'rgba(44,62,45,0.03)', borderRadius: '10px', padding: '1rem', border: '1px solid #E5DFD3' }}>
          <div style={{ fontWeight: 600, color: '#2C3E2D', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Full Fine-Tuning (FP16)</div>
          <Bar label="Model weights" value={fullFTBase} max={maxMem} color="rgba(44,62,45,0.3)" />
          <Bar label="Optimizer (Adam)" value={fullFTOpt} max={maxMem} color="rgba(44,62,45,0.4)" />
          <Bar label="Gradients" value={fullFTGrad} max={maxMem} color="rgba(44,62,45,0.25)" />
          <Bar label="Activations" value={fullFTAct} max={maxMem} color="rgba(139,168,136,0.4)" />
          <div style={{ borderTop: '1.5px solid #E5DFD3', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2C3E2D' }}>Total</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1rem', color: '#2C3E2D', fontWeight: 700 }}>{totalFullFT.toFixed(1)} GB</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.6rem', background: 'rgba(212,168,67,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: '#2C3E2D', textAlign: 'center' as const }}>
        Memory reduction: <strong style={{ color: '#C76B4A' }}>{((1 - totalQLoRA / totalFullFT) * 100).toFixed(0)}%</strong> &mdash;
        QLoRA uses <strong>{(totalFullFT / totalQLoRA).toFixed(1)}x</strong> less memory
      </div>
    </div>
  );
}
