import { getTransferSolInstruction } from '@solana-program/system';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

function makeTransfer(from: PublicKey, to: PublicKey) {
  return getTransferSolInstruction({ source: from, destination: to, amount: LAMPORTS_PER_SOL });
}
