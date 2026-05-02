import { PublicKey } from "@solana/web3.js";

async function derive(seeds: Uint8Array[], programId: PublicKey) {
  const [pda, bump] = PublicKey.findProgramAddressSync(seeds, programId);
  return { pda, bump };
}
