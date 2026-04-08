---
name: integrating-apis
description: Ability to interact with external REST and GraphQL APIs. Use when integrating with third-party APIs, fetching data from external services, or automating API interactions.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# API Integrator

## When to Use
- When integrating with external REST or GraphQL APIs.
- When fetching or sending data to third-party services.
- When automating API calls for data processing or workflows.
- When testing endpoints or simulating responses.

## Instructions
1.  **Exploration:** Use tools like `curl` or `httpie` to quickly test endpoints.
    *   **httpie:** `http GET api.example.com/users Authorization:"Bearer $TOKEN"`
    *   **curl:** `curl -H "Authorization: Bearer $TOKEN" https://api.example.com/users`
2.  **Collection Management:**
    *   **Postman/Bruno:** Use collections committed to repo (without secrets) to document the API.
    *   **OpenAPI:** Validate if the API has a spec (`swagger.json`) to auto-generate clients.
3.  **Authentication:** NEVER hardcode tokens.
    *   Use environment variables (`process.env.API_KEY` or `os.getenv('API_KEY')`).
    *   For local testing, use `.env` (added to `.gitignore`).
4.  **Error Handling:** Implement retry with exponential backoff for network failures (429/503).

## Examples
- "Test endpoint: `http GET https://api.example.com/health`"
- "Generate TypeScript client from OpenAPI spec: `openapi-generator-cli generate -i spec.yaml -g typescript-axios -o src/api`"
- "Mock response for test: create file `mocks/user_response.json` and serve with `json-server`."

## Resources
- **Rate Limiting:** Respect `X-RateLimit-*` headers.
- **Security:** Never log request bodies containing PII or passwords.
- **Idempotency:** Use `Idempotency-Key` in critical POST operations (payments).
