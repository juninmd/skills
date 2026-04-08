# Referência: API Integration Standards 📚
## Common HTTP Methods
- `GET`: Retrieve data from a server.
- `POST`: Send data to a server to create a new resource.
- `PUT`: Update an existing resource completely.
- `PATCH`: Update an existing resource partially.
- `DELETE`: Remove a resource from the server.

## Standard Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Server cannot process the request due to client error.
- `401 Unauthorized`: Authentication is required and has failed or not been provided.
- `403 Forbidden`: Server understood the request but refuses to authorize it.
- `404 Not Found`: Requested resource could not be found.
- `500 Internal Server Error`: Server encountered an unexpected condition.

## GraphQL Standards
- All requests are typically `POST` to a single `/graphql` endpoint.
- Success or failure is often returned with a `200 OK` status, with errors detailed in the `errors` field of the response body.
