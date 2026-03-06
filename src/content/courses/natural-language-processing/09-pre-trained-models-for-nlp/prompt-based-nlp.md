# Prompt-Based NLP

**One-Line Summary**: Prompt-based NLP reformulates traditional NLP tasks as cloze-style fill-in-the-blank or text generation problems, leveraging pre-trained language models' existing knowledge to perform tasks with minimal or zero labeled data by converting classification into "predict the next/masked word" problems.

**Prerequisites**: `transfer-learning-in-nlp.md`, `bert.md`, `gpt-for-nlp-tasks.md`, `text-classification.md`, `sentiment-analysis.md`

## What Is Prompt-Based NLP?

Imagine you want to know if a movie review is positive or negative, but instead of training a classifier, you simply show the review to someone who has read millions of reviews and ask them to complete a sentence: "Overall, this movie was ___." If they fill in "great," the review is positive; if they fill in "terrible," it is negative. You never explicitly taught them what "positive" or "negative" means -- you just structured the question so their natural language intuition does the classification for you.

Prompt-based NLP applies this principle systematically. Rather than adding a task-specific classification head to a pre-trained model and fine-tuning on labeled examples, you design a natural language template (the "prompt") that transforms the task into a form the pre-trained model already knows how to solve -- predicting masked tokens (for BERT-style models) or generating the next tokens (for GPT-style models). The model's pre-trained knowledge of language patterns effectively becomes the task solver.

This approach represents a fundamental shift in how NLP tasks are framed. Traditional fine-tuning adapts the model to the task. Prompt-based methods adapt the task to the model. This inversion is especially powerful in low-data regimes, where crafting the right prompt can outperform fine-tuning on hundreds of labeled examples.

## How It Works

### Manual Prompts and Cloze-Style Reformulation

A **cloze prompt** converts a classification task into a fill-in-the-blank problem compatible with masked language modeling (MLM):

**Sentiment Analysis:**
```
Input:   "This movie was fantastic. Overall, it was [MASK]."
Predict: [MASK] → "great" (positive) / "terrible" (negative)
```

**Topic Classification:**
```
Input:   "Apple released a new iPhone today. This is about [MASK]."
Predict: [MASK] → "technology" / "sports" / "politics" / ...
```

**Natural Language Inference:**
```
Input:   "A man is running. [MASK], a person is jogging."
Predict: [MASK] → "Yes" (entailment) / "No" (contradiction) / "Maybe" (neutral)
```

For generation-based models (GPT-style), the prompt is formatted as a prefix that the model completes:

```
Input:   "Review: This movie was fantastic. Sentiment: "
Generate: "positive"
```

### Verbalizers: Mapping Labels to Words

A **verbalizer** defines the mapping between task labels and natural language words that the MLM or LM is likely to predict. This mapping is critical and non-trivial:

| Task | Label | Possible Verbalizer Words |
|------|-------|--------------------------|
| Sentiment | Positive | great, wonderful, amazing, good |
| Sentiment | Negative | terrible, awful, bad, horrible |
| NLI | Entailment | Yes, Right, True |
| NLI | Contradiction | No, Wrong, False |
| Topic | Sports | sports, athletics, football |

The choice of verbalizer significantly impacts performance. Schick and Schutze (2021) showed that poorly chosen verbalizers can degrade accuracy by 10-20%. Multiple verbalizer words per label can be aggregated by summing their probabilities:

```
P(positive) = P([MASK]="great") + P([MASK]="wonderful") + P([MASK]="good") + ...
```

### Prompt Tuning and Soft Prompts

Manual prompt engineering is labor-intensive and sensitive to wording. Automated approaches learn optimal prompts:

**P-tuning (Liu et al., 2021):** Replaces discrete prompt tokens with continuous embeddings that are learned through gradient descent while keeping the pre-trained model frozen. The prompt tokens do not correspond to real words -- they are vectors in embedding space optimized for the task.

