import { Connection } from "@solana/web3.js";

async function withCustomMethod() {
  const connection = new Connection("https://api.devnet.solana.com");
  const x = connection.someCustomMethod();
  const y = connection.toString();
  return { x, y };
}
