import { Keypair, PublicKey } from "@solana/web3.js";

export function getOwner(kp: Keypair): PublicKey {
  return kp.publicKey;
}

export function getSecret(signer: Keypair): Uint8Array {
  return signer.secretKey;
}
