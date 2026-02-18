---
name: network-skill
description: Testes de conectividade, inspeção de headers HTTP, resolução de DNS e troubleshooting de rede.
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# Network & Diagnostics

Esta skill fornece ferramentas e comandos para depuração de rede, APIs e conectividade.

## When to use this skill
- Debugar problemas de conectividade entre serviços
- Inspecionar headers HTTP e certificados SSL/TLS
- Testar endpoints de APIs REST/GraphQL
- Diagnosticar problemas de DNS e resolução de nomes
- Verificar portas abertas e firewalls

## Instructions

### Teste de Conectividade Básica

**ping**: Verifica se um host está acessível na rede
```bash
ping -c 4 google.com
ping -c 4 8.8.8.8            # IP direto
```

**telnet/nc**: Testa se uma porta específica está aberta
```bash
telnet example.com 80
nc -zv example.com 443        # Verifica porta HTTPS
nc -zv localhost 5432         # Testa Postgres local
```

### Inspeção HTTP/HTTPS com curl

**Headers verbosos**: Debug completo da requisição
```bash
curl -v https://api.example.com/health
```

Output mostra:
- DNS lookup
- TCP handshake
- TLS handshake (certificados)
- Request headers
- Response headers
- Response body

**Ver apenas headers de resposta**:
```bash
curl -I https://api.example.com/users
```

**Testar com autenticação**:
```bash
# Bearer token
curl -H "Authorization: Bearer $TOKEN" https://api.example.com/me

# Basic auth
curl -u username:password https://api.example.com/login

# Custom headers
curl -H "X-API-Key: abc123" -H "Content-Type: application/json" https://api.example.com
```

**POST com JSON**:
```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@example.com"}'
```

**Seguir redirects**:
```bash
curl -L https://exemplo.com
```

**Timeout e retry**:
```bash
curl --max-time 10 --retry 3 --retry-delay 2 https://api.example.com
```

### Resolução DNS

**nslookup**: Consulta DNS básica
```bash
nslookup example.com
nslookup example.com 8.8.8.8    # Usando DNS específico
```

**dig**: Consulta DNS detalhada (recomendado)
```bash
dig example.com                 # Registro A
dig example.com AAAA            # IPv6
dig example.com MX              # Mail servers
dig example.com TXT             # Registros TXT (SPF, DKIM, etc)
dig @8.8.8.8 example.com        # Usando DNS do Google
dig +trace example.com          # Trace completo da resolução
```

**host**: Consulta DNS simples
```bash
host example.com
host -a example.com             # Todos os registros
```

### Análise de Certificados SSL/TLS

**Ver certificado de um site**:
```bash
openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -text -noout
```

**Verificar data de expiração**:
```bash
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -dates
```

**Testar versões TLS suportadas**:
```bash
openssl s_client -connect example.com:443 -tls1_2 < /dev/null
openssl s_client -connect example.com:443 -tls1_3 < /dev/null
```

### Rotas de Rede

**traceroute/tracepath**: Rastreia rota até o destino
```bash
traceroute google.com
tracepath google.com            # Não precisa sudo
```

**mtr**: Traceroute contínuo com estatísticas
```bash
mtr google.com
```

### Análise de Tráfego

**tcpdump**: Captura pacotes (requer sudo)
```bash
# Capturar tráfego HTTP
sudo tcpdump -i any port 80 -A

# Capturar tráfego de um host específico
sudo tcpdump -i any host 192.168.1.10

# Salvar em arquivo para análise posterior
sudo tcpdump -i any -w capture.pcap
```

**netstat/ss**: Conexões ativas e portas em uso
```bash
# Listar portas em LISTEN
ss -ltn                         # TCP
ss -lun                         # UDP

# Ver processos usando portas
ss -tlnp

# Ver conexões estabelecidas
ss -tn state established
```

### Testes de Performance

**Medir latência**:
```bash
ping -c 100 api.example.com | tail -1
```

**Medir throughput HTTP**:
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

### Erro: Connection refused
- Serviço não está rodando na porta especificada
- Verifique com `ss -ltn | grep :PORTA`
- Restart o serviço: `systemctl restart <service>`

### Erro: Connection timeout
- Firewall bloqueando a conexão
- Host inacessível na rede
- Verifique rotas com `traceroute` ou `mtr`
- Teste diferentes portas

### Erro: SSL certificate problem
- Certificado expirado ou inválido
- Verifique com `openssl s_client`
- Para bypass em dev: `curl -k` (não use em produção!)

### Erro: Could not resolve host
- Problema de DNS
- Teste com `dig` ou `nslookup`
- Verifique `/etc/resolv.conf`
- Tente DNS público: `dig @8.8.8.8 example.com`

### Performance lenta
- Alta latência: use `ping` e `mtr` para identificar gargalos
- DNS lento: teste com `time dig example.com`
- TLS handshake lento: analise com `curl -w` timing
- Upstream lento: verifique logs da aplicação

## Capabilities
- **curl**: Testes HTTP/HTTPS com headers, auth, timeouts
- **ping**: Conectividade básica e latência
- **dig/nslookup/host**: Resolução DNS
- **openssl**: Análise de certificados SSL/TLS
- **traceroute/mtr**: Análise de rotas de rede
- **tcpdump**: Captura de pacotes
- **ss/netstat**: Análise de portas e conexões
