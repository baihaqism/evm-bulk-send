# 💸 EVM Bulk Send
A powerful Node.js CLI tool for bulk Ethereum distribution across multiple wallets ⚡

## ✨ Features
* 🔐 Securely distribute ETH to multiple addresses
* 💰 Precise amount control per address
* 🔍 Comprehensive transaction tracking
* 📊 Balance verification before distribution

## 🚀 Installation

```bash
git clone https://github.com/baihaqism/evm-bulk-send.git && cd evm-bulk-send && npm install
```

## 📋 Prerequisites
* Fill a `wallet.txt` file with recipient addresses (one per line)
* Ensure source wallet has sufficient ETH balance

## 💻 Usage

```bash
npm start
```

### 🛠️ Required Inputs
* RPC URL (e.g., Ethereum, Polygon, or other EVM network endpoint)
* Source wallet private key
* Amount of ETH to distribute per address

## 📁 Input Requirements
* `wallet.txt`: Contains destination wallet addresses
* Addresses must be valid EVM addresses