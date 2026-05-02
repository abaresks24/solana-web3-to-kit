import { Address } from '@solana/kit';
import { getTransferSolInstruction } from '@solana-program/system';
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

function makeTransfer(from: Address, to: Address) {
  return getTransferSolInstruction({ source: from, destination: to, amount: LAMPORTS_PER_SOL });
}
