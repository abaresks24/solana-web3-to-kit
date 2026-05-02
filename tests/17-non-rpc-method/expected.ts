import { createSolanaRpc } from '@solana/kit';
import { Connection } from "@solana/web3.js";

async function withCustomMethod() {
  const connection = createSolanaRpc("https://api.devnet.solana.com");
  const x = connection.someCustomMethod();
  const y = connection.toString();
  return { x, y };
}
