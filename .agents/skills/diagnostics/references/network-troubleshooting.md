# Network Troubleshooting Guide

Common errors and resolution steps for connectivity issues.

## 1. Connection Refused
- **Symptom:** Service not running or wrong port.
- **Fix:** Check `ss -ltn | grep :PORT`. Restart the service.

## 2. Connection Timeout
- **Symptom:** Firewall blocking or host unreachable.
- **Fix:** Verify routes with `mtr`. Check firewall rules.

## 3. SSL Errors
- **Symptom:** Invalid or expired certificate.
- **Fix:** Verify with `openssl s_client`. Bypass in dev only with `curl -k`.

## 4. Host Resolution Failed
- **Symptom:** DNS issue.
- **Fix:** Test with `dig @8.8.8.8 example.com`. Check `/etc/resolv.conf`.
