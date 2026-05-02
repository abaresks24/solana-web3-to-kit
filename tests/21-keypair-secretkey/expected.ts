import { createKeyPairSignerFromBytes } from '@solana/kit';
import { Keypair } from "@solana/web3.js";

async function dump(bytes: Uint8Array) {
  const kp = await createKeyPairSignerFromBytes(bytes);
  console.log(kp.privateKey);
  return kp.privateKey.length;
}
