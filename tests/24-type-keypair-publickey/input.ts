import { Keypair, PublicKey } from "@solana/web3.js";

export function getOwner(kp: Keypair): PublicKey {
  return kp.publicKey;
}

export const wallets: Array<Keypair> = [];

export type WalletList = Array<Keypair>;
export type Owner = PublicKey | null;
