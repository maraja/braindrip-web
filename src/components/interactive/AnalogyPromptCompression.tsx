import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyPromptCompression() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '📰', label: 'Executive Summary', text: 'Instead of feeding a 50-page report to the CEO, an assistant writes a 2-page executive summary. Prompt compression condenses long prompts into shorter versions that preserve the essential information. Techniques like LLMLingua identify and remove less important tokens, or a small model distills the prompt into compact "summary tokens" that the main model can process faster and cheaper.' },
    { emoji: '✂️', label: 'Tailoring a Suit', text: 'A tailor removes excess fabric without changing how the suit fits. Prompt compression trims redundant or low-information tokens from long prompts while preserving the meaning the model needs to generate a correct response. This reduces costs (fewer input tokens), speeds up prefill, and can even improve quality by removing distracting noise.' },
    { emoji: '📦', label: 'Zip File', text: 'Zipping a folder keeps all the important data but in a much smaller package. Prompt compression does the same for context: methods like gist tokens learn to compress long instructions into a handful of special tokens, or perplexity-based pruning removes tokens the model would easily predict anyway. The compressed prompt conveys the same information in fewer tokens.' },
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
