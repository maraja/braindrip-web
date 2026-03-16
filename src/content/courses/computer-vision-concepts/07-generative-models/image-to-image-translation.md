# Image-to-Image Translation

**One-Line Summary**: Image-to-image translation learns mappings between visual domains -- from sketches to photos, day to night, horses to zebras -- using paired supervision (Pix2Pix) or unpaired cycle-consistency constraints (CycleGAN).

**Prerequisites**: Generative adversarial networks, convolutional neural networks, U-Net architecture, perceptual loss

## What Is Image-to-Image Translation?

Imagine an artist who can take your rough pencil sketch and render it as a photorealistic painting, or take a daytime photograph and reimagine it at sunset. Image-to-image translation automates this: given an image in one visual domain, produce a corresponding image in another domain while preserving the underlying structure.

The key challenge is that this is fundamentally underdetermined -- many valid outputs exist for a given input. The field splits into two settings based on data availability: **paired** translation, where matching input-output examples exist, and **unpaired** translation, where only two unaligned collections of images are available.

## How It Works

### Pix2Pix (Paired Translation)

Isola et al. (2017) proposed a general-purpose framework for paired image-to-image translation using a conditional GAN:

$$\mathcal{L}_{\text{cGAN}} = \mathbb{E}_{x,y}[\log D(x, y)] + \mathbb{E}_{x,z}[\log(1 - D(x, G(x, z)))]$$

combined with an L1 reconstruction loss:

$$\mathcal{L}_{L1} = \mathbb{E}_{x,y}[\|y - G(x, z)\|_1]$$

The total objective is $\mathcal{L} = \mathcal{L}_{\text{cGAN}} + \lambda \mathcal{L}_{L1}$ with $\lambda = 100$.

**PatchGAN discriminator**: Rather than classifying the entire image as real or fake, the discriminator classifies each $N \times N$ patch independently and averages the results. With $N = 70$, this captures local texture quality while the L1 loss handles global coherence. The PatchGAN is fully convolutional, making it applicable to any input resolution.

**Generator architecture**: A U-Net with skip connections between corresponding encoder and decoder layers, preserving spatial detail that would otherwise be lost through the bottleneck.

Applications: semantic labels to street scenes, edges to photos, BW to color, day to night (all requiring paired training data).

### CycleGAN (Unpaired Translation)

Zhu et al. (2017) removed the need for paired data by introducing cycle consistency. Given two domains $X$ and $Y$ with no correspondence, CycleGAN trains two generators $G: X \to Y$ and $F: Y \to X$ with the constraint that translating and translating back should recover the original:

$$\mathcal{L}_{\text{cyc}} = \mathbb{E}_{x}[\|F(G(x)) - x\|_1] + \mathbb{E}_{y}[\|G(F(y)) - y\|_1]$$

The full objective combines adversarial losses for both directions plus cycle consistency:

$$\mathcal{L} = \mathcal{L}_{\text{GAN}}(G, D_Y) + \mathcal{L}_{\text{GAN}}(F, D_X) + \lambda \mathcal{L}_{\text{cyc}}$$

with $\lambda = 10$. An optional identity loss $\|G(y) - y\|_1$ helps preserve color when the input already belongs to the target domain.

### Limitations of Cycle Consistency

Cycle consistency constrains the mapping to be approximately bijective, which means:
- It cannot handle large geometric changes (e.g., cat to dog with different body structure).
- Information must be preserved somewhere in the translation, which can lead to steganographic encoding -- hiding information imperceptibly in the output to enable reconstruction.

### SPADE (Semantic Image Synthesis)

Park et al. (2019) introduced Spatially-Adaptive Normalization for generating photorealistic images from semantic segmentation maps. Instead of feeding the layout as input, SPADE modulates normalization parameters spatially:

$$\gamma_{c,y,x}(m) \frac{h_{c,y,x} - \mu_c}{\sigma_c} + \beta_{c,y,x}(m)$$

where $m$ is the segmentation map and $\gamma$, $\beta$ are learned spatial functions. This preserves semantic information that batch normalization would wash away, achieving FID of 22.6 on Cityscapes 256x256.

