import { Connection, PublicKey } from "@solana/web3.js";

export class Service {
  constructor(public conn: Connection) {}

  async balanceOf(addr: PublicKey): Promise<number> {
    return this.conn.getBalance(addr);
  }
}

export type ConnGetter = () => Connection;
