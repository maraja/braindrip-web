# Step 8: Deploy to Cloud Run

One-Line Summary: Deploy your research agent to Google Cloud Run with a single ADK command — get a live HTTPS endpoint anyone can access.

Prerequisites: Complete agent with sessions from Step 7, a Google Cloud account

---

## Why Cloud Run

Cloud Run is Google's serverless container platform. It is the natural deployment target for ADK agents because:

- **Scales to zero** — you pay nothing when nobody is using your agent
- **Scales up automatically** — handles traffic spikes without configuration
- **HTTPS by default** — every deployment gets a secure URL
- **One-command deploy** — ADK's CLI handles containerization, image push, and deployment

No Dockerfile to write. No container registry to manage. No Kubernetes to configure.

## Prerequisites

Before deploying, you need:

1. **A Google Cloud account** — [cloud.google.com](https://cloud.google.com/) (free tier available)
2. **A Google Cloud project** with billing enabled
3. **The `gcloud` CLI** installed — [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)

### Enable Required APIs

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable the APIs that ADK needs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  aiplatform.googleapis.com
```

### Authenticate

```bash
# Log in to Google Cloud
gcloud auth login

# Set up application default credentials
gcloud auth application-default login
```

## Deploy with One Command

ADK includes a built-in deployment command that handles everything:

```bash
adk deploy cloud_run \
  --project=YOUR_PROJECT_ID \
  --region=us-central1 \
  --service_name=research-agent \
  --with_ui \
  research_agent
```

That is it. One command. Here is what happens behind the scenes:

```
┌──────────────────────────────────────────────┐
│  adk deploy cloud_run                        │
│                                              │
│  1. Generates a Dockerfile from your code    │
│  2. Builds a container image                 │
│  3. Pushes to Artifact Registry              │
│  4. Deploys to Cloud Run                     │
│  5. Returns your live HTTPS URL              │
└──────────────────────────────────────────────┘
```

### Command Flags

| Flag | What It Does |
|------|-------------|
| `--project` | Your Google Cloud project ID |
| `--region` | Where to deploy (e.g., `us-central1`, `europe-west1`) |
| `--service_name` | Name for the Cloud Run service |
| `--with_ui` | Include the ADK web UI alongside the API server |
| `--app_name` | Application name (defaults to the agent directory name) |
| `--port` | Port number (defaults to 8000) |

## Access Your Agent

After deployment completes, you will see a URL like:

```
Service URL: https://research-agent-abc123-uc.a.run.app
```

If you used `--with_ui`, open that URL in your browser to get the same testing interface you used during development.

### Call the API

Your agent is also available as an API. You can send requests programmatically:

```bash
# Send a research query to your deployed agent
curl -X POST https://research-agent-abc123-uc.a.run.app/run \
  -H "Content-Type: application/json" \
  -d '{
    "app_name": "research_agent",
    "user_id": "api_user",
    "session_id": "session_1",
    "message": "What are the top AI trends right now?"
  }'
```

## Environment Variables

Your deployed agent needs the Gemini API key. Set it as a Cloud Run environment variable:

```bash
# Set environment variables on the deployed service
gcloud run services update research-agent \
  --region=us-central1 \
  --set-env-vars="GOOGLE_API_KEY=your-gemini-api-key"
```

Or pass extra `gcloud` flags during deployment using the `--` separator:

```bash
adk deploy cloud_run \
  --project=YOUR_PROJECT_ID \
  --region=us-central1 \
  --service_name=research-agent \
  --with_ui \
  research_agent \
  -- \
  --set-env-vars="GOOGLE_API_KEY=your-gemini-api-key"
```

## Update Your Deployment

When you make changes to your agent, redeploy with the same command:

```bash
# Same command — Cloud Run updates the existing service
adk deploy cloud_run \
  --project=YOUR_PROJECT_ID \
  --region=us-central1 \
  --service_name=research-agent \
  --with_ui \
  research_agent
```

Cloud Run performs **zero-downtime deployments** — it spins up the new version, routes traffic to it, then shuts down the old one.

## Costs

Cloud Run pricing is based on usage:

| Resource | Free Tier (per month) |
|----------|----------------------|
| CPU | 180,000 vCPU-seconds |
| Memory | 360,000 GiB-seconds |
| Requests | 2 million |

For a development agent with light traffic, you will likely stay within the free tier. The main cost will be the Gemini API calls themselves.

## Verify Your Deployment

Open your service URL in a browser. If you deployed with `--with_ui`, you should see the ADK web interface. Send a test message:

```
Search for the latest news about Google Cloud Run and summarize the top results.
```

If you see search results and a summary, your agent is live and working in production.

## Key Takeaways

- **`adk deploy cloud_run`** handles containerization, image push, and deployment in one command
- **No Dockerfile needed** — ADK generates it for you
- **`--with_ui`** bundles the testing interface with your API
- **Cloud Run scales to zero** — you only pay for what you use
- **Redeployment is the same command** — zero-downtime updates

---

**Reference:** [ADK Cloud Run Deployment](https://google.github.io/adk-docs/deploy/cloud-run/) · [Cloud Run Pricing](https://cloud.google.com/run/pricing) · [Google Cloud Free Tier](https://cloud.google.com/free)

[← Sessions and Memory](07-sessions-and-memory.md) | [Next: Step 9 - What's Next →](09-whats-next.md)
