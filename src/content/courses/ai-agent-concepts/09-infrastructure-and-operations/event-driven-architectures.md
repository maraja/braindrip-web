# Event-Driven Architectures

**One-Line Summary**: Event-driven architectures enable reactive agents that respond to external triggers -- webhooks, file changes, schedules, user messages -- rather than running continuous polling loops.

**Prerequisites**: Agent orchestration, state machines and graphs, tool use and function calling

## What Is Event-Driven Architectures?

Think of a security guard who patrols the building on a fixed schedule versus one who sits at a monitoring station and responds when an alarm triggers. The patrolling guard wastes effort checking empty hallways; the monitoring guard is idle most of the time but responds instantly when something happens. Event-driven agents work like the monitoring guard: they sit dormant until an event (a webhook, a file change, a user message, a cron trigger) activates them, execute their task, and return to dormancy.

Traditional agent architectures are request-response: a user sends a message, the agent processes it, returns a result. Event-driven agents invert this model. The agent subscribes to event sources and reacts when events arrive. A code review agent activates when a pull request is opened. A monitoring agent activates when an error rate exceeds a threshold. A data pipeline agent activates when a new file appears in an S3 bucket. The agent does not need to continuously poll -- it is awakened by the event.

*Recommended visual: Architecture diagram showing event sources (webhooks, message queues, cron, file watchers) feeding into an event router that dispatches to agent handlers, with state persistence between activations — see [Kleppmann, 2017 — Designing Data-Intensive Applications](https://dataintensive.net/)*

This architecture is essential for long-running, production agent systems. A customer support agent must be available 24/7 but might process only 50 requests per day. Running a continuous loop wastes compute. An event-driven architecture spins up the agent only when a customer message arrives, processes it, and shuts down. This maps naturally to serverless computing platforms (AWS Lambda, Google Cloud Functions) where you pay only for execution time.

## How It Works

### Event Sources and Triggers
An event source is anything that produces events the agent should respond to. Common sources include: HTTP webhooks (GitHub sends a webhook when a PR is opened), message queues (Kafka, RabbitMQ, SQS), file system watchers (a new CSV appears in a directory), scheduled triggers (run every Monday at 9am via cron), database change streams (a new row is inserted), and user interactions (a Slack message mentioning @agent). Each event carries a payload with context: the webhook includes the PR diff, the file watcher includes the file path, the Slack message includes the text and channel.

### Event Loops and Processing
The event loop is the core runtime. It listens for incoming events, deserializes them, routes them to the appropriate handler, and manages concurrency. In Python, `asyncio` provides the event loop primitive. A typical pattern: the agent registers handlers for different event types, the loop receives events from multiple sources concurrently, and dispatches each event to its handler. The handler may invoke an LLM, call tools, update state, and produce new events (e.g., posting a Slack response after reviewing a PR).

### Async Processing and Concurrency
Event-driven agents are inherently asynchronous. When an event arrives, the agent starts processing it but does not block waiting for results. If the agent needs to call an API, it issues the request and continues processing other events while waiting for the response. This is critical for agents handling multiple concurrent events -- a Slack bot agent might be processing five conversations simultaneously. Python's `asyncio`, JavaScript's event loop, or Go's goroutines provide the concurrency primitives.

*Recommended visual: Serverless agent pattern showing event trigger → Lambda function → load state from DynamoDB → process event → save state → return, with fan-out pattern for multiple concurrent events — see [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)*

### Serverless Agent Patterns
Serverless platforms are a natural fit for event-driven agents. The pattern: an event source (API Gateway, S3, CloudWatch) triggers a Lambda function. The function loads the agent's configuration, reconstructs state from a persistent store (DynamoDB, Redis), processes the event, saves updated state, and terminates. Cold start latency (1-5 seconds for Python Lambdas with dependencies) is the main challenge. Mitigation strategies include provisioned concurrency, keeping agent dependencies minimal, and using warm-start-friendly runtimes.

## Why It Matters

### Cost Efficiency
Agents that run continuously consume compute even when idle. A GPT-4-based agent polling for new emails every 30 seconds incurs LLM costs for every poll -- even when there are no new emails. An event-driven architecture eliminates idle compute. The agent runs only when there is work to do. For agents with bursty workloads (high activity during business hours, idle overnight), this can reduce costs by 80-95%.

### Scalability
Event-driven architectures decouple event production from event processing. When a spike of events arrives, you can scale up the number of agent instances processing events independently. A message queue (SQS, Kafka) acts as a buffer, smoothing out traffic spikes. Each agent instance pulls events from the queue, processes them, and acknowledges completion. If an instance fails mid-processing, the message returns to the queue for another instance to handle.

### Integration with Existing Systems
Most production software already uses events: CI/CD pipelines emit build events, monitoring systems emit alerts, CRMs emit customer activity events. Event-driven agents plug directly into these existing event streams. A deploy-monitoring agent subscribes to the same Datadog alert webhooks that page engineers. A sales assistant agent subscribes to the same Salesforce events that update dashboards. No new integration patterns are needed -- agents become another event consumer.

## Key Technical Details

- **Webhook handlers** typically expose an HTTP endpoint that validates the event signature (HMAC for GitHub, signing secret for Slack), parses the payload, and enqueues processing
- **Dead letter queues (DLQ)** capture events that fail processing after maximum retries, preventing data loss and enabling manual investigation
- **Idempotency** is critical: events may be delivered more than once (at-least-once delivery), so the agent must handle duplicate events gracefully using deduplication keys
- **Event schemas** should be versioned (e.g., `event.type: "pr.opened.v2"`) to enable backward-compatible evolution of event payloads
- **Backpressure** mechanisms prevent the agent from being overwhelmed: rate limiting, queue depth monitoring, and circuit breakers that temporarily stop consuming events
- **State reconstruction** in serverless patterns requires fast reads from a persistent store; Redis provides sub-millisecond latency for agent state lookups
- **Fan-out patterns** allow a single event to trigger multiple agent workflows: a new customer signup might activate an onboarding agent, a data enrichment agent, and a notification agent simultaneously

## Common Misconceptions

- **"Event-driven means the agent has no memory between events."** State is persisted externally (database, Redis, checkpoint store). The agent reconstructs its state when activated and persists updates before deactivating. Memory spans across events.
- **"Serverless agents are always cheaper."** For agents that process events continuously (high throughput, consistent load), a persistent server is more cost-effective than paying per-invocation serverless pricing. Serverless wins for bursty, low-frequency workloads.
- **"Event-driven architectures are only for simple agents."** Complex multi-step agents work in event-driven architectures by breaking execution into event-triggered stages. A research agent might process a "search_completed" event differently from an "article_read" event, progressing through its workflow across multiple event activations.
- **"You need a message queue for event-driven agents."** Simple event-driven agents can use direct webhook invocation without a queue. Queues add reliability (retry, buffering) but are not required for low-volume use cases.

## Connections to Other Concepts

- `agent-orchestration.md` -- Event-driven architectures provide the runtime execution model; orchestration provides the control flow logic that runs within each event handler
- `state-machines-and-graphs.md` -- Graph-based agents in event-driven architectures advance through graph nodes as events arrive, with state persisted between activations
- `error-handling-and-retries.md` -- Dead letter queues, retry policies, and idempotency are error-handling concerns specific to event-driven agent systems
- `agent-deployment.md` -- Serverless deployment is a natural pairing with event-driven agent architectures, handling scaling and infrastructure automatically
- `cost-optimization.md` -- Event-driven architectures are a primary cost optimization strategy, eliminating idle compute for bursty agent workloads

## Further Reading

- **Kleppmann, "Designing Data-Intensive Applications" (2017)** -- Chapters on stream processing and event-driven architectures provide the foundational infrastructure patterns that agent systems build upon
- **AWS Lambda Documentation (Amazon, 2024)** -- Reference architecture for serverless event-driven applications, directly applicable to agent deployment patterns
- **Inngest Documentation (2024)** -- A modern event-driven execution platform designed for AI workflows, with built-in step functions, retry logic, and agent-specific primitives
- **"Building LLM-Powered Agents with Event-Driven Architecture" (Chip Huyen, 2024)** -- Practical guide to combining LLM agents with event-driven infrastructure for production deployments
