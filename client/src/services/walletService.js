import { MOCK_WALLET_STATUS } from '../data/mockPlans'

export const walletService = {
  getWalletStatus: async () => {
    await new Promise((res) => setTimeout(res, 200))
    return MOCK_WALLET_STATUS
  },

  connectWallet: async () => {
    await new Promise((res) => setTimeout(res, 600))
    MOCK_WALLET_STATUS.isConnected = true
    MOCK_WALLET_STATUS.address = '0x7a91c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f78d21'
    MOCK_WALLET_STATUS.balanceEth = '0.045 ETH'
    return { success: true, wallet: MOCK_WALLET_STATUS }
  },

  disconnectWallet: async () => {
    await new Promise((res) => setTimeout(res, 300))
    MOCK_WALLET_STATUS.isConnected = false
    MOCK_WALLET_STATUS.address = null
    MOCK_WALLET_STATUS.balanceEth = '0.00'
    return { success: true, wallet: MOCK_WALLET_STATUS }
  }
}
