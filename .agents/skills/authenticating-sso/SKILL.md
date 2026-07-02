---
name: authenticating-sso
description: Ability to implement authentication and authorization in internal collaborative applications using Internal SSO (Keycloak). Use for applications that manage employee logins. DO NOT use for M2M, B2B, or vendor integrations (use ID.platform instead).
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# Internal SSO Authenticator

## When to Use
- When integrating an application to authenticate platform employees.
- When the application needs to validate permissions/roles to grant specific access.
- When migrating an old application from legacy legacy Keycloak (legacy-idp) to the new Internal SSO.
- **DO NOT** use for machine-to-machine (M2M), B2B, vendor, or seller integrations. For these cases, use ID.platform (Turia).

## Context
Internal SSO is the centralized system for authentication and authorization of internal employees (human interaction). It is replacing the older legacy Keycloak (legacy-idp).
If migrating, note that older tokens had permissions in the `groups` array. Internal SSO places permissions in `resource_access.[your-client-id].roles`.

## Base URLs & Endpoints
All OIDC endpoints follow the pattern `{BASE_URL}/realms/internal/protocol/openid-connect/{endpoint}`.

| Environment | Base URL |
|---|---|
| **HML** | `https://sso-internal.mgc-hml.mglu.io` |
| **PROD** | `https://sso-internal.example.com` |

### Available Endpoints (relative to `{BASE_URL}/realms/internal`)

| Endpoint | Path |
|---|---|
| **Discovery** | `/.well-known/openid-configuration` |
| **Token** | `/protocol/openid-connect/token` |
| **Authorization** | `/protocol/openid-connect/auth` |
| **UserInfo** | `/protocol/openid-connect/userinfo` |
| **Logout** | `/protocol/openid-connect/logout` |

> [!TIP]
> Use the **Discovery** endpoint to get all metadata (endpoints, supported scopes, signing keys) automatically instead of hardcoding paths.

## Preparation & Client Requirements
Before implementing, check if the system requires Internal SSO authentication.
1. The system must be registered in the **User Control (cadUser)** to define access and roles.
2. The team must request a **Client ID** (and Client Secret if needed) via **AWX** (`https://awx.example.com/#/home`).
   - The Client ID should use underscores `_` on AWX templates (e.g., `aba_loja_assortment_admin`).
   - For frontends, a redirect URI needs to be pre-registered during the AWX setup.
3. The Client ID will be passed inside the token for validation via the `azp` claim.

### AWX Confirmation Example
When the client is created via AWX, you will receive a confirmation (usually via email) with a structure like this:
```json
{
    "auth_server_url": "https://sso-internal.example.com/",
    "clientId": "purchase_order_frontend",
    "description": "...",
    "id": "3320cb71-5718-4fe2-836b-1b5601cc1e80",
    "name": "purchase-order-frontend",
    "protocol": "openid-connect",
    "realm": "internal",
    "redirectUris": ["https://baap-sso-login.example.com/*"],
    "secret": "",
    "webOrigins": ["https://baap-console.example.com"]
}
```
> [!IMPORTANT]
> The `secret` field is often empty. You only receive a **Client Secret** if the Security team explicitly generates and enables it in Keycloak for your client (usually for backends/BFFs).

## Implementing Backend Authentication (Password Grant Flow)
If the backend handles the login directly:
1. Send a `POST` to the **Token** endpoint with `Content-Type: application/x-www-form-urlencoded`.
2. **Payload:**
    - `grant_type="password"`
    - `client_id="YOUR_CLIENT_ID"`
    - `username="user_login"`
    - `password="user_password"`
    - `client_secret` (Optional: only if enabled by Security team)
3. **Response:** The response will contain an `access_token` (JWT).

## Implementing Frontend Authentication (Authorization Code Flow OIDC)
If the application is a frontend single-page application (SPA):
1. Redirect the user to the **Authorization** endpoint with `client_id`, `redirect_uri` (pre-registered), `response_type=code`, `scope` (e.g., `openid profile email`).
2. The user authenticates and is redirected back to the `redirect_uri` with an authorization `code`.
3. Exchange the `code` for tokens (`id_token`, `access_token`) via a `POST` to the **Token** endpoint with `grant_type=authorization_code`, `client_id`, `code`, `redirect_uri`.
4. Optionally, retrieve user info from the **UserInfo** endpoint.

### PKCE (Proof Key for Code Exchange)
For SPAs without a BFF (Backend-for-Frontend), **DO NOT** use `client_secret`. Instead, implement **Authorization Code Flow with PKCE**:
1. Generate a `code_verifier` (random string) and a `code_challenge` (SHA256 hash of verifier).
2. Send `code_challenge` and `code_challenge_method=S256` in the Authorization request.
3. Send `code_verifier` in the Token request to prove original ownership.

## Token Decoding and Validation
The `access_token` is a JWT. When decoding it:
1. **User Login:** Get the employee username from the `preferred_username` field.
2. **Verify Client:** The `azp` (Authorized Party) field confirms the Client ID that generated the token.
3. **Permissions (Roles):** The user's roles are inside `resource_access.[your-client-id].roles`.
    - E.g: `resource_access["unclechan-front"].roles` -> `["ADMIN_TI"]`
    - If the user has no authorization, `roles` will be an empty array `[]`.

## JWT Validation (Security First)
Never just decode a token; always **validate** the claims:
- `iss` (Issuer): Must match the expected Realm URL.
- `aud` (Audience): Must contain your `client_id` (or check `azp`).
- `exp` (Expiration): Ensure the current time is before the expiry.
- `iat` (Issued At): Ensure it's not from the future.

