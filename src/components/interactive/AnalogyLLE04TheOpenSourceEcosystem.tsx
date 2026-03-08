import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE04TheOpenSourceEcosystem() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Imagine a city where every building is designed by the same three architecture firms. The buildings are impressive, but variety is limited, costs are high, and if you want a custom design, you have no options. Now imagine an alternative: a public repository of blueprints, free materials, and a community of builders who improve each other\'s designs.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Hugging Face transformed from a chatbot startup (2016) into the central platform for the open AI ecosystem. Its Model Hub hosts over 500,000 models across every modality — text, vision, audio, multimodal — from single-GPU experiments to trillion-parameter frontier models. The Datasets Hub provides open training and evaluation data.' },
    { emoji: '🔍', label: 'In Detail', text: 'The ecosystem is not a single project but an interconnected web of tools, platforms, formats, and communities that collectively make it practical to work with open-weight language models. At its center is Hugging Face, the GitHub of machine learning, hosting over 500,000 models by 2025. Around it orbit inference engines (vLLM, llama.' },
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
