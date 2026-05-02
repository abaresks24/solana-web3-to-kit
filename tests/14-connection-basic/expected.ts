import { createSolanaRpc, Address } from '@solana/kit';
import { Connection, PublicKey } from "@solana/web3.js";

async function checkBalance(addr: Address) {
  const connection = createSolanaRpc("https://api.devnet.solana.com");
  const balance = await connection.getBalance(addr).send();
  return balance;
}
