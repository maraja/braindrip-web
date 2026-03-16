# Visual Question Answering

**One-Line Summary**: Answering natural language questions about images by jointly reasoning over visual and textual information -- a fundamental test of multimodal understanding that exposes the tension between genuine reasoning and superficial language bias.

**Prerequisites**: `multimodal-nlp.md`, `attention-mechanism.md`, `bert.md`, `text-classification.md`, `question-answering.md`

## What Is Visual Question Answering?

Imagine showing a friend a photograph and asking, "What color is the umbrella the woman on the left is holding?" Your friend must parse the question linguistically (understanding the nested reference), locate the relevant region in the image (the woman on the left, specifically her umbrella), extract the visual attribute (color), and produce a natural language answer. This seemingly simple interaction requires the tight integration of language comprehension, visual perception, spatial reasoning, and world knowledge.

Visual question answering (VQA) formalizes this task: given an image and a free-form natural language question about that image, produce a correct natural language answer. VQA is significant not because answering questions about images is itself a killer application, but because it serves as a litmus test for genuine multimodal understanding. A system that can answer arbitrary questions about arbitrary images must, in principle, understand both modalities deeply and reason across them. In practice, as we will see, many systems learned to cheat -- answering questions from language patterns alone without truly "looking" at the image.

## How It Works

### Task Formulation

VQA is most commonly formulated as a multi-class classification problem rather than open-ended generation. Given image I and question Q, predict answer a from a vocabulary of the most frequent ~3,129 answers (covering ~90% of the VQA v2.0 training answers). The model outputs:

```
a* = argmax P(a | I, Q)
```

Each (image, question) pair in VQA v2.0 has 10 human-provided answers. The accuracy is computed using soft scoring: an answer gets full credit if at least 3 annotators gave that exact answer, partial credit otherwise:

```
Accuracy = min(count(answer) / 3, 1)
```

### VQA Datasets

**VQA v1.0** (Antol et al., 2015): The original VQA dataset with ~614K questions on ~204K MS COCO images. Questions span "yes/no" (38%), "number" (12%), and "other" (50%) types. VQA v1.0 suffered from severe language priors -- models could achieve ~44% accuracy by answering based solely on the question, without seeing the image (e.g., always answering "2" for "How many..." or "yes" for "Is there a...").

**VQA v2.0** (Goyal et al., 2017): Specifically designed to reduce language bias by adding complementary image pairs. For each question, the dataset includes two similar images with different answers. For example, the question "What color is the car?" is paired with an image of a red car and an image of a blue car. This roughly doubled the dataset to ~1.1M questions on ~204K images and made it much harder for language-only models.

**CLEVR** (Johnson et al., 2017): A synthetic dataset of rendered 3D scenes with compositional questions testing spatial reasoning, counting, attribute comparison, and logical operations. CLEVR questions are generated from functional programs, providing full reasoning traces. Human accuracy is ~92%; neural module networks achieve ~99%.

**GQA** (Hudson & Manning, 2019): 22M questions on real-world images, generated from scene graphs to ensure balanced answer distributions and compositional reasoning. GQA includes consistency, validity, plausibility, and distribution metrics beyond accuracy.

### Approaches

**Joint Embedding Models (2015--2017)**: The earliest neural VQA approaches encoded the image with a CNN (VGGNet, ResNet) into a single global feature vector and the question with an LSTM into a sentence vector. These vectors were combined via element-wise multiplication, concatenation, or multilinear pooling and fed to a classifier. Simple but limited by the global image representation.

**Attention-Based Models (2016--2019)**: Stacked Attention Networks (Yang et al., 2016) introduced visual attention for VQA -- using the question to attend over spatial image regions (typically a 7x7 or 14x14 grid from the CNN). Bottom-Up Top-Down attention (Anderson et al., 2018) replaced grid features with object-level features from Faster R-CNN, detecting ~36 salient regions per image. This model won the 2017 VQA Challenge with 70.3% accuracy on VQA v2.0 test-standard.

**Transformer-Based Models (2019--present)**: ViLBERT (Lu et al., 2019) introduced co-attentional transformer layers processing image regions and text tokens in parallel streams with cross-modal attention. LXMERT (Tan & Bansal, 2019) used separate object-relationship and language encoders connected by a cross-modality encoder. UNITER (Chen et al., 2020) unified nine vision-language tasks in a single pre-trained model, achieving 73.82% on VQA v2.0.

**Multimodal LLM Approaches (2023--present)**: Models like PaLI (Chen et al., 2022), Flamingo (Alayrac et al., 2022), and GPT-4V treat VQA as open-ended text generation rather than classification. PaLI-X (55B parameters) achieved 86.1% on VQA v2.0 test-standard. These models handle arbitrary questions, including those requiring multi-step reasoning, OCR, and external knowledge, without being constrained to a fixed answer vocabulary.

### The Language Bias Problem

VQA's most instructive contribution to the field is exposing how easily models exploit statistical shortcuts. Agrawal et al. (2016) demonstrated that a question-only model (no image input) achieves ~44% accuracy on VQA v1.0 -- models learn that "How many..." questions are usually answered with "2," "What sport..." questions with "tennis," and "Is there a..." questions with "yes."

Even with VQA v2.0's balanced pairs, language bias persists. Models perform significantly better on "easy" questions where language priors align with the correct answer than on "hard" questions where they conflict. Debiasing techniques include:

- **Adversarial regularization**: Training a question-only branch and penalizing the full model for relying on its predictions (RUBi, Cadene et al., 2019).
- **Counterfactual data augmentation**: Generating synthetic (image, question, answer) triples with altered visual content.
- **Explicit grounding losses**: Penalizing models that attend to irrelevant image regions.

## Why It Matters

1. **Benchmark for multimodal reasoning**: VQA serves as a litmus test for whether models genuinely integrate visual and linguistic understanding, or merely exploit surface patterns.
2. **Accessibility**: VQA systems can describe visual content for visually impaired users in response to specific questions, more useful than generic captions (see `image-captioning.md`).
3. **Visual search and e-commerce**: Answering product-related questions from images ("Is this jacket machine washable?" while looking at the care label) has direct commercial value.
4. **Exposing model weaknesses**: The language bias problem revealed fundamental issues with how models learn, influencing broader AI safety and robustness research relevant to `bias-in-nlp.md`.
5. **Medical and scientific applications**: VQA applied to medical images, charts, and scientific figures enables interactive exploration of visual data by non-experts.

## Key Technical Details

- VQA v2.0 contains ~1.1M questions on ~204K COCO images with 10 human answers per question. The answer vocabulary of 3,129 answers covers ~90% of training instances.
- Bottom-Up features (Anderson et al., 2018): Faster R-CNN with ResNet-101 backbone pre-trained on Visual Genome, extracting 10--100 (typically 36) region proposals per image, each represented as a 2,048-dimensional feature vector.
- State-of-the-art on VQA v2.0 test-standard: PaLI-X at 86.1% (generative), with earlier discriminative models at ~80%. Human accuracy is approximately 83%.
- On CLEVR, neural module networks achieve ~99.1% accuracy, demonstrating that compositional reasoning can be solved with appropriate architectural inductive biases.
- GQA accuracy: human performance ~89.3%; current SOTA ~75% for fine-tuned models, indicating substantial room for improvement on real-world compositional reasoning.
- Training VQA models typically requires ~100K--1M question-image pairs; multimodal LLMs amortize this across billions of image-text pre-training pairs.

## Common Misconceptions

- **"High VQA accuracy means the model truly understands images."** Many VQA questions can be answered from language priors, common sense, or superficial visual features (e.g., detecting dominant colors). Consistency metrics, compositional tests, and adversarial evaluation provide more reliable assessments than aggregate accuracy.

- **"VQA is just image classification with extra steps."** While some VQA questions reduce to classification ("What animal is this?"), many require spatial reasoning ("Is the cat on the table or under it?"), counting, reading text in images, understanding actions, or integrating external knowledge -- capabilities beyond standard classification.

- **"Free-form answer generation is always better than classification."** Classification over a fixed answer vocabulary enables efficient training and evaluation, and covers ~90% of natural VQA questions. Generative approaches shine for long-tail answers, numerical reasoning, and open-ended questions but introduce evaluation challenges (how to score "a brown and white dog" vs. "a beagle").

- **"Synthetic datasets like CLEVR are toy problems."** CLEVR was instrumental in diagnosing compositional reasoning failures and inspiring architectures (neural module networks, relation networks) that improved reasoning on real-world datasets. Controlled benchmarks remain essential for understanding what models can and cannot do.

## Connections to Other Concepts

- `multimodal-nlp.md`: VQA is one of the primary evaluation tasks for multimodal models, driving advances in vision-language pre-training.
- `image-captioning.md`: Captioning and VQA are complementary tasks -- captioning generates descriptions, VQA answers specific questions. Both require grounding language in visual content.
- `question-answering.md`: Text-based QA shares the question understanding component, and extractive QA methods inspired early VQA attention mechanisms.
- `attention-mechanism.md`: Visual attention in VQA (attending to relevant image regions based on the question) is one of the most intuitive demonstrations of the attention mechanism.
- `text-classification.md`: VQA formulated as classification over answer candidates is a multimodal extension of text classification.
- `bias-in-nlp.md`: Language bias in VQA is a canonical example of shortcut learning, relevant to broader discussions of bias and robustness in NLP.
- `document-understanding.md`: Document QA (DocVQA) extends VQA to visually rich documents, requiring OCR and layout understanding.

## Further Reading

- Antol et al., "VQA: Visual Question Answering" (2015) -- The original VQA dataset and task definition.
- Goyal et al., "Making the V in VQA Matter: Elevating the Role of Image Understanding in Visual Question Answering" (2017) -- VQA v2.0 with balanced image pairs to reduce language bias.
- Anderson et al., "Bottom-Up and Top-Down Attention for Image Captioning and Visual Question Answering" (2018) -- Object-level attention features that became the standard for VQA.
- Johnson et al., "CLEVR: A Diagnostic Dataset for Compositional Language and Elementary Visual Reasoning" (2017) -- Synthetic benchmark for testing compositional reasoning.
- Hudson & Manning, "GQA: A New Dataset for Real-World Visual Reasoning and Compositional Question Answering" (2019) -- Scene-graph-based questions with compositional reasoning metrics.
- Agrawal et al., "Analyzing the Behavior of Visual Question Answering Models" (2016) -- Diagnosing language bias and shortcut learning in VQA.
