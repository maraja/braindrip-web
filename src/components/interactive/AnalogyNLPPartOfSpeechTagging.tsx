import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: "system-ui, sans-serif" };
export default function AnalogyNLPPartOfSpeechTagging() {
  const [idx, setIdx] = useState(0);
  const perspectives = [
    { emoji: '💡', label: 'Core Idea', text: 'Consider how a grammar teacher diagrams a sentence, labeling each word as a noun, verb, adjective, and so on. POS tagging automates this process: given a sentence, the model assigns a grammatical tag to every token. "The quick brown fox jumps over the lazy dog" becomes DT JJ JJ NN VBZ IN DT JJ NN.' },
    { emoji: '⚙️', label: 'How It Works', text: 'Penn Treebank (PTB): 36 tags covering fine-grained distinctions. Nouns split into NN (singular), NNS (plural), NNP (proper singular), NNPS (proper plural). Verbs split across 6 tense/form categories.' },
    { emoji: '🔍', label: 'In Detail', text: 'Formally, POS tagging is a sequence labeling task: given tokens x_1, , x_n, assign tags y_1, , y_n where each y_i comes from a predefined tag set. The tag set defines the granularity -- the Penn Treebank (PTB) uses 36 tags (distinguishing verb tenses like VB, VBD, VBG, VBN, VBP, VBZ), while Universal Dependencies (UD) uses 17 coarser tags (a.' },
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
