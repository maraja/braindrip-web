# Segment Anything

**One-Line Summary**: The Segment Anything Model (SAM) is a foundation model for image segmentation trained on over 1 billion masks, capable of zero-shot, promptable segmentation of any object in any image without task-specific fine-tuning.

**Prerequisites**: Instance segmentation, semantic segmentation, vision transformers (ViT), transfer learning, prompt engineering, self-supervised and supervised pretraining

## What Is Segment Anything?

Imagine a segmentation assistant that has seen so many objects that it can outline *anything* you point to -- a cell under a microscope, a building in a satellite photo, or a dog in a home video -- without ever having been specifically trained on cells, buildings, or dogs. You just click on the object, draw a rough box, or type "the red car," and the model produces a precise mask. That is the aspiration behind SAM.

Released by Meta AI (Kirillov et al., 2023), SAM represents a paradigm shift: instead of training a separate model for each segmentation task, train one model on an enormous, diverse dataset and use **prompts** (points, boxes, masks, or text) to specify what to segment at inference time. This mirrors the foundation-model revolution in NLP (GPT, BERT) but applied to visual segmentation.

SAM was trained on SA-1B, a dataset of over 1.1 billion masks across 11 million images -- more than 400x the size of any prior segmentation dataset.

## How It Works

### Architecture: Three Components

**1. Image Encoder**

A Vision Transformer (ViT-H by default) that processes the input image once to produce image embeddings:
- Input: 1024x1024 image (resized and padded).
- Architecture: ViT-H with 632M parameters, pre-trained with MAE (Masked Autoencoder).
- Output: 64x64 spatial embedding grid with 256 channels.
- This is the expensive step (~0.15s on an A100). Crucially, it runs only once per image regardless of how many prompts follow.

**2. Prompt Encoder**

Encodes the user's prompt into a format compatible with the mask decoder:
- **Point prompts**: each (x, y) coordinate is encoded with positional encoding + a learned embedding indicating foreground or background.
- **Box prompts**: encoded as a pair of corner points.
- **Mask prompts**: downsampled to 4x lower resolution and processed with two convolution layers.
- **Text prompts**: (in later versions) encoded with a text encoder like CLIP.

The prompt encoder is lightweight -- it adds negligible compute.

**3. Mask Decoder**

A lightweight transformer decoder that combines image embeddings with prompt tokens to produce masks:
- Two transformer decoder layers with cross-attention between prompt tokens and image embeddings.
- Outputs: 3 mask predictions (for ambiguity resolution) + per-mask IoU confidence scores.
- Each mask is predicted as a 256x256 low-resolution map, then upsampled to the original resolution.
- Total decoder parameters: ~4M. Runs in ~50ms even on CPU.

```
Image (1024x1024) -> Image Encoder (ViT-H) -> Image Embedding (64x64x256)
                                                        |
Prompt (points/boxes/mask) -> Prompt Encoder -----> Mask Decoder -> 3 Masks + IoU scores
                                                        |
                                                  256x256 -> Upsample -> Full resolution
```

### Ambiguity-Aware Output

A single point click can be ambiguous: clicking on a person's eye could mean "the eye," "the face," or "the whole person." SAM addresses this by predicting **three masks at different granularity levels** and a confidence score for each. The user or downstream system selects the appropriate one.

### Data Engine and SA-1B Dataset

SAM's dataset was built in three phases:

1. **Assisted-manual** (4.3M masks): human annotators used SAM (early version) as a tool, correcting and adding masks.
2. **Semi-automatic** (5.9M masks): SAM generated confident masks automatically; annotators labeled remaining unannotated objects.
3. **Fully automatic** (1.1B masks): SAM was prompted with a 32x32 grid of points over each image, generating masks everywhere, filtered by confidence and NMS.

SA-1B statistics: 11M images, 1.1B masks, average 100 masks per image. Images were licensed from a photo provider with geographic and demographic diversity measures.

### Training

- **Loss**: focal loss + dice loss on the predicted masks, plus MSE on IoU predictions.
- **Prompt simulation**: during training, prompts are simulated by sampling foreground/background points and bounding boxes from ground-truth masks.
- **Training compute**: 256 A100 GPUs for 3--5 days.

