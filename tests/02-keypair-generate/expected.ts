import { generateKeyPairSigner } from '@solana/kit';
import { Keypair } from "@solana/web3.js";

async function setup() {
  const payer = await generateKeyPairSigner();
  return payer;
}
