import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPVisualQuestionAnswering() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine showing a friend a photograph and asking, "What color is the umbrella the woman on the left is holding?" Your friend must parse the question linguistically (understanding the nested reference), locate the relevant region in the image (the woman on the left, specifically her umbrella), extract the visual attribute (color), and produce a.' },
    { emoji: '⚙️', label: 'How It Works', text: 'VQA is most commonly formulated as a multi-class classification problem rather than open-ended generation. Given image I and question Q, predict answer a from a vocabulary of the most frequent ~3,129 answers (covering ~90% of the VQA v2.0 training answers). The model outputs:  Each (image, question) pair in VQA v2.0 has 10 human-provided answers.' },
    { emoji: '🔍', label: 'In Detail', text: 'Visual question answering (VQA) formalizes this task: given an image and a free-form natural language question about that image, produce a correct natural language answer. VQA is significant not because answering questions about images is itself a killer application, but because it serves as a litmus test for genuine multimodal understanding.' },
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
