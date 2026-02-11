# Vector Database Operation Request

## Purpose
Standardized form for requesting vector database operations.

## Fields

### 1. Database Provider
- **Field:** `provider`
- **Type:** String (Enum: `pinecone`, `weaviate`, `milvus`, `chroma`, `qdrant`)
- **Description:** The vector database service to use.
- **Required:** Yes

### 2. Operation
- **Field:** `operation`
- **Type:** String (Enum: `create_index`, `upsert`, `query`, `delete`, `describe_index`)
- **Description:** The action to perform.
- **Required:** Yes

### 3. Index/Collection Name
- **Field:** `index_name`
- **Type:** String
- **Description:** Name of the index or collection.
- **Required:** Yes

### 4. Configuration (for `create_index`)
- **Field:** `config`
- **Type:** JSON Object
- **Description:** Settings like dimension, metric (cosine/euclidean), and cloud region.
- **Required:** No (Required for `create_index`)

### 5. Data (for `upsert`)
- **Field:** `data`
- **Type:** List of Objects
- **Description:** List of vectors to insert. Each object should have `id`, `values` (embedding), and optional `metadata`.
- **Required:** No (Required for `upsert`)

### 6. Query Parameters (for `query`)
- **Field:** `query_params`
- **Type:** JSON Object
- **Description:** Search parameters like `vector` (query embedding), `top_k`, `filter` (metadata filter), `namespace`.
- **Required:** No (Required for `query`)

## Example
```json
{
  "provider": "pinecone",
  "operation": "query",
  "index_name": "knowledge-base",
  "query_params": {
    "vector": [0.1, 0.2, ...],
    "top_k": 5,
    "filter": {"category": "documentation"}
  }
}
```
