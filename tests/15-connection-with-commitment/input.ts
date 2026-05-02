import { Connection } from "@solana/web3.js";

const conn = new Connection("https://api.devnet.solana.com", "confirmed");
const conn2 = new Connection("https://api.mainnet-beta.solana.com", { commitment: "finalized", wsEndpoint: "wss://..." });
