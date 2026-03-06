# Production Monitoring

**One-Line Summary**: LangSmith provides production dashboards, user feedback collection, annotation queues, and alerting to monitor agent health and catch degradation.

**Prerequisites**: `langsmith-setup.md`, `tracing-and-debugging.md`, `evaluation-with-datasets.md`

## What Is Production Monitoring?

Think of production monitoring as the vital signs monitor in a hospital. A patient might look fine from the outside, but the monitor tracks heart rate, blood pressure, and oxygen levels continuously, sounding an alarm the moment something drifts out of range. Similarly, your agent might appear functional, but production monitoring tracks latency, error rates, token costs, and user satisfaction continuously, alerting you when performance degrades.

Development and evaluation give you confidence that an agent works well on test cases. Production monitoring tells you whether it continues to work well on real traffic. Models degrade silently when providers change behavior, query patterns shift, or data sources go stale. Without monitoring, these problems accumulate undetected.

## How It Works

### Dashboard Metrics

LangSmith automatically aggregates production traces into dashboard views:

```python
from langsmith import Client

client = Client()

runs = list(client.list_runs(
    project_name="production-agent",
    filter='and(gte(start_time, "2025-01-01"), lte(start_time, "2025-01-31"))',
    limit=1000,
))

latencies = [r.latency for r in runs if r.latency]
errors = [r for r in runs if r.status == "error"]
total_tokens = sum(r.total_tokens or 0 for r in runs)

print(f"P50 latency: {sorted(latencies)[len(latencies)//2]:.2f}s")
print(f"P99 latency: {sorted(latencies)[int(len(latencies)*0.99)]:.2f}s")
print(f"Error rate: {len(errors)/len(runs)*100:.1f}%")
print(f"Total tokens: {total_tokens:,}")
```

### User Feedback Collection

Capture thumbs-up/down or scored feedback from end users and attach it to traces:

```python
from langsmith import Client

client = Client()

def handle_user_feedback(run_id: str, score: float, comment: str = ""):
    """Record user feedback for a specific agent run."""
    client.create_feedback(
        run_id=run_id,
        key="user-rating",
        score=score,  # 0.0 to 1.0
        comment=comment,
    )

handle_user_feedback("run-id", score=0.0, comment="Wrong answer about pricing")
```

### Annotation Queues for Human Review

Route traces to human reviewers for quality assessment:

```python
from langsmith import Client

client = Client()

queue = client.create_annotation_queue(
    name="low-confidence-responses",
    description="Agent responses needing human verification"
)

runs = client.list_runs(
    project_name="production-agent",
    filter='and(eq(status, "success"), lte(feedback_score, 0.5))',
    limit=50,
)

for run in runs:
    client.add_runs_to_annotation_queue(queue_id=queue.id, run_ids=[run.id])
```

### Alerting and External Integration

Set up programmatic alerts and export to existing observability platforms:

```python
from langsmith import Client
from datetime import datetime, timedelta
from prometheus_client import Histogram, Counter

client = Client()
llm_latency = Histogram("llm_request_latency_seconds", "LLM call latency")
llm_errors = Counter("llm_request_errors_total", "LLM call errors")

def check_error_rate_alert(project: str, threshold: float = 0.05):
    """Alert if error rate exceeds threshold in the last hour."""
    one_hour_ago = (datetime.utcnow() - timedelta(hours=1)).isoformat()
    runs = list(client.list_runs(
        project_name=project,
        filter=f'gte(start_time, "{one_hour_ago}")',
    ))
    if not runs:
        return
    error_rate = sum(1 for r in runs if r.status == "error") / len(runs)
    if error_rate > threshold:
        send_alert(f"Error rate {error_rate:.1%} exceeds {threshold:.1%}")

def export_metrics_to_prometheus(run):
    """Export per-run metrics to Prometheus for Grafana dashboards."""
    if run.latency:
        llm_latency.observe(run.latency)
    if run.status == "error":
        llm_errors.inc()
```

## Why It Matters

1. **Early degradation detection**: Monitoring catches increased error rates, latency spikes, and output quality drops within minutes of onset.
2. **Cost control**: Token usage trends and cost tracking prevent unexpected bills and identify optimization opportunities.
3. **User satisfaction signal**: Feedback scores provide a direct quality signal, closing the loop between agent behavior and user experience.
4. **Continuous improvement**: Annotation queues turn production failures into evaluation dataset additions, creating a virtuous improvement cycle.
5. **Compliance and auditing**: Trace retention provides a complete audit trail of every agent interaction for regulatory requirements.

## Key Technical Details

- LangSmith dashboards show **latency distribution** (P50, P95, P99), **error rates**, **token usage trends**, and **cost estimates** over configurable time windows.
- Feedback supports arbitrary keys (e.g., "accuracy", "helpfulness") with numeric scores and text comments.
- Annotation queues support multiple reviewers with inter-annotator agreement tracking.
- Production traces can be **sampled** to reduce costs at high traffic volumes while maintaining statistical significance.
- LangSmith exposes a REST API for all metrics, enabling integration with Prometheus, Datadog, and Grafana.
- Trace filtering supports complex queries combining time ranges, error status, feedback scores, tags, and metadata.
- Projects can be configured with **retention policies** to automatically delete old traces and manage storage.

## Common Misconceptions

- **"Application-level monitoring tools like Datadog replace LangSmith."** General APM tools track HTTP status codes and response times but cannot inspect LLM prompt content, token usage, or agent decision paths. Both are needed.
- **"Monitoring is only necessary for high-traffic applications."** Even low-traffic agents benefit because a single bad response to an important user can cause significant damage.
- **"User feedback alone is sufficient for quality monitoring."** Most users never provide explicit feedback. Automated metrics and proactive annotation queues are necessary to catch problems silent users experience.

## Connections to Other Concepts

- `langsmith-setup.md` -- Environment variables must point to the production project for traces to appear correctly.
- `tracing-and-debugging.md` -- Production traces use the same structure as development traces for consistent debugging.
- `evaluation-with-datasets.md` -- Production failures identified through monitoring should be added to evaluation datasets.
- `human-in-the-loop-workflows.md` -- Annotation queues extend the human-in-the-loop pattern to post-hoc quality review.
- `deploying-with-langgraph-cloud.md` -- LangGraph Cloud deployments include built-in LangSmith integration.

## Further Reading

- [LangSmith Monitoring Guide](https://docs.smith.langchain.com/monitoring) -- Official documentation on dashboards, feedback, and annotation queues.
- [LLM Monitoring Best Practices (LangChain Blog)](https://blog.langchain.dev/monitoring-llm-applications/) -- Strategies for production monitoring of LLM apps.
- [OpenTelemetry for LLMs](https://opentelemetry.io/) -- Open standard for exporting LLM traces to multiple backends.
- [Prometheus Client Library](https://github.com/prometheus/client_python) -- Python library for exposing custom LLM metrics to Prometheus.
