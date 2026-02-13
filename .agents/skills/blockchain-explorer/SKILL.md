---
name: blockchain-explorer
description: This skill enables the agent to interact with blockchain networks, query smart contracts, analyze transactions, and manage wallets.
metadata:
  metadata:
    works_on: [vscode, antigravity, gemini_cli]

---

# Blockchain Explorer

## Instructions
- Connect to a blockchain node via RPC using libraries like Web3.js or Web3.py.
- Authenticate if necessary (e.g., using API keys for Infura or Alchemy).
- Get information about specific blocks (height, timestamp, transactions).
- Retrieve details of a transaction (sender, receiver, value, gas).
- Call read-only functions on smart contracts to get state.
- Sign and broadcast transactions (transfer tokens, call contract functions).
- Generate addresses, manage keys (securely), and check balances.
- Monitor events emitted by smart contracts.
- Trace transaction execution paths.
- Audit smart contract code for security.

## Resources
- **Security:** NEVER store private keys in plain text. Use environment variables or secure vaults.
- **Gas Estimation:** Always estimate gas before sending transactions to avoid failures.
- **Network Selection:** Double-check the network (Mainnet vs. Testnet) before performing actions.
