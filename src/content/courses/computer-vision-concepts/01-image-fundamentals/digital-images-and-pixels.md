# Digital Images and Pixels

**One-Line Summary**: A digital image is a rectangular grid of discrete numerical values (pixels) that approximates a continuous visual scene through spatial sampling and intensity quantization.

**Prerequisites**: Basic linear algebra (matrices), binary number representation.

## What Is a Digital Image?

Imagine standing before a mosaic mural. From a distance, you see a smooth portrait -- but step closer and you notice it is built from thousands of small colored tiles. Each tile has a single uniform color, and the illusion of a continuous image emerges only when you step back and your visual system blends the tiles together. A digital image works the same way: the continuous light field reaching a camera sensor is broken into a finite grid of tiny samples called **pixels** (short for "picture elements"), each storing a single brightness or color value.

Formally, a continuous image can be modeled as a function $f(x, y)$ mapping spatial coordinates to intensity. A digital image $I[m, n]$ is obtained by **sampling** this function on a discrete lattice and **quantizing** the resulting values to a finite set of levels:

$$I[m, n] = \text{Quantize}\bigl(f(m \cdot \Delta x,\; n \cdot \Delta y)\bigr)$$

where $\Delta x$ and $\Delta y$ are the spatial sampling intervals and $m, n$ are integer indices.

## How It Works

### Spatial Sampling

The camera sensor (CCD or CMOS) contains a 2D array of photosites. Each photosite integrates incoming photons over its area during the exposure time, producing one sample. The number of photosites determines the image's **spatial resolution**. A sensor with 4000 columns and 3000 rows yields a 12-megapixel image.

The **Nyquist-Shannon sampling theorem** governs fidelity: to faithfully represent details at spatial frequency $f_s$, the sampling rate must be at least $2f_s$. If the scene contains frequencies above the Nyquist limit, **aliasing** artifacts appear -- the jagged staircase patterns visible on diagonal edges in low-resolution images.

### Intensity Quantization

After sampling, each analog voltage is converted to a discrete integer by an analog-to-digital converter (ADC). With $b$ bits per channel, there are $2^b$ possible levels:

| Bit Depth | Levels | Typical Use |
|-----------|--------|-------------|
| 1         | 2      | Binary / mask images |
| 8         | 256    | Standard photographs (JPEG) |
| 10        | 1024   | Video (Rec. 2020) |
| 12        | 4096   | RAW camera files |
| 16        | 65536  | HDR / scientific imaging |
| 32 (float)| ~4 billion | Computational pipelines |

Quantization introduces **quantization noise**, which for uniform quantization has an RMS value of approximately $\Delta / \sqrt{12}$, where $\Delta$ is the step size between adjacent levels.

### Memory Layout

Images are stored as contiguous arrays in row-major (C/NumPy) or column-major (MATLAB/Fortran) order. A single-channel 8-bit grayscale image of size $H \times W$ occupies $H \times W$ bytes. A 3-channel 8-bit color image occupies $H \times W \times 3$ bytes. A 1920x1080 RGB frame therefore requires approximately 6.2 MB uncompressed.

```python
import numpy as np

# Create a grayscale image: 480 rows, 640 columns, uint8
gray = np.zeros((480, 640), dtype=np.uint8)

# Create a color image: 480 rows, 640 columns, 3 channels (BGR in OpenCV)
color = np.zeros((480, 640, 3), dtype=np.uint8)

# Access pixel at row 100, column 200
pixel_value = gray[100, 200]          # single integer 0-255
color_pixel = color[100, 200]         # array of 3 values [B, G, R]
```

### Coordinate Conventions

A persistent source of bugs: image libraries disagree on axis order. NumPy and OpenCV index as `image[row, col]` (y first, x second), while many graphics APIs use `(x, y)`. The origin is typically the top-left corner, with $y$ increasing downward.

| Library / API | Indexing Order | Origin |
|--------------|---------------|--------|
| NumPy / OpenCV | `[row, col]` (y, x) | Top-left |
| PIL / Pillow | `(x, y)` in some methods | Top-left |
| MATLAB | `(row, col)` | Top-left (1-indexed) |
| OpenGL / Vulkan | `(x, y)` | Bottom-left / Top-left |

