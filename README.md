# 🔐 WalletGen CLI (EVM Only)

**Securely generate and encrypt EVM-compatible wallets via CLI. Perfect for offline usage.**

---

## ✨ Features

- 🚀 One-click wallet generation (address, mnemonic, private key)

- 🔐 Military-grade encryption (AES-256-CBC)

- 📁 Multiple formats: .txt or .json

- 🔓 Built-in decryption tool

- 📂 Automatic wallet organization
---

## 📦 Requirements

- [Node.js](https://nodejs.org)
- Dependencies:
  - [`ethers`](https://www.npmjs.com/package/ethers)
  - [`readline-sync`](https://www.npmjs.com/package/readline-sync)

## 🚀 Installation
Clone this repository:
```bash
git clone https://github.com/zamallrockk/wallet_generator.git

cd wallet_generator
```
Install dependencies:
```bash
npm install ethers readline-sync
```
Run the script with:
```bash
node genwallet.js
```

## 📋 Main Menu
1. Generate Wallet → Creates a new Ethereum wallet
   - Choose between .txt or .json format
   - Optionally encrypt with a password
   - Wallet files are saved in /wallets
2. Decrypt Wallet → Decrypts an encrypted wallet file
   - Enter the decryption password
   - Displays wallet info in the terminal


## 📌 Example Output
wallet_1.txt
```
Address: 0x123...abc  
Mnemonic: apple banana ... zebra  
Private Key: 0x456...def
```
wallet_2.json.enc (Encrypted)
```
a1b2c3...xyz
```
## ⚠️ Security Warning
Never share your wallet files or private keys!
Keep encryption passwords secure!
Encrypted files (.enc) can still be vulnerable with weak passwords.

## Badges

[![Donate](https://img.shields.io/badge/Buy_Me_a_Coffee-ko--fi-FF5E5B?logo=ko-fi&logoColor=white&style=flat-square)](https://ko-fi.com/zamallrock)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js CI](https://github.com/zamallrockk/wallet_generator/actions/workflows/nodejs-ci.yml/badge.svg)



## 🧠 Created by
**zamallrock** – 2025




