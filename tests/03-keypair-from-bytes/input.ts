import { Keypair } from "@solana/web3.js";

async function loadWallet(bytes: Uint8Array) {
  const wallet = Keypair.fromSecretKey(bytes);
  return wallet;
}
