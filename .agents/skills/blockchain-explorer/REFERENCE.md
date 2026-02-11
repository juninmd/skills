# Blockchain Explorer Reference

## Tools

### 1. `Web3.py` (Python)
**Description:** A Python library for interacting with Ethereum.
**Common Commands:**
- `w3 = Web3(Web3.HTTPProvider('...'))`: Connect to node.
- `w3.eth.get_block('latest')`: Get latest block.
- `w3.eth.get_balance(address)`: Get balance.

### 2. `Ethers.js` (JavaScript)
**Description:** Complete Ethereum wallet implementation and utilities in JavaScript.
**Common Commands:**
- `provider.getBlockNumber()`: Get block number.
- `contract.functionName()`: Call contract function.

### 3. `Solana CLI`
**Description:** Command-line tool for Solana.
**Common Commands:**
- `solana balance`: Check balance.
- `solana transfer [ADDRESS] [AMOUNT]`: Transfer SOL.
