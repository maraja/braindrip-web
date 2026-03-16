# Automatic Speech Recognition

**One-Line Summary**: Converting spoken language into written text by mapping acoustic signals through feature extraction, acoustic modeling, and language decoding -- progressing from HMM-GMM pipelines to end-to-end neural systems like Whisper.

**Prerequisites**: `recurrent-neural-networks.md`, `attention-mechanism.md`, `sequence-to-sequence-models.md`, `n-gram-language-models.md`, `transfer-learning-in-nlp.md`

## What Is Automatic Speech Recognition?

Imagine transcribing a conversation in a noisy coffee shop. Your brain performs an extraordinary feat: it separates the speaker's voice from background clatter, segments the continuous sound stream into words (even though there are no pauses between most words in fluent speech), resolves ambiguities using context ("recognize speech" vs. "wreck a nice beach" sound nearly identical), and produces a coherent transcript. Automatic speech recognition (ASR) attempts to replicate this entire pipeline computationally.

ASR is the task of converting an audio waveform of human speech into a sequence of words. It sits at the intersection of signal processing, acoustics, and natural language processing. Commercially, ASR powers voice assistants (Siri, Alexa, Google Assistant), real-time captioning, medical dictation, call center analytics, and accessibility tools for the hearing impaired. The field dates back to Bell Labs' "Audrey" system in 1952, which recognized isolated digits, but modern systems handle continuous, spontaneous, multilingual speech with near-human accuracy.

## How It Works

### Classical Pipeline: Feature Extraction, Acoustic Model, Language Model, Decoder

Traditional ASR decomposes the problem into four stages:

**1. Feature Extraction**: Raw audio (sampled at 16 kHz typically) is converted into compact acoustic features. The standard representation is Mel-frequency cepstral coefficients (MFCCs): the signal is windowed into 25 ms frames with 10 ms stride, a Fourier transform extracts the frequency spectrum, a Mel-scale filterbank (typically 40--80 filters) mimics human auditory perception, and a discrete cosine transform yields 13 cepstral coefficients plus their deltas, producing ~39-dimensional feature vectors per frame.

**2. Acoustic Model**: Maps feature vectors to phoneme or subword probabilities. In HMM-GMM systems (the dominant approach from the 1980s through ~2010), each phoneme is modeled as a hidden Markov model with 3--5 states, and each state's emission probability is modeled by a Gaussian mixture model with 8--32 mixture components. The system uses context-dependent triphone models (e.g., the "t" in "stop" vs. "top") to capture co-articulation effects.

**3. Language Model**: Provides prior probabilities over word sequences to resolve acoustic ambiguities. Typically an n-gram model (trigram or 4-gram) trained on large text corpora, assigning higher probability to "I saw a bird" than "ice saw a burred."

**4. Decoder**: Searches the combined acoustic-model and language-model space to find the most likely word sequence. Weighted finite-state transducer (WFST) decoders compose the HMM topology, lexicon (pronunciation dictionary), and language model into a single search graph and use beam search (typical beam width: 10--20) for efficient decoding.

### Hybrid DNN-HMM Systems

Starting around 2012, deep neural networks replaced GMMs as the emission model within the HMM framework. A DNN (typically 5--7 fully connected layers) takes a context window of acoustic frames and predicts the posterior probability of each HMM state (senone), with typical systems using 5,000--10,000 senones. This hybrid DNN-HMM approach reduced word error rates by 10--30% relative over GMM-HMM systems across multiple benchmarks.

### End-to-End Models

End-to-end models directly map audio features to character or subword sequences, eliminating the need for separate components:

**CTC (Connectionist Temporal Classification)**: Graves et al. (2006) introduced CTC, which handles the alignment problem between variable-length audio and text. CTC adds a "blank" token and marginalizes over all possible alignments using dynamic programming. The CTC loss function enables training with unaligned (audio, transcript) pairs. DeepSpeech (Hannun et al., 2014) demonstrated that a simple 5-layer bidirectional RNN with CTC could match traditional pipelines.

**Attention-Based Encoder-Decoder (Listen, Attend and Spell)**: Chan et al. (2016) proposed LAS, which uses a pyramidal BLSTM encoder that subsamples the audio sequence (reducing length by 8x) and an attention-based decoder that generates characters one at a time. Unlike CTC, attention models can learn non-monotonic alignments, though in practice speech alignments are largely monotonic.

