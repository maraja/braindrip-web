# Step 3: Start Qdrant

One-Line Summary: Launch a Qdrant vector database locally using Docker and verify it is accepting connections.

Prerequisites: Docker installed and running on your machine

---

## Why Qdrant?

A vector database stores embeddings (arrays of numbers representing the meaning of text) and lets you search by similarity. When a user asks a question, we embed the question, then find the stored chunks whose embeddings are closest to it.

Qdrant is an excellent choice for local development:

- **Open-source** with a permissive Apache 2.0 license
- **Single Docker command** to run — no accounts, no cloud setup
- **REST and gRPC APIs** built in
- **Rich filtering** — filter by metadata alongside vector similarity
- **Dashboard included** — a web UI to inspect your collections

## Start Qdrant with Docker

The simplest approach is a single Docker command:

```bash
# Pull and start Qdrant on port 6333 (REST) and 6334 (gRPC)
# Data is persisted in a local volume so it survives container restarts
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant:v1.13.2
```

Alternatively, create a `docker-compose.yml` in your project root for a more reproducible setup:

```yaml
# docker-compose.yml
# ==========================================
# Qdrant vector database — local development
# ==========================================

services:
  qdrant:
    image: qdrant/qdrant:v1.13.2
    container_name: qdrant
    ports:
      # REST API — used by the Python client
      - "6333:6333"
      # gRPC API — optional, faster for large batches
      - "6334:6334"
    volumes:
      # Persist data across container restarts
      - qdrant_storage:/qdrant/storage

volumes:
  qdrant_storage:
```

Then start it:

```bash
docker compose up -d
```

## Verify Qdrant Is Running

Check that the container is up:

```bash
docker ps | grep qdrant
```

You should see a running container on ports 6333 and 6334.

Hit the health endpoint:

```bash
curl http://localhost:6333/healthz
```

Expected response:

```json
{"title":"qdrant - vectorass engine","version":"1.13.2"}
```

You can also verify from Python, which confirms the client library can connect:

```python
# test_qdrant.py
# ==========================================
# Verify Qdrant is reachable from Python
# ==========================================

from qdrant_client import QdrantClient

# Connect to the local Qdrant instance
client = QdrantClient(host="localhost", port=6333)

# List existing collections (should be empty on first run)
collections = client.get_collections()
print(f"Connected to Qdrant. Collections: {collections.collections}")
```

```bash
python test_qdrant.py
```

Expected output:

```
Connected to Qdrant. Collections: []
```

## Explore the Dashboard

Qdrant ships with a built-in web dashboard. Open your browser and navigate to:

```
http://localhost:6333/dashboard
```

You will see an empty collections list. After we ingest documents in the next steps, your collection will appear here. The dashboard is useful for inspecting stored vectors, running test queries, and checking collection statistics.

## Troubleshooting

**"Cannot connect to the Docker daemon"** — Make sure Docker Desktop (or the Docker engine) is running. On macOS/Windows, open the Docker Desktop app. On Linux, run `sudo systemctl start docker`.

**Port 6333 already in use** — Another service is using that port. Either stop it or change the Qdrant port mapping: `-p 16333:6333` and update your Python client to use port 16333.

**Container exits immediately** — Check logs with `docker logs qdrant`. The most common cause is insufficient disk space or a corrupted volume. Try removing the volume and starting fresh: `docker volume rm qdrant_storage`.

Qdrant is running. Next, we load some documents.

---

[← Project Setup](02-project-setup.md) | [Next: Step 4 - Document Loader →](04-document-loader.md)
