# Network Connectivity and DNS Reference

Guidelines for testing basic network accessibility and name resolution.

## 1. Basic Connectivity
- **ping:** Check if a host is accessible. `ping -c 4 google.com`.
- **nc (Netcat):** Test specific ports. `nc -zv example.com 443`.
- **telnet:** Alternative port testing. `telnet example.com 80`.

## 2. DNS Resolution
- **nslookup:** Basic query. `nslookup example.com`.
- **dig (Recommended):** Detailed queries.
  - `dig example.com` (A record).
  - `dig +trace example.com` (Full trace).
  - `dig @8.8.8.8 example.com` (Specify DNS server).
- **host:** Simple DNS query. `host example.com`.
