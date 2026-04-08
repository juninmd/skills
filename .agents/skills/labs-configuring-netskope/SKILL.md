---
name: labs-configuring-netskope
description: SSL/CA certificate configurations to ensure connectivity in environments protected by Netskope at Luizalabs.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[config/tool] [options]"
disable-model-invocation: true
---

# Skill: Netskope Configuration
# Id: netskope_config

### Overview
Netskope is a cloud security platform used at Luizalabs to control internet access. In protected environments, tools like `npm`, `pip`, and `gcloud` may face SSL connectivity issues.

### When to Apply
- Whenever working in Luizalabs development or production environments that use Netskope.
- Before running commands involving downloads or secure connections (e.g., `npm install`, `pip install`, `gcloud auth`).
- In environment initialization scripts or Docker containers.
- Use the script `scripts/setup_netskope.sh` to configure environment variables.

### How to Apply
Run the following commands in the terminal or add them to `.bashrc` / `.zshrc`:

```bash
# Netskope configuration for npm, pip, gcloud to work
export SSL_CERT_DIR="/etc/ssl/certs"
NETSKOPE_CA_PATH="$SSL_CERT_DIR/nscacert.pem"
export REQUESTS_CA_BUNDLE="$SSL_CERT_DIR/ca-certificates.crt"
export NODE_EXTRA_CA_CERTS="$NETSKOPE_CA_PATH"
export AWS_CA_BUNDLE="$SSL_CERT_DIR/ca-certificates.crt"
export GIT_SSL_CAPATH="$NETSKOPE_CA_PATH"
export CURL_CA_BUNDLE="$NETSKOPE_CA_PATH"
export SSL_CERT_FILE="$NETSKOPE_CA_PATH"
```

### Variable Explanation
- `SSL_CERT_DIR`: Directory where SSL certificates are stored.
- `NETSKOPE_CA_PATH`: Path to the specific Netskope CA certificate.
- `REQUESTS_CA_BUNDLE`: Used by Python (requests).
- `NODE_EXTRA_CA_CERTS`: Used by Node.js/npm.
- `AWS_CA_BUNDLE`: Used by AWS CLI/SDK.
- `GIT_SSL_CAPATH`: Used by Git.
- `CURL_CA_BUNDLE`: Used by curl.
- `SSL_CERT_FILE`: Default SSL certificate file.

### Validation
Test with:
- `npm install`
- `pip install requests`
- `gcloud version`

If errors occur, verify if `$SSL_CERT_DIR/nscacert.pem` exists.
