# Document Understanding

**One-Line Summary**: Extracting and understanding information from visually rich documents (forms, invoices, reports, tables) by jointly modeling text content, visual appearance, and spatial layout -- powered by the LayoutLM family and multimodal document representations.

**Prerequisites**: `multimodal-nlp.md`, `bert.md`, `named-entity-recognition.md`, `information-extraction.md`, `transfer-learning-in-nlp.md`

## What Is Document Understanding?

Imagine handing a stack of receipts to an accountant. Without reading a single word, the accountant can already extract information from the layout: the total is at the bottom right, the date is at the top, line items are in a table, and the store name is in large bold text at the top center. Spatial position, font size, alignment, and visual grouping all carry meaning that is completely lost when document text is extracted as a flat string via OCR. A receipt and a resume might contain similar words, but their layouts communicate entirely different structures.

Document understanding (also called Document AI or intelligent document processing) is the task of automatically extracting structured information from visually rich documents -- forms, invoices, receipts, contracts, scientific papers, financial statements, and more. Unlike standard NLP, which operates on plain text, document understanding must jointly reason over three modalities:

1. **Text**: The actual words and characters in the document (extracted via OCR or born-digital text layers).
2. **Vision**: Visual features including font style, size, color, logos, checkboxes, separating lines, and images.
3. **Layout**: The 2D spatial positions of text tokens -- their bounding box coordinates, reading order, and spatial relationships.

The insight that unifies the field is that layout is not merely decorative -- it is semantic. A number appearing next to the word "Total:" in the bottom-right of a receipt means something very different from the same number appearing next to "Item Qty:" in a table row. Modeling layout as a first-class signal alongside text and vision is what distinguishes document understanding from conventional NLP.

## How It Works

### The Document Understanding Pipeline

A typical document understanding system involves:

**1. Document Digitization / OCR**: Converting scanned documents or images into machine-readable text with bounding box coordinates. Modern OCR engines (Tesseract, Google Cloud Vision, Amazon Textract, PaddleOCR) achieve >99% character accuracy on clean printed text but degrade on handwriting, low resolution, and complex layouts. For born-digital PDFs, text and coordinates are extracted directly from the PDF structure.

**2. Layout Analysis**: Identifying document structure -- paragraphs, headings, tables, figures, headers, footers, and reading order. Rule-based approaches use heuristics (whitespace, font size changes), while learned approaches (Detectron2-based models, DiT) treat layout analysis as object detection over document pages.

**3. Multimodal Feature Encoding**: Combining text tokens, visual patches, and spatial coordinates into a unified representation for downstream tasks.

**4. Task-Specific Heads**: Fine-tuning the multimodal encoder for specific tasks -- key information extraction (KIE), document classification, table extraction, or document question answering.

### The LayoutLM Family

**LayoutLM** (Xu et al., 2020, Microsoft): The foundational model that introduced layout-aware pre-training. LayoutLM extends BERT by adding 2D position embeddings to each text token:

- Text tokens are embedded using WordPiece (as in BERT).
- Each token's bounding box coordinates (x0, y0, x1, y1) are embedded as four separate learned embeddings, normalized to a 0--1000 coordinate space.
- The text embedding and 2D position embedding are summed and fed to a standard BERT transformer.

LayoutLM is pre-trained with masked language modeling (predicting masked tokens from surrounding text and spatial context) on 11M scanned documents (IIT-CDIP dataset). It achieved dramatic improvements over text-only BERT: +15% F1 on the FUNSD form understanding benchmark and +4% F1 on the SROIE receipt extraction task.

**LayoutLMv2** (Xu et al., 2021): Adds visual features to the mix. A CNN (ResNeXt-101-FPN) extracts visual features from the document image, which are tokenized into patches and fed to the transformer alongside text tokens. LayoutLMv2 introduces two new pre-training objectives:

- **Text-Image Alignment**: Predicting whether an image region corresponds to a text token (detecting OCR coverage).
- **Text-Image Matching**: Binary classification of whether a page image matches its text content (analogous to next-sentence prediction).

