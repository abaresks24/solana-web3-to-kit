import { Address, Rpc, SolanaRpcApi } from '@solana/kit';
import { Connection, PublicKey } from "@solana/web3.js";

export class Service {
  constructor(public conn: Rpc<SolanaRpcApi>) {}

  async balanceOf(addr: Address): Promise<number> {
    return this.conn.getBalance(addr).send();
  }
}

export type ConnGetter = () => Rpc<SolanaRpcApi>;
