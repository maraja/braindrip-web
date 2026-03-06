# Extraction and Parsing Prompts

**One-Line Summary**: Extraction and parsing prompts instruct LLMs to locate, identify, and structure specific information from unstructured text into defined fields, bridging the gap between raw documents and structured databases.
**Prerequisites**: `json-mode-and-schema-enforcement.md`.

## What Is Extraction and Parsing?

Imagine scanning a printed page and circling specific pieces of information with a highlighter — the person's name in yellow, the date in green, the dollar amount in pink. You are not creating new information; you are finding and marking what already exists. LLM extraction works the same way: the model reads unstructured text and pulls out specific, predefined pieces of information into structured fields.

Extraction is fundamentally different from generation. In generation, the model creates new text that did not exist before. In extraction, every piece of output should be directly traceable to something in the input. This distinction matters for evaluation, validation, and trust — extracted information can be verified against the source, while generated information cannot.

Named Entity Recognition (NER), field extraction from forms and documents, data parsing from emails, and information extraction from scientific papers are all extraction tasks. The common thread is: input is unstructured text, output is structured data with defined fields, and every output value should come from the input (or be marked as absent).

*Recommended visual: A pipeline diagram showing the extraction workflow: "Unstructured document" -> "LLM with schema prompt" -> "Raw JSON output" -> "Structural validation (Pydantic)" -> "Source grounding check (fuzzy match against input)" -> "Cross-field consistency check" -> "Validated structured data" or "Low-confidence: human review queue," with pass/fail gates at each validation step.*
*Source: Adapted from Jason Liu, "Instructor" (2023) and Li et al., "Evaluating ChatGPT's Information Extraction Capabilities" (2023)*

![Structured approaches to prompt engineering showing systematic decomposition of complex tasks](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/tree-of-thoughts.png)
*Source: Lilian Weng, "Prompt Engineering," lilianweng.github.io (2023) -- illustrates how structured decomposition techniques apply to extraction tasks, where complex documents are systematically parsed into defined fields*

## How It Works

### Schema Specification

Every extraction task begins with defining what to extract. The schema specifies field names, types, descriptions, and whether each field is required or optional. A well-designed schema for extracting contact information might look like:

```
Extract the following fields from the text:
- full_name (string, required): The person's complete name
- email (string, optional): Email address if present
- phone (string, optional): Phone number in any format
- company (string, optional): Organization name if mentioned
- role (string, optional): Job title or role if mentioned
```

Field descriptions are critical — they resolve ambiguity. Is "name" the person's name, the company name, or a product name? "The person's complete name as it appears in the text" eliminates confusion. Include edge case guidance: "If multiple people are mentioned, extract only the primary contact."

### Handling Missing Fields

How the model reports absent information is a key design decision. Three approaches exist:

**Null values**: Return the field with a null/None value. Best for strongly typed systems where every field must be present in the output structure.

**Omission**: Simply exclude the field from the output. Best for sparse extraction where most fields are usually absent.

**Explicit markers**: Return a value like "NOT_FOUND" or "N/A". Best for human review workflows where the absence itself is informative.

Choose one approach and be explicit in the prompt: "If a field is not present in the text, set its value to null. Do not guess or infer values that are not explicitly stated."

### Few-Shot Extraction Examples

Few-shot examples are especially powerful for extraction because they demonstrate both what to extract and how to handle edge cases. Include 2-3 examples that cover:

- A straightforward case with all fields present.
- A case with missing fields (demonstrating the null/omit convention).
- An ambiguous case showing the correct resolution.

Each example should be a complete input-output pair. The investment in crafting good examples pays off disproportionately — few-shot extraction typically improves accuracy by 15-25% compared to zero-shot, with the largest gains on ambiguous or domain-specific fields.

### Validation Strategies

Extraction output should be validated at multiple levels:

**Structural validation**: Does the output conform to the schema? Are required fields present? Are types correct? Use JSON Schema validation or Pydantic models for this.

**Source grounding**: Can each extracted value be found in the source text? Implement string matching or fuzzy matching between extracted values and the input. Values that do not appear in the source are likely hallucinated.

**Cross-field consistency**: Do extracted fields make logical sense together? An email from "google.com" with a company of "Microsoft" suggests an error. Implement domain-specific consistency checks.

