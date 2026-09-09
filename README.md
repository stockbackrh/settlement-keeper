# settlement-keeper

The keeper behind [StockBack](https://usestockback.xyz). It takes an accepted claim and turns it into one transaction on Robinhood Chain: ETH from the treasury goes through USDG into the brand's tokenized stock on Uniswap v3, and the swap output is delivered straight to the claimant's wallet. No custody step in between, nothing to withdraw later.

```
accepted claim ─> quote ETH→USDG→TOKEN ─> exactInput(recipient = claimant) ─> settled + tx hash
```

## Running it

```bash
npm install
cp .env.example .env    # fill it in
npm run dry             # prints what would be bought, sends nothing
node settle.mjs --loop  # polls every minute
```

`TREASURY_PK` is a wallet funded with ETH on Robinhood Chain and nothing else. The keeper never holds stock tokens; they go from the pool to the claimant.

## What it does per claim

1. Picks the USDG pool for the token by depth across the fee tiers (`lib/pools.mjs`).
2. Prices ETH through the same router path and sizes the input so its USDG value equals the reward, plus half a percent (`lib/size.mjs`).
3. Refuses anything above `MAX_ETH_PER_CLAIM` and marks it queued with the reason.
4. Sends `exactInput` with the claimant as recipient and two percent slippage.
5. Reads the token's Transfer logs to the claimant and writes the exact amount and the hash back to the claim.

A failure never loses a claim. It goes back to `queued` with the error text, and the next run tries again.

## Tests

```bash
npm test
```

The sizing math is pure and tested. The chain calls are not mocked; use `--dry` against the real chain.
