import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyDataParallelism() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📊', label: 'Survey Teams', text: 'To survey a city of 1 million people, you send 8 identical teams with the same questionnaire. Each team surveys 125k people. They reconvene to average their findings. Data parallelism works the same way: each GPU holds a full copy of the model, processes a different mini-batch of data, then all GPUs average their gradients (all-reduce) to update the shared model identically.' },
    { emoji: '🍕', label: 'Pizza Kitchen', text: 'Eight identical pizza ovens, each baking different pizzas from the same recipe. At the end of the shift, the head chef collects feedback from all ovens ("this dough needed more water") and updates the recipe. Data parallelism gives each GPU the same model but different data batches, synchronizing gradients to maintain one consistent set of weights across all devices.' },
    { emoji: '📝', label: 'Parallel Graders', text: 'A professor distributes 800 exams equally to 8 teaching assistants, all using the same rubric. Each TA grades 100 exams and reports patterns ("students struggled with Q3"). The professor aggregates feedback. Data parallelism splits training data across GPUs, each computing gradients independently, then aggregating via all-reduce so every GPU stays in sync.' },
  ];
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2C3E2D', marginBottom: 10, letterSpacing: '0.05em' }}>✦ THINK OF IT AS...</p>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {analogies.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '4px 12px', borderRadius: 20, border: idx === i ? '2px solid #8BA888' : '1px solid #E5DFD3', background: idx === i ? '#8BA888' + '18' : 'transparent', fontSize: '0.8rem', cursor: 'pointer', color: '#2C3E2D', fontWeight: idx === i ? 600 : 400 }}>
            {a.emoji} {a.label}
          </button>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#3D4F3E', lineHeight: 1.6, margin: 0 }}>{analogies[idx].text}</p>
    </div>
  );
}
