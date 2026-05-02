import { Connection, Keypair, PublicKey, SystemProgram, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";

async function airdropAndTransfer() {
  const conn = new Connection(clusterApiUrl("devnet"));
  const payer = Keypair.generate();
  const recipient = new PublicKey("So11111111111111111111111111111111111111112");

  const ix = SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: recipient, lamports: LAMPORTS_PER_SOL });
  const sysProg = SystemProgram.programId;
  return { ix, sysProg, conn };
}
