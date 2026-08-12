// Robinhood Chain addresses and the provider. The RPC sits behind Cloudflare, so the request
// carries a browser user agent and an origin, otherwise the connection is reset.
import { ethers } from 'ethers';
export const CHAIN_ID = 4663;
export const WETH = '0x0Bd7D308f8E1639FAb988df18A8011f41EAcAD73';
export const USDG = '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168';
export const FACTORY = '0x1f7d7550B1b028f7571E69A784071F0205FD2EfA';
export const ROUTER = '0xcaf681a66d020601342297493863e78c959e5cb2';
export const QUOTER = '0x33e885ed0ec9bf04ecfb19341582aadcb4c8a9e7';
export function provider(rpc = process.env.RPC_URL || 'https://rpc.mainnet.chain.robinhood.com') {
  const fr = new ethers.FetchRequest(rpc);
  fr.setHeader('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0 Safari/537.36');
  fr.setHeader('Origin', 'https://robinhood.com');
  return new ethers.JsonRpcProvider(fr, CHAIN_ID, { staticNetwork: true });
}
export const erc20 = (p, a) => new ethers.Contract(a, ['function balanceOf(address) view returns(uint256)', 'function decimals() view returns(uint8)'], p);
