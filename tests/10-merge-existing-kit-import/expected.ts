import { someFutureHelper, address, generateKeyPairSigner } from '@solana/kit'
import { PublicKey, Keypair } from "@solana/web3.js";

async function main() {
  const owner = address("abc");
  const payer = await generateKeyPairSigner();
  return { owner, payer, someFutureHelper };
}
