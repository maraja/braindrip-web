import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const PRESETS: Record<string, { layers: number; heads: number; headDim: number }> = {
  'GPT-2 (117M)': { layers: 12, heads: 12, headDim: 64 },
  'LLaMA-7B': { layers: 32, heads: 32, headDim: 128 },
  'LLaMA-70B': { layers: 80, heads: 64, headDim: 128 },
  Custom: { layers: 32, heads: 32, headDim: 128 },
};

export default function KVCacheMemoryCalc() {
  const [preset, setPreset] = useState('LLaMA-7B');
  const [layers, setLayers] = useState(32);
  const [heads, setHeads] = useState(32);
  const [headDim, setHeadDim] = useState(128);
  const [seqLen, setSeqLen] = useState(4096);
  const [batch, setBatch] = useState(1);
  const [precision, setPrecision] = useState<'FP16' | 'FP32'>('FP16');

  const bytes = precision === 'FP16' ? 2 : 4;
  const totalBytes = 2 * layers * heads * headDim * seqLen * batch * bytes;
  const totalGB = totalBytes / (1024 ** 3);
  const perLayer = totalBytes / layers;
  const perLayerGB = perLayer / (1024 ** 3);

  const selectPreset = (name: string) => {
    setPreset(name);
    if (name !== 'Custom') {
      const p = PRESETS[name];
      setLayers(p.layers); setHeads(p.heads); setHeadDim(p.headDim);
    }
  };

  const sliders: { label: string; value: number; set: (v: number) => void; min: number; max: number; step: number; unit: string }[] = [
    { label: 'Layers', value: layers, set: (v) => { setLayers(v); setPreset('Custom'); }, min: 1, max: 128, step: 1, unit: '' },
    { label: 'Attention Heads', value: heads, set: (v) => { setHeads(v); setPreset('Custom'); }, min: 1, max: 128, step: 1, unit: '' },
    { label: 'Head Dimension', value: headDim, set: (v) => { setHeadDim(v); setPreset('Custom'); }, min: 32, max: 256, step: 32, unit: '' },
    { label: 'Sequence Length', value: seqLen, set: setSeqLen, min: 128, max: 131072, step: 128, unit: ' tokens' },
    { label: 'Batch Size', value: batch, set: setBatch, min: 1, max: 128, step: 1, unit: '' },
  ];

  const segments = [
    { label: 'K cache', share: 0.5, color: '#8BA888' },
    { label: 'V cache', share: 0.5, color: '#C76B4A' },
  ];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>KV Cache Memory Calculator</h3>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {Object.keys(PRESETS).map((name) => (
          <button key={name} onClick={() => selectPreset(name)} style={{
            padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem',
            border: preset === name ? '2px solid #C76B4A' : '1px solid #E5DFD3',
            background: preset === name ? 'rgba(199,107,74,0.08)' : '#fff',
            color: preset === name ? '#C76B4A' : '#2C3E2D', cursor: 'pointer', fontWeight: preset === name ? 600 : 400,
          }}>{name}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.35rem' }}>
          {(['FP16', 'FP32'] as const).map((p) => (
            <button key={p} onClick={() => setPrecision(p)} style={{
              padding: '0.3rem 0.7rem', borderRadius: '8px', fontSize: '0.8rem',
              border: precision === p ? '2px solid #D4A843' : '1px solid #E5DFD3',
              background: precision === p ? 'rgba(212,168,67,0.08)' : '#fff',
              color: precision === p ? '#D4A843' : '#999', cursor: 'pointer', fontWeight: precision === p ? 600 : 400,
            }}>{p} ({p === 'FP16' ? '2B' : '4B'})</button>
          ))}
        </div>
      </div>

      {sliders.map(({ label, value, set, min, max, step: s, unit }) => (
        <div key={label} style={{ marginBottom: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
            <span style={{ color: '#2C3E2D' }}>{label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#C76B4A', fontWeight: 600 }}>{value.toLocaleString()}{unit}</span>
          </div>
          <input type="range" min={min} max={max} step={s} value={value} onChange={(e) => set(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#8BA888' }} />
        </div>
      ))}

      <div style={{ background: 'rgba(199,107,74,0.06)', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem', lineHeight: 1.8 }}>
          Memory = 2 x {layers} x {heads} x {headDim} x {seqLen.toLocaleString()} x {batch} x {bytes}B
        </div>
        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#C76B4A', fontFamily: "'JetBrains Mono', monospace" }}>
          {totalGB < 1 ? `${(totalGB * 1024).toFixed(1)} MB` : `${totalGB.toFixed(2)} GB`}
        </div>
        <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', height: '18px', marginTop: '0.75rem' }}>
          {segments.map((seg) => (
            <div key={seg.label} style={{ width: `${seg.share * 100}%`, background: seg.color, position: 'relative' }}>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.6rem', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>{seg.label}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
          Per layer: {perLayerGB < 0.001 ? `${(perLayerGB * 1024 * 1024).toFixed(0)} KB` : perLayerGB < 1 ? `${(perLayerGB * 1024).toFixed(1)} MB` : `${perLayerGB.toFixed(2)} GB`}
        </div>
      </div>

      <div style={{ background: 'rgba(139,168,136,0.08)', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#2C3E2D', lineHeight: 1.6 }}>
        KV cache memory scales <strong>linearly</strong> with sequence length and batch size.
        At {seqLen.toLocaleString()} tokens with batch {batch}, the cache uses{' '}
        <strong>{totalGB < 1 ? `${(totalGB * 1024).toFixed(1)} MB` : `${totalGB.toFixed(2)} GB`}</strong>.
        {totalGB > 10 && <span style={{ color: '#C76B4A', fontWeight: 600 }}> Warning: this exceeds most single GPU memory!</span>}
      </div>
    </div>
  );
}
