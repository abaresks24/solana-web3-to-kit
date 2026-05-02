import { Keypair } from "@solana/web3.js";

async function dump(bytes: Uint8Array) {
  const kp = Keypair.fromSecretKey(bytes);
  console.log(kp.secretKey);
  return kp.secretKey.length;
}
