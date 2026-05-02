import { Connection, clusterApiUrl } from "@solana/web3.js";

const dev = new Connection(clusterApiUrl("devnet"));
const main = new Connection(clusterApiUrl("mainnet-beta"));
const test = new Connection(clusterApiUrl("testnet"));
