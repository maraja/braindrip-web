# Video Generation

**One-Line Summary**: Video generation extends image synthesis to the temporal domain, using diffusion models or autoregressive approaches to produce temporally coherent frame sequences while battling flickering, motion artifacts, and immense computational costs.

**Prerequisites**: Diffusion models, latent diffusion, variational autoencoders, transformer architectures, video representation, 3D convolutions

## What Is Video Generation?

Consider an animator drawing a cartoon: each frame must look good individually, but more critically, consecutive frames must flow smoothly -- characters cannot teleport, lighting cannot flicker randomly, and objects must move physically plausibly. A single badly drawn frame breaks the entire illusion. Video generation faces this same challenge computationally: it must produce not just one photorealistic image but tens to hundreds of images that are individually high-quality AND temporally consistent.

Video generation is the task of synthesizing a sequence of video frames, either unconditionally, from text prompts (text-to-video), from a single image (image-to-video), or by extending an existing clip. Formally, the model generates a tensor $V \in \mathbb{R}^{T \times H \times W \times 3}$ where all frames must exhibit spatial quality (sharp, realistic content), temporal coherence (smooth motion without flickering), and semantic fidelity (matching any conditioning signal like text).

## How It Works

### The Temporal Coherence Challenge

The fundamental difficulty of video generation is maintaining consistency across frames. Sources of temporal incoherence include:

- **Flickering**: High-frequency random variations in pixel values between frames, visible as shimmering textures
- **Object identity drift**: Characters or objects gradually changing appearance (hair color, clothing) over time
- **Motion artifacts**: Physically implausible movements -- limbs bending incorrectly, objects passing through each other
- **Temporal aliasing**: Abrupt transitions or discontinuities between frames

Image diffusion models applied independently per frame produce visually appealing but temporally incoherent results. Solving this requires explicit temporal modeling.

### Diffusion-Based Video Generation

The dominant approach extends latent diffusion models (LDMs) to video:

**Spatial-temporal VAE**: First, a video VAE compresses $T \times H \times W \times 3$ into a latent representation $T' \times H' \times W' \times C$, with spatial downsampling (typically 8x) and optional temporal downsampling (2--4x). This drastically reduces computation: a 16-frame 512x512 video compresses from ~12M pixels to ~100k latent elements.

**3D UNet / DiT with temporal layers**: The denoising network alternates between:
1. Spatial layers (2D convolutions or spatial self-attention) -- process each frame independently
2. Temporal layers (1D temporal convolutions or temporal self-attention) -- process each spatial position across time

This factorized design mirrors TimeSformer's divided attention. The temporal layers are often initialized from pretrained image models by inserting new temporal modules and fine-tuning.

**Training objective**: Same as image diffusion but applied to video latents:

$$\mathcal{L} = \mathbb{E}_{z_0, \epsilon, t}\left[\|\epsilon - \epsilon_\theta(z_t, t, c)\|^2\right]$$

where $z_0$ is the encoded video, $\epsilon$ is noise, $t$ is the diffusion timestep, and $c$ is the conditioning (text embedding).

### Autoregressive Video Generation

An alternative approach generates frames sequentially:

1. Generate frame 1 from text
2. Generate frame 2 conditioned on frame 1 (and text)
3. Continue for $T$ frames

**Advantages**: Natural handling of variable-length videos; can generate arbitrarily long sequences. Each step only needs to produce one frame.

**Disadvantages**: Error accumulation causes quality degradation and drift over long sequences. Each frame depends on all previous frames, making parallel generation impossible. Typically generates 1--4 frames per forward pass to mitigate drift.

Hybrid approaches (e.g., generating keyframes with diffusion, then interpolating with autoregressive or diffusion-based interpolation) combine the strengths of both paradigms.

### Key Systems

**Stable Video Diffusion (SVD)** (Blattmann et al., 2023): Image-to-video model based on Stable Diffusion. Takes a single image and generates 14--25 frames at 576x1024. Uses a 3D UNet with temporal attention and convolution layers inserted into the pretrained image model. The temporal layers are trained on a curated video dataset after the spatial layers are frozen.

**Runway Gen-2/Gen-3** (2023--2024): Commercial text-to-video and image-to-video models. Gen-3 Alpha produces clips up to 10 seconds at 720p/1080p. Architecture details are proprietary but understood to use diffusion with transformer-based backbones.

**Sora** (OpenAI, 2024): Text-to-video model generating up to 60 seconds of 1080p video. Key technical aspects (based on the technical report):
- Uses a Diffusion Transformer (DiT) architecture operating on spacetime patches
- Trained on variable-resolution and variable-duration videos (no fixed aspect ratio)
- Operates in a compressed latent space
- Demonstrates emergent 3D consistency and long-range coherence
- Can perform image-to-video, video extension, and video editing

**CogVideoX** (Yang et al., 2024): Open-source text-to-video model using a 3D VAE and expert transformer architecture. Generates 6-second clips at 720x480, 8 FPS.

### Evaluation Metrics

Video generation quality is notoriously difficult to evaluate:

