import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyMLFDataSplittingAndSampling() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine studying for an exam using a textbook. If the exam questions are drawn directly from the textbook, your score reflects memorization, not understanding. To measure genuine comprehension, the exam must contain new questions you have never seen.' },
    { emoji: '⚙️', label: 'How It Works', text: 'The simplest scheme: reserve a fraction (commonly 20-30%) of the data for testing and train on the rest. For a dataset of n observations with a test fraction :  [equation]  The split should be random but reproducible (set a random seed). The test set is touched exactly once -- at the very end -- to report final performance.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, given a dataset D = \\&#123;(x_i, y_i)\\&#125;_&#123;i=1&#125;^n, we partition it into disjoint subsets D_&#123;train&#125;, D_&#123;val&#125;, and D_&#123;test&#125; such that D_&#123;train&#125;  D_&#123;val&#125;  D_&#123;test&#125; = D and the subsets are pairwise disjoint.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>\u2726 KEY PERSPECTIVES</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' as const }}>
        {perspectives.map((p, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA88818' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {p.emoji} {p.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{perspectives[idx].text}</p>
    </div>
  );
}
