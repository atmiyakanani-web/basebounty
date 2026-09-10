const BOUNTIES_KEY = 'basebounty_bounties'
const DRAFT_KEY = 'basebounty_draft'
const APPLICATIONS_KEY = 'basebounty_applications'
const USER_KEY = 'basebounty_user_id'

const demoBounties = [
  {
    id: 'demo-1',
    title: 'Build a Web3 Landing Page',
    description:
      'Create a modern responsive landing page for a blockchain project.',
    reward: '250',
    status: 'Open',
    category: 'Development',
    recipientType: 'open',
    network: 'Base',
    escrow: 'Smart Contract',
    client: '0x84...29F1',
    ownerId: null,
  },
  {
    id: 'demo-2',
    title: 'Design a Product Dashboard',
    description:
      'Design a clean and intuitive dashboard interface for a Web3 application.',
    reward: '150',
    status: 'Open',
    category: 'Design',
    recipientType: 'open',
    network: 'Base',
    escrow: 'Smart Contract',
    client: '0x84...29F1',
    ownerId: null,
  },
  {
    id: 'demo-3',
    title: 'Write Technical Documentation',
    description:
      'Create clear documentation explaining a Web3 product and its workflow.',
    reward: '100',
    status: 'Open',
    category: 'Writing',
    recipientType: 'open',
    network: 'Base',
    escrow: 'Smart Contract',
    client: '0x84...29F1',
    ownerId: null,
  },
]

function createUserId() {
  return `user-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`
}

export function getCurrentUserId() {
  let userId = localStorage.getItem(USER_KEY)

  if (!userId) {
    userId = createUserId()
    localStorage.setItem(USER_KEY, userId)
  }

  return userId
}

export function getBounties() {
  try {
    const saved = localStorage.getItem(BOUNTIES_KEY)

    if (!saved) {
      localStorage.setItem(
        BOUNTIES_KEY,
        JSON.stringify(demoBounties)
      )

      return demoBounties
    }

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      return demoBounties
    }

    const currentUserId = getCurrentUserId()

    /*
      Legacy migration:
      Old non-demo bounties may not have ownerId.
      Automatically attach them to the current local user.
      Demo bounties are never claimed.
    */

    let changed = false

    const migrated = parsed.map((bounty) => {
      const isDemo = String(bounty.id).startsWith('demo-')

      if (
        !isDemo &&
        !bounty.ownerId
      ) {
        changed = true

        return {
          ...bounty,
          ownerId: currentUserId,
        }
      }

      return bounty
    })

    if (changed) {
      localStorage.setItem(
        BOUNTIES_KEY,
        JSON.stringify(migrated)
      )
    }

    return migrated
  } catch (error) {
    console.error(
      'Could not load bounties:',
      error
    )

    return demoBounties
  }
}

export function createLocalBounty(draft) {
  const existing = getBounties()

  const newBounty = {
    ...draft,

    id: `bounty-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    status: 'Open',

    category:
      draft.category || 'Development',

    network: 'Base',

    escrow: 'Smart Contract',

    client: 'Connected wallet',

    ownerId: getCurrentUserId(),

    createdAt:
      new Date().toISOString(),
  }

  localStorage.setItem(
    BOUNTIES_KEY,
    JSON.stringify([
      newBounty,
      ...existing,
    ])
  )

  return newBounty
}

export function deleteBounty(id) {
  const bounties = getBounties()

  const bounty = bounties.find(
    (item) =>
      String(item.id) === String(id)
  )

  if (!bounty) {
    return {
      success: false,
      reason: 'Bounty not found.',
    }
  }

  if (
    bounty.ownerId !==
    getCurrentUserId()
  ) {
    return {
      success: false,
      reason:
        'You can only delete your own bounties.',
    }
  }

  if (bounty.status !== 'Open') {
    return {
      success: false,
      reason:
        'This bounty can no longer be deleted because work has already started.',
    }
  }

  const updated =
    bounties.filter(
      (item) =>
        String(item.id) !==
        String(id)
    )

  localStorage.setItem(
    BOUNTIES_KEY,
    JSON.stringify(updated)
  )

  return {
    success: true,
  }
}

export function getDraft() {
  try {
    const saved =
      localStorage.getItem(DRAFT_KEY)

    if (!saved) return null

    return JSON.parse(saved)
  } catch (error) {
    console.error(
      'Could not load bounty draft:',
      error
    )

    return null
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

export function getApplications() {
  try {
    const saved =
      localStorage.getItem(
        APPLICATIONS_KEY
      )

    if (!saved) return []

    const parsed = JSON.parse(saved)

    return Array.isArray(parsed)
      ? parsed
      : []
  } catch (error) {
    console.error(
      'Could not load applications:',
      error
    )

    return []
  }
}

export function createApplication(application) {
  const applications =
    getApplications()

  const newApplication = {
    ...application,

    id: `application-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    applicantId:
      getCurrentUserId(),

    status: 'Pending',

    createdAt:
      new Date().toISOString(),
  }

  localStorage.setItem(
    APPLICATIONS_KEY,
    JSON.stringify([
      ...applications,
      newApplication,
    ])
  )

  return newApplication
}