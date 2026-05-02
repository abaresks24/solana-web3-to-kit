import type { Codemod, Edit, SgNode } from "codemod:ast-grep";
import type TS from "codemod:ast-grep/langs/typescript";

type Lang = TS;

const WEB3_SOURCE = "@solana/web3.js";

function collectWeb3Imports(root: SgNode<Lang>): Set<string> {
  const names = new Set<string>();
  const importNodes = [
    ...root.findAll({
      rule: { pattern: `import { $$$NAMES } from '${WEB3_SOURCE}'` },
    }),
    ...root.findAll({
      rule: { pattern: `import { $$$NAMES } from "${WEB3_SOURCE}"` },
    }),
  ];
  for (const node of importNodes) {
    for (const m of node.getMultipleMatches("NAMES")) {
      const text = m.text().trim();
      if (!text || text === ",") continue;
      const bare = text.split(/\s+as\s+/)[0].trim();
      if (bare) names.add(bare);
    }
  }
  return names;
}

function addNamedImport(
  root: SgNode<Lang>,
  names: string[],
  from: string,
): Edit | null {
  if (names.length === 0) return null;

  const existing =
    root.find({ rule: { pattern: `import { $$$NAMES } from '${from}'` } }) ??
    root.find({ rule: { pattern: `import { $$$NAMES } from "${from}"` } });

  if (existing) {
    const existingSpecs = existing
      .getMultipleMatches("NAMES")
      .map((n) => n.text().trim())
      .filter((s) => s.length > 0 && s !== ",");
    const merged = Array.from(new Set([...existingSpecs, ...names]));
    return existing.replace(`import { ${merged.join(", ")} } from '${from}'`);
  }

  return {
    startPos: 0,
    endPos: 0,
    insertedText: `import { ${names.join(", ")} } from '${from}';\n`,
  };
}

const codemod: Codemod<Lang> = async (root) => {
  const r = root.root();
  const imported = collectWeb3Imports(r);

  if (imported.size === 0) return null;

  const edits: Edit[] = [];
  const kitNames = new Set<string>();
  const sysNames = new Set<string>();

  if (imported.has("PublicKey")) {
    for (const n of r.findAll({ rule: { pattern: "new PublicKey($X)" } })) {
      const x = n.getMatch("X")?.text();
      if (x) {
        edits.push(n.replace(`address(${x})`));
        kitNames.add("address");
      }
    }
    for (const n of r.findAll({
      rule: {
        pattern:
          "const [$PDA, $BUMP] = PublicKey.findProgramAddressSync($SEEDS, $PROG)",
      },
    })) {
      const pda = n.getMatch("PDA")?.text();
      const bump = n.getMatch("BUMP")?.text();
      const seeds = n.getMatch("SEEDS")?.text();
      const prog = n.getMatch("PROG")?.text();
      if (pda && bump && seeds && prog) {
        edits.push(
          n.replace(
            `const { address: ${pda}, bump: ${bump} } = await getProgramDerivedAddress({ programAddress: ${prog}, seeds: ${seeds} })`,
          ),
        );
        kitNames.add("getProgramDerivedAddress");
      }
    }
  }

  if (imported.has("Keypair")) {
    for (const n of r.findAll({ rule: { pattern: "Keypair.generate()" } })) {
      edits.push(n.replace("await generateKeyPairSigner()"));
      kitNames.add("generateKeyPairSigner");
    }
    for (const n of r.findAll({
      rule: { pattern: "Keypair.fromSecretKey($X)" },
    })) {
      const x = n.getMatch("X")?.text();
      if (x) {
        edits.push(n.replace(`await createKeyPairSignerFromBytes(${x})`));
        kitNames.add("createKeyPairSignerFromBytes");
      }
    }
  }

  if (imported.has("clusterApiUrl")) {
    const clusterMap: Record<string, string> = {
      devnet: "https://api.devnet.solana.com",
      testnet: "https://api.testnet.solana.com",
      "mainnet-beta": "https://api.mainnet-beta.solana.com",
    };
    for (const n of r.findAll({ rule: { pattern: "clusterApiUrl($X)" } })) {
      const xText = n.getMatch("X")?.text();
      if (!xText) continue;
      const inner = xText.slice(1, -1);
      const url = clusterMap[inner];
      if (url) edits.push(n.replace(`'${url}'`));
    }
  }

  if (imported.has("SystemProgram")) {
    for (const n of r.findAll({
      rule: { pattern: "SystemProgram.transfer($OBJ)" },
    })) {
      const obj = n.getMatch("OBJ");
      if (!obj || obj.kind() !== "object") continue;

      let from: string | undefined;
      let to: string | undefined;
      let lamports: string | undefined;

      for (const prop of obj.children()) {
        const k = prop.kind();
        if (k === "pair") {
          const key = prop.field("key")?.text();
          const value = prop.field("value")?.text();
          if (!key || !value) continue;
          if (key === "fromPubkey") from = value;
          else if (key === "toPubkey") to = value;
          else if (key === "lamports") lamports = value;
        } else if (k === "shorthand_property_identifier") {
          const key = prop.text();
          if (key === "fromPubkey") from = key;
          else if (key === "toPubkey") to = key;
          else if (key === "lamports") lamports = key;
        }
      }

      if (from && to && lamports) {
        edits.push(
          n.replace(
            `getTransferSolInstruction({ source: ${from}, destination: ${to}, amount: ${lamports} })`,
          ),
        );
        sysNames.add("getTransferSolInstruction");
      }
    }
    for (const n of r.findAll({
      rule: { pattern: "SystemProgram.programId" },
    })) {
      edits.push(n.replace("SYSTEM_PROGRAM_ADDRESS"));
      sysNames.add("SYSTEM_PROGRAM_ADDRESS");
    }
  }

  const kitImport = addNamedImport(r, [...kitNames], "@solana/kit");
  if (kitImport) edits.push(kitImport);
  const sysImport = addNamedImport(r, [...sysNames], "@solana-program/system");
  if (sysImport) edits.push(sysImport);

  return edits.length ? r.commitEdits(edits) : null;
};

export default codemod;
