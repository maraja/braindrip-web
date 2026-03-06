# Cloud Provider Deployment

**One-Line Summary**: Deploying LangGraph agents to AWS, GCP, or Azure involves packaging the agent as a Docker container and running it on a managed container service -- with each provider offering trade-offs in complexity, cost, and scaling behavior.

**Prerequisites**: `fastapi-deployment.md`, `containerization.md`, `production-checklist.md`

## What Is Cloud Provider Deployment?

Think of LangGraph Platform as a valet service -- you hand over your keys and they park the car. Cloud provider deployment is driving yourself: you choose the parking garage, the floor, and the spot. You have full control, but you also handle navigation, payment, and finding the exit. For teams that need to keep infrastructure within their own cloud account (for compliance, cost control, or integration with existing services), deploying directly to AWS, GCP, or Azure is the standard path.

All three major cloud providers offer managed container services that can run your Dockerized LangGraph agent without managing raw servers. The core pattern is the same: build a Docker image, push it to a container registry, and deploy it on a service that handles scaling, networking, and health checks. The differences lie in the specific services, CLI commands, and configuration details.

## How It Works

### AWS: ECS with Fargate

Amazon ECS (Elastic Container Service) with Fargate is the most common choice for containerized agents on AWS. Fargate eliminates server management entirely -- you define the container, and AWS runs it.

```python
# Step 1: Build and push to ECR (Elastic Container Registry)
# aws ecr get-login-password --region us-east-1 | \
#   docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
#
# docker build -t langgraph-agent .
# docker tag langgraph-agent:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/langgraph-agent:latest
# docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/langgraph-agent:latest

# Step 2: Create ECS task definition (task-definition.json)
# {
#   "family": "langgraph-agent",
#   "networkMode": "awsvpc",
#   "requiresCompatibilities": ["FARGATE"],
#   "cpu": "1024",
#   "memory": "2048",
#   "containerDefinitions": [{
#     "name": "agent",
#     "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/langgraph-agent:latest",
#     "portMappings": [{"containerPort": 8000, "protocol": "tcp"}],
#     "environment": [
#       {"name": "DATABASE_URL", "value": "postgresql://..."}
#     ],
#     "secrets": [
#       {"name": "OPENAI_API_KEY", "valueFrom": "arn:aws:secretsmanager:..."}
#     ],
#     "healthCheck": {
#       "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
#       "interval": 30, "timeout": 5, "retries": 3
#     },
#     "logConfiguration": {
#       "logDriver": "awslogs",
#       "options": {
#         "awslogs-group": "/ecs/langgraph-agent",
#         "awslogs-region": "us-east-1",
#         "awslogs-stream-prefix": "ecs"
#       }
#     }
#   }]
# }

# Step 3: Create service
# aws ecs create-service \
#   --cluster my-cluster \
#   --service-name langgraph-agent \
#   --task-definition langgraph-agent \
#   --desired-count 2 \
#   --launch-type FARGATE \
#   --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

### GCP: Cloud Run

Cloud Run is the simplest path on GCP -- it scales to zero when idle and charges only for active request time, making it cost-effective for agents with variable traffic.

```python
# Step 1: Build and push to Artifact Registry
# gcloud builds submit --tag gcr.io/<project-id>/langgraph-agent

# Step 2: Deploy to Cloud Run
# gcloud run deploy langgraph-agent \
#   --image gcr.io/<project-id>/langgraph-agent \
#   --port 8000 \
#   --memory 2Gi \
#   --cpu 1 \
#   --timeout 300 \
#   --min-instances 0 \
#   --max-instances 10 \
#   --set-env-vars "DATABASE_URL=postgresql://..." \
#   --set-secrets "OPENAI_API_KEY=openai-key:latest" \
#   --allow-unauthenticated

# Cloud Run specifics for agents:
# --timeout 300     (5 minutes, default 60s is too short for agent runs)
# --cpu-boost       (faster cold starts)
# --no-cpu-throttling  (keep CPU active during I/O waits -- important for streaming)
```

### Azure: Container Apps

Azure Container Apps provides a serverless container platform with built-in scaling and ingress, similar to Cloud Run.

```python
# Step 1: Build and push to Azure Container Registry
# az acr build --registry myregistry --image langgraph-agent:latest .

