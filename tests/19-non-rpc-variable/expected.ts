import { createSolanaRpc } from '@solana/kit';
import { Connection } from "@solana/web3.js";

const conn = createSolanaRpc("https://api.devnet.solana.com");

const someOtherObject = {
  getBalance: () => 42,
};
const x = someOtherObject.getBalance();
const y = await conn.getBalance(addr).send();
