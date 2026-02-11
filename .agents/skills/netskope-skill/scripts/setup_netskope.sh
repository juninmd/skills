#!/bin/bash
# setup_netskope.sh
export SSL_CERT_DIR="/etc/ssl/certs"
NETSKOPE_CA_PATH="$SSL_CERT_DIR/nscacert.pem"

if [ -f "$NETSKOPE_CA_PATH" ]; then
    export REQUESTS_CA_BUNDLE="$SSL_CERT_DIR/ca-certificates.crt"
    export NODE_EXTRA_CA_CERTS="$NETSKOPE_CA_PATH"
    export AWS_CA_BUNDLE="$SSL_CERT_DIR/ca-certificates.crt"
    export GIT_SSL_CAPATH="$NETSKOPE_CA_PATH"
    export CURL_CA_BUNDLE="$NETSKOPE_CA_PATH"
    export SSL_CERT_FILE="$NETSKOPE_CA_PATH"
    echo "✅ Netskope environment variables set."
else
    echo "❌ Netskope CA certificate not found at $NETSKOPE_CA_PATH"
fi
