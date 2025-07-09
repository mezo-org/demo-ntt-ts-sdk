# MUSD Token Transfer Tests

This document provides instructions for running comprehensive tests for MUSD token transfers between Mezo Testnet and Sepolia chains using the Wormhole NTT (Native Token Transfer) protocol.

## Test Overview

The test suite covers the following scenarios:

### Transfer Scenarios

- **Sepolia → Mezo**: Transfer various amounts of MUSD tokens from Sepolia to Mezo testnet
- **Mezo → Sepolia**: Transfer various amounts of MUSD tokens from Mezo to Sepolia testnet

### Test Cases

1. **Standard Transfers**
   - 1.0 MUSD from Sepolia to Mezo
   - 0.5 MUSD from Sepolia to Mezo
   - 1.0 MUSD from Mezo to Sepolia
   - 0.5 MUSD from Mezo to Sepolia

2. **Edge Cases**
   - Very small amounts (0.001 MUSD)
   - Maximum precision transfers (1.12345678 MUSD)
   - Zero amount transfers (should fail)

## Prerequisites

### Environment Setup

1. **Node.js**: Ensure you have Node.js v18+ installed
2. **Dependencies**: Install required packages
3. **Environment Variables**: Set up your `.env` file with private keys and RPC URLs

### Required Environment Variables

Copy `.env.example` file in the project root and rename it to `.env`. Add values.


⚠️ **Important**: Use testnet accounts with sufficient MUSD tokens and ETH/native tokens for gas fees.

### Funded Test Accounts

You will need accounts with:
- **Sepolia**: ETH for gas fees + MUSD tokens
- **Mezo Testnet**: Native tokens for gas fees + MUSD tokens

## Installation

**Install dependencies**:

```bash
npm install
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

Add `.only` to the test case you want to run.
