# Visual Question Answering (VQA)

**One-Line Summary**: Visual question answering requires models to answer free-form natural language questions about images, demanding joint reasoning over visual content and linguistic structure.

**Prerequisites**: Image captioning, attention mechanisms, transformers, CLIP, multimodal fusion, encoder-decoder architectures

## What Is Visual Question Answering?

Think of VQA as an open-book exam where the textbook is a photograph. A student (the model) sees an image and reads a question about it -- "How many people are wearing hats?" or "What color is the car on the left?" -- and must produce the correct answer. Unlike image classification (which picks from fixed categories) or captioning (which describes freely), VQA requires targeted comprehension: the model must understand what is being asked, locate the relevant visual evidence, and reason to produce a specific answer.

Formally, VQA maps an image $\mathbf{x}$ and a question $\mathbf{q} = (q_1, \ldots, q_L)$ to an answer $\mathbf{a}$:

$$\hat{\mathbf{a}} = \arg\max_{\mathbf{a}} P(\mathbf{a} | \mathbf{x}, \mathbf{q})$$

The answer can be a single word, a short phrase, or a full sentence depending on the formulation.

## How It Works

### Task Formulations

VQA has been approached in three main ways:

1. **Classification over a fixed answer set**: Treat VQA as selecting from the top 3,129 most frequent answers in the training set. Simple but limited.
2. **Generative (open-ended)**: Generate the answer token by token, allowing arbitrary responses. More flexible but harder to evaluate.
3. **Multiple choice**: Select from provided answer options. Used in some benchmarks (VCR, A-OKVQA) for unambiguous evaluation.

### Fusion Architectures

The core challenge is how to combine visual and textual information:

**Early fusion:**
- Concatenate image features and question features before processing
- Simple but limited interaction between modalities

**Late fusion:**
- Process image and question independently, combine only at the prediction layer
- Misses fine-grained cross-modal interactions

**Cross-attention fusion (dominant approach):**
- Question tokens attend to image regions (or patches) via cross-attention layers:

$$\text{Attention}(\mathbf{Q}_{\text{text}}, \mathbf{K}_{\text{image}}, \mathbf{V}_{\text{image}}) = \text{softmax}\left(\frac{\mathbf{Q}_{\text{text}} \mathbf{K}_{\text{image}}^T}{\sqrt{d_k}}\right) \mathbf{V}_{\text{image}}$$

- This allows the model to "look at" different image regions depending on the question
- Used in BAN, MCAN, and all modern Transformer-based approaches

### Evolution of VQA Models

**Phase 1: CNN + LSTM (2015-2018)**
- Extract image features with a CNN (VGG, ResNet)
- Encode the question with an LSTM
- Fuse via element-wise multiplication or concatenation
- Classify over the answer vocabulary
- VQA v1 challenge winner: ~58% accuracy

**Phase 2: Attention-based (2016-2020)**
- Bottom-Up and Top-Down Attention (Anderson et al., 2018): Use Faster R-CNN to extract 36 region features per image, then apply attention weighted by the question
- Achieved 70.3% on VQA v2.0 -- a landmark result that dominated for two years
- Introduced the concept of object-centric visual features for VQA

**Phase 3: Pretrained Vision-Language Models (2019-2022)**
- **ViLBERT** (2019): Two-stream Transformer with co-attention, pretrained on Conceptual Captions
- **LXMERT** (2019): Cross-modal Transformer with separate visual, language, and cross-modal encoders
- **UNITER** (2020): Single-stream Transformer processing concatenated visual and textual tokens
- **VinVL** (2021): Improved object features + OSCAR pretraining, 76.6% on VQA v2.0

**Phase 4: Multimodal LLMs (2023-present)**
- **BLIP-2** (2023): Q-Former bridges frozen ViT and frozen LLM; 82.2% on VQA v2.0 (with FlanT5-XXL)
- **LLaVA-1.5** (2023): CLIP ViT + Vicuna with MLP connector; competitive VQA performance with instruction tuning on 665K samples
- **InstructBLIP** (2023): Instruction-aware Q-Former; 82.4% on VQA v2.0
- These models treat VQA as a special case of visual instruction following

### Evaluation Metrics

The standard VQA v2.0 metric accounts for human disagreement:

