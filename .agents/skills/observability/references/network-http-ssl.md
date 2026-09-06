# HTTP and TLS Reference

Application-layer evidence (L7): request/response inspection, certificate health, and per-phase timing.

## 1. HTTP Inspection (curl)
- **Verbose:** `curl -v https://example.com` — shows DNS, TCP, TLS, and headers in one pass.
- **Headers only:** `curl -I https://example.com`.
- **POST JSON:** `curl -X POST -H "Content-Type: application/json" -d '{"key":"val"}' URL`.
- **Auth:** `curl -H "Authorization: Bearer $TOKEN" URL`, or `curl -u user:pass URL` for Basic.
- **Follow redirects:** `curl -L URL`.

## 2. Timing Breakdown
Do not treat "slow" as one symptom. Split it:

```
curl -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total}\n' -o /dev/null -s URL
```

- High `dns` → resolver, not the service.
- High `connect` → routing, saturation, or accept-queue backlog.
- High `tls` → handshake, chain fetching, or OCSP.
- `ttfb` far above `tls` → upstream processing is the cost.

## 3. TLS Certificate Analysis (openssl)
- **View certificate:** `openssl s_client -connect example.com:443 -servername example.com < /dev/null | openssl x509 -text -noout`.
- **Check expiry:** `echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates`.
- **Test a specific protocol version:** `openssl s_client -connect example.com:443 -tls1_2 < /dev/null`.
- Always pass `-servername`; without SNI a virtual host returns the wrong certificate and sends you chasing a fake mismatch.

## 4. Common Failures
- **Certificate invalid or expired:** Confirm with `s_client`. `curl -k` is a diagnostic shortcut for development only, never a fix.
- **Incomplete chain:** The leaf validates locally but fails elsewhere — the server is not sending intermediates. Check the chain depth in `s_client` output.
- **Handshake failure:** Protocol or cipher mismatch. Test versions individually before suspecting the certificate.
- **Unexpected 4xx/5xx:** Compare a verbose request against a known-good one; diff headers before diffing bodies.
