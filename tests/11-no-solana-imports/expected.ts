class Keypair {
  static generate() { return new Keypair(); }
}

const SystemProgram = {
  programId: "fake",
  transfer(args: { fromPubkey: string; toPubkey: string; lamports: number }) {
    return args;
  },
};

const x = new PublicKey("hi");
const y = Keypair.generate();
const z = SystemProgram.programId;
const w = SystemProgram.transfer({ fromPubkey: "a", toPubkey: "b", lamports: 1 });
