# Publishing to the Codemod registry

Two steps required, both interactive (no API key on this machine yet):

## 1. Authenticate

```bash
cd /Users/arthur/codemod-hackathon/solana-web3-to-kit
npx codemod login
```

Opens a browser → sign in → token stored in `~/.codemod/`.

If you'd rather use a CI-style API key (skips the browser):

```bash
npx codemod login --api-key <your-codemod-api-key>
```

Get the key from https://app.codemod.com → account settings → API keys.

## 2. Publish

```bash
npx codemod publish .
```

This reads `codemod.yaml` and uploads. Consumers will then run:

```bash
npx codemod @abaresks24/solana-web3-to-kit -t /target/repo
```

(The scope `@abaresks24` will resolve to whichever org/user scope your Codemod account is registered under — confirm during `codemod login --scope <scope>`.)

## 3. Verify

```bash
npx codemod search solana
# or browse https://app.codemod.com/registry
```

## Iterating

Bump the `version` in `codemod.yaml`, re-run `codemod publish .`. The registry is npm-style — versions are immutable once published.
