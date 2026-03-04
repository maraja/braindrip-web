import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogySpecialTokens() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🚏', label: 'Road Signs', text: 'Special tokens are road signs that tell the model where it is and what to do. <BOS> is the "Start" sign at the highway on-ramp. <EOS> is the "Exit" sign. <PAD> is an empty lane filler. <SEP> marks the boundary between lanes (segments). <MASK> is a road covered for construction, asking the model to predict what is underneath. Without these signs, the model has no navigation aids.' },
    { emoji: '📑', label: 'Bookmarks', text: 'Special tokens are like bookmarks and chapter dividers in a book. The [CLS] token is the bookmark where the model writes its "summary judgment" of the whole document. [SEP] tokens are chapter dividers between different text segments. [PAD] tokens are blank pages added so all books in a batch have the same page count. Each has a learned embedding capturing its role.' },
    { emoji: '🎬', label: 'Film Cues', text: 'In filmmaking, special markers like "Action!" and "Cut!" are not part of the story but control the process. Special tokens work the same way: <|im_start|> and <|im_end|> mark where a chat message begins and ends. <|system|> signals a system instruction. These tokens are never in natural text — they are pure control signals that organize the model\'s behavior.' },
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