**RNN-Transducer**: Graves (2012) combined CTC's streaming capability with attention's label-conditioning, making it suitable for real-time applications. RNN-T is widely deployed in on-device ASR (e.g., Google's on-device speech recognizer uses an RNN-T with ~80M parameters).

### Whisper (OpenAI, 2022)

Whisper (Radford et al., 2022) demonstrated that scaling weakly-supervised data dramatically improves ASR robustness. Key design choices:

- **Data**: Trained on 680,000 hours of audio-text pairs collected from the internet, spanning 99 languages. This is roughly 10x more data than prior systems.
- **Architecture**: Standard Transformer encoder-decoder. The encoder processes log-Mel spectrogram features (80 Mel bins, 30-second audio chunks). The decoder autoregressively generates tokens using a BPE vocabulary.
- **Multitask**: A single model handles transcription, translation (any language to English), language identification, and timestamp prediction, all controlled via special tokens in the decoder prompt.
- **Models**: Range from Tiny (39M parameters) to Large-v3 (1.5B parameters).
- **Results**: Whisper Large-v2 achieved 3.0% WER on LibriSpeech test-clean without any fine-tuning on LibriSpeech data, demonstrating remarkable zero-shot generalization. Its robustness to noise, accents, and domain shift far exceeds systems trained only on clean read speech.

### Evaluation: Word Error Rate (WER)

WER is the standard ASR metric, computed as:

```
WER = (Substitutions + Insertions + Deletions) / Total Reference Words
```

Alignment between the hypothesis and reference is found via dynamic programming (minimum edit distance). A WER of 5% means roughly 1 in 20 words is wrong. Character Error Rate (CER) is used for character-based languages like Chinese.

## Why It Matters

1. **Accessibility**: ASR enables real-time captioning for the deaf and hard-of-hearing, voice control for motor-impaired users, and audio content searchability.
2. **Voice interfaces**: Smart speakers, in-car systems, and phone assistants rely entirely on ASR as the input modality, serving billions of queries daily.
3. **Healthcare**: Medical dictation systems save physicians an estimated 2+ hours per day of documentation time.
4. **Multilingual communication**: Systems like Whisper provide ASR in 99 languages, including many with limited prior coverage.
5. **Downstream NLP**: ASR output feeds into `sentiment-analysis.md`, `named-entity-recognition.md`, `text-summarization.md`, and other text-based tasks applied to spoken content.

## Key Technical Details

- State-of-the-art WER on LibriSpeech test-clean: ~1.4% (supervised models fine-tuned on LibriSpeech) and ~3% (zero-shot Whisper Large-v2). Human WER on this benchmark is approximately 5.8%, meaning machines now surpass humans on clean read speech.
- On noisy/conversational benchmarks like Switchboard, WER is 5--6% for best systems, with the CHiME challenges targeting far-field and multi-speaker scenarios at 15--30% WER.
- Standard audio sampling rate is 16 kHz for speech (telephony uses 8 kHz). Mel-spectrogram computation uses 25 ms windows with 10 ms hop.
- Whisper processes audio in 30-second chunks and uses 80-channel log-Mel spectrograms as input features.
- Streaming (real-time) ASR adds latency constraints: RNN-Transducer models achieve <200 ms latency for on-device recognition.
- Self-supervised pre-training (wav2vec 2.0, HuBERT) enables strong ASR with as few as 10 minutes of labeled speech, critical for low-resource languages covered in `low-resource-nlp.md`.

## Common Misconceptions

- **"ASR is a solved problem."** While WER on clean English read speech is impressively low (~2--5%), performance degrades significantly with background noise, overlapping speakers, accented speech, code-switching, domain-specific jargon, and spontaneous disfluencies. The gap between clean and real-world performance remains substantial.

- **"Lower WER always means a better user experience."** WER treats all errors equally, but deleting a function word ("the") is far less disruptive than substituting a content word ("cancer" vs. "dancer"). Task-specific metrics and semantic error measures often better predict usefulness.

- **"End-to-end models eliminated the need for language models."** External language models still improve end-to-end ASR. Shallow fusion (log-linear combination with an LM at decode time) typically reduces WER by 5--15% relative, and many production systems use this approach.

- **"ASR works equally well for all speakers."** Studies have shown significant performance disparities across demographics. Koenecke et al. (2020) found that commercial ASR systems had roughly twice the WER for Black speakers compared to White speakers, highlighting bias in training data and evaluation.

## Connections to Other Concepts

- `text-to-speech.md`: TTS is the inverse problem of ASR -- generating speech from text rather than text from speech. They share acoustic feature representations and increasingly share model architectures.
- `speech-language-models.md`: Unified speech-text models build on ASR capabilities to enable bidirectional speech-text processing.
- `sequence-to-sequence-models.md`: End-to-end ASR (LAS, Whisper) is fundamentally a sequence-to-sequence problem mapping audio frames to token sequences.
- `attention-mechanism.md`: Attention is central to modern ASR, enabling the decoder to focus on relevant audio frames during transcription.
- `n-gram-language-models.md`: N-gram LMs remain widely used in ASR decoding for their efficiency and effectiveness in constraining the search space.
- `low-resource-nlp.md`: Self-supervised speech models and multilingual ASR address the same data scarcity challenges for underserved languages.
- `evaluation-metrics.md`: WER, CER, and other ASR metrics complement the text-based metrics covered there.

## Further Reading

- Graves et al., "Connectionist Temporal Classification" (2006) -- Introduced the CTC loss function that made end-to-end ASR training possible.
- Hannun et al., "Deep Speech: Scaling Up End-to-End Speech Recognition" (2014) -- Demonstrated that a simple deep RNN with CTC could rival traditional ASR pipelines.
- Chan et al., "Listen, Attend and Spell" (2016) -- The attention-based encoder-decoder model for end-to-end ASR.
- Baevski et al., "wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations" (2020) -- Self-supervised pre-training enabling ASR with minimal labeled data.
- Radford et al., "Robust Speech Recognition via Large-Scale Weak Supervision" (2022) -- Whisper: scaling weakly supervised data to 680K hours for robust multilingual ASR.
- Koenecke et al., "Racial Disparities in Automated Speech Recognition" (2020) -- Documented significant performance gaps across demographic groups in commercial ASR systems.
