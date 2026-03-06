# Image Captioning

**One-Line Summary**: Generating natural language descriptions of images by bridging visual perception and language generation -- from CNN-LSTM pipelines to attention-based and transformer models, now increasingly subsumed by vision-language foundation models.

**Prerequisites**: `multimodal-nlp.md`, `sequence-to-sequence-models.md`, `attention-mechanism.md`, `recurrent-neural-networks.md`, `text-generation.md`

## What Is Image Captioning?

Imagine walking through a museum with a friend who asks you to describe each painting. For a simple scene -- a dog catching a frisbee in a park -- you produce a concise description almost instantly. But for a complex painting -- Bruegel's "The Tower of Babel" -- you face choices: which details to mention, what level of specificity to use, whether to describe the overall composition or individual elements, and how to structure the description so it flows naturally. Image captioning systems face exactly these challenges.

Image captioning is the task of automatically generating a natural language sentence (or paragraph) that describes the visual content of an image. It sits at the intersection of computer vision (understanding what is in the image) and natural language generation (expressing that understanding fluently). Unlike image classification (which assigns a label) or object detection (which locates objects), captioning requires producing a complete sentence that captures objects, attributes, spatial relationships, and actions in a coherent, grammatical description.

The task is deceptively difficult. A system must not only recognize objects ("dog," "frisbee," "park") but also understand their relationships ("catching," "in the air"), infer activities ("playing fetch"), and produce grammatically correct, contextually appropriate language. The gap between "a dog and a frisbee" and "a golden retriever leaps to catch a red frisbee in a sunny park" illustrates the distance between object detection and genuine captioning.

## How It Works

### Encoder-Decoder: CNN + LSTM

The foundational approach (Vinyals et al., 2015 -- "Show and Tell") treats captioning as a sequence-to-sequence problem:

1. **Encoder**: A pre-trained CNN (typically Inception, ResNet, or VGG) extracts a fixed-length visual feature vector from the image. The final fully connected layer or global average pooling layer produces a single vector (e.g., 2,048 dimensions from ResNet-101).
2. **Decoder**: An LSTM language model generates the caption word by word, conditioned on the image feature vector (injected as the initial hidden state or concatenated with word embeddings at each time step).

The model is trained with teacher forcing: at each step, the ground-truth previous word is fed as input, and the loss is cross-entropy against the next ground-truth word. At inference, beam search (beam width 3--5) generates the caption.

This approach produces grammatical sentences but suffers from a fundamental limitation: the entire image is compressed into a single vector, forcing the model to encode all relevant information in ~2,048 dimensions regardless of image complexity.

### Attention-Based Captioning: Show, Attend and Tell

Xu et al. (2015) introduced visual attention for captioning, allowing the decoder to focus on different image regions at each generation step:

1. The CNN encoder produces a spatial feature map (e.g., 14x14x512 from VGG or 7x7x2048 from ResNet) rather than a single vector.
2. At each decoder time step, an attention mechanism computes a weighted sum over spatial features, with weights determined by the decoder's hidden state. This produces a context vector highlighting the regions most relevant to the next word being generated.
3. The paper introduced "soft attention" (differentiable weighted average, trained end-to-end) and "hard attention" (stochastic sampling of a single region, trained with REINFORCE).

The result: the model learns to look at the dog when generating "dog" and at the frisbee when generating "frisbee." Attention maps provide interpretable visualizations of what the model focuses on, though these do not always correspond to human-intuitive regions.

### Bottom-Up and Top-Down Attention

Anderson et al. (2018) replaced grid-based spatial attention with object-level ("bottom-up") attention. A Faster R-CNN detector (pre-trained on Visual Genome with 1,600 object classes and 400 attribute classes) proposes ~36 salient regions per image, each represented as a 2,048-dimensional feature vector plus bounding box coordinates. The LSTM decoder then attends over these object proposals ("top-down" attention).

