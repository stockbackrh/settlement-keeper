#!/usr/bin/env node
// StockBack settlement keeper. An accepted claim becomes one transaction: ETH from the treasury
// goes through USDG into the brand's stock token on Uniswap v3, and the output lands in the
// claimant's wallet. The hash and the amount are written back to the claim.
// Usage: node settle.mjs [--loop] [--dry]
import { ethers } from 'ethers';
import { WETH, USDG, ROUTER, QUOTER, provider, erc20 } from './lib/chain.mjs';
import { bestFee } from './lib/pools.mjs';
import { ethForUsd, minOut, overCap } from './lib/size.mjs';
import { pending, mark } from './lib/store.mjs';
const env = process.env, DRY = process.argv.includes('--dry'), LOOP = process.argv.includes('--loop');
const MAX_ETH = Number(env.MAX_ETH_PER_CLAIM || '0.02');
const p = provider();
const wallet = env.TREASURY_PK ? new ethers.Wallet(env.TREASURY_PK, p) : null;
const quoter = new ethers.Contract(QUOTER, ['function quoteExactInput(bytes path, uint256 amountIn) returns (uint256 amountOut, uint160[] a, uint32[] b, uint256 c)'], p);
const router = new ethers.Contract(ROUTER, ['function exactInput((bytes path,address recipient,uint256 amountIn,uint256 amountOutMinimum)) payable returns (uint256 amountOut)'], wallet || p);
const path = (fee, token) => ethers.solidityPacked(['address', 'uint24', 'address', 'uint24', 'address'], [WETH, 100, USDG, fee, token]);

async function ethPrice() {
  const probe = ethers.parseEther('0.001');
  const q = await quoter.quoteExactInput.staticCall(ethers.solidityPacked(['address', 'uint24', 'address'], [WETH, 100, USDG]), probe);
  return Number(ethers.formatUnits(q[0], 6)) / 0.001;
}

async function settle(c) {
  const token = c.token_address;
  if (!token) return mark(c.id, 'queued', null, null, 'no token address for ' + c.ticker);
  const fee = await bestFee(p, token);
  const eth = ethForUsd(c.reward_usd, await ethPrice());
  if (overCap(eth, MAX_ETH)) return mark(c.id, 'queued', null, null, 'reward above per-claim ETH cap');
