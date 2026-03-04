import { useState } from 'react';

const baseStyle = {
  fontFamily: "'Source Sans 3', system-ui, sans-serif",
  background: '#FDFBF7',
  border: '1px solid #E5DFD3',
  borderRadius: '14px',
  padding: '2rem',
  margin: '2.5rem 0',
};

const labelStyle = {
  fontSize: '10px',
  fontWeight: 700 as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: '#6E8B6B',
};

const sampleText = `The transformer architecture was introduced in 2017 by Vaswani et al. in the paper "Attention Is All You Need." It replaced recurrent layers with self-attention mechanisms. This allowed for significantly more parallelization during training.

The key innovation was the multi-head attention mechanism. Each head learns to attend to different parts of the input. This enables the model to capture various types of relationships simultaneously.

Unlike RNNs, transformers process all positions in parallel. This dramatically reduces training time. However, the quadratic complexity of self-attention with respect to sequence length remains a challenge for very long documents.

Several variants have been proposed to address this limitation. Sparse attention patterns reduce complexity to near-linear. Models like Longformer and BigBird use local and global attention combinations.`;

const methods = [
  {
    id: 'fixed',
    name: 'Fixed-Size',
    desc: 'Split text into equal-sized chunks of N characters',
    color: '#C76B4A',
    chunks: [
      sampleText.substring(0, 200),
      sampleText.substring(200, 400),
      sampleText.substring(400, 600),
      sampleText.substring(600),
    ],
    pros: 'Simple, predictable chunk count',
    cons: 'Breaks mid-sentence, loses context',
  },
  {
    id: 'sentence',
    name: 'Sentence-Based',
    desc: 'Split on sentence boundaries, grouping 2-3 sentences per chunk',
    color: '#D4A843',
    chunks: [
      'The transformer architecture was introduced in 2017 by Vaswani et al. in the paper "Attention Is All You Need." It replaced recurrent layers with self-attention mechanisms. This allowed for significantly more parallelization during training.',
      'The key innovation was the multi-head attention mechanism. Each head learns to attend to different parts of the input. This enables the model to capture various types of relationships simultaneously.',
      'Unlike RNNs, transformers process all positions in parallel. This dramatically reduces training time. However, the quadratic complexity of self-attention with respect to sequence length remains a challenge for very long documents.',
      'Several variants have been proposed to address this limitation. Sparse attention patterns reduce complexity to near-linear. Models like Longformer and BigBird use local and global attention combinations.',
    ],
    pros: 'Preserves sentence integrity',
    cons: 'Variable chunk sizes, no semantic grouping',
  },
  {
    id: 'semantic',
    name: 'Semantic',
    desc: 'Use embedding similarity to find natural topic boundaries',
    color: '#8BA888',
    chunks: [
      'The transformer architecture was introduced in 2017 by Vaswani et al. in the paper "Attention Is All You Need." It replaced recurrent layers with self-attention mechanisms. This allowed for significantly more parallelization during training.\n\nThe key innovation was the multi-head attention mechanism. Each head learns to attend to different parts of the input. This enables the model to capture various types of relationships simultaneously.',
      'Unlike RNNs, transformers process all positions in parallel. This dramatically reduces training time. However, the quadratic complexity of self-attention with respect to sequence length remains a challenge for very long documents.',
      'Several variants have been proposed to address this limitation. Sparse attention patterns reduce complexity to near-linear. Models like Longformer and BigBird use local and global attention combinations.',
    ],
    pros: 'Topically coherent chunks, best retrieval quality',
    cons: 'Requires embedding model, slower processing',
  },
  {
    id: 'recursive',
    name: 'Recursive',
    desc: 'Split by paragraphs, then sentences, then characters if chunks are too large',
    color: '#5B8DB8',
    chunks: [
      'The transformer architecture was introduced in 2017 by Vaswani et al. in the paper "Attention Is All You Need." It replaced recurrent layers with self-attention mechanisms. This allowed for significantly more parallelization during training.',
      'The key innovation was the multi-head attention mechanism. Each head learns to attend to different parts of the input. This enables the model to capture various types of relationships simultaneously.',
      'Unlike RNNs, transformers process all positions in parallel. This dramatically reduces training time. However, the quadratic complexity of self-attention with respect to sequence length remains a challenge for very long documents.',
      'Several variants have been proposed to address this limitation. Sparse attention patterns reduce complexity to near-linear. Models like Longformer and BigBird use local and global attention combinations.',
    ],
    pros: 'Respects document structure hierarchy',
    cons: 'Implementation complexity, parameter tuning needed',
  },
];

export default function ChunkingMethodComparison() {
  const [methodIdx, setMethodIdx] = useState(0);
  const method = methods[methodIdx];

  return (
    <div style={baseStyle}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(139, 168, 136, 0.15)', fontSize: '12px' }}>▶</span>
          <span style={labelStyle}>Interactive</span>
        </div>
        <h3 style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: '1.3rem', fontWeight: 600, color: '#2C3E2D', margin: 0 }}>
          Chunking Method Comparison
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#5A6B5C', margin: '0.4rem 0 0 0', lineHeight: 1.6 }}>
          Compare how different chunking strategies split the same document. Notice boundary differences.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {methods.map((m, i) => (
          <button key={m.id} onClick={() => setMethodIdx(i)} style={{
            padding: '0.4rem 0.9rem', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer',
            border: `1px solid ${methodIdx === i ? m.color : '#E5DFD3'}`,
            background: methodIdx === i ? m.color + '12' : 'transparent',
            color: methodIdx === i ? m.color : '#5A6B5C', fontWeight: methodIdx === i ? 600 : 400,
            fontFamily: "'Source Sans 3', system-ui, sans-serif",
          }}>{m.name}</button>
        ))}
      </div>

      <div style={{ padding: '0.5rem 0.8rem', background: '#F0EBE1', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.82rem', color: '#5A6B5C' }}>
        {method.desc}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {method.chunks.map((chunk, i) => (
          <div key={i} style={{
            padding: '0.7rem 0.9rem', marginBottom: '0.4rem', borderRadius: '8px',
            border: `1px solid ${method.color}33`,
            background: method.color + '08',
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: '0.4rem', right: '0.6rem', fontSize: '0.68rem', fontWeight: 700, color: method.color, background: method.color + '15', padding: '1px 6px', borderRadius: '4px' }}>
              Chunk {i + 1} — {chunk.length} chars
            </div>
            <p style={{ fontSize: '0.78rem', color: '#2C3E2D', margin: 0, lineHeight: 1.6, paddingRight: '6rem' }}>
              {chunk}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
        <div style={{ padding: '0.6rem', background: '#F0EBE1', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '1.2rem', fontWeight: 700, color: '#2C3E2D' }}>{method.chunks.length}</div>
          <div style={{ fontSize: '0.72rem', color: '#7A8B7C' }}>Chunks</div>
        </div>
        <div style={{ padding: '0.6rem', background: 'rgba(139, 168, 136, 0.08)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8BA888', marginBottom: '0.2rem' }}>Pros</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>{method.pros}</div>
        </div>
        <div style={{ padding: '0.6rem', background: 'rgba(199, 107, 74, 0.06)', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#C76B4A', marginBottom: '0.2rem' }}>Cons</div>
          <div style={{ fontSize: '0.72rem', color: '#5A6B5C' }}>{method.cons}</div>
        </div>
      </div>
    </div>
  );
}
