import { Connection } from "@solana/web3.js";

const conn = new Connection("https://api.devnet.solana.com");
const balance = await conn.getBalance(somePubkey);
