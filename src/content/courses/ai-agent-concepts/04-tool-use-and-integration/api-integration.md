# API Integration

**One-Line Summary**: API integration connects AI agents to external services via REST and GraphQL endpoints, handling authentication, rate limiting, pagination, and error recovery to enable real-world action.

**Prerequisites**: Function calling, HTTP protocol basics, JSON schema, authentication concepts (API keys, OAuth)

## What Is API Integration?

Think of an API as a restaurant menu with precise ordering instructions. The menu (API documentation) tells you what dishes (endpoints) are available, what customizations (parameters) you can request, and the format for placing your order (request structure). The kitchen (server) prepares your order and returns it through the window (response). An AI agent integrating with APIs is like a very capable dining companion who reads the menu, places the right order based on your preferences, handles any issues with the kitchen, and combines dishes from multiple restaurants into a coherent meal.

API integration is the practice of connecting AI agents to external services — weather data, CRM systems, payment processors, email providers, databases, and thousands of other services that expose programmatic interfaces. The agent translates user intent into HTTP requests, sends them to the appropriate endpoint, processes the response, and feeds the result back into its reasoning. This is the primary mechanism by which agents affect the real world beyond generating text.

The challenge is not making a single API call — that is trivial. The challenge is doing it reliably at scale: handling authentication flows, respecting rate limits, paginating through large result sets, recovering from errors, and transforming between the data formats the API expects and the structured outputs the LLM produces. Production API integration requires treating every external call as potentially slow, flaky, or adversarial.

