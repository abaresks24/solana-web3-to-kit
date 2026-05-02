import { createKeyPairSignerFromBytes } from '@solana/kit';
import { Keypair } from "@solana/web3.js";

async function loadWallet(bytes: Uint8Array) {
  const wallet = await createKeyPairSignerFromBytes(bytes);
  return wallet;
}