**Confidence scoring**: Ask the model to provide a confidence score per field, or use token log-probabilities to estimate extraction certainty. Route low-confidence extractions to human review.

## Why It Matters

### Automating Data Entry at Scale

Organizations spend enormous resources manually extracting information from documents — invoices, contracts, resumes, medical records, legal filings. LLM extraction automates this at a fraction of the cost. A well-designed extraction prompt can process thousands of documents per hour at $0.01-0.10 per document, compared to $1-5 per document for manual extraction.

### Bridging Unstructured and Structured Data

Most of the world's information exists as unstructured text, but most software systems need structured data. Extraction prompts are the bridge. An email becomes a database record, a contract becomes structured terms, a news article becomes an event with date, location, and participants.

### Composability with Downstream Systems

Extracted structured data integrates directly with databases, APIs, analytics pipelines, and other LLM calls. The extraction step converts one-time natural language into reusable structured data that powers automation across the entire system.

## Key Technical Details

- **Few-shot examples improve extraction accuracy by 15-25%** compared to zero-shot, with the largest gains on domain-specific fields.
- **Hallucination in extraction** manifests as values that do not appear in the source text — source grounding validation catches 80-90% of these.
- **Schema field descriptions improve accuracy by 10-15%** compared to bare field names, especially for ambiguous or domain-specific fields.
- **Extraction from long documents (4K+ tokens)** should use section-aware extraction: split the document into chunks, extract per chunk, then deduplicate and merge results.
- **Nested extraction** (extracting a list of entities, each with sub-fields) is significantly harder than flat extraction. Accuracy drops 10-20% for each level of nesting.
- **Temperature 0 is recommended** for extraction tasks to maximize consistency and reduce hallucinated values.
- **The extraction vs generation distinction** is critical for evaluation: extraction output should be verifiable against the source, generation output cannot be.

## Common Misconceptions

- **"Extraction is just a simple prompt task."** Reliable extraction at scale requires schema design, validation pipelines, error handling for missing fields, and systematic evaluation. The prompt is just the starting point.
- **"If the model returns a value, it must be in the source."** LLMs hallucinate in extraction tasks just as they do in generation. A model might "extract" a phone number that is actually fabricated from partial patterns in the text. Source grounding validation is essential.
- **"One extraction prompt works for all document types."** Different document types (emails, contracts, web pages, academic papers) have different structures, conventions, and ambiguities. Prompt customization per document type significantly improves accuracy.
- **"More schema fields are always better."** Each additional field increases the chance of errors and hallucination. Extract only what you need. A focused 5-field schema outperforms a comprehensive 20-field schema on the fields that matter.
- **"Extraction doesn't need examples because the task is straightforward."** Extraction feels intuitive to humans but is full of edge cases. Few-shot examples handle ambiguity that instructions alone cannot resolve.

## Connections to Other Concepts

- `json-mode-and-schema-enforcement.md` — Schema enforcement ensures extraction output is structurally valid and machine-parseable.
- `classification-and-labeling-output.md` — Extraction and classification are often combined: extract entities, then classify them.
- `xml-and-tag-based-output.md` — XML tags naturally structure extraction output with `<entity>`, `<value>`, and `<evidence>` annotations.
- `multi-step-output-pipelines.md` — Extraction is often the first step in a pipeline, feeding structured data into downstream classification or analysis.
- `constrained-decoding-from-prompt-perspective.md` — Constrained decoding can enforce valid field values (enums, formats) in extraction output.

## Further Reading

- Li et al., "Evaluating ChatGPT's Information Extraction Capabilities" (2023) — Systematic evaluation of LLM extraction across NER, relation extraction, and event extraction tasks.
- Wei et al., "Zero-Shot Information Extraction via Chatting with ChatGPT" (2023) — Demonstrates effective prompting strategies for zero-shot and few-shot extraction.
- Agrawal et al., "Can Large Language Models Provide Useful Feedback on Research Papers?" (2023) — Includes structured extraction methodology for scientific document parsing.
- Jason Liu, "Instructor" documentation (2023) — Practical library for Pydantic-validated extraction with automatic retry loops.
