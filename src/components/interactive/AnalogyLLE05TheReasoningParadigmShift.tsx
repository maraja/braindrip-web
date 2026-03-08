import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyLLE05TheReasoningParadigmShift() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'The history of reasoning in large language models is a story of how a surprising discovery became a research program and then an industry. In January 2022, Jason Wei and colleagues at Google discovered that simply adding "Let\'s think step by step" to a prompt could dramatically improve a model\'s performance on math and logic problems.' },
    { emoji: '⚙️', label: 'How It Works', text: '(2022) showed that providing a few worked examples with intermediate reasoning steps, or simply appending "Let\'s think step by step" (Kojima et al., 2022), could unlock latent reasoning abilities in large language models. On the GSM8K math benchmark, chain-of-thought prompting improved PaLM 540B from 17.9% to 56.5% accuracy.' },
    { emoji: '🔍', label: 'In Detail', text: 'What changed was not just technique but philosophy. The field went from "models can be coaxed into reasoning" to "models should be trained to reason" to "reasoning should be verified step by step." Each phase built on the last, and the implications for AI safety, capability, and economics were profound.' },
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
