# Solana DevRel outreach — drafts

> The Tier-3 prize ($2k) requires a Solana team member to either host this codemod in their org or reference it in their official upgrade guide. The path is short — Solana is actively pushing kit adoption — but it requires a personal ask.

## Who to contact

| Contact | Channel | Why |
| --- | --- | --- |
| **Nick Frostbutter** ([@nickfrosty](https://github.com/nickfrosty)) | GitHub @-mention on a kit-related issue, or X DM | Lead DevRel for Solana, owns `solana-developers/helpers` (the case-study target). Most likely to own a "tools we recommend" page in the kit migration guide. |
| **Steve Luscher** ([@steveluscher](https://github.com/steveluscher)) | X / GitHub | Lead author of `@solana/kit`, deeply opinionated about the migration story. Reviewing DX wins is part of his job. |
| **Solana Foundation Discord** — `#dev-tools` and `#kit` channels | https://solana.com/discord | High-traffic, low-formality, often where DevRel notice things first. |
| **`anza-xyz/kit` Issues** | https://github.com/anza-xyz/kit/issues | Filing a meta-issue ("codemod for v1→kit migration available — interested in upstream link?") creates a public artifact and gets routed to the right people. |

## Draft 1 — GitHub issue on `anza-xyz/kit`

**Title:** Codemod for `@solana/web3.js` v1 → `@solana/kit` migration — interested in linking from the upgrade guide?

**Body:**

> Hi 👋
>
> I built a [`Codemod`](https://codemod.com) workflow that automates the deterministic 80–95% of the v1 → kit migration: https://github.com/abaresks24/solana-web3-to-kit
>
> **Validated on `solana-developers/helpers`** (commit `a7e75d0`):
>
> - 60 / 60 mechanical call-sites rewritten = 100% coverage
> - 0 false positives
> - 14 ms runtime for the deterministic step
> - 9 files / +71 / −124 lines
>
> See the case study: https://github.com/abaresks24/solana-web3-to-kit/blob/main/CASE_STUDY.md
>
> The deterministic pass handles `new PublicKey`, `Keypair.generate`/`fromSecretKey`, `PublicKey.findProgramAddressSync`, `clusterApiUrl`, `SystemProgram.transfer` (all shorthand combos), `SystemProgram.programId`, and idempotent import management. An AI step (Claude Sonnet) covers the structural edges — `Connection` → `createSolanaRpc`, transaction-builder → `pipe`, `BN` → `bigint`, subscriptions, `Buffer` → `Uint8Array`.
>
> Two questions:
>
> 1. Would you accept a PR adding a "Migration tooling" section to the [upgrade guide](https://www.solana-kit.com/docs/upgrade-guide) linking this codemod?
> 2. Would the team be open to hosting it under `anza-xyz` (or `solana-developers`) so it's the canonical migration path?
>
> Happy to expand coverage on any specific patterns the team sees most often in the field.

## Draft 2 — Discord/X DM (shorter)

> Hey @nickfrosty / @steveluscher — I shipped a Codemod recipe that automates the v1 → kit migration. Validated on `solana-developers/helpers`: 60/60 mechanical patterns rewritten, 0 false positives, 14ms.
>
> https://github.com/abaresks24/solana-web3-to-kit
> Case study: https://github.com/abaresks24/solana-web3-to-kit/blob/main/CASE_STUDY.md
>
> Open to either (a) a PR to the kit migration guide adding a "tooling" section, or (b) hosting under `anza-xyz` if that's a fit. What's the right next step from your side?

## Draft 3 — Concrete PR proposal

If you want to lower the friction even further, open a draft PR to the kit docs first, *then* link to it in your outreach message. The repo to PR is `https://github.com/anza-xyz/kit` (path likely `docs/upgrade-guide.md`).

Add a short section like:

```markdown
## Migration tooling

The v1 → kit migration covers many mechanical changes (imports, identifier
renames, instruction field reshapes). The community-maintained
[`solana-web3-to-kit`](https://github.com/abaresks24/solana-web3-to-kit)
codemod automates the deterministic ~95% of these and leaves an AI step
for structural rewrites (`Connection` → RPC, transaction builder → `pipe`,
`BN` → `bigint`, subscriptions).

Run it once on your repo:

`​`​`bash
npx codemod @abaresks24/solana-web3-to-kit -t .
`​`​`
```

## Cadence

- **Day 0**: open the meta-issue on `anza-xyz/kit` (Draft 1).
- **Day 1**: ping @nickfrosty in Solana Foundation Discord `#dev-tools` with a link to the issue.
- **Day 3 if no response**: X DM to @steveluscher (Draft 2).
- **Day 7 if no response**: open the docs PR (Draft 3) — public artifact tends to flush silence.

Once any of them say "yes, link it" or "yes, mirror it", that's the Tier-3 trigger for the hackathon.