**Prefix Tuning (Li and Liang, 2021):** Prepends learnable continuous vectors (the "prefix") to the key and value matrices at every transformer layer, not just the input embedding layer. For GPT-2-Large on table-to-text generation, prefix tuning with only 0.1% trainable parameters matches full fine-tuning performance.

**Prompt Tuning (Lester et al., 2021):** A simplified version of prefix tuning that only prepends learnable tokens to the input embedding. With T5-XXL (11B), prompt tuning (20K trainable parameters) matches full fine-tuning across SuperGLUE tasks.

The key insight across these methods: as model size increases, the gap between prompt tuning and full fine-tuning narrows. At 11B parameters, prompt tuning essentially matches fine-tuning while being far more parameter-efficient -- each task requires storing only the learned prompt vectors (~20K-100K parameters) rather than a full model copy.

### Pattern-Exploiting Training (PET)

Schick and Schutze (2021) introduced PET, which combines prompt-based classification with semi-supervised learning:

1. Define multiple prompt templates (patterns) with verbalizers for the same task.
2. Fine-tune a model on a small labeled set (e.g., 32 examples) using each pattern independently.
3. Use the ensemble of fine-tuned models to label a large unlabeled dataset (soft pseudo-labels).
4. Train a final classifier on the pseudo-labeled data.

PET with BERT-base and 32 labeled examples outperforms standard BERT fine-tuning with 5,000 labeled examples on several GLUE tasks, demonstrating the power of prompts in low-data regimes.

### Connection to In-Context Learning

Prompt-based NLP and in-context learning (from `gpt-for-nlp-tasks.md`) share the principle of task reformulation through natural language. The distinction:

- **Prompt-based (with fine-tuning)**: The model is updated (even if only prompt parameters) on task data. Designed for MLM-style models (BERT, RoBERTa).
- **In-context learning**: The model is not updated at all. Task examples are provided in the prompt, and the model performs the task through forward-pass pattern matching. Designed for large autoregressive models (GPT-3+).
- **Prompt tuning**: A hybrid that updates only the prompt parameters, bridging the two approaches.

## Why It Matters

1. **Low-data champion**: Prompt-based methods outperform standard fine-tuning when labeled data is scarce (fewer than 100-500 examples per class), making NLP accessible for specialized or emerging domains.
2. **No task-specific architecture**: Unlike fine-tuning which adds classification heads, prompt-based methods use the pre-trained model as-is, simplifying the engineering pipeline.
3. **Multi-task efficiency**: Prompt tuning stores only a small set of task-specific parameters per task (~20K-100K), enabling a single frozen model to serve hundreds of tasks simultaneously. Compare this to fine-tuning, which requires a separate model copy per task.
4. **Foundation for modern LLM interaction**: The prompt engineering skills developed in prompt-based NLP directly apply to working with ChatGPT, Claude, and other instruction-tuned models -- prompting is now the primary interface for NLP.
5. **Bridges understanding and generation**: Prompt-based methods showed that classification, extraction, and generation tasks can all be solved through the same predict-the-next-word interface.

## Key Technical Details

- **PET performance**: BERT-base + PET with 32 labeled examples on Yelp Full: 53.6% accuracy, vs. standard fine-tuning with 32 examples: 40.4%, vs. fine-tuning with full dataset: 66.1%.
- **Prompt sensitivity**: Zhao et al. (2021) showed that GPT-3's accuracy on SST-2 ranges from 51% to 93% depending on prompt wording alone -- a 42-point swing from phrasing choices.
- **Prompt tuning convergence**: With T5-11B, prompt tuning matches full fine-tuning on SuperGLUE; with T5-Base (220M), prompt tuning lags by ~5 points, highlighting the importance of model scale.
- **Prefix tuning efficiency**: 0.1% of trainable parameters (prefix vectors) vs. 100% for full fine-tuning, with comparable performance on GPT-2-Large for table-to-text and summarization.
- **Verbalizer impact**: On SST-2, changing the verbalizer from {"great"/"terrible"} to {"cat"/"dog"} drops accuracy from ~90% to random chance -- demonstrating that the mapping must align with the model's pre-trained knowledge.
- **Optimal number of prompt tokens**: Lester et al. (2021) found 20-100 tokens sufficient; performance plateaus beyond ~100 tokens.
- **Training cost**: Prompt tuning trains ~1000x fewer parameters than full fine-tuning, with 5-10x faster training time.

