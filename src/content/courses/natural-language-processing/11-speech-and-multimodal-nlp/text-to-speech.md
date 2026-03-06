# Text-to-Speech

**One-Line Summary**: Generating natural-sounding human speech from written text, progressing from concatenative and parametric methods to neural systems (Tacotron, WaveNet, FastSpeech) that approach human-level naturalness.

**Prerequisites**: `sequence-to-sequence-models.md`, `attention-mechanism.md`, `recurrent-neural-networks.md`, `automatic-speech-recognition.md`

## What Is Text-to-Speech?

Imagine reading a bedtime story aloud. Your brain performs an intricate transformation: it parses the text to determine pronunciation (is "read" past or present tense?), decides where to place emphasis and pauses, modulates pitch to convey emotion, and orchestrates dozens of muscles to produce a continuous, expressive sound wave. Text-to-speech (TTS) synthesis attempts to replicate this entire process computationally -- converting a string of characters into an audio waveform that sounds natural, intelligible, and appropriately expressive.

TTS is the inverse of automatic speech recognition (see `automatic-speech-recognition.md`): where ASR converts sound to text, TTS converts text to sound. Modern TTS systems power voice assistants, audiobook narration, accessibility tools for the visually impaired, navigation systems, and increasingly, voice cloning and personalized digital avatars. The field has undergone a dramatic transformation since 2016, with neural approaches achieving near-human naturalness for the first time.

## How It Works

### The TTS Pipeline

Most TTS systems decompose synthesis into three stages:

**1. Text Analysis (Front-End)**: Converts raw text into a linguistic representation. This includes text normalization (expanding "Dr." to "Doctor," "$3.50" to "three dollars and fifty cents"), grapheme-to-phoneme conversion (mapping spelling to pronunciation using rules or learned models), prosody prediction (determining stress patterns, intonation contours, and phrasing), and part-of-speech disambiguation (see `part-of-speech-tagging.md`).

**2. Acoustic Model**: Maps the linguistic representation to acoustic features -- typically a Mel-spectrogram (80 Mel-frequency bins computed from 50 ms frames). This is the core generative component that determines how each phoneme sounds in context.

**3. Vocoder**: Converts the Mel-spectrogram into a raw audio waveform (typically 16 kHz or 24 kHz sampling rate, producing 16,000--24,000 samples per second). This is the most computationally intensive stage.

### Concatenative Synthesis (1990s--2010s)

Concatenative TTS stores a large database of recorded speech segments (diphones, half-phones, or longer units) and selects and concatenates the best-matching segments for each utterance. Unit selection systems like Festival and AT&T Natural Voices maintained databases of 10--40 hours of recorded speech. Quality could be excellent when appropriate units existed, but suffered audible discontinuities at concatenation boundaries and could not generalize beyond the recorded voice.

### Parametric Synthesis

Statistical parametric synthesis (Zen et al., 2009) uses HMMs or DNNs to predict acoustic parameters (fundamental frequency, spectral envelope, aperiodicity) frame by frame. This produces smoother output than concatenation but sounds "buzzy" or robotic because the vocoder (typically STRAIGHT or WORLD) reconstructs the waveform from oversimplified parameters. The sound quality ceiling was fundamentally limited by the parametric vocoder.

### Neural TTS: Tacotron Family

**Tacotron** (Wang et al., 2017) introduced end-to-end neural TTS using a sequence-to-sequence architecture with attention. The encoder processes character or phoneme sequences, and the decoder autoregressively generates Mel-spectrogram frames. A key innovation was predicting multiple frames per decoder step (reduction factor r = 2--5) to reduce the sequence length and stabilize training. The original Tacotron used the Griffin-Lim algorithm as its vocoder.

**Tacotron 2** (Shen et al., 2018) refined the architecture with a location-sensitive attention mechanism that encourages monotonic alignment, an LSTM-based decoder, and a WaveNet vocoder for waveform generation. Tacotron 2 achieved a mean opinion score (MOS) of 4.53 on a 5-point scale, compared to 4.58 for ground-truth recordings -- the first system to approach human-level naturalness.

### Neural Vocoders

The vocoder is the bottleneck for audio quality:

**WaveNet** (van den Oord et al., 2016): An autoregressive model generating audio sample by sample using dilated causal convolutions. WaveNet produces extraordinarily natural audio but is painfully slow -- generating 1 second of 16 kHz audio requires 16,000 sequential forward passes. The original model was ~1,000x slower than real-time.

**WaveRNN** (Kalchbrenner et al., 2018): A single-layer RNN vocoder that achieves WaveNet-quality audio at 4x real-time on a GPU through weight pruning and subscale generation, making on-device synthesis feasible.

**HiFi-GAN** (Kong et al., 2020): A GAN-based vocoder using multi-scale and multi-period discriminators. HiFi-GAN generates audio 13x faster than real-time on a single GPU while matching or exceeding autoregressive vocoder quality (MOS ~4.36). It has become the de facto standard vocoder.

### FastSpeech: Non-Autoregressive Generation

**FastSpeech** (Ren et al., 2019) and **FastSpeech 2** (Ren et al., 2021) replaced autoregressive Mel-spectrogram generation with parallel (non-autoregressive) generation. A duration predictor explicitly models the length of each phoneme, enabling the model to generate all spectrogram frames simultaneously. FastSpeech 2 generates Mel-spectrograms ~270x faster than Tacotron 2 with comparable quality and eliminates attention alignment failures (skipping, repeating words) that plague autoregressive models.

