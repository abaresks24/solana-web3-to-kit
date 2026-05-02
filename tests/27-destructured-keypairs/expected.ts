import { generateKeyPairSigner } from '@solana/kit';
import { getTransferSolInstruction } from '@solana-program/system';
import { Keypair, SystemProgram } from "@solana/web3.js";

async function pair() {
  const [sender, recipient] = [await generateKeyPairSigner(), await generateKeyPairSigner()];
  const ix = getTransferSolInstruction({ source: sender.address, destination: recipient.address, amount: 1000 });
  return { sender, recipient, ix };
}