> [!TIP]
> For advanced scenarios requiring cryptographic signature verification (JWKS), refer to the [Keycloak OIDC Endpoints documentation](https://www.keycloak.org/docs/latest/securing_apps/#available-endpoints). The JWKS URI is also available via the Discovery Endpoint.

## Refresh Tokens & Session Management
Access tokens are typically short-lived. Use the `refresh_token` to maintain the session:
- **Endpoint:** Token Endpoint (same as above).
- **Payload:** `grant_type=refresh_token`, `refresh_token="YOUR_REFRESH_TOKEN"`, `client_id`.
- **Note:** Handle `400 Bad Request` (token expired/revoked) by redirecting the user to login again.

## Logout (Single Sign-Out)
To end a session, redirect the user to the **Logout** endpoint.
- **Params:** `post_logout_redirect_uri` (optional), `client_id`, `id_token_hint` (optional but recommended).

## Recommended Libraries by Stack

| Stack | Library | Use Case |
|---|---|---|
| **Python** | `python-keycloak` | Full Keycloak admin + auth integration |
| **Python** | `authlib` or `PyJWT` | Generic OIDC / JWT validation |
| **Node.js (Backend)** | `openid-client` | Server-side OIDC client (recommended) |
| **Node.js (Backend)** | `jsonwebtoken` + `jwks-rsa` | Manual JWT validation with JWKS |
| **Node.js (Frontend)** | `keycloak-js` | Official Keycloak JS adapter for SPAs |
| **Java / Spring** | `spring-boot-starter-oauth2-client` | Spring Security OIDC integration |
| **Go** | `coreos/go-oidc` | OIDC client with discovery support |

## Backend Middleware Pattern
Protect your API routes by creating an authentication middleware/guard that:
1. Extracts the `Bearer` token from the `Authorization` header.
2. Decodes the JWT and validates the claims (`exp`, `iss`, `azp`).
3. Reads `resource_access.[your-client-id].roles` from the decoded payload.
4. If the user has the required role, attaches the user info (e.g., `preferred_username`, `roles`) to the request context and proceeds.
5. Otherwise, returns `401` (no/invalid token) or `403` (missing role).

## Frontend Integration Pattern (SPA)
General pattern for implementing the Authorization Code Flow in a frontend:
1. **Login:** Redirect the user to the Authorization Endpoint with `client_id`, `redirect_uri`, `response_type=code`, and `scope`.
2. **Callback:** On the callback route, extract the `code` from the URL query parameters.
3. **Token Exchange:** Send the `code` to your BFF or directly to the Token Endpoint to get `access_token` and `refresh_token`.
4. **Role Check:** Decode the `access_token` and read `resource_access.[your-client-id].roles` to determine user permissions.

> [!WARNING]
> Prefer exchanging the `code` via a **BFF (Backend-for-Frontend)** instead of directly from the browser.
> Avoid storing tokens in `localStorage` in production — use `httpOnly` cookies set by the BFF.

## Common Error Handling

| Status | Meaning | Action |
|---|---|---|
| `200 OK` | Authentication successful | Process the returned tokens |
| `400 Bad Request` | Invalid credentials, expired refresh token, or malformed request | Show error to user or redirect to login |
| `401 Unauthorized` | Token expired or invalid | Attempt refresh; if it fails, redirect to login |
| `403 Forbidden` | Token is valid but user lacks the required role | Show "access denied" message |
| `404 Not Found` | Wrong endpoint URL or realm | Verify your Internal SSO URL configuration |
| `502/503` | Internal SSO is temporarily unavailable | Implement retry with exponential backoff |

## CORS Configuration
For frontend apps calling the Token endpoint directly (without a BFF), the `webOrigins` field in the AWX client configuration **must** include your frontend domain.
- If `webOrigins` is misconfigured, the browser will block the token request with a CORS error.
- The `webOrigins` values are set during the AWX client creation.
- For local development, ensure `http://localhost:<port>` is also included in `webOrigins`.

## Environment Variables and .env Setup
**CRITICAL:** Ensure `.env` is listed in your `.gitignore` to avoid leaking secrets.

### Backend Template (.env)
```env
SSO_CORP_BASE_URL=https://sso-internal.mgc-hml.mglu.io
SSO_CORP_CLIENT_ID=your_client_id_here
SSO_CORP_CLIENT_SECRET=your_client_secret_here (only if enabled by SEC team)
```

### Frontend Template (.env)
```env
VITE_SSO_CORP_BASE_URL=https://sso-internal.mgc-hml.mglu.io
VITE_SSO_CORP_CLIENT_ID=your_client_id_here
VITE_SSO_CORP_REDIRECT_URI=http://localhost:5173/callback
```

### Helpful Prompts for AI Assistant
- **Backend Prompt:** "Generate a `.env` file for my backend using Internal SSO HML with the required variables for Base URL, Client ID, and Secret. Also, verify if `.env` is in `.gitignore`."
- **Frontend Prompt:** "Create a `.env` template for my frontend app with Internal SSO HML variables including Base URL, Client ID, and Redirect URI. Make sure to suggest adding it to `.gitignore`."

## Good Practices & Security
- **Never** manually pass user tokens between unrelated applications. Call M2M flows from application to application when appropriate.
- Client Secrets, if acquired, must be stored securely (e.g., in Google Secret Manager) and never hardcoded in the frontend.

