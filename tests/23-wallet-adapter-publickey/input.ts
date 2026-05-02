import { Keypair } from "@solana/web3.js";

declare function useWallet(): { publicKey: any; signTransaction: any };

async function main() {
  const kp = Keypair.generate();
  const wallet = useWallet();

  const ownPk = kp.publicKey;
  const adapterPk = wallet.publicKey;
  return { ownPk, adapterPk };
}
