# Experiment Tracking

**One-Line Summary**: Logging parameters, metrics, artifacts, and code versions -- reproducing results and navigating the experiment space systematically.

**Prerequisites**: Model training basics, hyperparameter tuning, cross-validation, version control (Git).

## What Is Experiment Tracking?

Imagine a scientist running hundreds of chemistry experiments but never writing anything in their lab notebook. Two weeks later, they got a promising result but cannot remember which reagent concentrations they used, which batch of raw material, or which oven temperature. That promising result is now irreproducible -- effectively lost.

Experiment tracking is the lab notebook for machine learning. It is the systematic recording of every variable that could influence a model's outcome: hyperparameters, data versions, code commits, environment specifications, metrics over time, and output artifacts. A tracking system lets you answer: *What exactly produced this model, and can I reproduce or improve upon it?*

## How It Works

### What to Track

A complete experiment record captures five dimensions:

| Dimension | Examples |
|-----------|----------|
| **Hyperparameters** | Learning rate, batch size, architecture choices, regularization strength |
| **Metrics** | Training loss, validation accuracy, F1 score, latency, per-class recall |
| **Artifacts** | Model weights, confusion matrices, prediction samples, plots |
| **Code version** | Git commit hash, diff of uncommitted changes |
| **Data version** | Dataset hash, DVC reference, data split seed |
| **Environment** | Python version, package versions, hardware (GPU type, memory) |

### The Experiment Hierarchy

Most tracking systems organize runs hierarchically:

$$\text{Project} \supset \text{Experiment} \supset \text{Run}$$

- A **project** groups related work (e.g., "fraud detection").
- An **experiment** represents a hypothesis or approach (e.g., "transformer-based features").
- A **run** is a single execution with specific parameters and results.

### Tool Landscape

**MLflow** -- Open-source, framework-agnostic. Provides tracking, model registry, and deployment. Minimal setup:

```python
import mlflow

mlflow.set_experiment("fraud-detection")

with mlflow.start_run():
    mlflow.log_param("learning_rate", 0.001)
    mlflow.log_param("n_layers", 4)

    # ... training loop ...

    mlflow.log_metric("val_auc", 0.94)
    mlflow.log_metric("val_loss", 0.23)
    mlflow.log_artifact("confusion_matrix.png")
    mlflow.sklearn.log_model(model, "model")
```

**Weights & Biases (W&B)** -- Cloud-hosted with rich visualization. Excels at real-time metric dashboards, hyperparameter sweep visualization, and team collaboration. Automatically captures system metrics (GPU utilization, memory).

**Neptune** -- Flexible metadata store. Strong at organizing large experiment volumes and comparing runs across teams.

**Comet** -- Focuses on experiment comparison and visual diffs between runs.

### Experiment Comparison

The real power of tracking emerges when comparing runs. A well-structured tracking system enables:

- **Parallel coordinate plots**: Visualize how hyperparameters map to metrics across hundreds of runs. Identify that, e.g., learning rates between $10^{-4}$ and $10^{-3}$ consistently outperform others.
- **Metric curves**: Overlay training curves from different runs to spot overfitting patterns.
- **Statistical analysis**: Aggregate results across random seeds to distinguish signal from noise.

The comparison workflow typically follows:

$$\text{Filter runs} \rightarrow \text{Sort by metric} \rightarrow \text{Compare top-}k \rightarrow \text{Analyze parameter differences}$$

### The Model Registry

A model registry is a versioned catalog of production-ready models. It extends experiment tracking by adding:

- **Model versioning**: Each registered model has versions (v1, v2, ...) linked to specific runs.
- **Stage transitions**: Models move through stages (Staging -> Production -> Archived).
- **Approval workflows**: Require human review before a model enters production.
- **Lineage**: Every production model traces back to the exact run, data, and code that produced it.

### Run Organization Best Practices

- **Tag runs** with meaningful metadata: `{"team": "fraud", "priority": "high", "data_version": "2024-Q3"}`.
- **Use consistent naming conventions** for parameters across experiments.
- **Log early, log often**: Log metrics at each epoch, not just final values. Training dynamics reveal more than final numbers.
- **Automate logging**: Integrate tracking into your pipeline so no run goes unrecorded.

## Why It Matters

"I forgot what I changed" is the single most expensive mistake in applied ML. It manifests as:

- Wasted compute re-running experiments that were already tried.
- Inability to reproduce a promising result from last week.
- Deploying a model without understanding its provenance.
- Team members duplicating each other's work.

At scale, an ML team without experiment tracking is navigating a high-dimensional space blindfolded. With tracking, every experiment narrows the search space and builds institutional knowledge.

## Key Technical Details

- **Metric logging granularity**: Log at the step/epoch level, not just at run completion. This enables early stopping analysis and learning curve comparison.
- **Artifact storage**: Large artifacts (model weights, datasets) should be stored in object storage (S3, GCS) with the tracking system storing only references.
- **Reproducibility hash**: Some systems compute a deterministic hash from (code version + data version + config) to detect when two runs should produce identical results.
- **Distributed training**: When training across multiple GPUs/nodes, designate one process as the logger to avoid duplicate entries.
- **Cost tracking**: Advanced setups log compute cost per run, enabling cost-performance Pareto analysis.

## Common Misconceptions

- **"Git is sufficient for experiment tracking."** Git versions code, but ML experiments depend on data, hyperparameters, and environment. Git alone cannot track metric trajectories or store large model artifacts efficiently.
- **"I only need to track successful experiments."** Failed experiments are equally valuable. They document what does not work and prevent others from repeating dead ends.
- **"Experiment tracking is overhead that slows me down."** Initial setup takes hours; the time saved from not re-running forgotten experiments saves weeks. Modern tools require just 3-5 lines of code to integrate.
- **"Metrics alone are enough."** Without parameter and data logging, a good metric is an unreproducible anecdote.

## Connections to Other Concepts

- `ml-pipelines.md`: Pipelines are the execution engines that produce tracked runs. Mature systems automatically log every pipeline execution to the tracking system.
- `ab-testing-for-ml.md`: Experiment tracking captures offline metrics; A/B testing reveals whether those offline gains translate to online improvements. The tracking system links offline runs to online experiment results.
- `hyperparameter-tuning.md`: Tuning algorithms (grid search, Bayesian optimization) generate many runs. Tracking systems store and visualize these runs, enabling analysis of the hyperparameter landscape.
- `model-deployment-and-serving.md`: The model registry bridges experiment tracking and deployment. A model transitions from "best tracked run" to "deployed artifact" through the registry.

## Further Reading

- Zaharia et al., "Accelerating the Machine Learning Lifecycle with MLflow" (2018) -- The paper introducing MLflow's design philosophy.
- Biewald, "Experiment Tracking with Weights & Biases" (2020) -- Practical patterns for experiment management at scale.
- Schelter et al., "On Challenges in Machine Learning Model Management" (2018) -- Academic perspective on the broader model management problem.
