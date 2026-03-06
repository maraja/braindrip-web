# Generative Model Metrics

**One-Line Summary**: Generative model quality is measured by FID (distribution distance, lower is better), Inception Score (diversity and quality), CLIP Score (text-image alignment), LPIPS (perceptual similarity), and KID (unbiased small-sample alternative to FID).

**Prerequisites**: Generative Models, Convolutional Neural Networks, Feature Extraction, Probability and Statistics Basics

## What Are Generative Model Metrics?

Judging whether a generated image is "good" is notoriously subjective. One person might praise the detail; another might notice a distorted hand. Generative model metrics attempt to replace subjective judgment with reproducible, quantitative scores. They answer questions like: Does the distribution of generated images match real images? Are generated images diverse? Do they align with text prompts?

Technically, generative model metrics compare statistics of generated samples against reference datasets or evaluate alignment with conditioning inputs. No single metric captures all aspects of generation quality (fidelity, diversity, novelty, alignment), so multiple metrics are reported together. The field struggles with the fact that these metrics are imperfect proxies for human preference -- a tension that drives ongoing research.

## How It Works

### Frechet Inception Distance (FID)

FID (Heusel et al., 2017) is the most widely used metric for unconditional and class-conditional image generation.

**Procedure**:
1. Extract 2048-dimensional features from the penultimate layer of InceptionV3 for both real and generated images.
2. Fit a multivariate Gaussian $\mathcal{N}(\mu_r, \Sigma_r)$ to real features and $\mathcal{N}(\mu_g, \Sigma_g)$ to generated features.
3. Compute the Frechet distance (Wasserstein-2 distance between Gaussians):

$$FID = \|\mu_r - \mu_g\|^2 + \text{Tr}\left(\Sigma_r + \Sigma_g - 2(\Sigma_r \Sigma_g)^{1/2}\right)$$

**Interpretation**: FID = 0 means identical distributions; lower is better. FID captures both fidelity (are generated images realistic?) and diversity (do they cover the real distribution?). A model that generates only one perfect image scores poorly because $\Sigma_g$ collapses.

**Practical considerations**:
- Requires a minimum of ~10,000 generated samples for stable estimates; 50,000 is standard.
- The reference set matters: FID computed against ImageNet validation vs. training gives different values.
- FID is biased: it systematically overestimates the true distance with small sample sizes.

**Typical values**: StyleGAN3 on FFHQ-256: FID ~3--4. Latent Diffusion (Stable Diffusion) on LAION: FID ~5--10 on COCO-30K. Human-indistinguishable quality is generally considered FID < 10 on standard benchmarks.

### Inception Score (IS)

IS (Salimans et al., 2016) uses the InceptionV3 classifier to evaluate generated images.

$$IS = \exp\left(\mathbb{E}_x \left[D_{KL}(p(y|x) \| p(y))\right]\right)$$

where $p(y|x)$ is the InceptionV3 class prediction for a generated image $x$, and $p(y) = \mathbb{E}_x[p(y|x)]$ is the marginal class distribution.

**Interpretation**: High IS means each image is confidently classified (sharp $p(y|x)$, indicating quality) AND the overall distribution covers many classes (uniform $p(y)$, indicating diversity). Higher is better. Maximum IS on ImageNet is ~1,000 (one confident image per class).

**Limitations**:
- Only measures quality/diversity within ImageNet's 1,000 classes. Ignores intra-class diversity.
- Does not compare to real data -- a model generating only ImageNet-like images of non-existent classes could score well.
- Sensitive to InceptionV3 artifacts; images adversarially optimized for InceptionV3 can achieve high IS without visual quality.

**Typical values**: BigGAN on ImageNet-128: IS ~171. Real ImageNet images: IS ~331.

### CLIP Score

CLIP Score (Hessel et al., 2021) measures text-image alignment for text-to-image generation.

$$\text{CLIP Score} = \max(0, \cos(E_{img}(x), E_{txt}(t)))$$

where $E_{img}$ and $E_{txt}$ are CLIP's image and text encoders, and $t$ is the conditioning text prompt.

**Interpretation**: Higher CLIP Score means the generated image better matches the text description. This metric is essential for evaluating text-to-image models (DALL-E, Stable Diffusion, Midjourney) because FID does not measure prompt adherence.

**Limitations**: CLIP has its own biases -- it may score highly on images that match CLIP's learned associations rather than genuine semantic alignment. CLIP Score can conflict with FID: a model can optimize for prompt alignment at the expense of photorealism.

### Learned Perceptual Image Patch Similarity (LPIPS)

LPIPS (Zhang et al., 2018) measures perceptual distance between two specific images (not distributions).

**Procedure**: Extract features from multiple layers of a pretrained network (AlexNet, VGG, or SqueezeNet), compute weighted L2 distance per layer, and average:

$$LPIPS(x, x_0) = \sum_l \frac{1}{H_l W_l} \sum_{h,w} \|w_l \odot (\hat{f}^l_{hw}(x) - \hat{f}^l_{hw}(x_0))\|^2$$

