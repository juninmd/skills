---
name: managing-vector-databases
description: Manage vector databases for similarity search, RAG systems, and semantic search applications.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[resource/project] [options]"
---

# Vector Database Manager

## Description
Specialized agent for managing vector databases (Pinecone, Weaviate, Milvus, Chroma, Qdrant). Capable of creating indices, ingesting embeddings, executing similarity searches, and managing vector metadata for RAG applications and semantic search.

## Capabilities
- **Index Management:** Create, configure, and remove vector indices/collections.
- **Data Ingestion:** Perform upserts of vectors with metadata and sparse values.
- **Similarity Search:** Query vectors via cosine similarity, dot product, or Euclidean distance.
- **Hybrid Search:** Combine keyword search with semantic search (where supported).
- **Metadata Filtering:** Filter results by metadata fields.
- **Namespace Management:** Organize vectors into namespaces for multi-tenancy.

## Use Cases
1.  **RAG Systems:** Store and retrieve document chunks for LLM context.
2.  **Semantic Search:** Implement search functionality based on meaning.
3.  **Recommendation Engines:** Find similar items (products, content) for users.
4.  **Long-term Memory:** Store agent memories as vectors for retrieval.

## Dependencies
- `pinecone-client` (Pinecone)
- `weaviate-client` (Weaviate)
- `pymilvus` (Milvus)
- `chromadb` (Chroma)
- `qdrant-client` (Qdrant)
