import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

type Framework = 'vLLM' | 'TensorRT-LLM' | 'TGI' | 'Ollama';

const frameworks: Record<Framework, {
  desc: string; lang: string; focus: string; throughput: number;
  features: Record<string, boolean | string>;
}> = {
  vLLM: {
    desc: 'High-throughput serving engine with PagedAttention for efficient memory management.',
    lang: 'Python', focus: 'Throughput & memory efficiency', throughput: 92,
    features: { 'Continuous Batching': true, 'PagedAttention': true, 'Speculative Decoding': true, 'Quantization (AWQ/GPTQ)': true, 'Multi-GPU (TP/PP)': true, 'OpenAI-compatible API': true },
  },
  'TensorRT-LLM': {
    desc: 'NVIDIA-optimized inference engine with custom CUDA kernels and flight recorder.',
    lang: 'C++/Python', focus: 'Maximum single-node perf', throughput: 100,
    features: { 'Continuous Batching': true, 'PagedAttention': true, 'Speculative Decoding': true, 'Quantization (AWQ/GPTQ)': true, 'Multi-GPU (TP/PP)': true, 'OpenAI-compatible API': false },
  },
  TGI: {
    desc: 'Hugging Face production serving with built-in safety and model hub integration.',
    lang: 'Rust/Python', focus: 'Production readiness', throughput: 78,
    features: { 'Continuous Batching': true, 'PagedAttention': true, 'Speculative Decoding': true, 'Quantization (AWQ/GPTQ)': true, 'Multi-GPU (TP/PP)': true, 'OpenAI-compatible API': true },
  },
  Ollama: {
    desc: 'Simple local inference. One-command setup for running models on laptops and desktops.',
    lang: 'Go', focus: 'Ease of use', throughput: 35,
    features: { 'Continuous Batching': false, 'PagedAttention': false, 'Speculative Decoding': false, 'Quantization (AWQ/GPTQ)': 'GGUF only', 'Multi-GPU (TP/PP)': 'Limited', 'OpenAI-compatible API': true },
  },
};

const featureKeys = ['Continuous Batching', 'PagedAttention', 'Speculative Decoding', 'Quantization (AWQ/GPTQ)', 'Multi-GPU (TP/PP)', 'OpenAI-compatible API'];
const names: Framework[] = ['vLLM', 'TensorRT-LLM', 'TGI', 'Ollama'];
const fwColors: Record<Framework, string> = { vLLM: '#C76B4A', 'TensorRT-LLM': '#8BA888', TGI: '#D4A843', Ollama: '#5B8DB8' };

export default function ServingFrameworkComparison() {
  const [selected, setSelected] = useState<Framework>('vLLM');
  const fw = frameworks[selected];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: '#6E8B6B' }}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Serving Framework Comparison
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare popular LLM serving frameworks across features and throughput.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {names.map(n => (
          <button key={n} onClick={() => setSelected(n)} style={{
            padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer',
            border: `1px solid ${selected === n ? fwColors[n] : '#E5DFD3'}`,
            background: selected === n ? `${fwColors[n]}12` : 'transparent',
            color: selected === n ? fwColors[n] : '#5A6B5C',
            fontWeight: selected === n ? 600 : 400, fontSize: '0.78rem',
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>
            {n}
          </button>
        ))}
      </div>

      {/* Detail card */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: fwColors[selected] }}>{selected}</div>
            <div style={{ fontSize: '0.68rem', color: '#7A8B7C' }}>{fw.lang} | {fw.focus}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', color: '#7A8B7C', textTransform: 'uppercase', fontWeight: 600 }}>Relative Throughput</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.1rem', fontWeight: 700, color: fwColors[selected] }}>{fw.throughput}%</div>
          </div>
        </div>
        <p style={{ fontSize: '0.78rem', color: '#2C3E2D', margin: 0, lineHeight: 1.5 }}>{fw.desc}</p>
      </div>

      {/* Feature matrix */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', overflowX: 'auto' }}>
        <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase' }}>Feature Matrix</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr repeat(4, 70px)', gap: '0.3rem', alignItems: 'center' }}>
          <div />
          {names.map(n => (
            <div key={n} style={{ fontSize: '0.6rem', fontWeight: 700, color: n === selected ? fwColors[n] : '#5A6B5C', textAlign: 'center' }}>{n === 'TensorRT-LLM' ? 'TRT-LLM' : n}</div>
          ))}
          {featureKeys.map(f => (
            <div key={f} style={{ display: 'contents' }}>
              <div style={{ fontSize: '0.7rem', color: '#2C3E2D', padding: '0.25rem 0' }}>{f}</div>
              {names.map(n => {
                const v = frameworks[n].features[f];
                return (
                  <div key={n} style={{
                    textAlign: 'center', fontSize: '0.72rem', fontWeight: 600,
                    color: v === true ? '#8BA888' : v === false ? '#C76B4A' : '#D4A843',
                    background: n === selected ? 'rgba(255,255,255,0.5)' : 'transparent',
                    borderRadius: '4px', padding: '0.2rem',
                  }}>
                    {v === true ? '\u2713' : v === false ? '\u2717' : v}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Throughput bars */}
      <div style={{ background: '#F0EBE1', borderRadius: '8px', padding: '1rem' }}>
        <div style={{ fontSize: '0.68rem', color: '#7A8B7C', fontWeight: 600, marginBottom: '0.6rem', textTransform: 'uppercase' }}>Relative Throughput (Llama-70B, A100)</div>
        {names.map(n => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span style={{ width: '70px', fontSize: '0.7rem', color: '#2C3E2D', fontWeight: n === selected ? 600 : 400, textAlign: 'right' }}>
              {n === 'TensorRT-LLM' ? 'TRT-LLM' : n}
            </span>
            <div style={{ flex: 1, height: '16px', background: 'rgba(229,223,211,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${frameworks[n].throughput}%`, height: '100%', background: fwColors[n], borderRadius: '4px', transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', fontWeight: 600, color: fwColors[n], minWidth: '30px' }}>
              {frameworks[n].throughput}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