- **FVD (Frechet Video Distance)**: Extension of FID to video using I3D features. Measures distributional similarity between generated and real videos. Lower is better; values below 300 indicate reasonable quality on UCF-101.
- **FID per frame**: Measures individual frame quality but ignores temporal coherence.
- **CLIPSIM**: Cosine similarity between CLIP embeddings of generated frames and text prompts.
- **Temporal consistency**: Optical flow-based metrics measuring smoothness of motion between consecutive frames.
- **Human evaluation**: Remains the gold standard. Typical protocols ask raters to evaluate realism, temporal coherence, and text alignment on Likert scales.

### Computational Requirements

Video generation is extraordinarily expensive:

- Training Sora-class models: estimated thousands of A100/H100 GPU-months
- SVD training: ~150k GPU-hours on A100s
- Inference for a single 4-second 512x512 clip: 30--120 seconds on a single A100 (diffusion with 50 sampling steps)
- Memory: generating 16 frames at 512x512 in latent space requires ~20--40 GB GPU memory
- Generating 1 minute of 1080p video can take 10--30 minutes on high-end hardware

## Why It Matters

1. **Content creation**: Video generation enables filmmakers, advertisers, and content creators to produce footage without physical cameras, actors, or locations. Estimated to reduce production costs for certain content types by an order of magnitude.
2. **Simulation and training data**: Generated video can provide synthetic training data for self-driving (diverse weather, rare scenarios), robotics (manipulation demonstrations), and other domains where real data is expensive or dangerous to collect.
3. **Accessibility**: Text-to-video lowers the barrier for video creation, enabling people without filmmaking expertise to produce visual content.
4. **World models**: Video generation models implicitly learn physics, object permanence, and 3D structure. Sora's technical report explicitly frames the model as a "world simulator," suggesting connections to planning and reasoning in AI.

## Key Technical Details

- SVD: 14--25 frames at 576x1024, image-conditioned, ~1.5B parameters
- CogVideoX: 49 frames at 720x480, text-conditioned, 5B parameters
- Sora: up to 60s at 1080p (estimated 3--10B+ parameters, not publicly confirmed)
- FVD scores: UCF-101 class-conditional generation -- best models achieve FVD ~90--150
- Typical training data: WebVid-10M (10M text-video pairs), HD-VILA-100M, InternVid (234M clips), plus proprietary datasets
- Latent space compression: 8x spatial, 4x temporal is common, reducing compute by ~256x vs. pixel space
- Sampling: DDPM (1000 steps), DDIM (50--200 steps), DPM-Solver (20--50 steps); video models typically use 50 steps
- Temporal attention memory scales as $O(T^2)$ per spatial position; at $T=64$, this is 16x the cost of single-frame generation

## Common Misconceptions

- **"Video generation is just image generation applied per frame."** Independent per-frame generation produces severe flickering and identity inconsistency. Temporal attention or convolution layers that enforce cross-frame coherence are essential components, not optional additions.
- **"Current models can generate arbitrary-length, high-resolution video."** Even the best models are limited to ~60 seconds at moderate resolution. Longer videos require autoregressive extension with quality degradation, and 4K generation remains impractical for real-time or interactive use.
- **"Video generation models understand physics."** While models like Sora exhibit impressive physical plausibility in many scenarios, they frequently violate physics in subtle and sometimes obvious ways: objects disappearing, gravity acting inconsistently, and impossible body configurations. The models learn statistical regularities, not physical laws.
- **"Diffusion is the only viable approach."** Autoregressive models and hybrid approaches are active research areas. Autoregressive methods may have advantages for very long video and interactive generation.

## Connections to Other Concepts

- **3D Convolutions**: Temporal convolution layers in video diffusion models draw directly from C3D/I3D architectural ideas.
- **Video Transformers**: DiT-based video generators (Sora, CogVideoX) use factorized spatiotemporal attention identical to TimeSformer/ViViT designs.
- **Optical Flow Estimation**: Flow-based metrics evaluate temporal coherence; flow can also guide video generation by specifying desired motion.
- **Video Representation**: The $T \times H \times W \times C$ tensor structure and temporal compression strategies from video understanding directly inform generative model design.
- **Action Recognition**: Generated videos are evaluated partly on whether recognizable actions are depicted correctly.

## Further Reading

- Ho et al., "Video Diffusion Models" (2022) -- Foundational work on extending diffusion to video with joint space-time denoising.
- Blattmann et al., "Stable Video Diffusion: Scaling Latent Video Diffusion Models to Large Datasets" (2023) -- Image-to-video generation using latent diffusion.
- Brooks et al., "Video Generation Models as World Simulators" (2024) -- Sora technical report describing DiT-based video generation.
- Yang et al., "CogVideoX: Text-to-Video Diffusion Models with An Expert Transformer" (2024) -- Open-source text-to-video with expert transformer architecture.
- Singer et al., "Make-A-Video: Text-to-Video Generation without Text-Video Data" (2022) -- Early text-to-video work leveraging text-to-image models.
