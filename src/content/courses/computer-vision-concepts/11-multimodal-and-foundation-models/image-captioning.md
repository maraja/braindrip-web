# Image Captioning

**One-Line Summary**: Image captioning generates natural language descriptions of images using encoder-decoder architectures that attend to visual regions, evolving from CNN-LSTM models to modern multimodal LLMs like LLaVA and GPT-4V.

**Prerequisites**: Encoder-decoder architecture, attention mechanisms, transformers, CLIP, autoregressive language models, beam search

## What Is Image Captioning?

Imagine describing a photograph to someone over the phone -- you scan the image, identify the important elements, and weave them into a coherent sentence. Image captioning automates this process: a model encodes the visual content of an image and decodes it into a fluent natural language description. The task requires not just recognizing objects but understanding their relationships, attributes, actions, and the overall scene context.

Formally, given an image $\mathbf{x}$, the model produces a sequence of tokens $\mathbf{y} = (y_1, y_2, \ldots, y_T)$ by maximizing:

$$P(\mathbf{y} | \mathbf{x}) = \prod_{t=1}^{T} P(y_t | y_{<t}, \mathbf{x})$$

This autoregressive factorization means each word is conditioned on all previous words and the image, making captioning fundamentally a conditional language generation problem.

## How It Works

### Generation 1: CNN + LSTM (2015-2019)

The original "Show and Tell" approach (Vinyals et al., 2015):

1. Encode the image using a CNN (e.g., Inception-v3) to get a global feature vector
2. Feed this vector as the initial hidden state of an LSTM
3. Generate words autoregressively until an end token

**Show, Attend and Tell** (Xu et al., 2015) introduced visual attention:
- Extract spatial feature maps from the CNN (e.g., $14 \times 14 \times 2048$ from ResNet)
- At each decoding step, compute attention weights over spatial locations
- The context vector is a weighted sum of spatial features:

$$\mathbf{c}_t = \sum_{i=1}^{L} \alpha_{t,i} \mathbf{a}_i, \quad \alpha_{t,i} = \frac{\exp(e_{t,i})}{\sum_{j=1}^{L} \exp(e_{t,j})}$$

This allowed the model to "look at" different image regions while generating each word.

### Generation 2: Transformer-Based (2019-2022)

Replacing LSTMs with Transformer decoders brought significant improvements:

- **OSCAR** (2020): Uses object tags detected by Faster R-CNN as anchor points between vision and language, achieving 41.7 CIDEr on COCO.
- **VinVL** (2021): Improved visual features from a better object detector, reaching 140.9 CIDEr on COCO.

### Generation 3: Unified Vision-Language Models (2022-present)

**BLIP (Salesforce, 2022):**
- Jointly trains three objectives: image-text contrastive learning, image-text matching, and image-conditioned language modeling
- Uses a captioning-and-filtering (CapFilt) approach to bootstrap training data
- A captioner generates synthetic captions; a filter removes noisy ones
- Achieves 136.7 CIDEr on COCO captioning

**BLIP-2 (2023):**
- Introduces Q-Former: a lightweight Transformer that bridges a frozen image encoder and a frozen LLM
- 32 learnable query tokens interact with image features via cross-attention
- Only the Q-Former (188M parameters) is trained; the image encoder and LLM remain frozen
- This makes it possible to leverage LLMs like FlanT5-XXL (11B) or OPT (6.7B) for captioning
- Achieves 145.8 CIDEr on COCO with far less training compute than end-to-end models

**CoCa (Google, 2022):**
- Combines contrastive and captioning objectives in a single encoder-decoder model
- The image encoder is a ViT; the text decoder handles both contrastive pooling and autoregressive generation
- Achieves state-of-the-art on both retrieval and captioning tasks simultaneously

### Generation 4: Multimodal LLMs (2023-present)

**LLaVA (Large Language and Vision Assistant, 2023):**
- Connects a CLIP ViT-L/14 image encoder to a Vicuna/LLaMA LLM via a simple linear projection
- Two-stage training: (1) pretraining the projection on CC3M captions, (2) instruction tuning on 158K multimodal conversations
- Generates detailed, paragraph-length descriptions rather than single-sentence captions
- LLaVA-1.5 with Vicuna-13B achieves strong results across multiple benchmarks with only ~1M training samples

