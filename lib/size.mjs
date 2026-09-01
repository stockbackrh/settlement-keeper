// Sizing: how much ETH buys a reward worth `usd`, given the ETH price in USDG, plus a small
// buffer so the claimant is never short after the route's fees. Pure, so it is tested.
export function ethForUsd(usd, ethUsd, buffer = 0.005) {
  if (!(ethUsd > 0)) throw new Error('bad eth price');
  return Number(usd) / ethUsd * (1 + buffer);
}
export function minOut(quoted, slippage = 0.02) {
