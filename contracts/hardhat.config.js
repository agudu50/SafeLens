require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config()

const { PRIVATE_KEY, BASE_SEPOLIA_RPC_URL, BASE_MAINNET_RPC_URL, BASESCAN_API_KEY } = process.env

const accounts = PRIVATE_KEY ? [PRIVATE_KEY] : []

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
      accounts,
      chainId: 84532,
    },
    baseMainnet: {
      url: BASE_MAINNET_RPC_URL || 'https://mainnet.base.org',
      accounts,
      chainId: 8453,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: BASESCAN_API_KEY || '',
      base: BASESCAN_API_KEY || '',
    },
    customChains: [
      {
        network: 'baseSepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
    ],
  },
}
