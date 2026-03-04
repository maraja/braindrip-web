import { useState } from 'react';
const baseStyle = { background: '#FDFBF7', border: '1px solid #E5DFD3', borderRadius: 14, padding: '1.25rem', margin: '1.5rem 0', fontFamily: 'system-ui, sans-serif' };
export default function AnalogyMultimodal() {
  const [idx, setIdx] = useState(0);
  const analogies = [
    { emoji: '👁️', label: 'Multiple Senses', text: 'Humans understand the world through sight, sound, touch, and language simultaneously. Multimodal models do the same for AI — they process text, images, audio, and video together. Just as hearing someone say "watch out!" while seeing a ball flying toward you creates richer understanding than either sense alone, multimodal AI combines visual and textual information for deeper comprehension.' },
    { emoji: '🌐', label: 'Universal Translator', text: 'Imagine a translator who speaks every language. Multimodal models are translators between modalities — they can describe images in text, generate images from text, answer questions about videos, and transcribe audio. They learn a shared representation space where an image of a cat and the word "cat" live near each other, enabling fluid translation between visual and linguistic understanding.' },
    { emoji: '📱', label: 'Smartphone', text: 'A phone that only made calls was useful. A smartphone that combines camera, GPS, internet, messaging, and apps is transformative. Multimodal models are the smartphone leap for AI: by combining vision, language, and sometimes audio into one model, they can do things no single-modality model can — analyze charts, follow visual instructions, understand memes, or describe scenes to visually impaired users.' },
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
