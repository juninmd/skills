---
name: managing-vector-databases
description: |
  **DATABASE SKILL** - Manage vector databases for RAG and semantic search.
  USE FOR: vector index management, embeddings ingestion, similarity search, hybrid search, metadata filtering, Pinecone, Weaviate, Milvus, Qdrant, Chroma.
  DO NOT USE FOR: traditional relational queries (use administrating-databases), training embedding models, non-vector data storage.
  INVOKES: pinecone-client, weaviate-client, qdrant-client, chromadb.
license: MIT
metadata:
  version: 1.0.0
compatibility:
  platforms: "Python, Node.js"
allowed-tools: [read_file, write_file, run_shell_command]
---

# Vector Database Manager

Expert methodology for managing vector databases to support Retrieval-Augmented Generation (RAG), semantic search, and recommendation systems through optimized indexing and querying.

**USE FOR:**
- Creating and configuring vector indices with appropriate distance metrics (Cosine, Euclidean).
- Ingesting and updating large-scale embeddings with rich metadata.
- Implementing hybrid search (keyword + vector) for improved retrieval relevance.
- Managing multi-tenant environments through namespaces and metadata filtering.
- Benchmarking retrieval latency and recall quality.

**DO NOT USE FOR:**
- Normalizing relational data or complex SQL joins.
- Fine-tuning or training the underlying LLMs or embedding models.

**INVOKES:**
- Vector database SDKs and similarity search APIs.

## Capabilities and Standards
1. **Index Management:** Lifecycle control of vector collections and shard configurations.
2. **Similarity Search:** Query optimization using filters and distance metrics.
3. **Data Ingestion:** Batch upserting with metadata validation to prevent drift.

## Core Principles
1. **Model Alignment:** Ensure the distance metric matches the embedding model's training objective.
2. **Metadata Integrity:** Validate all metadata fields used for production filtering.
3. **Hybrid Balance:** Optimize the weight between keyword and semantic results based on domain requirements.

## Checklist
- [ ] Confirm embedding model and distance metric before creating indices.
- [ ] Validate recall quality with representative queries and filters.
- [ ] Ensure metadata schemas are consistent across ingested documents.
- [ ] Verify that indices have appropriate resource limits and scaling policies.
