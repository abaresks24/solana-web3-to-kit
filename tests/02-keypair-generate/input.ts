import { Keypair } from "@solana/web3.js";

async function setup() {
  const payer = Keypair.generate();
  return payer;
}
