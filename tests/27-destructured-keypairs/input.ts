import { Keypair, SystemProgram } from "@solana/web3.js";

async function pair() {
  const [sender, recipient] = [Keypair.generate(), Keypair.generate()];
  const ix = SystemProgram.transfer({
    fromPubkey: sender.publicKey,
    toPubkey: recipient.publicKey,
    lamports: 1000,
  });
  return { sender, recipient, ix };
}
