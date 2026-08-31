// Pick the USDG pool for a stock token by depth. Fee tiers are tried in order and the one with
// the most USDG in it wins. Cached per process, a pool does not move between claims.
import { ethers } from 'ethers';
import { FACTORY, USDG, erc20 } from './chain.mjs';
const cache = new Map();
export async function bestFee(p, token, minUsdg = 1000n * 10n ** 6n) {
  if (cache.has(token)) return cache.get(token);
  const factory = new ethers.Contract(FACTORY, ['function getPool(address,address,uint24) view returns(address)'], p);
  let best = null;
  for (const fee of [100, 500, 3000, 10000]) {
    const pool = await factory.getPool(token, USDG, fee);
    if (pool === ethers.ZeroAddress) continue;
    const bal = await erc20(p, USDG).balanceOf(pool);
    if (!best || bal > best.bal) best = { fee, bal, pool };
  }
  if (!best || best.bal < minUsdg) throw new Error('no usable USDG pool for ' + token);
  cache.set(token, best.fee);
  return best.fee;
}