## Why It Matters

1. **Zero-shot transfer**: SAM segments objects in domains it was never explicitly trained on -- satellite imagery, microscopy, underwater photography, X-rays -- with competitive or near-competitive performance.
2. **Interactive annotation**: SAM dramatically accelerates data labeling. Annotators can click a few points and get a high-quality mask in milliseconds, reducing per-mask annotation time from ~30 seconds to ~5 seconds.
3. **Foundation model for vision**: SAM established that the foundation-model paradigm (scale data and model, then prompt) works for dense vision tasks, not just language.
4. **Composable building block**: SAM's masks can be fed into downstream systems for tracking (SAM-Track), 3D reconstruction (SA3D), medical analysis, or any task needing object boundaries.
5. **Open research**: Meta released the model weights, dataset, and demo, enabling widespread academic and industrial adoption.

## Key Technical Details

- SAM ViT-H has 632M parameters (image encoder) + ~4M (mask decoder). Total ~636M.
- Image encoder throughput: ~6.7 images/second on a single A100 GPU.
- Mask decoder throughput: after encoding, each prompt produces masks in ~50ms on a V100 GPU.
- SA-1B contains 400x more masks than the next largest dataset (Open Images V5 with 2.7M masks).
- On 23 diverse zero-shot benchmarks, SAM's automatic mask generation achieves comparable or better quality than prior task-specific models for many domains.
- SAM's mask quality (measured by human ratings) shows 94% of generated masks are rated as high quality.
- SAM 2 (Ravi et al., 2024) extends the framework to video, adding temporal memory for consistent mask tracking across frames, trained on SA-V (50.9k videos, 642.6k masklets).
- EfficientSAM and MobileSAM distill the ViT-H encoder into smaller backbones (ViT-Tiny), achieving 20x speedup with modest quality loss.

## Common Misconceptions

- **"SAM is a complete segmentation solution."** SAM produces class-agnostic masks. It does not classify objects -- it does not know that a mask is a "cat" vs. a "dog." For semantic or panoptic segmentation, SAM must be combined with a classifier.
- **"SAM works equally well on all domains."** While zero-shot performance is impressive, SAM underperforms specialized models on domains with very different visual characteristics (e.g., medical imaging with low contrast, or satellite imagery with tiny objects). Fine-tuning helps significantly.
- **"SAM replaces the need for labeled data."** SAM reduces annotation effort but does not eliminate it. Task-specific labels (class names, relationships, attributes) still require human input. SAM accelerates the mask-drawing step.
- **"The image encoder must run for every prompt."** The encoder runs once per image. Subsequent prompts on the same image only require the lightweight decoder, enabling real-time interactive segmentation.

## Connections to Other Concepts

- **Instance Segmentation**: SAM produces instance-level masks but without class labels; it is class-agnostic instance segmentation.
- **Semantic Segmentation**: SAM does not perform semantic segmentation directly but can provide mask proposals that a semantic classifier labels.
- **Panoptic Segmentation**: SAM's automatic mask generation produces a set of non-overlapping masks resembling panoptic output, though without semantic labels.
- **Mask R-CNN**: SAM generalizes the idea of mask prediction but decouples it from class-specific detection.
- **U-Net**: domain-specific U-Net models still outperform SAM on specialized tasks (e.g., cell segmentation) without fine-tuning, but SAM fine-tuned variants are closing the gap.

## Further Reading

- Kirillov et al., "Segment Anything" (2023) -- The original SAM paper introducing the model, dataset, and data engine.
- Ravi et al., "SAM 2: Segment Anything in Images and Videos" (2024) -- Extension to video with streaming memory.
- Zhao et al., "Fast Segment Anything" (2023) -- Distilled SAM for real-time applications.
- Ma et al., "Segment Anything in Medical Images" (MedSAM, 2024) -- Fine-tuning SAM for medical imaging across 10 modalities.
- Zhang et al., "A Comprehensive Survey on Segment Anything Model for Vision and Beyond" (2024) -- Survey covering SAM's impact and applications.
