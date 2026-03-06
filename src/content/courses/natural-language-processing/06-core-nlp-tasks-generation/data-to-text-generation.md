# Data-to-Text Generation

**One-Line Summary**: Converting structured data (tables, knowledge graphs, database records) into fluent natural language descriptions, bridging the gap between databases and human-readable reports.

**Prerequisites**: `sequence-to-sequence-models.md`, `attention-mechanism.md`, `text-generation.md`, `knowledge-graphs-for-nlp.md`

## What Is Data-to-Text Generation?

Imagine a sports broadcaster reading a box score. The raw data says "Lakers 112, Celtics 108; LeBron James: 31 pts, 8 reb, 6 ast." The broadcaster transforms this into: "The Lakers edged out the Celtics 112--108 in a thriller, led by LeBron James's dominant 31-point performance with 8 rebounds and 6 assists." The numbers are the same, but the natural language version is readable, contextualizes the performance ("dominant," "thriller"), and selects which statistics to highlight.

Data-to-text generation (D2T) is the task of automatically producing natural language text from structured data inputs -- tables, knowledge graph triples, spreadsheets, or database records. Unlike open-ended text generation, D2T is grounded: every claim in the output should be verifiable against the input data. This grounding makes D2T both more constrained and more practically deployable than free-form generation, but introduces the critical challenge of hallucination -- generating fluent text that says things the data does not support.

## How It Works

### Template-Based Generation

The oldest and most reliable approach fills in predefined templates with values from the data:

```
Template: "The {team} {outcome} the {opponent} {score1}-{score2} on {date}."
Data:     {team: Lakers, outcome: defeated, opponent: Celtics, score1: 112, score2: 108, date: March 5}
Output:   "The Lakers defeated the Celtics 112-108 on March 5."
```

**Strengths**: Zero hallucination risk, predictable output, easy to maintain, and fast at inference. Production systems in weather reporting (WeatherGov) and financial reporting still rely on templates.

**Weaknesses**: Rigid output with limited linguistic variety, requires manual authoring of templates for each domain and data schema, and cannot handle unexpected data configurations.

### Statistical Generation (Content Selection + Surface Realization)

The traditional NLG pipeline separates what to say from how to say it:

**1. Content Selection**: Choose which data elements to include. Given a table with 20 rows and 10 columns, the model selects the 5--10 most newsworthy cells. Barzilay and Lapata (2005) modeled this as a sequence of content selection decisions.

**2. Sentence Planning**: Decide how to group selected content into sentences and what discourse structure to use (e.g., comparison, temporal sequence, cause-effect).

**3. Surface Realization**: Generate the actual words using a grammar-based realizer (SimpleNLG by Gatt and Reiter, 2009) or a statistical language model conditioned on the content plan.

### Neural Data-to-Text Generation

Modern approaches use encoder-decoder models that take linearized (serialized) data as input and generate text end-to-end.

**Linearization**: Structured data is converted to a flat token sequence the model can process:
- Table: "player: LeBron James | points: 31 | rebounds: 8 | assists: 6"
- KG triples: "<LeBron_James, playsFor, Lakers> <LeBron_James, scored, 31>"

**Encoder-Decoder Models**: The linearized data is encoded (with LSTM, Transformer, or pre-trained model), and the decoder generates the description token by token. Puduppully et al. (2019) introduced content planning into neural models, first generating a content plan (ordered list of records to mention), then generating text conditioned on the plan, achieving significant improvements on the RotoWire sports benchmark.

**Pre-trained Models**: Fine-tuning T5 or BART on D2T datasets produces strong results with relatively little task-specific data. Kale and Rastogi (2020) showed that T5-large achieved 65.0 BLEU on WebNLG and 68.1 BLEU on E2E, outperforming all prior task-specific models.

### Hallucination in Data-to-Text

Hallucination is the most critical failure mode: the model generates text that is fluent and plausible but not supported by the input data.

**Types of hallucination**:
- **Intrinsic**: Contradicts the input data ("scored 28 points" when the data says 31).
- **Extrinsic**: Adds information not present in the input data ("in a career-high performance" when career stats are not provided).

Dhingra et al. (2019) found that neural models on RotoWire hallucinates in approximately 20--30% of generated sentences. Mitigation strategies include:

- **Copy mechanisms**: Encourage the model to copy data values directly rather than generating them.
- **Constrained decoding**: Restrict generation to tokens that appear in the input data (for values) or a controlled vocabulary (for descriptions).
- **Verification models**: Post-generation, a separate model checks each claim against the source data.

## Why It Matters