where $\hat{f}^l$ are channel-normalized features at layer $l$ and $w_l$ are learned weights.

**Interpretation**: LPIPS = 0 means identical images; higher values indicate greater perceptual difference. Lower is better when evaluating reconstruction quality (e.g., image super-resolution, style transfer). LPIPS correlates with human perceptual judgments better than PSNR or SSIM (by ~2x in reported agreement rates).

**Typical values**: Two visually similar but pixel-shifted images: LPIPS ~0.1. Clearly different images: LPIPS ~0.5--0.7.

### Kernel Inception Distance (KID)

KID (Binkowski et al., 2018) is an alternative to FID that uses the squared Maximum Mean Discrepancy (MMD) with a polynomial kernel:

$$KID = MMD^2(f_r, f_g) = \mathbb{E}[k(f_r, f_r')] + \mathbb{E}[k(f_g, f_g')] - 2\mathbb{E}[k(f_r, f_g)]$$

where $k$ is a polynomial kernel and $f_r, f_g$ are InceptionV3 features.

**Advantages over FID**:
- **Unbiased**: KID has an unbiased estimator, unlike FID which is biased upward for small samples.
- **Works with fewer samples**: Reliable estimates from ~1,000 images (vs. 10,000+ for FID).
- **No Gaussian assumption**: FID assumes features are Gaussian-distributed; KID does not.

**Typical values**: KID is reported as $\times 10^{-3}$ for readability. StyleGAN3 on FFHQ: KID ~1--2 $\times 10^{-3}$.

### Human Evaluation

All automated metrics are proxies. Human evaluation remains the gold standard:
- **Side-by-side comparison**: Show two generated images; ask which is more realistic or better matches the prompt.
- **Mean Opinion Score (MOS)**: Rate images on a 1--5 Likert scale.
- Human evaluations are expensive (~$0.10--0.50 per judgment) and noisy (inter-rater agreement typically 70--80%).

## Why It Matters

1. FID is the gatekeeper metric for publication: a new generative model must demonstrate lower FID than baselines to claim improvement.
2. CLIP Score has become essential for text-to-image models, as FID alone cannot distinguish a photorealistic but prompt-irrelevant image from a well-aligned one.
3. Metric limitations drive research: the recognition that FID uses outdated InceptionV3 features has spurred development of FD_DINOv2 and CMMD as potential replacements.
4. No single metric is sufficient -- responsible evaluation requires reporting multiple metrics plus human evaluation.

## Key Technical Details

- FID is computed using `pytorch-fid` or `cleanfid` libraries. Always specify the reference dataset, number of samples, and image resolution.
- Standard FID benchmarks: CIFAR-10 (50K samples), FFHQ-256 (70K samples), COCO-30K (30K samples, text-conditioned).
- IS is computed over 50,000 samples, split into 10 groups, reporting mean +/- std.
- CLIP Score uses ViT-B/32 or ViT-L/14 CLIP encoders. ViT-L/14 is preferred for higher discrimination.
- LPIPS with AlexNet backbone: ~5 ms per pair on a GPU. VGG backbone is slower but slightly more accurate.
- FID is sensitive to image preprocessing: resizing method (bilinear vs. bicubic), JPEG compression, and center cropping all affect scores by 1--5 points.

## Common Misconceptions

- **"Low FID means the model generates perfect images."** FID measures distributional similarity, not individual image quality. A model can achieve low FID by generating diverse, slightly blurry images that match the overall statistics.
- **"Inception Score and FID measure the same thing."** IS measures quality and diversity using class predictions. FID measures distributional distance using features. They can disagree: a model generating only one class of very realistic images scores high IS but high FID.
- **"LPIPS replaces PSNR and SSIM."** LPIPS is better at capturing perceptual similarity, but PSNR and SSIM remain useful for measuring pixel-level and structural fidelity. They are complementary.

## Connections to Other Concepts

- **Generative Models**: FID and IS are the primary evaluation metrics for GANs, diffusion models, and VAEs.
- **Multimodal Models**: CLIP Score evaluates the text-image alignment that CLIP and similar models are trained to optimize.
- **Feature Extraction**: All metrics (FID, IS, KID, LPIPS) rely on features from pretrained networks as perceptual representations.
- **Benchmark Leaderboards**: Generative model leaderboards typically rank by FID, with CLIP Score and IS as secondary metrics.

## Further Reading

- Heusel et al., "GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium" (2017) -- Introduced FID.
- Salimans et al., "Improved Techniques for Training GANs" (2016) -- Introduced Inception Score.
- Zhang et al., "The Unreasonable Effectiveness of Deep Features as a Perceptual Metric" (2018) -- Introduced LPIPS.
- Jayasumana et al., "Rethinking FID: Towards a Better Evaluation Metric for Image Generation" (2024) -- Proposes CMMD as a modern FID replacement.
