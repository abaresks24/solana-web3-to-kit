import type { PublicKey } from "@solana/web3.js";

export function isOwner(target: PublicKey, owner: PublicKey): boolean {
  return target === owner;
}