**GPT-4V and proprietary systems:**
- Can generate highly detailed, contextually rich captions
- Handle complex scenes, text in images, and abstract concepts
- Represent the current frontier but lack published architectural details

## Why It Matters

1. **Accessibility**: Automatic image descriptions make visual content accessible to visually impaired users -- a critical application with direct human impact.
2. **Image search and retrieval**: Generated captions enable text-based search over image databases that lack manual annotations.
3. **Content moderation**: Captioning models can describe image content for automated review systems.
4. **Training data generation**: BLIP's CapFilt and similar approaches use captioning to bootstrap large-scale image-text datasets, enabling a flywheel of self-improvement.
5. **Multimodal reasoning**: Image captioning is a prerequisite capability for visual question answering, visual dialogue, and embodied AI.

## Key Technical Details

- **COCO Captions benchmark**: Standard evaluation uses 5,000 test images with 5 human captions each; CIDEr is the primary metric (human performance ~85 CIDEr on Karpathy test split)
- **CIDEr score progression**: Show-Tell (2015): 94.3; BLIP (2022): 136.7; BLIP-2 (2023): 145.8; modern multimodal LLMs are less frequently evaluated on CIDEr due to their verbose style
- **Decoding strategies**: Beam search (beam width 3-5) typically outperforms greedy decoding by 2-5 CIDEr points; nucleus sampling ($p = 0.9$) is preferred for diverse or creative captions
- **Training data**: COCO Captions (590K pairs), Visual Genome (5.4M region descriptions), CC3M/CC12M (web-crawled), LAION-COCO (600M synthetic)
- **Hallucination rate**: Captioning models frequently hallucinate objects not present in the image; CHAIR (Caption Hallucination Assessment with Image Relevance) measures this at 7-15% for modern models
- **Resolution matters**: LLaVA-1.5 at 336px significantly outperforms 224px; some models now support up to 1344px for detail-dense images

## Common Misconceptions

- **"CIDEr score directly measures caption quality."** CIDEr measures n-gram overlap with reference captions. A model scoring 145 CIDEr may produce bland, generic captions that match references well but lack the richness humans expect. Human evaluation often disagrees with automatic metrics.

- **"Captioning models understand the image."** These models learn statistical correlations between visual patterns and language. They often fail on spatial relationships ("the cat is behind the dog"), counting ("three birds on a wire"), and uncommon compositions.

- **"Multimodal LLMs have solved captioning."** While LLaVA and GPT-4V generate impressively fluent descriptions, they hallucinate objects, misidentify fine-grained categories, and struggle with precise spatial descriptions. The gap to human-level captioning remains significant for detailed, factually accurate descriptions.

- **"More detail is always better."** Verbose captions from LLMs may score poorly on CIDEr (designed for concise captions) and can include hallucinated details. The optimal caption length depends on the application.

## Connections to Other Concepts

- **CLIP**: Provides the image encoder for BLIP-2, LLaVA, and many modern captioning models; its embedding space enables contrastive pretraining.
- **Visual Question Answering**: Captioning and VQA share encoder-decoder architectures; VQA can be seen as conditional captioning where the condition is a question.
- **Text-to-Image Generation**: The inverse of captioning -- generating images from text rather than text from images. Both require cross-modal understanding.
- **Vision Transformers**: ViTs serve as the image encoder in all modern captioning architectures.
- **Vision Foundation Models**: Captioning capability is a key benchmark for evaluating general-purpose vision-language models.

## Further Reading

- Xu et al., "Show, Attend and Tell: Neural Image Caption Generation with Visual Attention" (2015) -- Introduced visual attention for captioning.
- Li et al., "BLIP: Bootstrapping Language-Image Pre-training for Unified Vision-Language Understanding and Generation" (2022) -- CapFilt paradigm.
- Li et al., "BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models" (2023) -- Q-Former bridge architecture.
- Liu et al., "Visual Instruction Tuning" (LLaVA, 2023) -- Multimodal LLM for conversational captioning and reasoning.
- Yu et al., "CoCa: Contrastive Captioners are Image-Text Foundation Models" (2022) -- Unified contrastive and captioning pretraining.
