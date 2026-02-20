import argparse
import json

def generate_vector_db_request(provider, operation, index_name, config, data, query_params):
    request = {
        "provider": provider,
        "operation": operation,
        "index_name": index_name
    }
    if config:
        request["config"] = json.loads(config)
    if data:
        request["data"] = json.loads(data)
    if query_params:
        request["query_params"] = json.loads(query_params)
    
    return json.dumps(request, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a vector database operation request.")
    parser.add_argument("--provider", required=True, choices=['pinecone', 'weaviate', 'milvus', 'chroma', 'qdrant'], help="Vector DB provider")
    parser.add_argument("--operation", required=True, choices=['create_index', 'upsert', 'query', 'delete', 'describe_index'], help="Operation to perform")
    parser.add_argument("--index-name", required=True, help="Name of the index/collection")
    parser.add_argument("--config", help="JSON string for index configuration (for create_index)")
    parser.add_argument("--data", help="JSON string for data to upsert")
    parser.add_argument("--query-params", help="JSON string for query parameters")

    args = parser.parse_args()
    print(generate_vector_db_request(args.provider, args.operation, args.index_name, args.config, args.data, args.query_params))
