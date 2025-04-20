
const fs = require("fs");
const crypto = require("crypto");
const ethers = require("ethers");
const path = require("path");
const readline = require("readline");
const rlSync = require("readline-sync");

const walletsDir = path.join(__dirname, "wallets");
if (!fs.existsSync(walletsDir)) fs.mkdirSync(walletsDir);

function encrypt(text, password) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, "salt", 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text, password) {
  const [ivHex, encryptedHex] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const key = crypto.scryptSync(password, "salt", 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString("utf8");
}

function getNextIndex() {
  const files = fs.readdirSync(walletsDir);
  const indexes = files
    .map(file => parseInt(file.match(/wallet_(\d+)/)?.[1]))
    .filter(n => !isNaN(n));
  return indexes.length ? Math.max(...indexes) + 1 : 1;
}

async function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

async function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  const address = wallet.address;
  const mnemonic = wallet.mnemonic.phrase;
  const privateKey = wallet.privateKey;

  console.log('\n1. Save as .txt');
  console.log('2. Save as .json');

  let format;
  while (true) {
    format = await ask('Choose (1 atau 2): ');
    if (["1", "2"].includes(format)) break;
    console.log('❌ Invalid choice. Please enter 1 or 2.');
  }

  let encryptChoice = 'n';
  let password;

  while (true) {
    encryptChoice = await ask("Ingin mengenkripsi file? (y/n): ");
    if (["y", "n"].includes(encryptChoice.toLowerCase())) break;
    console.log("❌ Pilihan tidak valid! Harus 'y' atau 'n'.");
  }

  if (encryptChoice.toLowerCase() === 'y') {
    password = rlSync.question('Enter encryption password: ', { hideEchoBack: true });
  }

  const newIndex = getNextIndex();
  const ext = format === '1' ? 'txt' : 'json';
  const filename = `wallet_${newIndex}.${ext}${(encryptChoice === 'y') ? '.enc' : ''}`;
  const filepath = path.join(walletsDir, filename);

  let content;
  if (format === '1') {
    content = `Address: ${address}\nMnemonic: ${mnemonic}\nPrivate Key: ${privateKey}`;
  } else {
    content = JSON.stringify({ address, mnemonic, privateKey }, null, 2);
  }

  if (encryptChoice.toLowerCase() === 'y') {
    content = encrypt(content, password);
  }

  fs.writeFileSync(filepath, content);
  console.log(`\n✅ Wallet saved as ${filename}`);
}

async function decryptWallet() {
  const files = fs.readdirSync(walletsDir).filter(file => file.endsWith('.enc'));
  if (!files.length) return console.log("❌ Tidak ada file terenkripsi.");

  console.log("\nPilih file terenkripsi:");
  files.forEach((file, idx) => console.log(`${idx + 1}. ${file}`));

  let index;
  while (true) {
    index = await ask("Nomor file: ");
    if (index >= 1 && index <= files.length) break;
    console.log("❌ Pilihan tidak valid.");
  }

  const filename = files[index - 1];
  const password = rlSync.question('Masukkan password dekripsi: ', { hideEchoBack: true });
  const filepath = path.join(walletsDir, filename);
  const encryptedContent = fs.readFileSync(filepath, "utf8");

  try {
    const decrypted = decrypt(encryptedContent, password);
    console.log("\n🔓 Konten terdekripsi:\n");
    console.log(decrypted);
  } catch (e) {
    console.log("❌ Gagal mendekripsi. Password mungkin salah.");
  }
}

async function encryptExistingFile() {
  const files = fs.readdirSync(walletsDir).filter(file => !file.endsWith('.enc'));
  if (!files.length) return console.log("❌ Tidak ada file non-enkripsi yang ditemukan.");

  console.log("\nPilih file untuk dienkripsi:");
  files.forEach((file, idx) => console.log(`${idx + 1}. ${file}`));

  let index;
  while (true) {
    index = await ask("Nomor file: ");
    if (index >= 1 && index <= files.length) break;
    console.log("❌ Pilihan tidak valid.");
  }

  const filename = files[index - 1];
  const password = rlSync.question('Masukkan password enkripsi: ', { hideEchoBack: true });
  const filepath = path.join(walletsDir, filename);
  const content = fs.readFileSync(filepath, "utf8");
  const encrypted = encrypt(content, password);
  const newFilename = filename + ".enc";
  const newFilepath = path.join(walletsDir, newFilename);
  fs.writeFileSync(newFilepath, encrypted);
  console.log(`\n✅ File terenkripsi disimpan sebagai ${newFilename}`);
}

(async () => {
  console.log("\n=== Ethereum Wallet Generator ===");
  console.log("1. Generate wallet");
  console.log("2. Dekripsi wallet");
  console.log("3. Enkripsi file wallet yang sudah ada");

  const choice = await ask("Pilih (1, 2, atau 3): ");
  if (choice === "1") {
    await generateWallet();
  } else if (choice === "2") {
    await decryptWallet();
  } else if (choice === "3") {
    await encryptExistingFile();
  } else {
    console.log("❌ Pilihan tidak valid!");
  }
})();
