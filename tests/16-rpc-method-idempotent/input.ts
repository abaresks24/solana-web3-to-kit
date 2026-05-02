import { Connection } from "@solana/web3.js";

async function alreadyMigrated() {
  const connection = new Connection("https://api.devnet.solana.com");
  const balance = await connection.getBalance(addr).send();
  const slot = await connection.getSlot().send();
  return { balance, slot };
}
