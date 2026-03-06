# Landmark Datasets

**One-Line Summary**: Landmark datasets -- ImageNet (1.2M images, 1K classes), COCO (330K images, 80 categories), Pascal VOC, ADE20K, Cityscapes, and Open Images -- define the benchmarks that drive computer vision progress and shape architectural design decisions.

**Prerequisites**: Image Classification in Practice, Object Detection, Image Segmentation

## What Are Landmark Datasets?

A dataset in computer vision is more than a collection of images -- it is an implicit definition of what the field considers important. When ImageNet chose 1,000 object categories, it defined what "general visual recognition" meant for a decade. When COCO included segmentation masks, it pushed the field toward pixel-level understanding. Landmark datasets are the benchmarks that entire research communities organize around, compete on, and cite as evidence of progress.

Technically, each landmark dataset specifies a collection of images, annotation types (class labels, bounding boxes, segmentation masks, keypoints), evaluation protocols, and train/val/test splits. The choice of dataset determines which problems get studied, which metrics get optimized, and ultimately which architectures become dominant.

## How It Works

### ImageNet (ILSVRC)

**Scale**: 1,281,167 training images, 50,000 validation images, 1,000 object categories drawn from WordNet.

**Task**: Image classification (single-label, one dominant object per image).

**Annotation**: One class label per image; bounding boxes also available for a subset.

**History**: Created by Fei-Fei Li's lab (Deng et al., 2009). The ImageNet Large Scale Visual Recognition Challenge (ILSVRC, 2010--2017) catalyzed the deep learning revolution. AlexNet's victory in 2012 (top-5 error: 16.4%) demonstrated that deep CNNs could dramatically outperform hand-crafted features (previous best: 25.8%).

**Key properties**:
- 1,000 classes spanning animals, objects, vehicles, food, scenes.
- Average ~1,281 images per class; some classes have as few as 732.
- Images are web-crawled and annotated via Amazon Mechanical Turk. Label noise estimated at ~4--6%.
- Validation set has been heavily studied; near-saturation at ~91% top-1 accuracy (CoCa, 2022).

**ImageNet-21K**: The full 14.2M images across 21,841 categories. Used for pretraining; fine-tuning from ImageNet-21K consistently improves downstream performance by 1--3% over ImageNet-1K pretraining.

### COCO (Common Objects in Context)

**Scale**: 330K images (118K train, 5K val, 20K test-dev, 40K test-challenge), 80 object categories, 91 stuff categories.

**Tasks**: Object detection, instance segmentation, panoptic segmentation, keypoint detection, image captioning.

**Annotation**: Bounding boxes, instance segmentation masks (polygon annotations), keypoints (17 per person), captions (5 per image). Average 7.3 object instances per image -- significantly more cluttered than ImageNet.

**Evaluation**: The COCO evaluation protocol (AP@[.50:.05:.95]) is the standard for detection and segmentation. The `pycocotools` library is the reference implementation.

**Key properties**:
- 80 thing categories + 91 stuff categories for panoptic segmentation.
- Emphasis on objects in natural context (multiple objects, occlusion, varied scales).
- Small objects are abundant: ~41% of objects have area < $32^2$ pixels.
- Over 2.5M instance annotations.

### Pascal VOC

**Scale**: ~11,500 images (train+val), 20 object categories.

**Tasks**: Classification, detection, segmentation, action recognition, person layout.

**History**: The original detection benchmark (2005--2012). VOC 2007 and VOC 2012 are the most cited splits. Faster R-CNN, SSD, and early YOLO versions reported results on VOC.

**Key properties**:
- 20 categories: person, bird, cat, cow, dog, horse, sheep, aeroplane, bicycle, boat, bus, car, motorbike, train, bottle, chair, dining table, potted plant, sofa, TV.
- Smaller and simpler than COCO; now considered a legacy benchmark.
- mAP at IoU = 0.50 (AP50) was the standard metric.
- Many methods achieved >90% mAP by 2018, saturating the benchmark.

### ADE20K

**Scale**: 25,574 images (20,210 train, 2,000 val, 3,352 test), 150 semantic categories.

**Tasks**: Semantic segmentation, instance segmentation, scene parsing.

**Key properties**:
- 150 categories covering stuff (wall, floor, sky) and things (person, car, chair).
- Dense annotation: every pixel is labeled.
- More diverse scenes than Cityscapes (indoor + outdoor).
- Standard benchmark for semantic segmentation; state-of-the-art mIoU: ~62--64%.
- Scene Parsing Challenge at MIT evaluated on this dataset.

### Cityscapes

