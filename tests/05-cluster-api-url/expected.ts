import { Connection, clusterApiUrl } from "@solana/web3.js";

const dev = new Connection('https://api.devnet.solana.com');
const main = new Connection('https://api.mainnet-beta.solana.com');
const test = new Connection('https://api.testnet.solana.com');