This bottom-up/top-down approach won the 2017 COCO captioning challenge and became the standard feature extraction pipeline for both captioning and VQA (see `visual-question-answering.md`), used in nearly all subsequent work through 2021.

### Transformer-Based Captioning

**Oscar** (Li et al., 2020): Uses object tags (detected by Faster R-CNN) as anchor points to align image regions with text. The input to a BERT-like transformer is a triplet of (word tokens, object tags, region features). Oscar learns cross-modal representations by using object tags as a semantic bridge between modalities.

**VinVL** (Zhang et al., 2021): Improves Oscar's visual features by pre-training a larger object detector (ResNeXt-152 on four combined object detection datasets), significantly boosting downstream captioning and VQA performance. VinVL achieved a CIDEr score of 140.9 on COCO Karpathy test, a major improvement.

**CoCa** (Yu et al., 2022): Combines contrastive learning (like CLIP) with captioning (generative) pre-training in a single model, using an image encoder and a text decoder with a combined contrastive + captioning loss. CoCa achieves strong results on both retrieval and generation benchmarks.

### Evaluation Metrics

Captioning evaluation is notoriously difficult because multiple valid descriptions exist for any image:

- **BLEU** (Papineni et al., 2002): Modified n-gram precision against reference captions. BLEU-4 is standard for captioning but correlates poorly with human judgment in this setting.
- **METEOR** (Banerjee & Lavie, 2005): Combines precision, recall, stemming, and synonym matching. Better correlation with human judgments than BLEU for captioning.
- **CIDEr** (Vedantam et al., 2015): Computes TF-IDF weighted n-gram similarity between the candidate and reference captions. Designed specifically for image captioning and correlates well with human consensus. COCO leaderboard CIDEr scores range from ~120 (early models) to ~150+ (current SOTA).
- **SPICE** (Anderson et al., 2016): Parses captions into scene graphs (objects, attributes, relationships) and computes F-score over graph tuples. SPICE directly evaluates semantic content rather than surface n-grams.

### The Problem of Generic Captions

A persistent issue: models learn to generate safe, generic captions that maximize metric scores against multiple references. "A man is standing in front of a building" is rarely wrong but also rarely informative. This "blandness" arises because:

- Training on consensus references (5 captions per image in COCO) rewards common descriptions and penalizes specific ones.
- Beam search and likelihood-based decoding favor high-probability, generic phrases.
- Metrics like CIDEr reward overlap with multiple references, favoring the least-common-denominator description.

Approaches to encourage specificity include reinforcement learning with CIDEr reward (SCST: Rennie et al., 2017), diverse beam search, contrastive decoding, and discriminability objectives (requiring captions to uniquely identify their image among distractors).

### Dense Captioning and the Shift to VLMs

**Dense captioning** (Johnson et al., 2016) generates descriptions for every region in an image, producing a set of (bounding box, caption) pairs rather than a single sentence. This provides richer, more detailed coverage of image content.

The current trajectory is toward vision-language models (see `multimodal-nlp.md`) that subsume captioning as one capability among many. GPT-4V, Gemini, and LLaVA can generate detailed, multi-sentence descriptions, answer follow-up questions, and control description style through prompting -- far exceeding the flexibility of specialized captioning models.

## Why It Matters

1. **Accessibility**: Image captioning (alt-text generation) is essential for making visual web content accessible to visually impaired users, a legal requirement in many jurisdictions.
2. **Image retrieval**: Captions enable text-based search over image databases, complementing embedding-based retrieval from `information-retrieval.md`.
3. **Content moderation**: Automated descriptions help identify inappropriate visual content at scale when combined with `text-classification.md`.
4. **Benchmark task**: Captioning has driven key innovations in attention mechanisms, visual feature extraction, and vision-language pre-training that benefit the entire multimodal field.
5. **Medical and scientific imaging**: Automated radiology report generation and microscopy image description assist professionals and reduce documentation burden.

## Key Technical Details

