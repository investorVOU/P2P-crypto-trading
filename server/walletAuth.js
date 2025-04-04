const crypto = require('crypto');
const { storage } = require('./storage.cjs');
const { ethers } = require('ethers');

// Generate a nonce for wallet authentication
async function generateWalletNonce(address) {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(16).toString('hex');
  const nonce = `Sign this message to authenticate on P2P Trading Platform: ${randomString}-${timestamp}`;
  
  // Store the nonce in the database with the address and timestamp
  await storage.createOrUpdateWalletNonce(address.toLowerCase(), nonce);
  
  return nonce;
}

// Verify a wallet signature
async function verifyWalletSignature(address, signature) {
  try {
    // Get the nonce from the database
    const nonceData = await storage.getWalletNonce(address.toLowerCase());
    
    if (!nonceData) {
      console.error('No nonce found for address:', address);
      return false;
    }
    
    // Check if nonce is expired (10 minutes)
    const expirationTime = new Date(nonceData.created_at);
    expirationTime.setMinutes(expirationTime.getMinutes() + 10);
    
    if (new Date() > expirationTime) {
      console.error('Nonce expired for address:', address);
      return false;
    }
    
    // Verify the signature using ethers.js
    try {
      // Recover the address from the signature
      const message = nonceData.nonce;
      const signerAddress = ethers.verifyMessage(message, signature);
      
      // Check if it matches the claimed address (case-insensitive)
      const isValid = signerAddress.toLowerCase() === address.toLowerCase();
      
      if (!isValid) {
        console.error('Recovered address does not match claimed address');
        console.error('Claimed:', address.toLowerCase());
        console.error('Recovered:', signerAddress.toLowerCase());
      }
      
      return isValid;
    } catch (err) {
      console.error('Error during signature verification:', err);
      return false;
    }
  } catch (error) {
    console.error('Error verifying wallet signature:', error);
    return false;
  }
}

module.exports = {
  generateWalletNonce,
  verifyWalletSignature
};