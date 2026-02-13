---
name: api-integrator
description: This skill enables the agent to interact with external REST and GraphQL APIs. Use this when integrating with third-party APIs, fetching data from external services, or automating API interactions.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# API Integrator

## When to Use
- When integrating with external REST or GraphQL APIs
- When fetching or sending data to third-party services
- When automating API calls for data processing or workflows
- When testing API endpoints or mocking responses

## Instructions
1.  **Exploration:** Use tools like `curl` or `httpie` to test endpoints quickly.
    *   **httpie:** `http GET api.example.com/users Authorization:"Bearer $TOKEN"`
    *   **curl:** `curl -H "Authorization: Bearer $TOKEN" https://api.example.com/users`
2.  **Collection Management:**
    *   **Postman/Bruno:** Use collections commitadas no repo (sem secrets) para documentar a API.
    *   **OpenAPI:** Valide se a API possui spec (`swagger.json`) para gerar clientes automaticamente.
3.  **Authentication:** NUNCA hardcode tokens.
    *   Use variáveis de ambiente (`process.env.API_KEY` ou `os.getenv('API_KEY')`).
    *   Para testes locais, use `.env` (adicionado ao `.gitignore`).
4.  **Error Handling:** Implemente retry com backoff exponencial para falhas de rede (429/503).

## Examples
- "Test endpoint: `http GET https://api.example.com/health`"
- "Generate TypeScript client from OpenAPI spec: `openapi-generator-cli generate -i spec.yaml -g typescript-axios -o src/api`"
- "Mock response for test: Create a JSON file `mocks/user_response.json` and serve with `json-server`."

## Resources
- **Rate Limiting:** Respeite os headers `X-RateLimit-*`.
- **Security:** Nunca logue o corpo de requisições contendo PII ou senhas.
- **Idempotency:** Use `Idempotency-Key` em operações POST críticas (pagamentos).
