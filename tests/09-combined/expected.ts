import { address, generateKeyPairSigner } from '@solana/kit';
import { getTransferSolInstruction, SYSTEM_PROGRAM_ADDRESS } from '@solana-program/system';
import { Connection, Keypair, PublicKey, SystemProgram, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

async function airdropAndTransfer() {
  const conn = new Connection('https://api.devnet.solana.com');
  const payer = await generateKeyPairSigner();
  const recipient = address("So11111111111111111111111111111111111111112");

  const ix = getTransferSolInstruction({ source: payer.publicKey, destination: recipient, amount: LAMPORTS_PER_SOL });
  const sysProg = SYSTEM_PROGRAM_ADDRESS;
  return { ix, sysProg, conn };
}
