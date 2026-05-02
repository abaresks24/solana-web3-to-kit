import { KeyPairSigner, Address } from '@solana/kit';
import { Keypair, PublicKey } from "@solana/web3.js";

export function getOwner(kp: KeyPairSigner): Address {
  return kp.address;
}

export function getSecret(signer: KeyPairSigner): Uint8Array {
  return signer.privateKey;
}
