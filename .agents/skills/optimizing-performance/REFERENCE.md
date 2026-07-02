# Performance Optimizer Referência 📚
## Tools

### 1. `cProfile` (Python)
**Description:** Built-in Python profiler.
**Comandos Comuns:**
- `python -m cProfile script.py`: Run script with profiler.
- `python -m cProfile -o output.pstats script.py`: Save stats to file.

### 2. `py-spy`
**Description:** Sampling profiler for Python programs. Low overhead.
**Comandos Comuns:**
- `py-spy record -o profile.svg --pid 12345`: Record profile of running process.
- `py-spy top --pid 12345`: Live view of active functions.

### 3. `siege` / `wrk`
**Description:** HTTP load testing and benchmarking utilities.
**Comandos Comuns:**
- `siege -c 10 -t 1M http://localhost:8080`: Run 10 concurrent users for 1 minute.

