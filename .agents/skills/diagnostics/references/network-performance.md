# Network Performance and Traffic Analysis

Guidelines for measuring latency and inspecting packets.

## 1. Network Routes
- **traceroute:** Trace hops to destination. `traceroute google.com`.
- **mtr:** Continuous traceroute with statistics. `mtr google.com`.

## 2. Traffic Analysis
- **tcpdump:** Packet capture (requires sudo).
  - `sudo tcpdump -i any port 80 -A` (HTTP traffic).
  - `sudo tcpdump -i any -w capture.pcap` (Save to file).
- **ss (Socket Statistics):** Active connections and ports.
  - `ss -ltn` (Listen TCP).
  - `ss -tlnp` (Processes using ports).

## 3. Performance Measurement
- **Latency:** `ping -c 100 URL | tail -1`.
- **HTTP Throughput:** Use `curl -w` to measure timings (DNS, Connect, Transfer, Total).
