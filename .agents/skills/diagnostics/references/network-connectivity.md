# Connectivity and Transport Reference

Reachability, name resolution, routing, and socket-level evidence (L3/L4).

## 1. Basic Connectivity
- **ping:** Check if a host is accessible. `ping -c 4 example.com`.
- **nc (Netcat):** Test a specific port. `nc -zv example.com 443`.
- **telnet:** Alternative port test. `telnet example.com 80`.

## 2. DNS Resolution
- **dig (preferred):** `dig example.com` (A record), `dig +trace example.com` (full delegation trace), `dig @8.8.8.8 example.com` (bypass the local resolver).
- **nslookup / host:** Quick one-off queries.
- Compare a resolver-specific answer against `@8.8.8.8` to separate a bad record from a bad resolver.

## 3. Routes and Latency
- **traceroute:** Hop-by-hop path. `traceroute example.com`.
- **mtr:** Continuous traceroute with loss and latency statistics. `mtr example.com`.
- **Latency baseline:** `ping -c 100 example.com | tail -1`.

## 4. Sockets and Traffic
- **ss:** `ss -ltn` (listening TCP), `ss -tlnp` (owning processes).
- **tcpdump:** `sudo tcpdump -i any port 80 -A` (inspect live), `sudo tcpdump -i any -w capture.pcap` (save for offline analysis).

## 5. Common Failures
- **Connection refused:** Nothing is listening, or the port is wrong. Check `ss -ltn | grep :PORT`; confirm the service is up — restart it if it is down — before blaming the network.
- **Connection timeout:** Firewall drop or unreachable host. Verify the path with `mtr`; check security groups and firewall rules.
- **Host resolution failed:** DNS. Test with `dig @8.8.8.8 example.com` and inspect `/etc/resolv.conf`.
- **Intermittent loss:** `mtr` over several minutes; loss at intermediate hops only is usually ICMP rate limiting, not a real fault.