- MS COCO Captions (the standard benchmark) contains ~330K images with 5 human-annotated captions each. The Karpathy split uses 113K/5K/5K for train/val/test.
- Current SOTA on COCO Karpathy test: CIDEr ~150+ for specialized models; GPT-4V and Gemini produce richer descriptions but are harder to evaluate with automated metrics.
- Bottom-up features: Faster R-CNN (ResNet-101 backbone) pre-trained on Visual Genome, extracting 10--100 (typically 36) region proposals per image, each as a 2,048-dim vector.
- Standard beam search uses beam width 3--5 at inference. Self-critical sequence training (SCST) with CIDEr reward improves CIDEr by ~10--20 points over cross-entropy training.
- Human-written COCO captions average ~10.5 words per caption. Model-generated captions tend to be shorter (~9 words) when trained with cross-entropy, longer (~11--13 words) with CIDEr optimization.
- VinVL achieves CIDEr 140.9, SPICE 25.2, BLEU-4 41.0 on COCO Karpathy test.

## Common Misconceptions

- **"High CIDEr score means the captions are good."** CIDEr measures consensus overlap with reference captions. A model scoring CIDEr 150 produces captions that match human references well on average, but individual captions may be generic, factually incorrect, or miss salient details. Human evaluation remains essential.

- **"Captioning is a solved problem."** While models generate grammatically correct, often accurate captions for simple scenes, they struggle with complex compositions, unusual viewpoints, abstract concepts, cultural references, humor, and fine-grained attributes. The gap between machine-generated alt-text and a thoughtful human description remains substantial.

- **"More detailed captions are always better."** For accessibility (screen readers), concise, accurate captions are often more useful than verbose descriptions. The appropriate level of detail depends on the application, user needs, and context.

- **"Caption models understand the scenes they describe."** Models frequently hallucinate objects not present in the image, miss salient content, and generate plausible-sounding but incorrect spatial relationships. They learn statistical co-occurrences rather than genuine scene understanding.

## Connections to Other Concepts

- **`multimodal-nlp.md`**: Captioning is a foundational multimodal task, and modern vision-language models subsume it as one of many capabilities.
- **`visual-question-answering.md`**: VQA and captioning are complementary -- captioning describes freely while VQA answers specific questions. They share visual feature extractors and attention mechanisms.
- **`text-generation.md`**: Caption decoding uses the same autoregressive generation techniques (beam search, sampling, nucleus sampling) as text generation.
- **`sequence-to-sequence-models.md`**: Captioning is fundamentally a seq2seq problem mapping visual input to text output.
- **`attention-mechanism.md`**: Visual attention for captioning ("Show, Attend and Tell") is one of the most cited applications of the attention mechanism.
- **`evaluation-metrics-for-nlp.md`**: CIDEr, SPICE, METEOR, and BLEU -- all used for captioning evaluation -- are covered in detail there.
- **`document-understanding.md`**: Dense captioning of document regions (figures, charts, tables) connects captioning to document AI.

## Further Reading

- Vinyals et al., "Show and Tell: A Neural Image Caption Generator" (2015) -- The foundational CNN-LSTM encoder-decoder captioning model.
- Xu et al., "Show, Attend and Tell: Neural Image Caption Generation with Visual Attention" (2015) -- Introduced visual attention for captioning.
- Anderson et al., "Bottom-Up and Top-Down Attention for Image Captioning and Visual Question Answering" (2018) -- Object-level attention features that became the standard.
- Vedantam et al., "CIDEr: Consensus-Based Image Description Evaluation" (2015) -- The primary captioning metric designed for consensus-based evaluation.
- Rennie et al., "Self-Critical Sequence Training for Image Captioning" (2017) -- REINFORCE-based training with CIDEr reward, a major quality improvement.
- Li et al., "Oscar: Object-Semantics Aligned Pre-training for Vision-Language Tasks" (2020) -- Using object tags as anchors for cross-modal alignment.
