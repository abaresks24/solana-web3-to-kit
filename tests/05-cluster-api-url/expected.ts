import { createSolanaRpc } from '@solana/kit';
import { Connection, clusterApiUrl } from "@solana/web3.js";

const dev = createSolanaRpc('https://api.devnet.solana.com');
const main = createSolanaRpc('https://api.mainnet-beta.solana.com');
const test = createSolanaRpc('https://api.testnet.solana.com');
