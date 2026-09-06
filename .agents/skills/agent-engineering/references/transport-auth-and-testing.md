# Transport, Auth, and Testing

## HTTP transport hardening

- Require credentials on every request: a bearer token for a service-to-service server, an OAuth authorization code flow when the server acts on behalf of an end user. Reject unauthenticated calls with a typed error, not a generic 500.
- Validate the `Origin` header on every incoming request and reject unknown origins.
- Bind a local server to `127.0.0.1`, never `0.0.0.0`. A server listening on all interfaces with no origin check is reachable from any page the user visits: the browser resolves an attacker-controlled hostname to loopback (DNS rebinding) and drives the tools with the user's credentials.
- Scope tokens to the minimum capability set and keep them out of tool arguments, results, and logs.
- Terminate TLS in front of any non-loopback listener.

## Long-running tools

- Declare a timeout per tool and return a typed timeout error rather than hanging the agent.
- Emit progress notifications for anything that can outlive a few seconds; an agent blocked on a silent call cannot tell slow from hung and will either stall or retry a side-effecting operation.
- Honor cancellation: stop the work, release resources, and report partial state instead of completing in the background.
- Prefer a start/poll pair for work measured in minutes: one tool starts the job and returns a handle, another reports status.

## Testing against a protocol client

Drive the server from a protocol inspector or a scripted client over the real transport, not by calling handler functions directly. Assert:

1. The advertised tool, resource, and prompt lists match what the server intends to expose, and every input schema validates.
2. A happy-path call round-trips and returns the documented field names.
3. Invalid input returns a typed, recoverable error and does not crash the process or leak a stack trace.
4. An unauthenticated or wrongly scoped call is rejected.
5. A large result is capped and its cursor advances to a stable next page.
6. A cancelled long call stops and reports cancellation.
7. Restarting the server keeps behavior identical; state must not live only in a warm process.
