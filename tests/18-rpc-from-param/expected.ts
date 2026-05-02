import { Address, Rpc, SolanaRpcApi } from '@solana/kit';
import { Connection, PublicKey } from "@solana/web3.js";

export async function airdrop(connection: Rpc<SolanaRpcApi>, pubkey: Address) {
  const sig = await connection.requestAirdrop(pubkey, 1000000000).send();
  await connection.confirmTransaction(sig);
  return connection.getBalance(pubkey).send();
}
