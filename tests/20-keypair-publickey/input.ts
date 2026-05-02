import { Keypair } from "@solana/web3.js";

async function main() {
  const kp = Keypair.generate();
  const pk = kp.publicKey;
  return { kp, pk };
}
