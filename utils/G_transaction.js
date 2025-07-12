// utils/G_transaction.js - v1.2.0
// Provides USDT TRC20 transaction polling and amount helpers
require('dotenv').config();
const axios = require('axios');

// TronGrid API base URL and USDT TRC20 contract address
const TRONGRID_API = process.env.TRONGRID_API || 'https://api.trongrid.io';
const USDT_CONTRACT = process.env.USDT_CONTRACT_ADDRESS; // e.g. 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj'
const PAGE_SIZE = 200;

/**
 * Fetches TRC20 USDT transactions to the given address.
 * @param {string} address TRON address to monitor
 * @param {string|null} sinceTxId Only return txs after this ID (optional)
 * @returns {Promise<Array<{txid:string, from:string, amount:number}>>}
 */
async function getUSDTTransactions(address, sinceTxId = null) {
  if (!USDT_CONTRACT) throw new Error('USDT_CONTRACT_ADDRESS not set');
  const url = `${TRONGRID_API}/v1/accounts/${address}/transactions/trc20`;
  const params = {
    only_to: true,
    contract_address: USDT_CONTRACT,
    limit: PAGE_SIZE,
  };
  if (sinceTxId) params.only_confirmed = true;

  const resp = await axios.get(url, { params });
  const data = resp.data.data || [];

  // Map to simplified format and filter by sinceTxId
  return data
    .filter(tx => !sinceTxId || tx.transaction_id > sinceTxId)
    .map(tx => ({
      txid: tx.transaction_id,
      from: tx.from,
      amount: parseInt(tx.value, 10) / 1e6, // USDT TRC20 has 6 decimals
    }));
}

// Existing helper functions
const AMOUNT_THRESHOLD_BASIC = parseFloat(process.env.AMOUNT_THRESHOLD_BASIC || '1');
const TOLERANCE = 0.01;

function isValidAmount(amount) {
  return amount >= AMOUNT_THRESHOLD_BASIC;
}

function isBasic(amount) {
  return Math.abs(amount - parseFloat(process.env.PRICE_BASIC || '1.99')) < TOLERANCE;
}

function isPremium(amount) {
  return Math.abs(amount - parseFloat(process.env.PRICE_PREMIUM || '28.99')) < TOLERANCE;
}

module.exports = {
  getUSDTTransactions,
  isValidAmount,
  isBasic,
  isPremium,
};