# Step 2: Deploy to Container Apps
# az containerapp create \
#   --name langgraph-agent \
#   --resource-group my-rg \
#   --environment my-env \
#   --image myregistry.azurecr.io/langgraph-agent:latest \
#   --target-port 8000 \
#   --ingress external \
#   --cpu 1.0 --memory 2.0Gi \
#   --min-replicas 0 \
#   --max-replicas 10 \
#   --secrets openai-key=<key-value> \
#   --env-vars "OPENAI_API_KEY=secretref:openai-key" \
#              "DATABASE_URL=postgresql://..."
```

### Database Considerations

All cloud deployments need a managed PostgreSQL instance for the checkpointer:

```python
# AWS: Amazon RDS PostgreSQL
# DATABASE_URL=postgresql://user:pass@my-db.xxx.us-east-1.rds.amazonaws.com:5432/agentdb

# GCP: Cloud SQL PostgreSQL
# DATABASE_URL=postgresql://user:pass@/agentdb?host=/cloudsql/project:region:instance

# Azure: Azure Database for PostgreSQL
# DATABASE_URL=postgresql://user:pass@my-db.postgres.database.azure.com:5432/agentdb
```

## Why It Matters

1. **Compliance and data residency** -- some organizations require infrastructure within their own cloud account, in specific regions, under their own security policies.
2. **Cost optimization** -- scale-to-zero services (Cloud Run, Container Apps) can be significantly cheaper for variable workloads compared to always-on managed platforms.
3. **Integration with existing infrastructure** -- deploying alongside existing databases, VPCs, monitoring, and CI/CD pipelines avoids duplicating infrastructure.
4. **No vendor lock-in** -- the Docker image is portable across all providers, and the FastAPI wrapper is a standard Python web server.
5. **Granular control** -- you choose instance sizes, scaling policies, networking rules, and security configurations.

## Key Technical Details

- All providers use the same Docker image built from the `Dockerfile` in `containerization.md`.
- Increase request timeouts beyond the default (60s) -- agent runs with tool calls and reasoning can take 30-120 seconds.
- Use managed secrets services (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault) instead of environment variables for API keys.
- Enable SSE streaming by ensuring your load balancer and ingress do not buffer responses -- Cloud Run and Container Apps support this by default; AWS ALB requires response streaming mode.
- For Cloud Run, set `--no-cpu-throttling` to prevent CPU from being throttled during I/O waits (LLM API calls), which would break streaming.
- Connect to managed PostgreSQL for the checkpointer; in-memory checkpointers do not work across container restarts or multiple replicas.
- Use health checks on the `/health` endpoint so the orchestrator can detect and restart unhealthy containers.
- Set minimum replicas to 1 if cold start latency (5-30 seconds) is unacceptable for your use case.

## Common Misconceptions

- **"Cloud Run cannot handle long-running agent requests."** Cloud Run supports request timeouts up to 60 minutes. Set `--timeout` appropriately for your use case.
- **"You need Kubernetes for production agent deployments."** Managed container services (ECS Fargate, Cloud Run, Container Apps) handle most use cases without the operational complexity of Kubernetes.
- **"Scale-to-zero means losing all state."** State lives in the PostgreSQL checkpointer, not the container. Containers can scale up and down freely.
- **"AWS is the only serious option for production."** All three providers offer production-grade container services. The choice depends on existing infrastructure and team expertise, not capability.

## Connections to Other Concepts

- `containerization.md` -- the Docker image and Compose setup used as the basis for all cloud deployments
- `fastapi-deployment.md` -- the FastAPI application inside the container
- `production-checklist.md` -- cloud deployment addresses infrastructure items; the checklist covers application-level hardening
- `checkpointers.md` -- managed PostgreSQL replaces MemorySaver for production persistence
- `langgraph-platform.md` -- the managed alternative that eliminates cloud provider configuration entirely

## Further Reading

- [AWS ECS Fargate Getting Started](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/getting-started-fargate.html)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Azure Container Apps Documentation](https://learn.microsoft.com/en-us/azure/container-apps/)
- [LangGraph PostgreSQL Checkpointer Setup](https://langchain-ai.github.io/langgraph/how-tos/persistence_postgres/)
