import { BrowserProvider, Contract, parseUnits } from 'ethers'
import { CONTRACTS, USDC_DECIMALS } from '../config/contractConfig'
import { BountyEscrowABI } from '../contracts/BountyEscrowABI'

const ERC20_ABI = [
  'function approve(address spender,uint256 amount) external returns (bool)',
  'function allowance(address owner,address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
]

export async function getWalletProvider(provider = window.ethereum) {
  if (!provider) throw new Error('Wallet provider not found.')
  return new BrowserProvider(provider)
}

export async function getSigner(provider = window.ethereum) {
  const browserProvider = await getWalletProvider(provider)
  return browserProvider.getSigner()
}

export function getUsdcAmount(value) {
  if (!value || Number(value) <= 0) {
    throw new Error('Enter a valid reward amount.')
  }
  return parseUnits(String(value), USDC_DECIMALS)
}

export async function switchToBaseSepolia(provider = window.ethereum) {
  if (!provider) throw new Error('Wallet provider not found.')

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CONTRACTS.chainIdHex }],
    })
  } catch (error) {
    if (error?.code !== 4902) throw error

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: CONTRACTS.chainIdHex,
        chainName: CONTRACTS.name,
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        rpcUrls: [CONTRACTS.rpcUrl],
        blockExplorerUrls: [CONTRACTS.explorerUrl],
      }],
    })
  }
}

export async function getUsdcContract(provider = window.ethereum) {
  if (!CONTRACTS.usdc) throw new Error('USDC contract is not configured.')
  const signer = await getSigner(provider)
  return new Contract(CONTRACTS.usdc, ERC20_ABI, signer)
}

export async function getBountyEscrow(provider = window.ethereum) {
  if (!CONTRACTS.bountyEscrow) {
    throw new Error(
      'Bounty escrow contract is not deployed yet. Set VITE_BOUNTY_ESCROW_ADDRESS in .env.'
    )
  }
  const signer = await getSigner(provider)
  return new Contract(CONTRACTS.bountyEscrow, BountyEscrowABI, signer)
}

export async function fundAndCreateBounty({
  reward,
  recipient,
  provider = window.ethereum,
}) {
  if (!provider) throw new Error('Connect an EVM wallet first.')
  if (!CONTRACTS.bountyEscrow) {
    throw new Error(
      'Bounty escrow is not deployed yet. Deploy BountyEscrow and set VITE_BOUNTY_ESCROW_ADDRESS.'
    )
  }

  await switchToBaseSepolia(provider)

  const usdc = await getUsdcContract(provider)
  const escrow = await getBountyEscrow(provider)
  const amount = getUsdcAmount(reward)

  const approveTx = await usdc.approve(CONTRACTS.bountyEscrow, amount)
  await approveTx.wait()

  const createTx = await escrow.createBounty(recipient, amount)
  const receipt = await createTx.wait()

  let bountyId = null

  for (const log of receipt.logs || []) {
    try {
      const parsed = escrow.interface.parseLog(log)
      if (parsed?.name === 'BountyCreated') {
        bountyId = parsed.args.bountyId.toString()
        break
      }
    } catch {
      // Ignore logs emitted by other contracts.
    }
  }

  return {
    bountyId,
    approveTxHash: approveTx.hash,
    createTxHash: createTx.hash,
  }
}

export function explorerTxUrl(hash) {
  return `${CONTRACTS.explorerUrl}/tx/${hash}`
}
