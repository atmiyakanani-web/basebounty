export const BASE_SEPOLIA = {
  chainId: 84532,
  chainIdHex: '0x14a34',
  name: 'Base Sepolia',
  rpcUrl: 'https://sepolia.base.org',
  explorerUrl: 'https://sepolia.basescan.org',
  usdc: '0x036CbD53842c5426634e7929544eC2318f3dCF7e',
  bountyEscrow: import.meta.env.VITE_BOUNTY_ESCROW_ADDRESS || '',
}

export const CONTRACTS = BASE_SEPOLIA
export const USDC_DECIMALS = 6
