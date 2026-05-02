import { getTransferSolInstruction } from '@solana-program/system';
import { SystemProgram } from "@solana/web3.js";

function partial(payer: any, user: any, lamports: any) {
  return getTransferSolInstruction({ source: payer.publicKey, destination: user.publicKey, amount: lamports });
}

function allShorthand(fromPubkey: any, toPubkey: any, lamports: any) {
  return getTransferSolInstruction({ source: fromPubkey, destination: toPubkey, amount: lamports });
}