### Prosody Control and Voice Cloning

**Prosody control**: GST-Tacotron (Wang et al., 2018) introduces "global style tokens" -- a bank of learned embeddings that capture speaking styles (happy, sad, whispered). Users can interpolate between styles at inference time without labeled prosody data.

**Voice cloning**: Speaker-adaptive TTS aims to reproduce a target speaker's voice from limited data. Zero-shot approaches like YourTTS (Casanova et al., 2022) and VALL-E (see `speech-language-models.md`) can clone a voice from as little as 3--10 seconds of reference audio by conditioning the model on a speaker embedding extracted from the reference.

## Why It Matters

1. **Accessibility**: TTS is essential for screen readers, enabling millions of visually impaired users to interact with digital content.
2. **Voice interfaces**: Every voice assistant response, navigation instruction, and smart device reply is synthesized speech.
3. **Content creation**: Automated audiobook narration, podcast generation, and video voiceovers are growing rapidly, with AI-narrated audiobooks now accepted on platforms like Audible.
4. **Personalized communication**: Voice banking for ALS patients preserves their voice identity before speech loss, and voice cloning can restore communication with a familiar voice.
5. **Multilingual access**: Neural TTS can generate intelligible speech in languages where professional voice talent is scarce, supporting `multilingual-nlp.md` efforts.

## Key Technical Details

- State-of-the-art TTS achieves MOS scores of 4.5--4.6 out of 5.0, compared to human recordings at ~4.6. The gap is essentially closed for single-speaker, clean-domain synthesis.
- Standard audio: 16 kHz or 22.05 kHz sampling rate, 80-channel Mel-spectrogram with 12.5 ms hop size.
- Tacotron 2 uses ~13M parameters (acoustic model) plus ~25M for WaveNet vocoder. HiFi-GAN vocoder has ~14M parameters.
- FastSpeech 2 achieves real-time factor (RTF) of ~0.003 on GPU (i.e., generating 1 second of audio takes ~3 ms), compared to RTF ~0.8 for autoregressive Tacotron 2 with WaveNet.
- Voice cloning quality degrades below ~3 seconds of reference audio; 10--30 seconds yields significantly better speaker similarity.
- VITS (Kim et al., 2021) combines the acoustic model and vocoder into a single end-to-end model using variational inference, eliminating the two-stage pipeline entirely.

## Common Misconceptions

- **"TTS just looks up words in a pronunciation dictionary."** Text analysis is far more complex than dictionary lookup. Handling homographs ("lead" the metal vs. "lead" the verb), numbers, abbreviations, foreign words, and context-dependent pronunciation requires sophisticated NLP -- the front-end of modern TTS systems is itself a substantial NLP pipeline.

- **"Neural TTS always sounds better than concatenative TTS."** For narrow domains (e.g., weather reports, transit announcements) with ample recorded data, well-built concatenative systems can still sound more natural because they use actual human speech segments. Neural TTS excels at generalization across diverse text inputs.

- **"Voice cloning requires hours of target speaker data."** Modern zero-shot TTS (VALL-E, YourTTS) can produce recognizable voice clones from just 3--10 seconds of audio. However, longer reference audio still significantly improves naturalness and speaker similarity.

- **"Faster models produce lower quality."** Non-autoregressive models like FastSpeech 2 + HiFi-GAN are orders of magnitude faster than autoregressive alternatives while achieving comparable or better quality, because they avoid error accumulation from sequential generation.

## Connections to Other Concepts

- **`automatic-speech-recognition.md`**: TTS is the inverse task of ASR. They share acoustic feature representations (Mel-spectrograms, MFCCs) and increasingly share model architectures.
- **`speech-language-models.md`**: Unified speech-text models like VALL-E reframe TTS as a language modeling problem over discrete speech tokens.
- **`sequence-to-sequence-models.md`**: Tacotron and its variants are fundamentally seq2seq models mapping text to acoustic features.
- **`attention-mechanism.md`**: Attention alignment between text and audio is critical for Tacotron-style models and a common source of failure when it misbehaves.
- **`text-generation.md`**: TTS shares the challenge of producing coherent, natural output autoregressively, with similar issues around exposure bias and repetition.
- **`evaluation-metrics-for-nlp.md`**: MOS evaluation methodology and its limitations parallel the challenges of evaluating generated text quality.

## Further Reading

- van den Oord et al., "WaveNet: A Generative Model for Raw Audio" (2016) -- The autoregressive neural vocoder that revolutionized speech synthesis quality.
- Wang et al., "Tacotron: Towards End-to-End Speech Synthesis" (2017) -- The first end-to-end neural TTS system using seq2seq with attention.
- Shen et al., "Natural TTS Synthesis by Conditioning WaveNet on Mel Spectrogram Predictions" (2018) -- Tacotron 2, achieving near-human naturalness.
- Ren et al., "FastSpeech 2: Fast and High-Quality End-to-End Text to Speech" (2021) -- Non-autoregressive TTS with explicit duration modeling.
- Kong et al., "HiFi-GAN: Generative Adversarial Networks for Efficient and High Fidelity Speech Synthesis" (2020) -- The GAN-based vocoder that became the standard for fast, high-quality waveform generation.
- Kim et al., "Conditional Variational Autoencoder with Adversarial Learning for End-to-End Text-to-Speech" (2021) -- VITS: a fully end-to-end TTS model combining acoustic model and vocoder.
