# ML Pipelines

**One-Line Summary**: Chaining data processing, feature engineering, and model training into reproducible, deployable workflows.

**Prerequisites**: Model training basics, feature engineering, cross-validation, version control.

## What Are ML Pipelines?

Think of an ML pipeline like an assembly line in a factory. Raw materials (data) enter at one end, pass through a sequence of processing stations (transformations, feature engineering, training), and a finished product (deployed model) exits at the other end. If any station breaks or changes, you know exactly where to look, and you can rebuild the entire product from scratch by re-running the line.

Formally, an ML pipeline is a directed acyclic graph (DAG) of computational steps that transforms raw data into a trained, validated, and deployable model. Each node in the DAG represents an idempotent operation with defined inputs and outputs, enabling reproducibility, automation, and auditability.

## How It Works

### Core Pipeline Components

A production ML pipeline typically consists of six stages:

1. **Data Ingestion** -- Pull data from databases, APIs, data lakes, or streaming sources. This stage handles schema validation and initial quality checks.

2. **Data Validation** -- Verify statistical properties of incoming data. Tools like TensorFlow Data Validation (TFDV) compute summary statistics and flag anomalies (e.g., unexpected feature ranges, missing value spikes, schema drift).

3. **Preprocessing and Feature Engineering** -- Apply transformations: imputation, scaling, encoding, feature crossing. Crucially, these transformations must be *fitted on training data only* and applied consistently to validation, test, and serving data.

4. **Model Training** -- Train one or more candidate models. This stage consumes processed features and produces model artifacts.

5. **Model Evaluation and Validation** -- Compare candidate models against baselines using held-out data. Gate deployment on performance thresholds.

6. **Model Serving** -- Push validated models to a serving infrastructure (REST API, batch job, edge device).

### Scikit-learn Pipeline: The Building Block

The simplest pipeline abstraction is scikit-learn's `Pipeline`, which chains transformers and an estimator:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestClassifier

pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(n_estimators=100))
])

pipeline.fit(X_train, y_train)       # fit all stages sequentially
predictions = pipeline.predict(X_test)  # transform + predict
```

This guarantees that the same preprocessing is applied during training and inference, eliminating a major source of training-serving skew.

### DAG-Based Orchestration

Production pipelines extend beyond a linear chain. Orchestrators represent the pipeline as a DAG where nodes execute when their upstream dependencies complete:

- **Apache Airflow** -- General-purpose workflow orchestration. Define pipelines as Python DAGs with operators for each task. Widely adopted but not ML-specific.
- **Kubeflow Pipelines** -- Kubernetes-native ML pipelines. Each step runs in a container, enabling heterogeneous compute (CPU preprocessing, GPU training).
- **Prefect** -- Modern orchestration with dynamic workflows, automatic retries, and observability built in.

### Feature Stores

A feature store is a centralized repository for feature definitions and computed feature values. It solves the dual-computation problem: features computed during training must be identically computed at serving time.

A feature store provides:
- **Offline store**: Historical feature values for training (e.g., backed by a data warehouse).
- **Online store**: Low-latency feature lookup for real-time inference (e.g., backed by Redis).
- **Feature registry**: Metadata, lineage, and documentation for each feature.

Tools like Feast, Tecton, and Hopsworks implement this pattern.

### Reproducibility: The Triple Lock

A reproducible pipeline versions three things:

$$\text{Reproducibility} = f(\text{Data}_{v}, \text{Code}_{v}, \text{Config}_{v})$$

- **Data versioning** (DVC, Delta Lake) ensures you can reconstruct the exact training dataset.
- **Code versioning** (Git) tracks all transformation and training logic.
- **Config versioning** captures hyperparameters, environment specs, and random seeds.

### CI/CD for ML

Continuous Integration / Continuous Deployment adapted for ML adds:
- **Continuous Training (CT)**: Automatically retrain models when new data arrives or performance degrades.
- **Model validation gates**: Automated checks (accuracy thresholds, fairness metrics, latency budgets) before deployment.
- **Rollback mechanisms**: Revert to previous model versions if production metrics deteriorate.

## Why It Matters

Without pipelines, ML development devolves into a tangle of notebooks, manual steps, and undocumented transformations. Pipelines make ML engineering *systematic*: they reduce time-to-production, catch errors early through validation stages, and ensure that any model can be rebuilt from scratch. Google's internal analysis found that ML code itself is often a small fraction of a production system -- the surrounding pipeline infrastructure dominates.

## Key Technical Details

- **Idempotency**: Each pipeline step should produce the same output given the same input, regardless of how many times it runs.
- **Training-serving skew**: The most dangerous pipeline bug. It occurs when preprocessing differs between training and inference. Pipelines with shared transformation objects (like scikit-learn's `Pipeline`) mitigate this.
- **Caching**: Orchestrators cache intermediate outputs so unchanged upstream steps are not re-executed, reducing iteration time significantly.
- **Parameterization**: Pipelines should accept configuration (hyperparameters, data paths, compute resources) as external parameters, not hardcoded values.
- **Testing**: Pipeline steps need unit tests (does this transform produce expected output?) and integration tests (do all steps compose correctly?).

## Common Misconceptions

- **"A Jupyter notebook is a pipeline."** Notebooks are great for exploration but lack reproducibility guarantees, error handling, scheduling, and modularity. A pipeline is a productionized, automated workflow.
- **"Pipelines are only for large-scale ML."** Even small projects benefit from pipelines. A simple scikit-learn Pipeline prevents training-serving skew and makes hyperparameter search cleaner.
- **"Once built, pipelines don't need maintenance."** Pipelines require ongoing monitoring. Data sources change, dependencies break, and data distributions shift -- all requiring pipeline updates.

## Connections to Other Concepts

- `experiment-tracking.md`: Pipelines generate the runs that experiment trackers log. Each pipeline execution should automatically record parameters, metrics, and artifacts.
- `data-drift-and-model-monitoring.md`: The data validation stage in a pipeline is your first line of defense against drift. Monitoring systems trigger pipeline re-execution when drift is detected.
- `model-deployment-and-serving.md`: The final pipeline stage hands off to serving infrastructure. CI/CD for ML automates this handoff.
- `automated-feature-engineering.md`: Feature computation logic lives inside pipelines and, ideally, in feature stores that pipelines both populate and consume.

## Further Reading

- Sculley et al., "Hidden Technical Debt in Machine Learning Systems" (2015) -- The foundational paper on why ML systems are more than just models.
- Baylor et al., "TFX: A TensorFlow-Based Production-Scale Machine Learning Platform" (2017) -- Google's end-to-end ML pipeline framework.
- Polyzotis et al., "Data Lifecycle Challenges in Production Machine Learning" (2018) -- Deep dive into data management within ML pipelines.
