import { MOCK_PROTECTION_PLANS, MOCK_USER_SUBSCRIPTION } from '../data/mockPlans'

export const subscriptionService = {
  getPlans: async () => {
    await new Promise((res) => setTimeout(res, 200))
    return MOCK_PROTECTION_PLANS
  },

  getUserSubscription: async () => {
    await new Promise((res) => setTimeout(res, 250))
    return MOCK_USER_SUBSCRIPTION
  },

  upgradePlan: async (planId) => {
    await new Promise((res) => setTimeout(res, 500))
    const selectedPlan = MOCK_PROTECTION_PLANS.find((p) => p.id === planId)
    if (selectedPlan) {
      MOCK_USER_SUBSCRIPTION.planId = selectedPlan.id
      MOCK_USER_SUBSCRIPTION.planName = `${selectedPlan.name} Protection`
      MOCK_USER_SUBSCRIPTION.scanLimit = selectedPlan.scanLimit
      MOCK_USER_SUBSCRIPTION.priceGhs = selectedPlan.priceGhs
    }
    return { success: true, subscription: MOCK_USER_SUBSCRIPTION }
  }
}
