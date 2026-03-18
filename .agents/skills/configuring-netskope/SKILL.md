---
name: configuring-netskope
description: Configurações de certificados SSL/CA para garantir conectividade em ambientes protegidos pelo Netskope na Luizalabs.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[config/tool] [options]"
disable-model-invocation: true
---

# Skill: Netskope Configuration
# Id: netskope_config

### Visão Geral
O Netskope é uma plataforma de segurança de nuvem utilizada na Luizalabs para controlar o acesso à internet. Em ambientes protegidos, ferramentas como `npm`, `pip` e `gcloud` podem enfrentar problemas de conectividade SSL.

### Quando Aplicar
- Sempre que trabalhar em ambientes de desenvolvimento ou produção da Luizalabs que utilizam Netskope.
- Antes de executar comandos que envolvam downloads ou conexões seguras (ex: `npm install`, `pip install`, `gcloud auth`).
- Em scripts de inicialização de ambiente ou containers Docker.
- Utilize o script `scripts/setup_netskope.sh` para configurar as variáveis de ambiente.

### Como Aplicar
Execute os seguintes comandos no terminal ou adicione ao `.bashrc` / `.zshrc`:

```bash
# Configuração Netskope para funcionar npm, pip, gcloud
export SSL_CERT_DIR="/etc/ssl/certs"
NETSKOPE_CA_PATH="$SSL_CERT_DIR/nscacert.pem"
export REQUESTS_CA_BUNDLE="$SSL_CERT_DIR/ca-certificates.crt"
export NODE_EXTRA_CA_CERTS="$NETSKOPE_CA_PATH"
export AWS_CA_BUNDLE="$SSL_CERT_DIR/ca-certificates.crt"
export GIT_SSL_CAPATH="$NETSKOPE_CA_PATH"
export CURL_CA_BUNDLE="$NETSKOPE_CA_PATH"
export SSL_CERT_FILE="$NETSKOPE_CA_PATH"
```

### Explicação das Variáveis
- `SSL_CERT_DIR`: Diretório onde os certificados SSL são armazenados.
- `NETSKOPE_CA_PATH`: Caminho para o certificado CA específico do Netskope.
- `REQUESTS_CA_BUNDLE`: Usado pelo Python (requests).
- `NODE_EXTRA_CA_CERTS`: Usado pelo Node.js/npm.
- `AWS_CA_BUNDLE`: Usado pelo AWS CLI/SDK.
- `GIT_SSL_CAPATH`: Usado pelo Git.
- `CURL_CA_BUNDLE`: Usado pelo curl.
- `SSL_CERT_FILE`: Arquivo de certificado SSL padrão.

### Validação
Teste com:
- `npm install`
- `pip install requests`
- `gcloud version`

Se houver erros, verifique se `$SSL_CERT_DIR/nscacert.pem` existe.
