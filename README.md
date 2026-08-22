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
