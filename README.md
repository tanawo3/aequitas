# Aequitas Protocol

Aequitas is a Decentralized Adjudication Protocol built on the GenLayer Network. It leverages GenLayer Intelligent Contracts (Python) to read off-chain evidence and perform validator consensus to resolve subjective disputes between parties based on strict conditions.

## Features

- **Consensus-Driven Resolution**: No mock backends or centralized APIs. Uses GenLayer validators to form subjective consensus on dispute outcomes based on agreement conditions and evidence.
- **On-Chain Ledger**: View all active agreements, conditions, and resolution statuses directly from the contract state.
- **Brutalist Interface**: Built with React and Tailwind CSS featuring a clean, dark aesthetic.
- **Web3 Wallet Support**: Directly interacts with the GenLayer Studio Network using `genlayer-js`.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Blockchain SDK**: `genlayer-js`
- **Smart Contracts**: GenLayer Python VM (Intelligent Contracts)

## How to Run

1. **Connect Wallet**: Make sure your Web3 wallet (MetaMask, OKX) is configured to connect to the GenLayer Studio Network.
2. **Deploy Contract**: If you don't have an active contract, click "INITIALIZE CONTRACT" to deploy `AequitasContract.py` to the network.
3. **Interact**: 
   - Initialize new agreements by setting parties and strict conditions.
   - Open disputes and submit payloads to have validators resolve the outcome.

## Disclaimer

This application uses GenLayer intelligent capabilities. Ensure you test thoroughly on `studionet` before real-world deployment.
