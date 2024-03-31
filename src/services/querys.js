
export const getLaunchpads = `query MyQuery($skip: Int, $first: Int, $address: Bytes) {
  pools(skip: $skip, first: $first) {
    uriData
    whitelistUsers
    usingWhitelist
    totalRaised
    tokenSale
    tokenPayment
    status
    startDate
    refundWhenFinish
    presaleRate
    owner
    minBuyPerParticipant
    maxBuyPerParticipant
    listingRate
    launchpadType
    endOfWhitelistTime
    softCap
    hardCap
    adminTokenSaleFee
    endDate
    createdAt
    claimDate
    auditRequest
    kycRequest
    auditStatus
    kycStatus
    auditLink
    kycLink
    adminWalletId
    address
    liquidityPercent
    liquidityLockTime
  }
  userInvestInfos(where: {address: $address, depositedAmount_gt: "0"}) {
    launchpad
  }
}`

export const getDashboardDetailQuery = `query MyQuery($first: Int, $skip: Int) {
  launchpadInfo(id: "1") {
    totalFairLaunchCreated
    totalLaunchpadCreated
    totalParticipants
    totalPresaleCreated
    totalRaisingETH
    lockedETH
  }
  pools(
    first: $first
    skip: $skip
    where: {status: "0"}
    orderBy: totalRaised
    orderDirection: desc
  ) {
    uriData
    whitelistUsers
    usingWhitelist
    totalRaised
    tokenSale
    tokenPayment
    status
    startDate
    refundWhenFinish
    presaleRate
    owner
    minBuyPerParticipant
    maxBuyPerParticipant
    listingRate
    launchpadType
    endOfWhitelistTime
    softCap
    hardCap
    adminTokenSaleFee
    endDate
    createdAt
    claimDate
    auditRequest
    kycRequest
    auditStatus
    kycStatus
    auditLink
    kycLink
    adminWalletId
    address
    liquidityPercent
    liquidityLockTime
  }
}`



export const getLaunchpadByAddress = `query MyQuery($id: ID) {
  pool(id: $id) {
    uriData
    whitelistUsers
    usingWhitelist
    totalRaised
    tokenSale
    tokenPayment
    status
    startDate
    refundWhenFinish
    presaleRate
    owner
    minBuyPerParticipant
    maxBuyPerParticipant
    listingRate
    launchpadType
    endOfWhitelistTime
    softCap
    hardCap
    adminTokenSaleFee
    endDate
    createdAt
    claimDate
    auditRequest
    kycRequest
    auditStatus
    kycStatus
    auditLink
    kycLink
    adminWalletId
    address
    liquidityPercent
    liquidityLockTime
  }
}`