---
name: diagnosing-networks
description: "Connectivity tests, HTTP inspection, DNS resolution, troubleshooting. Triggers: network, DNS, HTTP."
argument-hint: "[incident/alert] [options]"
---

# Network & Diagnostics

This skill provides tools and commands for debugging networks, APIs, and connectivity.

## When to use this skill
- Debug connectivity issues between services.
- Inspect HTTP headers and SSL/TLS certificates.
- Test REST/GraphQL API endpoints.
- Diagnose DNS issues and name resolution.
- Verify open ports and firewalls.

## Instructions

### Service Health Checks
Use known health, readiness, or status endpoints from the target environment when they exist:

**Example public status check:**
```bash
# Example: inspect the headers returned by a public status page
curl -I https://www.githubstatus.com/
```

- Prefer service-specific `/health`, `/ready`, or status endpoints over guessing.

### Basic Connectivity Testing

**ping**: Check if a host is accessible on the network.
```bash
ping -c 4 google.com
ping -c 4 8.8.8.8            # Direct IP
```

**telnet/nc**: Test if a specific port is open.
```bash
telnet example.com 80
nc -zv example.com 443        # Check HTTPS port
nc -zv localhost 5432         # Test local Postgres
```

### HTTP/HTTPS Inspection with curl

**Verbose headers**: Full request debugging.
```bash
curl -v https://google.com
```

Output shows:
- DNS lookup
- TCP handshake
- TLS handshake (certificates)
- Request headers
- Response headers
- Response body

**View only response headers**:
```bash
curl -I https://api.example.com/users
```

**Test with authentication**:
```bash
# Bearer token
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/me

# Basic auth
curl -u username:password https://api.example.com/login

# Custom headers
curl -H "X-API-Key: abc123" -H "Content-Type: application/json" https://api.example.com
```

**POST with JSON**:
```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

**Follow redirects**:
```bash
curl -L https://example.com
```

**Timeout and retry**:
```bash
curl --max-time 10 --retry 3 --retry-delay 2 https://api.example.com
```

### DNS Resolution

**nslookup**: Basic DNS query.
```bash
nslookup example.com
nslookup example.com 8.8.8.8    # Using specific DNS
```

**dig**: Detailed DNS query (recommended).
```bash
dig example.com                 # A record
dig example.com AAAA            # IPv6
dig example.com MX              # Mail servers
dig example.com TXT             # TXT records (SPF, DKIM, etc.)
dig @8.8.8.8 example.com        # Using Google DNS
dig +trace example.com          # Full resolution trace
```

**host**: Simple DNS query.
```bash
host example.com
host -a example.com             # All records
```

### SSL/TLS Certificate Analysis

**View a site's certificate**:
```bash
openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -text -noout
```

**Check expiration date**:
```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -dates
```

**Test supported TLS versions**:
```bash
openssl s_client -connect example.com:443 -tls1_2 < /dev/null
openssl s_client -connect example.com:443 -tls1_3 < /dev/null
```

### Network Routes

**traceroute/tracepath**: Trace the route to the destination.
```bash
traceroute google.com
tracepath google.com            # Does not require sudo
```

**mtr**: Continuous traceroute with statistics.
```bash
mtr google.com
```

### Traffic Analysis

**tcpdump**: Packet capture (requires sudo).
```bash
# Capture HTTP traffic
sudo tcpdump -i any port 80 -A

# Capture traffic from a specific host
sudo tcpdump -i any host 192.168.1.10

# Save to a file for later analysis
sudo tcpdump -i any -w capture.pcap
```

**netstat/ss**: Active connections and ports in use.
```bash
# List ports in LISTEN state
ss -ltn                         # TCP
ss -lun                         # UDP

# View processes using ports
ss -tlnp

# View established connections
ss -tn state established
```

### Performance Testing

**Measure latency**:
```bash
ping -c 100 api.example.com | tail -1
```

**Measure HTTP throughput**:
```bash
curl -w "@-" -o /dev/null -s https://example.com/large-file <<'EOF'
    time_namelookup:  %{time_namelookup}s\n
       time_connect:  %{time_connect}s\n
    time_appconnect:  %{time_appconnect}s\n
   time_pretransfer:  %{time_pretransfer}s\n
      time_redirect:  %{time_redirect}s\n
 time_starttransfer:  %{time_starttransfer}s\n
                    ----------\n
         time_total:  %{time_total}s\n
EOF
```

## Troubleshooting
### Error: Connection refused
- Service is not running on the specified port.
- Verify with `ss -ltn | grep :PORT`.
- Restart the service: `systemctl restart <service>`.

### Error: Connection timeout
- Firewall is blocking the connection.
- Host is unreachable on the network.
- Verify routes with `traceroute` or `mtr`.
- Test different ports.

### Error: SSL certificate problem
- Certificate is expired or invalid.
- Verify with `openssl s_client`.
- To bypass in dev: `curl -k` (do not use in production!).

### Error: Could not resolve host
- DNS issue.
- Test with `dig` or `nslookup`.
- Check `/etc/resolv.conf`.
- Try public DNS: `dig @8.8.8.8 example.com`.

### Slow performance
- High latency: use `ping` and `mtr` to identify bottlenecks.
- Slow DNS: test with `time dig example.com`.
- Slow TLS handshake: analyze with `curl -w` timing.
- Slow upstream: check application logs.

## Capabilities
- **curl**: HTTP/HTTPS testing with headers, auth, timeouts.
- **ping**: Basic connectivity and latency.
- **dig/nslookup/host**: DNS resolution.
- **openssl**: SSL/TLS certificate analysis.
- **traceroute/mtr**: Network route analysis.
- **tcpdump**: Packet capture.
- **ss/netstat**: Port and connection analysis.

## Checklist

- [ ] Identify the failing hop first: DNS, TCP, TLS, HTTP, or application behavior.
- [ ] Capture timestamps, endpoints, and exact commands so the diagnosis is reproducible.
- [ ] Verify the fix with the same probe that originally demonstrated the failure.

## References

- [curl Documentation](https://curl.se/docs/)
- [OpenSSL Documentation](https://docs.openssl.org/)