*Recommended visual: A flow diagram showing the API integration lifecycle: OpenAPI spec parsing to tool schema generation to LLM function call to HTTP request construction to execution with auth/retry/rate-limiting to response parsing to LLM context — see [Qin et al., "ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs" (2023)](https://arxiv.org/abs/2307.16789)*

## How It Works

### Endpoint Discovery and Schema Generation

Before an agent can use an API, the available endpoints must be described as tool schemas the LLM can understand. This can be done manually (writing function definitions) or automatically by parsing OpenAPI/Swagger specifications. Tools like `openapi-to-functions` convert OpenAPI specs into LLM-compatible function schemas. The conversion must balance completeness (all endpoints available) with usability (too many endpoints trigger the "too many tools" problem).

### Authentication Patterns

APIs use various authentication mechanisms that agents must handle:

- **API keys**: Simplest — a static token passed in a header (`Authorization: Bearer <key>`) or query parameter. The key is stored securely and injected into requests by the agent runtime, never exposed to the LLM.
- **OAuth 2.0**: Required for user-specific access (e.g., reading a user's Gmail). Involves authorization code flows, token refresh, and scope management. The agent framework must handle token lifecycle; the LLM only sees the authenticated endpoint.
- **Session-based auth**: Some APIs require login flows that produce session cookies. Browser automation may be needed for these.

### Rate Limiting and Throttling

Production APIs enforce rate limits (e.g., 100 requests/minute). Agents must implement: exponential backoff on 429 (Too Many Requests) responses, request queuing to stay under limits, and caching of repeated identical requests. Without rate limit handling, an eager agent can exhaust quotas in minutes, especially in loops.

### Error Handling and Retry Logic

API calls fail for many reasons: network timeouts, server errors (500), invalid parameters (400), authentication expiry (401), and rate limiting (429). Robust agent systems classify errors as retryable (500, 429, timeout) vs. non-retryable (400, 404, 403), implement retry with backoff for the former, and return descriptive error messages to the LLM for the latter so it can adjust its approach.

## Why It Matters

### Real-World Capabilities

APIs are how agents interact with the real world. Without API integration, an agent is limited to text generation. With it, an agent can send messages (Slack, email), manage projects (Jira, Linear), process payments (Stripe), retrieve data (databases, SaaS platforms), and control physical systems (IoT devices, cloud infrastructure).

### The Long Tail of Integrations

There are tens of thousands of public APIs. Each business has internal APIs. The ability to quickly integrate an agent with a new API — reading its docs, generating function schemas, handling its auth pattern — is a core competency for agent developers. Frameworks that make this easy (like MCP servers or LangChain tool wrappers) provide enormous leverage.

### Reliability as a Differentiator

The difference between a demo agent and a production agent is largely API integration quality. Demos work on the happy path. Production agents handle token refresh at 3 AM, retry on transient failures, paginate through 10,000 records, and degrade gracefully when a dependency is down.

## Key Technical Details

- **REST vs. GraphQL**: REST APIs have fixed endpoints returning fixed shapes. GraphQL APIs have a single endpoint where the agent specifies exactly what data to return. GraphQL reduces over-fetching but requires the agent to construct valid queries, which adds complexity.
- **Pagination patterns**: APIs use cursor-based (`?cursor=abc123`), offset-based (`?page=2&limit=50`), or link-header pagination. Agents must recognize when results are truncated and issue follow-up requests to get complete data.
- **Idempotency**: POST requests that create resources should include idempotency keys to prevent duplicate creation when retrying after ambiguous failures (timeout where you do not know if the server processed the request).
- **Response size management**: API responses can be very large. Agents should request only needed fields (GraphQL) or use query parameters to filter server-side. Dumping a 50KB JSON response into the LLM context is wasteful and can degrade performance.
- **Webhook vs. polling**: For async operations, agents can either poll an endpoint repeatedly or register a webhook callback. Webhooks are more efficient but require the agent system to expose an HTTP endpoint.
- **Timeout configuration**: Set aggressive timeouts (5-15 seconds) for API calls. An agent waiting 60 seconds for a hung API creates a terrible user experience. Fail fast and inform the model.
- **Sensitive data handling**: API responses may contain PII or secrets. The agent runtime should filter sensitive fields before passing data to the LLM or logging it.

## Common Misconceptions

- **"The LLM makes HTTP requests directly"**: The LLM generates a function call specifying the endpoint and parameters. The host application's runtime executes the actual HTTP request. The model never directly touches the network.
- **"One API = one tool"**: A complex API like Salesforce has hundreds of endpoints. Exposing all of them as tools is impractical. Effective integration curates a subset of the most useful endpoints and wraps them in higher-level tools (e.g., `update_deal_status` instead of raw `PATCH /api/v1/opportunities/:id`).
- **"API integration is a solved problem"**: Each API has quirks — inconsistent error formats, undocumented rate limits, breaking changes in new versions. Production integration requires ongoing maintenance, monitoring, and adaptation.
- **"Authentication can be handled once"**: OAuth tokens expire (typically every hour). API keys get rotated. Session cookies invalidate. Authentication is an ongoing lifecycle, not a one-time setup.

## Connections to Other Concepts

- `function-calling.md` — Function calling is the mechanism by which the LLM specifies which API endpoint to call and with what parameters.
- `tool-selection-and-routing.md` — When dozens of API endpoints are available, the agent must select the right one for the user's intent.
- `tool-chaining.md` — Complex API workflows require chaining multiple calls: search for a customer, get their order, update the status.
- `model-context-protocol.md` — MCP provides a standardized way to expose API integrations as tool servers that any MCP-compatible client can use.
- `structured-output-for-actions.md` — API request bodies must be precisely structured; structured output techniques ensure the LLM generates valid request payloads.

## Further Reading

- Qin et al., "ToolLLM: Facilitating Large Language Models to Master 16000+ Real-world APIs" (2023) — Research on enabling LLMs to select and use APIs from a catalog of 16,000+ real-world REST endpoints.
- LangChain Documentation, "API Chain" (2024) — Practical guide to building agent chains that interact with REST APIs, including authentication and error handling patterns.
- Postman, "State of the API Report" (2024) — Annual survey of API practices, standards, and trends relevant to agent integration.
- Anthropic, "Building Effective Agents" (2024) — Guidance on structuring API tool definitions for Claude, including patterns for complex multi-step API workflows.
- Swagger/OpenAPI Specification v3.1 (2023) — The standard for describing REST APIs that serves as the source for auto-generating agent tool schemas.
