import { KeyPairSigner, Address } from '@solana/kit';
import { Keypair, PublicKey } from "@solana/web3.js";

export function getOwner(kp: KeyPairSigner): Address {
  return kp.address;
}

export const wallets: Array<KeyPairSigner> = [];

export type WalletList = Array<KeyPairSigner>;
export type Owner = Address | null;
