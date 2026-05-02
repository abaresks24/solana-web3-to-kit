import { generateKeyPairSigner } from '@solana/kit';
import { Keypair } from "@solana/web3.js";

declare function useWallet(): { publicKey: any; signTransaction: any };

async function main() {
  const kp = await generateKeyPairSigner();
  const wallet = useWallet();

  const ownPk = kp.address;
  const adapterPk = wallet.publicKey;
  return { ownPk, adapterPk };
}
