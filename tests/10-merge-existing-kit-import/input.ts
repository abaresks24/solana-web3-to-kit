import { someFutureHelper } from "@solana/kit";
import { PublicKey, Keypair } from "@solana/web3.js";

async function main() {
  const owner = new PublicKey("abc");
  const payer = Keypair.generate();
  return { owner, payer, someFutureHelper };
}
