import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyEncoderDecoder() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '🌐', label: 'Translator', text: 'The encoder is like a person who reads an entire French document and forms a deep understanding of its meaning. The decoder is a second person who takes that understanding and writes it out in English, word by word. The encoder sees everything at once (bidirectional); the decoder produces output sequentially, consulting the encoder\'s understanding at each step.' },
    { emoji: '🎬', label: 'Director & Actor', text: 'The encoder is the director who reads the entire script and creates a detailed vision. The decoder is the actor who performs the scene one line at a time, constantly checking with the director (cross-attention) to stay faithful to the vision. The director sees the whole picture; the actor reveals it moment by moment.' },
    { emoji: '📦', label: 'Compress & Unpack', text: 'The encoder compresses a message into a rich, dense package (contextualized representations). The decoder unpacks this package into an output sequence. It is like zipping a folder of files: the encoder creates the .zip (understanding), and the decoder extracts files one at a time (generates tokens), using cross-attention to look inside the zip at each step.' },
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
