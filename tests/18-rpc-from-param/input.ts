import { Connection, PublicKey } from "@solana/web3.js";

export async function airdrop(connection: Connection, pubkey: PublicKey) {
  const sig = await connection.requestAirdrop(pubkey, 1000000000);
  await connection.confirmTransaction(sig);
  return connection.getBalance(pubkey);
}