$$\text{Accuracy} = \min\left(\frac{\text{# humans that gave that answer}}{3}, 1\right)$$

An answer is considered 100% correct if at least 3 out of 10 annotators gave the same answer. This soft metric acknowledges that reasonable people may answer the same question differently.

## Why It Matters

1. **Benchmarks multimodal understanding**: VQA tests whether models truly integrate visual and linguistic reasoning, not just pattern matching in either modality alone.
2. **Assistive technology**: VQA enables visually impaired users to ask questions about their surroundings -- "Is the stove on?" or "What does this sign say?"
3. **Visual search and analytics**: Business applications include querying visual databases ("How many red cars are in this parking lot?") and automated report generation.
4. **Medical imaging**: VQA models adapted for radiology can answer questions about X-rays and CT scans, supporting clinical decision-making.
5. **Driving multimodal AI research**: VQA has been a primary benchmark for measuring progress in vision-language models, pushing the field toward general-purpose multimodal systems.

## Key Technical Details

- **VQA v2.0 dataset**: 1.1M questions on 204K COCO images, with 10 human answers per question; balanced to reduce language bias
- **Accuracy progression**: Simple baselines ~50% (2015); attention models ~70% (2018); pretrained VL models ~76% (2021); multimodal LLMs ~82% (2023); human performance ~83%
- **Language bias**: A text-only model (no image) achieves ~44% on VQA v1.0, exposing severe dataset bias; VQA v2.0 reduced this to ~28% by adding complementary image pairs
- **Question types**: "Yes/No" (~38%), "Number" (~12%), "Other" (~50%) in VQA v2.0; models are strongest on Yes/No and weakest on counting
- **Region features**: Bottom-Up features (36 regions from Faster R-CNN) dominated for 3+ years; now replaced by ViT patch features in modern architectures
- **Out-of-domain VQA**: GQA (Hudson & Manning, 2019) tests compositional reasoning; OK-VQA requires external knowledge; TextVQA requires reading text in images

## Common Misconceptions

- **"High VQA accuracy means the model understands the image."** Models exploit strong language priors. For "What sport is being played?" the answer "tennis" is often correct without looking at the image. Adversarial benchmarks like VQA-CP reveal accuracy drops of 20+ points when priors are broken.

- **"VQA is a solved problem."** While headline numbers approach human performance (~82% vs ~83% on VQA v2.0), models still fail catastrophically on compositional questions, counting, spatial reasoning, and questions requiring world knowledge.

- **"Open-ended VQA is fundamentally different from classification VQA."** In practice, 82% of VQA v2.0 answers come from a vocabulary of just 3,129 words. Generative models produce the same short answers; the two formulations converge on common benchmarks.

- **"Bigger language models always help VQA."** Scaling the LLM backbone helps knowledge-intensive questions but can hurt on visual grounding tasks where the model may "hallucinate" plausible-sounding answers instead of attending to the image.

## Connections to Other Concepts

- **Image Captioning**: VQA can be viewed as conditional captioning where the condition is a question. Both tasks share encoder-decoder architectures and attention mechanisms.
- **CLIP**: CLIP embeddings provide the visual backbone for modern VQA models (BLIP-2, LLaVA) and enable zero-shot VQA without task-specific training.
- **Vision Foundation Models**: VQA performance is a key evaluation axis for general-purpose vision-language models.
- **Zero-Shot Classification**: VQA subsumes classification -- "What object is in this image?" with a constrained answer set is equivalent to classification.
- **Visual Question Answering Datasets**: VQA v2.0, GQA, OK-VQA, TextVQA, VizWiz each test different capabilities and expose different model weaknesses.

## Further Reading

- Antol et al., "VQA: Visual Question Answering" (2015) -- Original VQA dataset and task definition.
- Anderson et al., "Bottom-Up and Top-Down Attention for Image Captioning and Visual Question Answering" (2018) -- Region-based features that dominated for years.
- Goyal et al., "Making the V in VQA Matter" (2017) -- VQA v2.0 with balanced pairs to reduce language bias.
- Li et al., "BLIP-2: Bootstrapping Language-Image Pre-training with Frozen Image Encoders and Large Language Models" (2023) -- Q-Former architecture for efficient VQA.
- Liu et al., "Improved Baselines with Visual Instruction Tuning" (LLaVA-1.5, 2023) -- Simple but effective multimodal LLM for VQA.
