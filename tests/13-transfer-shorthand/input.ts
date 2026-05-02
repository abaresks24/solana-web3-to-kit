import { SystemProgram } from "@solana/web3.js";

function partial(payer: any, user: any, lamports: any) {
  return SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: user.publicKey,
    lamports,
  });
}

function allShorthand(fromPubkey: any, toPubkey: any, lamports: any) {
  return SystemProgram.transfer({ fromPubkey, toPubkey, lamports });
}
