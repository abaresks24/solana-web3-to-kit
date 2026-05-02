import { Connection } from "@solana/web3.js";

const conn = new Connection("https://api.devnet.solana.com");

const someOtherObject = {
  getBalance: () => 42,
};
const x = someOtherObject.getBalance();
const y = await conn.getBalance(addr);
