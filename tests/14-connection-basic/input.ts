import { Connection, PublicKey } from "@solana/web3.js";

async function checkBalance(addr: PublicKey) {
  const connection = new Connection("https://api.devnet.solana.com");
  const balance = await connection.getBalance(addr);
  return balance;
}
