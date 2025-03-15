export type MembershipTier = {
  id: string
  name: string
  description: string
  benefits: string[]
  minimumSpend: number
  discountPercentage: number
  freeShipping: boolean
  birthdayReward: boolean
  earlyAccess: boolean
  exclusiveProducts: boolean
  prioritySupport: boolean
}

export type UserMembership = {
  userId: string
  tierId: string
  tier: MembershipTier
  currentSpend: number
  nextTier?: MembershipTier
  progressToNextTier: number
  joinedAt: string
  updatedAt: string
}

