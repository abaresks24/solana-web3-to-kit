import { getProgramDerivedAddress, Address } from '@solana/kit';
import { PublicKey } from "@solana/web3.js";

async function derive(seeds: Uint8Array[], programId: Address) {
  const { address: pda, bump: bump } = await getProgramDerivedAddress({ programAddress: programId, seeds: seeds })
  return { pda, bump };
}
