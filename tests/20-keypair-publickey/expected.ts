import { generateKeyPairSigner } from '@solana/kit';
import { Keypair } from "@solana/web3.js";

async function main() {
  const kp = await generateKeyPairSigner();
  const pk = kp.address;
  return { kp, pk };
}
