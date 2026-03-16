# Speech Language Models

**One-Line Summary**: Unified models that process both text and speech as token sequences, enabling zero-shot voice cloning, speech generation, and the convergence toward universal language models that handle any modality.

**Prerequisites**: `automatic-speech-recognition.md`, `text-to-speech.md`, `gpt-for-nlp-tasks.md`, `transfer-learning-in-nlp.md`, `tokenization-in-nlp.md`

## What Is a Speech Language Model?

Consider how a fluent bilingual person processes two languages through a single cognitive system -- seamlessly switching between them, translating internally, and understanding that the same concept can be expressed in either language. Speech language models aim for an analogous unification, but between text and speech. Rather than treating speech recognition and speech synthesis as separate pipelines (as in `automatic-speech-recognition.md` and `text-to-speech.md`), these models represent both modalities as sequences of discrete tokens and process them with a single language model.

The core insight is deceptively simple: if we can convert continuous audio waveforms into discrete tokens (much like how text is already discrete characters or subwords), then we can train a single autoregressive model to predict the next token regardless of whether that token represents text or speech. This enables a model to "read" text and "speak" audio using the same architecture, the same attention mechanism, and the same training objective -- next-token prediction.

This paradigm represents a fundamental shift from task-specific pipelines (separate ASR model, separate TTS model, separate dialogue model) toward a single foundation model that natively understands and generates both modalities. The implications extend beyond convenience: such models discover cross-modal correspondences that specialized systems cannot, and they inherit the in-context learning abilities of large language models (see `gpt-for-nlp-tasks.md`).

## How It Works

### Speech Tokenization: Neural Audio Codecs

The foundation of speech language models is converting continuous audio into discrete tokens:

**SoundStream** (Zeghidour et al., 2021, Google): A neural audio codec that compresses audio using an encoder-decoder architecture with residual vector quantization (RVQ). The encoder maps raw audio to a latent representation, which is then quantized using multiple codebook levels. With 8 codebooks of 1,024 entries each at 50 Hz, SoundStream compresses 24 kHz audio to ~6 kbps while maintaining high perceptual quality. Each codebook captures progressively finer acoustic details -- the first codebook encodes coarse spectral content (speaker identity, phonetic content), while later codebooks capture fine acoustic texture.

**EnCodec** (Defossez et al., 2022, Meta): Similar architecture to SoundStream but trained on diverse audio (speech, music, environmental sounds). EnCodec uses a convolutional encoder-decoder with RVQ (4--32 codebooks) and a multi-scale discriminator. At 6 kbps (8 codebooks, 75 Hz), EnCodec achieves quality comparable to Opus at 12 kbps. The key innovation for language modeling is that each time step produces multiple tokens (one per codebook level), creating a "token matrix" rather than a flat sequence.

### AudioLM (Google, 2022)

Borsos et al. (2022) introduced AudioLM, the first model to demonstrate that audio generation can be framed as language modeling over discrete tokens. AudioLM uses a hierarchical approach:

1. **Semantic tokens** from w2v-BERT (a self-supervised speech model) capture linguistic content at ~25 Hz.
2. **Acoustic tokens** from SoundStream (multiple codebook levels) capture fine acoustic details at 50 Hz.

AudioLM first generates semantic tokens autoregressively (modeling *what* is said), then generates acoustic tokens conditioned on the semantic tokens (modeling *how* it sounds). Without any text supervision, AudioLM can continue a speech prompt maintaining linguistic coherence, speaker identity, and prosody. It demonstrated that language-model-style training on audio tokens produces coherent, natural-sounding speech continuations.

### VALL-E (Microsoft, 2023)

Wang et al. (2023) introduced VALL-E, which reframes TTS as a conditional language modeling task over neural codec codes. Given a text transcript and a 3-second audio prompt from the target speaker:

1. The text is encoded as phoneme tokens.
2. The first codebook level is generated autoregressively, conditioned on text and the prompt's codec tokens.
3. Remaining codebook levels (2--8) are generated non-autoregressively in parallel, conditioned on the first level.

VALL-E was trained on 60,000 hours of English speech (LibriLight) -- orders of magnitude more than prior TTS systems. The result: zero-shot TTS that clones a speaker's voice, emotion, and acoustic environment from just 3 seconds of reference audio, without any fine-tuning. VALL-E significantly outperformed YourTTS on speaker similarity (0.580 vs. 0.510 speaker similarity score) while producing more natural speech.

### AudioPaLM (Google, 2023)

Rubenstein et al. (2023) merged a text language model (PaLM-2) with an audio language model (AudioLM) into a single multimodal model. AudioPaLM processes interleaved text and audio tokens, enabling:

- Speech-to-speech translation (preserving the speaker's voice across languages)
- ASR and TTS as special cases of the same model
- Zero-shot voice transfer in translation

AudioPaLM demonstrated that a large language model's linguistic knowledge transfers to speech tasks, achieving state-of-the-art results on ASR benchmarks while simultaneously handling speech generation.

### SpeechGPT (Fudan University, 2023)

Zhang et al. (2023) built SpeechGPT by expanding LLaMA's vocabulary with discrete speech tokens (derived from HuBERT) and fine-tuning on speech-text paired data. The model can:

- Perceive and generate speech end-to-end
- Follow spoken instructions
- Engage in spoken dialogue

SpeechGPT demonstrated a three-stage training process: (1) modality-adaptation pre-training on unpaired speech, (2) cross-modal instruction fine-tuning on ASR/TTS data, and (3) chain-of-modality instruction tuning where the model reasons in text before responding in speech.

### The Convergence Vision

The trajectory points toward universal language models that natively handle text, speech, images, video, and other modalities through a common token vocabulary and architecture. GPT-4o (OpenAI, 2024) exemplifies this vision with real-time speech-to-speech conversation capabilities, low latency (~320 ms average response time), and the ability to perceive and generate across modalities without separate pipeline stages.

## Why It Matters

1. **Unified architectures**: A single model replacing separate ASR, TTS, and dialogue systems reduces engineering complexity, latency, and maintenance burden.
2. **Zero-shot voice cloning**: VALL-E-style models democratize custom voice creation, with implications for accessibility (voice banking), entertainment, and personalization.
3. **Cross-modal transfer**: Linguistic knowledge from text pre-training transfers to speech tasks, dramatically improving sample efficiency -- critical for low-resource languages (see `low-resource-nlp.md`).
4. **Emergent capabilities**: In-context learning, instruction following, and chain-of-thought reasoning (developed for text LLMs) naturally extend to speech when both modalities share the same model.
5. **Real-time conversation**: Eliminating the ASR-LLM-TTS pipeline in favor of direct speech-to-speech models reduces latency from seconds to hundreds of milliseconds.

## Key Technical Details

- Neural audio codecs (SoundStream, EnCodec) compress speech to 1.5--6 kbps using 4--8 RVQ codebooks at 50--75 Hz frame rate, yielding 200--600 tokens per second of audio.
- VALL-E was trained on 60,000 hours of speech from 7,000+ speakers (LibriLight dataset). By comparison, typical TTS training uses 10--100 hours from a single speaker.
- AudioLM's semantic tokens (from w2v-BERT) operate at ~25 Hz; acoustic tokens (from SoundStream) at 50 Hz with 4--8 codebook levels per frame.
- VALL-E achieves 3-second zero-shot voice cloning with speaker similarity scores of 0.580 (SECS), compared to 0.510 for YourTTS and 0.681 for ground-truth continuation.
- GPT-4o achieves average speech response latency of ~320 ms, compared to ~2--5 seconds for cascaded ASR + LLM + TTS pipelines.
- The total vocabulary for speech language models is typically 1,024--8,192 speech tokens per codebook level, added to the existing text vocabulary of 32K--100K subword tokens.

## Common Misconceptions

- **"Speech language models just chain ASR + LLM + TTS together."** The key innovation is that speech tokens are first-class citizens in the vocabulary, processed by the same transformer alongside text tokens. This enables cross-modal attention, in-context learning from speech examples, and avoidance of the error cascade inherent in pipeline systems (ASR errors propagating to downstream components).

- **"Discrete speech tokens lose too much audio information."** Residual vector quantization across multiple codebook levels preserves remarkable audio fidelity. EnCodec at 6 kbps (8 codebooks) is perceptually comparable to Opus at 12 kbps. The hierarchical structure -- semantic tokens for content, acoustic tokens for fine detail -- captures both what is said and how it sounds.

- **"These models require massive compute and are impractical."** While training is indeed expensive, inference for models like VALL-E can run on a single GPU. Smaller variants and distillation techniques are actively being developed, and the consolidation of multiple models into one actually reduces total deployment cost.

- **"Voice cloning from 3 seconds is just speaker style transfer."** VALL-E and similar models capture not just speaker timbre but also acoustic environment, recording conditions, and emotional tone from the prompt. The 3-second prompt provides a surprisingly rich conditioning signal.

## Connections to Other Concepts

- `automatic-speech-recognition.md`: ASR becomes a special case of speech language modeling -- transcription is generating text tokens conditioned on speech tokens.
- `text-to-speech.md`: TTS becomes generating speech tokens conditioned on text tokens, inheriting zero-shot and few-shot capabilities from the LM framework.
- `gpt-for-nlp-tasks.md`: Speech language models extend the autoregressive language modeling paradigm from text to audio, inheriting in-context learning and instruction-following abilities.
- `tokenization.md`: Neural audio codecs are fundamentally a tokenization problem -- finding a discrete vocabulary to represent continuous audio, analogous to BPE for text.
- `multimodal-nlp.md`: Speech language models are part of the broader multimodal trend, which extends to vision, video, and other modalities.
- `transfer-learning.md`: Cross-modal transfer from text to speech mirrors cross-lingual transfer -- pre-trained knowledge in one modality benefits another.

## Further Reading

- Zeghidour et al., "SoundStream: An End-to-End Neural Audio Codec" (2021) -- The neural audio codec enabling discrete speech tokenization.
- Borsos et al., "AudioLM: A Language Modeling Approach to Audio Generation" (2022) -- Demonstrated that audio generation can be framed as language modeling over discrete tokens.
- Wang et al., "Neural Codec Language Models are Zero-Shot Text to Speech Synthesizers" (2023) -- VALL-E: zero-shot TTS from 3 seconds of audio using language modeling over codec tokens.
- Rubenstein et al., "AudioPaLM: A Large Language Model That Can Speak and Listen" (2023) -- Merging text and audio language models into a single multimodal system.
- Zhang et al., "SpeechGPT: Empowering Large Language Models with Intrinsic Cross-Modal Conversational Abilities" (2023) -- Expanding LLaMA with speech tokens for end-to-end spoken dialogue.
- Defossez et al., "High Fidelity Neural Audio Compression" (2022) -- EnCodec: Meta's neural audio codec for high-quality speech and music compression.
