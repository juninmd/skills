---
name: api-integrator
description: This skill enables the agent to interact with external REST and GraphQL APIs. Use this when integrating with third-party APIs, fetching data from external services, or automating API interactions.
---

# API Integrator

## When to Use
- When integrating with external REST or GraphQL APIs
- When fetching or sending data to third-party services
- When automating API calls for data processing or workflows
- When testing API endpoints or mocking responses

## Instructions
- Explore and document RESTful API endpoints and their parameters.
- Formulate and execute GraphQL queries and mutations.
- Handle various authentication schemes (OAuth2, API Keys, Basic Auth).
- Parse and transform JSON/XML responses for further processing.
- Mock API responses for testing purposes.
- Identify the API base URL and available endpoints using documentation or introspection.
- Configure the necessary headers or tokens required for the API.
- Send HTTP requests (GET, POST, PUT, DELETE) or GraphQL operations.
- Check status codes and validate the structure of the returned data.

## Examples
- "Fetch user data from this REST API: https://api.example.com/users"
- "Execute this GraphQL query: { user(id: 1) { name email } }"
- "Mock a response for testing the login endpoint"

## Resources
- Adhere to API rate limits and usage quotas.
- Ensure sensitive information like API keys are handled securely and not logged.
- Handle network timeouts and errors gracefully.
