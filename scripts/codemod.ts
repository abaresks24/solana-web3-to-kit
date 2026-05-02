import type { Codemod, Edit, SgNode } from "codemod:ast-grep";
import type TS from "codemod:ast-grep/langs/typescript";

type Lang = TS;

const WEB3_SOURCE = "@solana/web3.js";

const CLUSTER_MAP: Record<string, string> = {
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
  "mainnet-beta": "https://api.mainnet-beta.solana.com",
};

function inlineRewriteClusterUrl(text: string): string {
  return text.replace(
    /\bclusterApiUrl\((['"])([\w-]+)\1\)/g,
    (m, _q, cluster) => (CLUSTER_MAP[cluster] ? `'${CLUSTER_MAP[cluster]}'` : m),
  );
}

function inlineRewriteFieldValue(
  text: string,
  signerVars: Set<string>,
): { text: string; needsAddress: boolean } {
  let out = text;
  let needsAddress = false;

  out = out.replace(
    /\b([a-zA-Z_$][\w$]*)\.publicKey\b/g,
    (m, name) => (signerVars.has(name) ? `${name}.address` : m),
  );
  out = out.replace(
    /\b([a-zA-Z_$][\w$]*)\.secretKey\b/g,
    (m, name) => (signerVars.has(name) ? `${name}.privateKey` : m),
  );
  out = out.replace(/\bnew\s+PublicKey\(/g, () => {
    needsAddress = true;
    return "address(";
  });

  return { text: out, needsAddress };
}

const RPC_METHODS = new Set([
  "getBalance",
  "getLatestBlockhash",
  "getAccountInfo",
  "getMultipleAccountsInfo",
  "getProgramAccounts",
  "getTokenAccountBalance",
  "getTokenAccountsByOwner",
  "getTokenAccountsByDelegate",
  "getSlot",
  "getBlockHeight",
  "getBlockTime",
  "getMinimumBalanceForRentExemption",
  "getSignatureStatuses",
  "getSignaturesForAddress",
  "getTransaction",
  "getTransactionCount",
  "getRecentBlockhash",
  "getSupply",
  "getTokenSupply",
  "getEpochInfo",
  "getVersion",
  "getFeeForMessage",
  "getInflationReward",
  "getInflationRate",
  "getInflationGovernor",
  "getRecentPerformanceSamples",
  "getRecentPrioritizationFees",
  "getStakeActivation",
  "getStakeMinimumDelegation",
  "getVoteAccounts",
  "getClusterNodes",
  "getFirstAvailableBlock",
  "getGenesisHash",
  "getHealth",
  "isBlockhashValid",
  "requestAirdrop",
  "sendRawTransaction",
  "sendTransaction",
  "simulateTransaction",
]);

function collectWeb3Imports(root: SgNode<Lang>): Set<string> {
  const names = new Set<string>();
  const importNodes = [
    ...root.findAll({
      rule: { pattern: `import { $$$NAMES } from '${WEB3_SOURCE}'` },
    }),
    ...root.findAll({
      rule: { pattern: `import { $$$NAMES } from "${WEB3_SOURCE}"` },
    }),
    ...root.findAll({
      rule: { pattern: `import type { $$$NAMES } from '${WEB3_SOURCE}'` },
    }),
    ...root.findAll({
      rule: { pattern: `import type { $$$NAMES } from "${WEB3_SOURCE}"` },
    }),
  ];
  for (const node of importNodes) {
    for (const m of node.getMultipleMatches("NAMES")) {
      const text = m.text().trim();
      if (!text || text === ",") continue;
      const stripped = text.replace(/^type\s+/, "");
      const bare = stripped.split(/\s+as\s+/)[0].trim();
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

  const signerVars = new Set<string>();
  if (imported.has("Keypair")) {
    const isSignerExpr = (t: string) =>
      /^\s*Keypair\.generate\(\)\s*$/.test(t) ||
      /^\s*Keypair\.fromSecretKey\(/.test(t) ||
      /^\s*await\s+generateKeyPairSigner\(\)\s*$/.test(t) ||
      /^\s*await\s+createKeyPairSignerFromBytes\(/.test(t);

    for (const declarator of r.findAll({
      rule: { kind: "variable_declarator" },
    })) {
      const name = declarator.field("name");
      const value = declarator.field("value");
      const type = declarator.field("type");
      if (!name) continue;

      if (type) {
        const typeText = type.text().replace(/^:\s*/, "").trim();
        if (typeText === "Keypair") {
          if (name.kind() === "identifier") signerVars.add(name.text());
          continue;
        }
      }

      if (!value) continue;

      if (name.kind() === "identifier") {
        if (isSignerExpr(value.text())) signerVars.add(name.text());
        continue;
      }

      if (name.kind() === "array_pattern" && value.kind() === "array") {
        const names = name
          .children()
          .filter(
            (c) =>
              c.kind() === "identifier" ||
              c.kind() === "shorthand_property_identifier_pattern",
          );
        const values = value
          .children()
          .filter(
            (c) => c.kind() !== "[" && c.kind() !== "]" && c.kind() !== ",",
          );
        if (
          names.length > 0 &&
          names.length === values.length &&
          values.every((v) => isSignerExpr(v.text()))
        ) {
          for (const nm of names) signerVars.add(nm.text());
        }
      }
    }
    for (const param of r.findAll({
      rule: {
        any: [{ kind: "required_parameter" }, { kind: "optional_parameter" }],
      },
    })) {
      const pat = param.field("pattern");
      const type = param.field("type");
      if (!pat || !type) continue;
      if (pat.kind() !== "identifier") continue;
      const typeText = type.text().replace(/^:\s*/, "").trim();
      if (typeText === "Keypair") {
        signerVars.add(pat.text());
      }
    }
  }

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

    if (signerVars.size > 0) {
      const isSigner = (v: string) =>
        signerVars.has(v) ||
        (v.startsWith("this.") && signerVars.has(v.slice(5)));

      for (const n of r.findAll({ rule: { pattern: "$V.publicKey" } })) {
        const v = n.getMatch("V")?.text();
        if (!v || !isSigner(v)) continue;
        edits.push(n.replace(`${v}.address`));
      }
      for (const n of r.findAll({ rule: { pattern: "$V.secretKey" } })) {
        const v = n.getMatch("V")?.text();
        if (!v || !isSigner(v)) continue;
        edits.push(n.replace(`${v}.privateKey`));
      }
    }
  }

  if (imported.has("clusterApiUrl")) {
    for (const n of r.findAll({ rule: { pattern: "clusterApiUrl($X)" } })) {
      const xText = n.getMatch("X")?.text();
      if (!xText) continue;
      const inner = xText.slice(1, -1);
      const url = CLUSTER_MAP[inner];
      if (url) edits.push(n.replace(`'${url}'`));
    }
  }

  if (imported.has("Connection")) {
    const rpcVars = new Set<string>();

    for (const declarator of r.findAll({
      rule: { kind: "variable_declarator" },
    })) {
      const name = declarator.field("name")?.text();
      if (!name) continue;

      const type = declarator.field("type");
      if (type) {
        const typeText = type.text().replace(/^:\s*/, "").trim();
        if (typeText === "Connection") {
          rpcVars.add(name);
          continue;
        }
      }

      const value = declarator.field("value");
      if (value) {
        const valueText = value.text();
        if (
          /^\s*new\s+Connection\s*\(/.test(valueText) ||
          /^\s*createSolanaRpc\s*\(/.test(valueText)
        ) {
          rpcVars.add(name);
        }
      }
    }

    for (const param of r.findAll({
      rule: { any: [{ kind: "required_parameter" }, { kind: "optional_parameter" }] },
    })) {
      const pat = param.field("pattern");
      const type = param.field("type");
      if (!pat || !type) continue;
      const typeText = type.text().replace(/^:\s*/, "").trim();
      if (typeText === "Connection") {
        rpcVars.add(pat.text());
      }
    }

    for (const n of r.findAll({
      rule: { pattern: "new Connection($$$ARGS)" },
    })) {
      const args = n
        .getMultipleMatches("ARGS")
        .filter((a) => a.text() !== ",");
      if (args.length === 0) continue;
      const url = inlineRewriteClusterUrl(args[0].text());
      edits.push(n.replace(`createSolanaRpc(${url})`));
      kitNames.add("createSolanaRpc");
    }

    if (rpcVars.size > 0) {
      for (const n of r.findAll({
        rule: { pattern: "$V.$M($$$ARGS)" },
      })) {
        const v = n.getMatch("V")?.text();
        const m = n.getMatch("M")?.text();
        if (!v || !m) continue;
        if (!RPC_METHODS.has(m)) continue;
        if (!rpcVars.has(v) && !(v.startsWith("this.") && rpcVars.has(v.slice(5))))
          continue;

        const parent = n.parent();
        if (parent && parent.kind() === "member_expression") {
          const prop = parent.field("property")?.text();
          if (prop === "send") continue;
        }

        const endPos = n.range().end.index;
        edits.push({
          startPos: endPos,
          endPos: endPos,
          insertedText: ".send()",
        });
      }
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
        const fromR = inlineRewriteFieldValue(from, signerVars);
        const toR = inlineRewriteFieldValue(to, signerVars);
        const lamportsR = inlineRewriteFieldValue(lamports, signerVars);
        if (fromR.needsAddress || toR.needsAddress || lamportsR.needsAddress) {
          kitNames.add("address");
        }
        edits.push(
          n.replace(
            `getTransferSolInstruction({ source: ${fromR.text}, destination: ${toR.text}, amount: ${lamportsR.text} })`,
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

  const TYPE_RENAMES: Array<{ from: string; to: string; deps: string[] }> = [
    { from: "Keypair", to: "KeyPairSigner", deps: ["KeyPairSigner"] },
    { from: "PublicKey", to: "Address", deps: ["Address"] },
    {
      from: "Connection",
      to: "Rpc<SolanaRpcApi>",
      deps: ["Rpc", "SolanaRpcApi"],
    },
  ];
  for (const { from, to, deps } of TYPE_RENAMES) {
    if (!imported.has(from)) continue;
    for (const n of r.findAll({ rule: { kind: "type_identifier" } })) {
      if (n.text() === from) {
        edits.push(n.replace(to));
        for (const dep of deps) kitNames.add(dep);
      }
    }
  }

  const kitImport = addNamedImport(r, [...kitNames], "@solana/kit");
  if (kitImport) edits.push(kitImport);
  const sysImport = addNamedImport(r, [...sysNames], "@solana-program/system");
  if (sysImport) edits.push(sysImport);

  return edits.length ? r.commitEdits(edits) : null;
};

export default codemod;
