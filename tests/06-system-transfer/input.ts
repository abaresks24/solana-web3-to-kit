import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

function makeTransfer(from: PublicKey, to: PublicKey) {
  return SystemProgram.transfer({ fromPubkey: from, toPubkey: to, lamports: LAMPORTS_PER_SOL });
}
