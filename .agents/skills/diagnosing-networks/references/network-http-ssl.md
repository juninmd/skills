# HTTP and SSL/TLS Inspection Reference

Guidelines for debugging APIs and certificate health.

## 1. HTTP Inspection (curl)
- **Verbose:** `curl -v https://example.com` (DNS, TCP, TLS, Headers).
- **Headers Only:** `curl -I https://example.com`.
- **POST JSON:** `curl -X POST -H "Content-Type: application/json" -d '{"key":"val"}' URL`.
- **Auth:**
  - `curl -H "Authorization: Bearer $TOKEN" URL`.
  - `curl -u user:pass URL` (Basic).
- **Follow Redirects:** `curl -L URL`.

## 2. SSL/TLS Certificate Analysis (openssl)
- **View Certificate:** `openssl s_client -connect example.com:443 -servername example.com < /dev/null | openssl x509 -text -noout`.
- **Check Expiration:** `echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates`.
- **Test TLS Versions:** `openssl s_client -connect example.com:443 -tls1_2 < /dev/null`.
