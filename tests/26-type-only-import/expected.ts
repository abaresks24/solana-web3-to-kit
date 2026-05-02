import { Address } from '@solana/kit';
import type { PublicKey } from "@solana/web3.js";

export function isOwner(target: Address, owner: Address): boolean {
  return target === owner;
}