1. **Automated reporting**: Weather services (MetOffice), financial institutions, and sports media use D2T to generate millions of routine reports that would be impractical to write manually.
2. **Business intelligence**: Automatically narrating dashboard data, sales figures, and KPI trends makes analytics accessible to non-technical stakeholders.
3. **Accessibility**: Generating text descriptions of charts, tables, and visualizations makes data-heavy content accessible to screen reader users.
4. **Healthcare**: Generating patient-readable summaries of lab results, medication lists, and clinical data improves patient understanding and engagement.
5. **Scalability**: D2T can produce personalized content at scale -- individualized financial reports, personalized weather briefings, or location-specific news summaries.

## Key Technical Details

- **WebNLG** (Gardent et al., 2017): 25K data-text pairs mapping RDF triples from DBpedia to English descriptions. Covers 15 categories with varying complexity (1--7 triples per input). Includes a "seen" and "unseen" split to test generalization to new domains.
- **E2E NLG Challenge** (Novikova et al., 2017): 50K restaurant descriptions from meaning representations with 8 slot types (name, food type, price range, etc.). Designed to evaluate neural NLG quality and diversity.
- **RotoWire** (Wiseman et al., 2017): 4,853 game summaries paired with NBA box-score tables. Long-form generation (300+ words) requiring content selection from tables with 600+ cells.
- **ToTTo** (Parikh et al., 2020): 120K examples of highlighted table cells paired with one-sentence descriptions, providing controlled evaluation of table-to-text fidelity.
- Template systems achieve near-zero hallucination rates but score lower on fluency and naturalness metrics.
- T5-large on E2E achieves 68.1 BLEU and 0.45 NIST, with human evaluations showing 95%+ adequacy.
- The PARENT metric (Dhingra et al., 2019) extends BLEU by rewarding n-grams that appear in both the reference and the source table, penalizing hallucinated content.

## Common Misconceptions

- **"Templates are outdated technology."** Templates remain the most reliable method for high-stakes D2T applications. In finance and healthcare, factual accuracy is non-negotiable, and the predictability of templates is a feature, not a limitation. Many production systems use a hybrid approach: templates for critical facts, neural generation for connecting prose.

- **"Neural D2T models only generate what the data contains."** Neural models hallucinate frequently, inserting plausible-sounding but unsupported facts. A model trained on basketball data might generate "in a season-best performance" even when season statistics are not in the input. Hallucination detection and mitigation remain active research areas.

- **"D2T is just a simpler version of general text generation."** D2T has unique challenges: faithfully representing numerical data (models often make arithmetic errors), selecting which data to include from potentially large tables, and maintaining consistency across a multi-paragraph report that references the same data multiple times.

- **"More training data eliminates hallucination."** Hallucination is partly a structural problem with encoder-decoder models, not just a data problem. Even with abundant training data, models can generate fluent text that diverges from the input because the decoder's language model prior can override the encoder's signal.

## Connections to Other Concepts

- **`text-generation.md`**: D2T uses the same decoding strategies, but with the additional constraint of data fidelity.
- **`knowledge-graphs-for-nlp.md`**: KG-to-text generation (e.g., WebNLG) converts graph triples into natural language, directly involving knowledge graph concepts.
- **`machine-translation.md`**: D2T can be framed as "translation" from a structured data language to natural language, sharing architecture and training approaches.
- **`text-summarization.md`**: Both tasks require content selection -- deciding which input elements to include in the shorter/natural-language output.
- **`question-answering.md`**: Table QA (answering questions about tables) is closely related, requiring understanding of the same structured inputs.
- **`named-entity-recognition.md`**: Entity extraction from generated text can verify that all mentioned entities appear in the source data.

## Further Reading

- Reiter and Dale, "Building Natural Language Generation Systems" (2000) -- The foundational textbook on NLG pipeline architecture.
- Wiseman et al., "Challenges in Data-to-Document Generation" (2017) -- Introduced the RotoWire benchmark and identified key challenges for long-form D2T.
- Gardent et al., "The WebNLG Challenge: Generating Text from RDF Data" (2017) -- The WebNLG shared task and benchmark for KG-to-text generation.
- Puduppully et al., "Data-to-Text Generation with Content Selection and Planning" (2019) -- Neural content planning for structured data-to-text generation.
- Dhingra et al., "Handling Divergent Reference Texts when Evaluating Table-to-Text Generation" (2019) -- Introduced the PARENT metric for faithful D2T evaluation.
- Kale and Rastogi, "Text-to-Text Pre-Training for Data-to-Text Tasks" (2020) -- Showed that pre-trained T5 achieves state-of-the-art on multiple D2T benchmarks.