LayoutLMv2 achieved 83.24% F1 on FUNSD and 95.65% F1 on SROIE, substantially outperforming LayoutLM.

**LayoutLMv3** (Huang et al., 2022): Unifies text and image pre-training in a single multimodal transformer without requiring a separate CNN feature extractor. Document images are directly patchified (like ViT) into 16x16 patches, linearly projected, and concatenated with text token embeddings. Pre-training uses:

- **Masked Language Modeling**: Predicting masked text tokens.
- **Masked Image Modeling**: Predicting masked image patches.
- **Word-Patch Alignment**: Predicting whether an image patch spatially corresponds to a text token.

LayoutLMv3 achieves 92.08% F1 on FUNSD, 90.29% on CORD (receipt dataset), and outperforms LayoutLMv2 on DocVQA (83.37% ANLS).

### Key Information Extraction (KIE)

KIE extracts specific field values from documents: vendor name, total amount, date, line items, etc. It is formulated as:

- **Token classification**: Each OCR token is labeled with a semantic tag (B-TOTAL, I-TOTAL, B-DATE, etc.) using BIO or BIOES tagging, identical to `named-entity-recognition.md` but with layout-aware features. LayoutLM family models excel at this formulation.
- **Graph-based approaches**: Model tokens as nodes in a graph with edges based on spatial proximity, then apply graph neural networks for relation extraction between key-value pairs.
- **Generative approaches**: Models like Donut (Kim et al., 2022) skip OCR entirely, directly generating structured JSON from document images using a vision-encoder to text-decoder architecture.

### Table Extraction

Tables are particularly challenging because their structure is implicit -- cells are defined by visual alignment and ruling lines rather than explicit markup:

- **Table detection**: Locating table regions in the document page (object detection task).
- **Table structure recognition**: Identifying rows, columns, and cell boundaries. Models like TableFormer and DETR-based approaches achieve ~95% F1 on table detection benchmarks.
- **Cell content extraction**: Mapping detected cells to their text content via spatial overlap with OCR tokens.

### Document QA

Document question answering (DocVQA) answers natural language questions about document content, requiring both reading comprehension (as in `question-answering.md`) and visual/layout understanding:

- **DocVQA benchmark** (Mathew et al., 2021): 50K questions on 12K industry document images. Questions require locating information using layout cues, reading tables, understanding forms, and sometimes basic reasoning. The metric is ANLS (Average Normalized Levenshtein Similarity), which is edit-distance-tolerant to OCR errors.
- Current SOTA: GPT-4V and Gemini achieve >90% ANLS on DocVQA through their native multimodal understanding, while LayoutLMv3 achieves ~83% ANLS as a specialized document model.

## Why It Matters

1. **Enterprise automation**: Businesses process billions of invoices, forms, contracts, and receipts annually. Intelligent document processing saves an estimated $12 billion annually in manual data entry costs globally.
2. **Compliance and audit**: Automated extraction of regulatory information from financial documents, medical records, and legal contracts enables scalable compliance monitoring.
3. **Digital archives**: Libraries, governments, and institutions hold vast collections of scanned historical documents that require digitization and structured extraction for searchability.
4. **Healthcare**: Extracting information from medical forms, insurance claims, lab reports, and prescriptions reduces administrative burden estimated at 15--25% of healthcare spending.
5. **Beyond flat text**: Document understanding demonstrates that NLP must extend beyond linear text to handle the spatial, visual, and structural dimensions of real-world language use.

## Key Technical Details

