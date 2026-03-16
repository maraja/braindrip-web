# Color Spaces

**One-Line Summary**: A color space is a coordinate system that maps numerical tuples to perceivable colors, with different spaces optimizing for hardware convenience (RGB), perceptual uniformity (CIELAB), or separation of luminance from chrominance (YCbCr, HSV).

**Prerequisites**: Digital images and pixels, basic trigonometry, matrix multiplication.

## What Is a Color Space?

Think of describing a location in a city. You could use street addresses, GPS coordinates, or directions relative to a landmark. Each system describes the same physical location, but some are more convenient for navigation, others for surveying, and others for casual conversation. Color spaces work the same way: RGB, HSV, LAB, and YCbCr are all different coordinate systems for the same perceptual phenomenon -- color -- but each one makes certain operations natural and others awkward.

Formally, a **color space** is a specific organization of colors defined by a color model (the abstract mathematical structure, e.g., three additive primaries) plus a reference mapping to absolute colorimetry (e.g., the sRGB specification ties R, G, B primaries to exact CIE chromaticity coordinates and a D65 white point).

## How It Works

### RGB (Red, Green, Blue)

RGB is an additive model matching the trichromatic nature of human vision and the physics of emissive displays. Each pixel stores three values, typically in [0, 255] for 8-bit:

$$\text{Color} = R \cdot \mathbf{e}_R + G \cdot \mathbf{e}_G + B \cdot \mathbf{e}_B$$

**sRGB** is the dominant standard for consumer imaging. It defines specific primary chromaticities, a D65 white point, and a nonlinear transfer function (gamma):

$$C_{\text{sRGB}} = \begin{cases} 12.92 \cdot C_{\text{linear}} & \text{if } C_{\text{linear}} \leq 0.0031308 \\ 1.055 \cdot C_{\text{linear}}^{1/2.4} - 0.055 & \text{otherwise} \end{cases}$$

This gamma encoding allocates more code values to dark tones where the human eye is most sensitive.

**Gotcha**: OpenCV loads images in **BGR** order, not RGB. Passing an OpenCV image directly to matplotlib produces incorrect colors unless you convert with `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)`.

### HSV / HSL (Hue, Saturation, Value / Lightness)

HSV rearranges RGB into a cylindrical coordinate system:

- **Hue** ($H$): Angle around the color wheel, 0--360 degrees (red at 0, green at 120, blue at 240).
- **Saturation** ($S$): Purity of the color, 0 (gray) to 1 (fully saturated).
- **Value** ($V$): Brightness, 0 (black) to 1 (full brightness).

HSV is useful when you need to select colors by hue range (e.g., "find all red objects") because a simple threshold on H isolates a color regardless of lighting variation in S and V.

```python
import cv2
import numpy as np

img_bgr = cv2.imread("scene.jpg")
img_hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

# Detect red objects (red wraps around 0/180 in OpenCV's 0-180 hue range)
lower_red1 = np.array([0, 70, 50])
upper_red1 = np.array([10, 255, 255])
lower_red2 = np.array([170, 70, 50])
upper_red2 = np.array([180, 255, 255])
mask = cv2.inRange(img_hsv, lower_red1, upper_red1) | \
       cv2.inRange(img_hsv, lower_red2, upper_red2)
```

**Limitation**: HSV is a nonlinear rearrangement of RGB, not a perceptually uniform space. Equal steps in H do not correspond to equal perceived color differences.

### CIELAB (L\*a\*b\*)

CIELAB was designed by the CIE in 1976 to be approximately **perceptually uniform**: a Euclidean distance $\Delta E_{ab}^{*}$ between two colors correlates with the perceived difference.

- $L^*$: Lightness, 0 (black) to 100 (white).
- $a^*$: Green (negative) to red (positive).
- $b^*$: Blue (negative) to yellow (positive).

The conversion from XYZ tristimulus values involves a cube-root nonlinearity:

$$L^* = 116 \cdot f\!\left(\frac{Y}{Y_n}\right) - 16, \quad a^* = 500 \cdot \left[f\!\left(\frac{X}{X_n}\right) - f\!\left(\frac{Y}{Y_n}\right)\right], \quad b^* = 200 \cdot \left[f\!\left(\frac{Y}{Y_n}\right) - f\!\left(\frac{Z}{Z_n}\right)\right]$$

