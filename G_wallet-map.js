// utils/G_wallet-map.js - v1.0.1
// Map wallets to userIds and store pending transactions if payment arrives first
const fs = require('fs');
const MAP_FILE = __dirname + '/wallet-map.json';

// Load or initialize wallet→userId map
let walletMap = {};
try { walletMap = JSON.parse(fs.readFileSync(MAP_FILE)); } catch {}

// In-memory pending payments: wallet → [{ amount, txid }, ...]
const pendingPayments = {};

function saveMap() {
  fs.writeFileSync(MAP_FILE, JSON.stringify(walletMap, null, 2));
}

/**
 * Register a wallet for a Telegram user
 */
function register(wallet, userId) {
  walletMap[wallet] = userId;
  saveMap();
}

/**
 * Get the Telegram userId for a registered wallet
 */
function getUser(wallet) {
  return walletMap[wallet];
}

/**
 * Queue a pending payment when wallet not yet registered
 */
function addPending(wallet, payment) {
  if (!pendingPayments[wallet]) pendingPayments[wallet] = [];
  pendingPayments[wallet].push(payment);
}

/**
 * Retrieve and clear pending payments for a wallet
 */
function drainPending(wallet) {
  const list = pendingPayments[wallet] || [];
  delete pendingPayments[wallet];
  return list;
}

module.exports = { register, getUser, addPending, drainPending };