- LayoutLM was pre-trained on 11M document pages (IIT-CDIP dataset) with ~160M text tokens. LayoutLMv3 uses a smaller but more diverse pre-training set.
- Bounding box coordinates are normalized to [0, 1000] for both x and y axes relative to the page dimensions. This produces a discrete 2D coordinate space of 1,001 x 1,001 positions.
- FUNSD (Form Understanding in Noisy Scanned Documents): 199 annotated forms (149 train, 50 test) with 4 entity types (header, question, answer, other) and linking annotations. F1 scores: LayoutLM 79.27%, LayoutLMv2 83.24%, LayoutLMv3 92.08%.
- SROIE (Scanned Receipts OCR and Information Extraction): 1,000 receipts with 4 fields to extract (company, date, address, total). F1: BERT 90.99%, LayoutLM 95.24%, LayoutLMv2 95.65%.
- DocVQA: 50K questions on 12K documents. ANLS: LayoutLMv3 83.37%, Donut 67.5%, GPT-4V >90%.
- Donut (Kim et al., 2022) eliminates OCR dependency by using a Swin Transformer encoder and BART decoder, directly generating structured output from document images. This avoids OCR error propagation but requires more training data.

## Common Misconceptions

- **"OCR + NLP is sufficient for document understanding."** Stripping text from a document and running NER or QA on the resulting flat string discards layout information that carries critical semantic meaning. Two adjacent cells in a table may appear as consecutive text after OCR but represent completely different fields. Layout-aware models consistently outperform text-only baselines by 10--20% F1 on extraction tasks.

- **"Document understanding is just NER on documents."** While key information extraction resembles NER (see `named-entity-recognition.md`), document understanding also encompasses table extraction, document classification, document QA, layout analysis, and visual element recognition -- a much broader scope than entity tagging.

- **"Modern OCR is perfect and can be treated as a solved component."** OCR accuracy on clean printed text is >99%, but real-world documents feature handwriting, stamps, watermarks, poor scan quality, skew, mixed languages, and complex layouts. OCR errors propagate directly into downstream extraction errors, motivating OCR-free approaches like Donut.

- **"Layout information only matters for forms and receipts."** Layout is semantic in virtually all document types: scientific papers (abstract vs. body vs. references), legal contracts (clauses, amendments, signatures), news articles (headlines, bylines, columns), and web pages (navigation vs. content). Even "plain text" documents use whitespace, indentation, and formatting to convey structure.

## Connections to Other Concepts

- `multimodal-nlp.md`: Document understanding is a practical application of multimodal NLP, fusing text, vision, and spatial modalities.
- `named-entity-recognition.md`: Key information extraction from documents uses the same BIO tagging formalism as NER, extended with layout features.
- `information-extraction.md`: Document understanding is a specialized form of information extraction tailored to visually structured documents.
- `bert.md`: LayoutLM directly extends BERT's architecture and pre-training objectives with 2D position embeddings.
- `visual-question-answering.md`: DocVQA applies VQA methodology to document images, requiring both reading comprehension and layout understanding.
- `text-cleaning-and-noise-removal.md`: OCR noise in scanned documents requires robust text cleaning pipelines before or during processing.
- `image-captioning.md`: Dense captioning of document elements (figures, charts) connects captioning to document understanding.

## Further Reading

- Xu et al., "LayoutLM: Pre-training of Text and Layout for Document Image Understanding" (2020) -- The foundational model adding 2D position embeddings to BERT for layout-aware document processing.
- Xu et al., "LayoutLMv2: Multi-modal Pre-training for Visually-Rich Document Understanding" (2021) -- Adding visual features and new pre-training tasks for stronger multimodal document representations.
- Huang et al., "LayoutLMv3: Pre-training for Document AI with Unified Text and Image Masking" (2022) -- Unified multimodal pre-training with patch-based image encoding, achieving state-of-the-art across document tasks.
- Kim et al., "OCR-Free Document Understanding Transformer" (2022) -- Donut: end-to-end document understanding without OCR, directly mapping images to structured output.
- Mathew et al., "DocVQA: A Dataset for VQA on Document Images" (2021) -- The primary benchmark for document question answering.
- Appalaraju et al., "DocFormer: End-to-End Transformer for Document Understanding" (2021) -- Multi-modal transformer with shared attention across text, vision, and spatial features.