where $f(t) = t^{1/3}$ for $t > (6/29)^3$ and $f(t) = \frac{t}{3(6/29)^2} + \frac{4}{29}$ otherwise.

A $\Delta E_{ab}^{*}$ of about 2.3 corresponds to a just-noticeable difference (JND) under controlled conditions. Later refinements (CIEDE2000) improve this correlation.

### YCbCr

YCbCr separates **luminance** ($Y$) from **chrominance** ($Cb$, $Cr$). This decomposition exploits the fact that the human visual system has higher spatial resolution for brightness than for color, enabling **chroma subsampling** (e.g., 4:2:0) that halves or quarters the color data with minimal perceived loss.

The BT.601 conversion from RGB:

$$Y = 0.299R + 0.587G + 0.114B$$
$$Cb = 128 - 0.169R - 0.331G + 0.500B$$
$$Cr = 128 + 0.500R - 0.419G - 0.081B$$

JPEG, H.264, and nearly all video codecs operate in YCbCr space.

## Why It Matters

1. Choosing the right color space can simplify an algorithm from complex multi-channel logic to a simple threshold on one channel (e.g., hue-based segmentation in HSV).
2. Perceptual uniformity in CIELAB enables meaningful color difference metrics used in quality assessment, color correction, and clustering.
3. YCbCr chroma subsampling reduces video bandwidth by 50% (4:2:0) with negligible perceptual impact, which is why virtually all video compression depends on it.
4. Ignoring gamma encoding when doing linear operations (blending, filtering) on sRGB data produces visible banding and incorrect darkening of midtones.

## Key Technical Details

- sRGB covers approximately 35% of the visible gamut defined by CIE 1931. Display-P3 (used by Apple devices since 2016) covers ~26% more than sRGB.
- OpenCV uses H in [0, 180], S in [0, 255], V in [0, 255] for 8-bit HSV -- not the conventional [0, 360], [0, 100], [0, 100] range.
- CIELAB is device-independent but requires a known illuminant; D65 (daylight) and D50 (print) are the most common reference white points.
- Converting RGB to LAB requires an intermediate transform through CIE XYZ, which itself depends on the specific RGB color space (sRGB vs. Adobe RGB vs. ProPhoto, etc.).
- Neural networks trained on ImageNet typically expect sRGB inputs normalized to [0, 1] or standardized with per-channel mean and standard deviation (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]).

## Common Misconceptions

- **"RGB values directly represent physical light intensity."** sRGB values are gamma-encoded. A pixel value of 128 does not represent half the light intensity of 255; it represents roughly $(128/255)^{2.2} \approx 21.6\%$ of maximum luminance.

- **"HSV is perceptually uniform."** HSV is a geometric rearrangement of RGB, not a perceptual model. Two colors 30 degrees apart in hue can look very different or nearly identical depending on their saturation and value.

- **"You can freely average RGB values for smooth blending."** Averaging gamma-encoded sRGB values without linearizing first produces results that are systematically too dark. Correct alpha blending requires converting to linear light, blending, then re-encoding.

## Connections to Other Concepts

- `digital-images-and-pixels.md`: Each pixel's numerical values only have meaning within the context of a specific color space.
- `image-histograms.md`: Histograms can be computed per-channel in any color space; computing the histogram of the L* channel in CIELAB gives a brightness distribution that better matches human perception.
- `convolution-and-filtering.md`: Gaussian blur on gamma-encoded sRGB data versus linearized data produces different results; filtering should ideally be performed in linear light.

## Further Reading

- Poynton, "Digital Video and HD: Algorithms and Interfaces" (2nd ed., 2012) -- The definitive reference on color science for digital imaging, including RGB, YCbCr, and gamma.
- CIE, "Colorimetry, 4th Edition" (CIE 015:2018) -- The official specification for CIELAB and related color difference formulas.
- Stokes et al., "A Standard Default Color Space for the Internet - sRGB" (1996) -- The original sRGB specification by HP and Microsoft, establishing the dominant consumer color space.
- Sharma et al., "The CIEDE2000 Color-Difference Formula" (2005) -- Presents the improved perceptual color difference metric now used in industry.
