import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const { RPC_URL, CONTRACT_ADDRESS, PRIVATE_KEY } = process.env

if (!CONTRACT_ADDRESS) {
  throw new Error('CONTRACT_ADDRESS is not set in server/.env')
}

// Minimal ABI \u2014 only the functions/events SafeLens needs to call.
export const SAFE_LENS_REGISTRY_ABI = [
  'function registerReport(bytes32 reportHash) external',
  'function verifyReport(bytes32 reportHash) external view returns (bool isRegistered, address reporter, uint256 timestamp)',
  'function isReportRegistered(bytes32 reportHash) external view returns (bool)',
  'function totalReports() external view returns (uint256)',
  'event ReportRegistered(bytes32 indexed reportHash, address indexed reporter, uint256 timestamp)',
]

export const provider = new ethers.JsonRpcProvider(RPC_URL || 'https://sepolia.base.org')

// Read-only contract instance \u2014 always available, even without a configured wallet.
export const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, SAFE_LENS_REGISTRY_ABI, provider)

// Write-capable contract instance \u2014 only available once PRIVATE_KEY is configured.
export function getWritableContract() {
  if (!PRIVATE_KEY) {
    throw new Error(
      'PRIVATE_KEY is not set in server/.env. Add a funded Base Sepolia wallet private key to anchor reports on-chain.'
    )
  }
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
  return new ethers.Contract(CONTRACT_ADDRESS, SAFE_LENS_REGISTRY_ABI, wallet)
}

export function hashReportPayload(payload) {
  const canonical = JSON.stringify(payload)
  return ethers.keccak256(ethers.toUtf8Bytes(canonical))
}

export const CONTRACT_ADDRESS_VALUE = CONTRACT_ADDRESS
export const EXPLORER_BASE_URL = 'https://sepolia.basescan.org'