### Common Image File Formats

Different formats make different tradeoffs between file size, quality, and feature support:

- **JPEG**: Lossy DCT-based compression. 8-bit per channel, no alpha. Ubiquitous for photographs. Typical compression ratios of 10:1 to 20:1.
- **PNG**: Lossless compression with deflate. Supports alpha transparency and 16-bit depth. Preferred for graphics, screenshots, and images requiring exact pixel values.
- **TIFF**: Flexible container supporting lossless and lossy compression, 8/16/32-bit, multiple layers. Standard in scientific and medical imaging.
- **WebP**: Modern format from Google supporting both lossy and lossless compression with alpha. Typically 25-35% smaller than JPEG at equivalent quality.
- **BMP**: Uncompressed (or minimally compressed) raster format. Large files but trivial to parse; occasionally used in embedded systems.

## Why It Matters

1. Every computer vision algorithm -- from edge detection to neural network inference -- ultimately operates on pixel grids. Understanding the data structure is foundational.
2. Bit depth determines the dynamic range available for downstream processing; working in 8-bit too early can destroy subtle gradients needed for medical or astronomical imaging.
3. Spatial resolution sets the upper bound on detectable detail; no algorithm can recover information lost below the Nyquist limit (though super-resolution networks can hallucinate plausible detail).
4. Memory and bandwidth costs scale linearly with pixel count and bit depth, directly impacting real-time system design.

## Key Technical Details

- A standard 4K UHD frame (3840 x 2160 x 3 channels x 8 bits) is ~24.9 MB uncompressed; at 60 fps that is ~1.49 GB/s of raw data.
- The Bayer color filter array on most sensors captures one color per photosite; full-color pixels are reconstructed via demosaicing, meaning roughly two-thirds of each pixel's color information is interpolated.
- JPEG compression typically achieves 10:1 to 20:1 ratios by exploiting frequency-domain redundancy, reducing that 24.9 MB 4K frame to roughly 1-2.5 MB.
- Integer overflow is a common pitfall: adding two uint8 pixels (e.g., 200 + 100) wraps to 44 instead of the expected 300 unless the computation is performed in a wider type.

## Common Misconceptions

- **"More megapixels always means a better image."** Spatial resolution is only one factor. Sensor size, photosite area (which affects noise), lens quality, and dynamic range often matter more. A 12 MP full-frame sensor can outperform a 48 MP smartphone sensor in low light.

- **"Pixels have a fixed physical size."** A pixel is a dimensionless sample. Its physical extent depends on how the image is displayed or printed. A 300 DPI print maps each pixel to ~85 micrometers; the same pixel on a 27-inch 4K monitor spans ~0.16 mm.

- **"Zooming in reveals more detail."** Enlarging a raster image beyond its native resolution only makes pixels larger (or triggers interpolation). The information content does not increase.

## Connections to Other Concepts

- `color-spaces.md`: Each pixel can store values in different color coordinate systems (RGB, HSV, LAB), which fundamentally changes how algorithms interpret the numbers.
- `image-histograms.md`: The distribution of pixel intensity values across the grid is the basis for histogram analysis, equalization, and thresholding.
- `image-interpolation-and-resampling.md`: When images are resized or geometrically transformed, new pixel values must be estimated at non-integer grid locations.
- `image-noise-and-denoising.md`: Noise is introduced during both the sampling (photon shot noise) and quantization stages of image formation.

## Further Reading

- Gonzalez & Woods, "Digital Image Processing" (4th ed., 2018) -- The standard textbook covering image formation, sampling, and quantization in depth.
- Szeliski, "Computer Vision: Algorithms and Applications" (2nd ed., 2022) -- Chapter 2 provides a thorough treatment of image formation models.
- Shannon, "Communication in the Presence of Noise" (1949) -- The foundational paper establishing the sampling theorem that governs digital image fidelity.