## Common Misconceptions

**"Prompt engineering is just trial and error."** While manual prompt design involves experimentation, there are systematic principles: prompts should match the pre-training distribution, verbalizers should use high-frequency words the model associates with the target concepts, and templates should be grammatically natural. Automated methods (P-tuning, prompt tuning) further systematize the process.

**"Prompt-based methods always beat fine-tuning."** In high-data regimes (10K+ labeled examples), standard fine-tuning typically matches or exceeds prompt-based methods. The advantage of prompts is concentrated in low-data settings (fewer than 500 examples). At sufficient data scale, the explicit classification signal overwhelms the indirect prompt signal.

**"Soft prompts are interpretable."** Learned continuous prompt vectors do not correspond to real words. Attempts to decode them into text often produce incoherent sequences. Soft prompts are effective but opaque, trading interpretability for performance -- the opposite of manual prompt design.

**"Prompt-based methods work equally well for all tasks."** Tasks with natural cloze formulations (sentiment, NLI, topic classification) work well. Tasks that are hard to express as fill-in-the-blank (dependency parsing, structured prediction) benefit less from prompt-based approaches and may still require specialized architectures.

**"You need GPT-3 for prompt-based NLP."** BERT and RoBERTa work well for cloze-style prompts via their MLM capability. PET achieves strong results with BERT-base (110M). The model needs to be large enough that its MLM predictions are meaningful, but 100M-300M parameters is often sufficient for prompt-based classification.

## Connections to Other Concepts

- `gpt-for-nlp-tasks.md` describes in-context learning, which extends prompt-based NLP to fully zero-parameter adaptation through demonstrations.
- `bert.md` provides the masked language modeling capability that cloze-style prompts exploit directly.
- `t5-and-text-to-text.md` shares the philosophy of reformulating tasks as text problems; T5's task prefixes are a form of prompting.
- `transfer-learning-in-nlp.md` places prompt-based methods as the latest evolution in the transfer learning timeline.
- `text-classification.md` and `sentiment-analysis.md` are the tasks most commonly reformulated via prompts.
- `natural-language-inference.md` is naturally suited to cloze formulation ("sentence1 [MASK], sentence2" with yes/no/maybe verbalizers).
- `domain-adaptation.md` can be combined with prompt-based methods: a domain-adapted model responds more accurately to domain-specific prompts.
- `cross-lingual-transfer.md` can leverage multilingual prompts for cross-lingual task transfer.
- In the LLM Concepts collection, `llm-concepts/06-parameter-efficient-fine-tuning/adapters-and-prompt-tuning.md` covers prompt tuning and prefix tuning in greater technical depth as PEFT methods for large language models.

## Further Reading

- Schick and Schutze, *Exploiting Cloze Questions for Few-Shot Text Classification and Natural Language Inference (PET)*, 2021 -- introduced pattern-exploiting training combining prompts with semi-supervised learning.
- Liu et al., *GPT Understands, Too (P-tuning)*, 2021 -- showed that continuous prompt optimization enables GPT models to match BERT on NLU tasks.
- Li and Liang, *Prefix-Tuning: Optimizing Continuous Prompts for Generation*, 2021 -- introduced learnable prefixes at every transformer layer for generation tasks.
- Lester et al., *The Power of Scale for Parameter-Efficient Prompt Tuning*, 2021 -- demonstrated that prompt tuning scales to match full fine-tuning at sufficient model size.
- Liu et al., *Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in Natural Language Processing*, 2023 -- comprehensive survey covering the full landscape of prompt-based NLP.