**Scale**: 5,000 finely annotated images + 20,000 coarsely annotated images, 30 categories (19 used for evaluation).

**Tasks**: Semantic segmentation, instance segmentation, panoptic segmentation.

**Key properties**:
- All images are driving scenes from 50 European cities.
- Fine annotations: pixel-level polygon labels for 5,000 images (2,975 train, 500 val, 1,525 test).
- 19 evaluation categories: road, sidewalk, building, wall, fence, pole, traffic light, traffic sign, vegetation, terrain, sky, person, rider, car, truck, bus, train, motorcycle, bicycle.
- Resolution: 2048 x 1024 pixels -- much higher than COCO.
- State-of-the-art mIoU: ~86% (InternImage, 2023).

### Open Images

**Scale**: 9.2M images, 600 object categories (detection), 350 categories (segmentation), ~16M bounding boxes.

**Tasks**: Detection, segmentation, visual relationship detection, image classification.

**Key properties**:
- Largest publicly available detection dataset.
- 600 categories with a long-tailed distribution; some categories have >1M boxes, others have <100.
- Hierarchical label structure aligned with Freebase.
- Open Images V7 includes point-level annotations and new evaluation protocols.
- Challenge hosted annually at ECCV/ICCV.

### Other Notable Datasets

| Dataset | Images | Task | Key Feature |
|---------|--------|------|-------------|
| LVIS | 164K | Instance seg. | 1,203 categories, long-tailed |
| Objects365 | 2M | Detection | 365 categories, large-scale |
| SA-1B | 11M | Segmentation | 1.1B masks, from SAM |
| KITTI | 15K | Driving | Stereo + LiDAR + detection |
| nuScenes | 1.4M 3D boxes | 3D detection | Full sensor suite |

## Why It Matters

1. ImageNet pretraining remains the default initialization for most vision models; the dataset fundamentally shaped the field.
2. COCO's multi-task annotations (detection + segmentation + keypoints + captions) pushed the field toward unified architectures.
3. Dataset biases propagate to models: ImageNet's Western-centric image sourcing leads to lower accuracy on underrepresented cultures and objects.
4. New datasets drive new research directions: SA-1B (1.1B masks) enabled the Segment Anything Model; LAION-5B enabled CLIP-scale training.

## Key Technical Details

- ImageNet-1K: 1,281,167 train / 50,000 val / 100,000 test. Images resized so shorter side = 256; standard crop: 224x224.
- COCO: 118,287 train / 5,000 val / 20,288 test-dev. Images at variable resolution (average ~640x480).
- Label noise estimates: ImageNet ~4--6%, COCO ~2--3% (professionally verified), Open Images ~5--10% (machine-generated labels verified by humans).
- Cityscapes fine annotations took ~1.5 hours per image; COCO instance masks took ~7 minutes per image.
- LVIS addresses COCO's frequency imbalance: categories split into frequent (>100 images), common (10--100), and rare (<10). State-of-the-art AP on rare categories: ~30% vs. ~45% on frequent categories.

## Common Misconceptions

- **"ImageNet performance predicts real-world performance."** ImageNet is curated, centered, and relatively clean. Real-world images are messy, cluttered, and out-of-distribution. ImageNet accuracy correlates with but does not guarantee deployment performance.
- **"More data always helps."** Dataset quality (annotation accuracy, diversity, balance) often matters more than raw size. JFT-300M (Google's internal dataset) helps ImageNet accuracy, but the gain per additional image diminishes rapidly.
- **"COCO has enough categories for general detection."** COCO's 80 categories cover common objects but miss thousands of real-world categories (specific tools, food items, medical instruments). LVIS (1,203 categories) and Open Images (600) better represent the long tail.

## Connections to Other Concepts

- **Classification Metrics**: ImageNet uses top-1/top-5 accuracy.
- **Detection Metrics**: COCO evaluation protocol (mAP) is the standard.
- **Segmentation Metrics**: ADE20K uses mIoU; COCO panoptic uses PQ.
- **Benchmark Leaderboards**: Papers With Code tracks state-of-the-art on all these datasets.

## Further Reading

- Deng et al., "ImageNet: A Large-Scale Hierarchical Image Database" (2009) -- The dataset that launched the deep learning era.
- Lin et al., "Microsoft COCO: Common Objects in Context" (2014) -- Multi-task benchmark with rich annotations.
- Cordts et al., "The Cityscapes Dataset for Semantic Urban Scene Understanding" (2016) -- High-resolution driving segmentation.
- Kuznetsova et al., "The Open Images Dataset V4" (2020) -- Largest public detection dataset with hierarchical labels.
