import { createSolanaRpc } from '@solana/kit';
import { Connection } from "@solana/web3.js";

const conn = createSolanaRpc("https://api.devnet.solana.com");
const conn2 = createSolanaRpc("https://api.mainnet-beta.solana.com");
