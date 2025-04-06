# 🔐 WalletGen CLI (EVM Only)

**Securely generate and encrypt EVM-compatible wallets via CLI. Perfect for offline usage.**

---

## ✨ Features

- ✅ Generate mnemonic phrase, public address, and private key
- ✅ Choose output format: `.txt` or `.json`
- ✅ Encrypt wallet data with AES-256 using password
- ✅ Decrypt `.enc` files using built-in CLI tool
- ✅ Designed for **offline** and secure usage

---

## 📦 Requirements

- [Node.js](https://nodejs.org)
- Dependencies:
  - [`ethers`](https://www.npmjs.com/package/ethers)
  - [`readline-sync`](https://www.npmjs.com/package/readline-sync)

Install dependencies:

```bash
npm install ethers readline-sync