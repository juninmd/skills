# Diagnostics: Layer Triage

Open this when a failure crosses the network and you do not yet know which layer is at fault. It answers only "where"; the method for finding and fixing the cause — feedback loop, reproduction, hypotheses, regression test — is [debugging-phases.md](debugging-phases.md).

## Layer Triage
Work bottom-up. An L7 symptom with an L3 cause wastes every minute spent in the application.

| Layer | Question | Command |
|---|---|---|
| Name | Does the name resolve, and to what? | `dig +short <host>` · `nslookup <host>` |
| Route | Is the host reachable at all? | `ping -c 3 <host>` · `traceroute <host>` |
| Port | Is anything listening, and is it reachable? | `ss -tlnp` (local) · `nc -vz <host> <port>` (remote) |
| TLS | Is the chain valid and not expired? | `openssl s_client -connect <host>:443 -servername <host>` |
| HTTP | What does the server actually answer? | `curl -sS -D- -o /dev/null <url>` |
| Timing | Which phase is slow? | `curl -w '@curl-format.txt' -o /dev/null -sS <url>` |

`connection refused` means reachable but nothing listening — wrong port, service down, or bound to loopback. `connection timed out` means a firewall or route is swallowing it. They are different bugs; never treat them as one.

Run the checks from the same runtime environment as the failure when possible, and redact `-D-` header output before quoting it: `Authorization`, `Cookie`, and `Set-Cookie` carry credentials.

## Next
- The layer is found and the cause is not: build the Phase 1 loop in [debugging-phases.md](debugging-phases.md) at that layer.
- L3/L4 detail (packet loss, refused versus timeout, DNS): [network-connectivity.md](network-connectivity.md).
- L7 detail (curl timing breakdown, certificate chain, handshake): [network-http-ssl.md](network-http-ssl.md).