### Contrastive Unpaired Translation (CUT)

Park et al. (2020) replaced cycle consistency with contrastive learning. Corresponding patches between input and output should have similar features (positive pairs), while non-corresponding patches should differ (negative pairs). CUT requires only one generator (not two), halving memory and compute:

$$\mathcal{L}_{\text{PatchNCE}} = -\log \frac{\exp(v \cdot v^+ / \tau)}{\exp(v \cdot v^+ / \tau) + \sum_n \exp(v \cdot v_n^- / \tau)}$$

## Why It Matters

1. **Data augmentation**: Translate labeled data from synthetic to realistic domains (e.g., GTA5 to real street scenes) for training perception systems.
2. **Creative applications**: Photo editors use domain transfer for artistic style conversion, season changing, and material retexturing.
3. **Medical imaging**: Cross-modality translation (MRI to CT, staining normalization in histopathology) reduces the need for expensive multi-modal acquisition.
4. **Autonomous driving**: Synthesize rare conditions (night, rain, snow) from common daytime images for robust model training.
5. **Architectural visualization**: Convert floor plans and sketches to photorealistic renders.

## Key Technical Details

- Pix2Pix: 256x256 resolution, Adam optimizer ($\beta_1 = 0.5$, $\beta_2 = 0.999$), learning rate 0.0002, batch size 1 with instance normalization.
- CycleGAN: ResNet-based generator with 9 residual blocks for 256x256, 6 blocks for 128x128. Training: 200 epochs with linear LR decay over the last 100.
- PatchGAN receptive field: 70x70 pixels is the standard; larger patches did not improve quality in ablations.
- CycleGAN training time: ~24 hours on a single V100 for horse-to-zebra at 256x256.
- SPADE achieves mIoU of 62.3 on Cityscapes, meaning generated images are semantically faithful enough that a segmentation model recovers the input labels.

## Common Misconceptions

- **"CycleGAN produces the same quality as Pix2Pix."** When paired data exists, Pix2Pix consistently outperforms CycleGAN because direct supervision is stronger than cycle consistency.
- **"Unpaired translation can handle arbitrary domain gaps."** CycleGAN works best for appearance changes (texture, color, style) with preserved structure. It struggles with geometric or topological changes.
- **"L1 loss is enough for image translation."** L1 alone produces blurry averages. The adversarial loss is essential for sharp, realistic textures.
- **"Image translation is just a filter."** Unlike fixed filters, learned translation adapts to semantic content -- a horse-to-zebra model adds stripes only to the horse, not the grass.

## Connections to Other Concepts

- `generative-adversarial-networks.md`: Pix2Pix and CycleGAN are conditional GAN frameworks with specialized architectures and loss functions.
- `neural-style-transfer.md`: Style transfer can be seen as a special case of image-to-image translation where the target domain is defined by a single style image.
- `image-inpainting.md`: Inpainting fills missing regions, a constrained form of image-to-image translation from masked to complete images.
- `diffusion-models.md`: Modern diffusion-based approaches (InstructPix2Pix, SDEdit) are increasingly replacing GAN-based translation with text-guided editing.
- `image-super-resolution.md`: Super-resolution is image-to-image translation from low to high resolution.

## Further Reading

- Isola et al., "Image-to-Image Translation with Conditional Adversarial Networks" (2017) -- Pix2Pix establishing the paired translation framework with PatchGAN.
- Zhu et al., "Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks" (2017) -- CycleGAN and the cycle consistency principle.
- Park et al., "Semantic Image Synthesis with Spatially-Adaptive Normalization" (2019) -- SPADE for high-quality layout-to-image generation.
- Park et al., "Contrastive Learning for Unpaired Image-to-Image Translation" (2020) -- CUT replacing cycle consistency with patch-based contrastive loss.
- Wang et al., "High-Resolution Image Synthesis and Semantic Manipulation with Conditional GANs" (2018) -- Pix2PixHD scaling paired translation to 2048x1024.
