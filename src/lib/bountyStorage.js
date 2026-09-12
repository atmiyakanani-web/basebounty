import { createClient } from '@supabase/supabase-js'

const BOUNTIES_KEY = 'basebounty_bounties'
const DRAFT_KEY = 'basebounty_draft'
const APPLICATIONS_KEY = 'basebounty_applications'
const USER_KEY = 'basebounty_user_id'

const SUPABASE_URL =
  'https://wdplylhtiwjrjfabqlme.supabase.co'

const SUPABASE_ANON_KEY =
  'sb_publishable_oQ6gvyv4KMy4QhHl5vX4VQ_y0dPSSda'

const supabase =
  SUPABASE_URL.startsWith('http') &&
  !SUPABASE_URL.includes('PASTE_') &&
  !SUPABASE_ANON_KEY.includes('PASTE_')
    ? createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      )
    : null

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

    localStorage.setItem(
      USER_KEY,
      userId
    )
  }

  return userId
}

function saveLocalBounties(bounties) {
  localStorage.setItem(
    BOUNTIES_KEY,
    JSON.stringify(bounties)
  )
}

function readLocalBounties() {
  try {
    const saved =
      localStorage.getItem(BOUNTIES_KEY)

    if (!saved) {
      saveLocalBounties(demoBounties)
      return demoBounties
    }

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      saveLocalBounties(demoBounties)
      return demoBounties
    }

    const currentUserId =
      getCurrentUserId()

    let changed = false

    const migrated = parsed.map((bounty) => {
      const isDemo =
        String(bounty.id).startsWith('demo-')

      if (!isDemo && !bounty.ownerId) {
        changed = true

        return {
          ...bounty,
          ownerId: currentUserId,
        }
      }

      return bounty
    })

    if (changed) {
      saveLocalBounties(migrated)
    }

    return migrated
  } catch (error) {
    console.error(
      'Could not load local bounties:',
      error
    )

    return demoBounties
  }
}

export function getBounties() {
  return readLocalBounties()
}

export function getApplications() {
  try {
    const saved =
      localStorage.getItem(
        APPLICATIONS_KEY
      )

    let localApplications = []

    if (saved) {
      const parsed = JSON.parse(saved)

      if (Array.isArray(parsed)) {
        localApplications = parsed
      }
    }

    const bountyApplications =
      readLocalBounties().flatMap(
        (bounty) =>
          Array.isArray(
            bounty.applications
          )
            ? bounty.applications
            : []
      )

    const map = new Map()

    for (const application of localApplications) {
      if (application?.id) {
        map.set(
          String(application.id),
          application
        )
      }
    }

    for (const application of bountyApplications) {
      if (application?.id) {
        map.set(
          String(application.id),
          application
        )
      }
    }

    return Array.from(map.values())
  } catch (error) {
    console.error(
      'Could not load applications:',
      error
    )

    return []
  }
}

export async function syncBounties() {
  if (!supabase) {
    return {
      success: false,
      reason:
        'Supabase is not configured yet.',
    }
  }

  try {
    const {
      data: deletedRows,
      error: deletedError,
    } = await supabase
      .from('deleted_bounties')
      .select('id')

    if (deletedError) {
      throw deletedError
    }

    const deletedIds =
      new Set(
        Array.isArray(deletedRows)
          ? deletedRows.map(
              (row) =>
                String(row.id)
            )
          : []
      )

    const {
      data,
      error,
    } = await supabase
      .from('bounties')
      .select(
        'id, data, created_at'
      )
      .order(
        'created_at',
        {
          ascending: false,
        }
      )

    if (error) {
      throw error
    }

    const localBounties =
      readLocalBounties()

    const remoteBounties =
      Array.isArray(data)
        ? data
            .map((row) => {
              if (
                row &&
                row.data &&
                typeof row.data ===
                  'object'
              ) {
                return {
                  ...row.data,
                  id:
                    row.data.id ||
                    row.id,
                }
              }

              return null
            })
            .filter(Boolean)
        : []

    const demos =
      localBounties.filter(
        (bounty) => {
          const bountyId =
            String(bounty.id)

          return (
            bountyId.startsWith('demo-') &&
            !deletedIds.has(bountyId)
          )
        }
      )

    const localUserBounties =
      localBounties.filter(
        (bounty) =>
          !String(
            bounty.id
          ).startsWith('demo-')
      )

    const remoteIds =
      new Set(
        remoteBounties.map(
          (bounty) =>
            String(bounty.id)
        )
      )

    const missingRemote =
      localUserBounties.filter(
        (bounty) => {
          const bountyId =
            String(bounty.id)

          return (
            !remoteIds.has(bountyId) &&
            !deletedIds.has(bountyId)
          )
        }
      )

    for (
      const bounty of missingRemote
    ) {
      await uploadBounty(bounty)
    }

    const mergedMap = new Map()

    for (const bounty of demos) {
      const bountyId =
        String(bounty.id)

      mergedMap.set(
        bountyId,
        bounty
      )
    }

    for (
      const bounty of remoteBounties
    ) {
      const bountyId =
        String(bounty.id)

      if (
        !deletedIds.has(bountyId)
      ) {
        mergedMap.set(
          bountyId,
          bounty
        )
      }
    }

    for (
      const bounty of missingRemote
    ) {
      const bountyId =
        String(bounty.id)

      if (
        !deletedIds.has(bountyId)
      ) {
        mergedMap.set(
          bountyId,
          bounty
        )
      }
    }

    const merged =
      Array.from(
        mergedMap.values()
      ).sort((a, b) => {
        const aDate =
          new Date(
            a.createdAt || 0
          ).getTime()

        const bDate =
          new Date(
            b.createdAt || 0
          ).getTime()

        return bDate - aDate
      })

    saveLocalBounties(merged)

    window.dispatchEvent(
      new CustomEvent(
        'basebounty:bounties-synced'
      )
    )

    return {
      success: true,
      bounties: merged,
    }
  } catch (error) {
    console.error(
      'Could not sync bounties:',
      error
    )

    return {
      success: false,
      reason:
        error?.message ||
        'Could not sync bounties.',
    }
  }
}

async function uploadBounty(bounty) {
  if (!supabase) {
    return false
  }

  const {
    data: deletedRows,
    error:
      deletedCheckError,
  } = await supabase
    .from('deleted_bounties')
    .select('id')
    .eq(
      'id',
      String(bounty.id)
    )
    .limit(1)

  if (deletedCheckError) {
    console.error(
      'Could not check deleted bounty:',
      deletedCheckError
    )

    return false
  }

  if (
    Array.isArray(deletedRows) &&
    deletedRows.length > 0
  ) {
    return false
  }

  const {
    error,
  } = await supabase
    .from('bounties')
    .upsert(
      {
        id: String(bounty.id),
        data: bounty,
      },
      {
        onConflict: 'id',
      }
    )

  if (error) {
    console.error(
      'Could not upload bounty:',
      error
    )

    return false
  }

  return true
}

export async function updateBounty(
  bountyId,
  updates
) {
  const id = String(bountyId)

  const localBounties =
    readLocalBounties()

  const existing =
    localBounties.find(
      (item) =>
        String(item.id) === id
    )

  if (!existing) {
    return {
      success: false,
      reason:
        'Bounty not found.',
    }
  }

  const updatedBounty = {
    ...existing,
    ...updates,
  }

  const updatedLocal =
    localBounties.map(
      (item) =>
        String(item.id) === id
          ? updatedBounty
          : item
    )

  saveLocalBounties(
    updatedLocal
  )

  if (supabase) {
    const {
      data: remoteRow,
      error: fetchError,
    } = await supabase
      .from('bounties')
      .select('id, data')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) {
      console.error(
        'Could not fetch bounty:',
        fetchError
      )

      return {
        success: false,
        reason:
          fetchError.message,
      }
    }

    const remoteBounty =
      remoteRow?.data &&
      typeof remoteRow.data ===
        'object'
        ? remoteRow.data
        : existing

    const finalBounty = {
      ...remoteBounty,
      ...updates,
      id:
        remoteBounty.id || id,
    }

    const {
      error: updateError,
    } = await supabase
      .from('bounties')
      .upsert(
        {
          id,
          data: finalBounty,
        },
        {
          onConflict: 'id',
        }
      )

    if (updateError) {
      console.error(
        'Could not update bounty:',
        updateError
      )

      return {
        success: false,
        reason:
          updateError.message,
      }
    }

    const refreshed =
      readLocalBounties().map(
        (item) =>
          String(item.id) === id
            ? finalBounty
            : item
      )

    saveLocalBounties(
      refreshed
    )
  }

  window.dispatchEvent(
    new CustomEvent(
      'basebounty:bounties-synced'
    )
  )

  return {
    success: true,
    bounty:
      getBounties().find(
        (item) =>
          String(item.id) === id
      ),
  }
}

export function createLocalBounty(draft) {
  const existing =
    readLocalBounties()

  const newBounty = {
    ...draft,

    recipientType:
      draft.recipientType || 'open',

    id: `bounty-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    status: 'Open',

    category:
      draft.category ||
      'Development',

    network: 'Base',

    escrow:
      'Smart Contract',

    client:
      'Connected wallet',

    ownerId:
      getCurrentUserId(),

    createdAt:
      new Date().toISOString(),

    applications: [],
  }

  saveLocalBounties([
    newBounty,
    ...existing,
  ])

  uploadBounty(newBounty)
    .then((uploaded) => {
      if (!uploaded) {
        console.error(
          'Bounty was saved locally but could not be uploaded.'
        )

        return
      }

      window.dispatchEvent(
        new CustomEvent(
          'basebounty:bounties-synced'
        )
      )
    })
    .catch((error) => {
      console.error(
        'Background bounty upload failed:',
        error
      )
    })

  return newBounty
}

export async function deleteBounty(id) {
  const bountyId =
    String(id)

  const bounties =
    readLocalBounties()

  const bounty =
    bounties.find(
      (item) =>
        String(item.id) ===
        bountyId
    )

  if (!bounty) {
    return {
      success: false,
      reason:
        'Bounty not found.',
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

  if (
    bounty.status !==
    'Open'
  ) {
    return {
      success: false,
      reason:
        'This bounty can no longer be deleted because work has already started.',
    }
  }

  if (supabase) {
    const {
      error:
        deletedError,
    } = await supabase
      .from('deleted_bounties')
      .upsert(
        {
          id: bountyId,
        },
        {
          onConflict:
            'id',
        }
      )

    if (deletedError) {
      return {
        success: false,
        reason:
          'Could not sync bounty deletion.',
      }
    }

    const {
      error:
        bountyDeleteError,
    } = await supabase
      .from('bounties')
      .delete()
      .eq(
        'id',
        bountyId
      )

    if (bountyDeleteError) {
      return {
        success: false,
        reason:
          'Could not delete bounty from server.',
      }
    }
  }

  saveLocalBounties(
    bounties.filter(
      (item) =>
        String(item.id) !==
        bountyId
    )
  )

  window.dispatchEvent(
    new CustomEvent(
      'basebounty:bounties-synced'
    )
  )

  return {
    success: true,
  }
}

export function getDraft() {
  try {
    const saved =
      localStorage.getItem(
        DRAFT_KEY
      )

    if (!saved) {
      return null
    }

    return JSON.parse(saved)
  } catch (error) {
    console.error(
      'Could not load draft:',
      error
    )

    return null
  }
}

export function clearDraft() {
  localStorage.removeItem(
    DRAFT_KEY
  )
}

export async function createApplication(
  application
) {
  const applications =
    getApplications()

  const newApplication = {
    ...application,

    id: `application-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    applicantId:
      getCurrentUserId(),

    status:
      'Pending',

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

  const localBounty =
    readLocalBounties().find(
      (bounty) =>
        String(bounty.id) ===
        String(
          application.bountyId
        )
    )

  if (!localBounty) {
    return newApplication
  }

  const currentApplications =
    Array.isArray(
      localBounty.applications
    )
      ? localBounty.applications
      : []

  const updatedBounty = {
    ...localBounty,
    applications: [
      ...currentApplications,
      newApplication,
    ],
  }

  saveLocalBounties(
    readLocalBounties().map(
      (bounty) =>
        String(bounty.id) ===
        String(
          application.bountyId
        )
          ? updatedBounty
          : bounty
    )
  )

  if (supabase) {
    const {
      data: remoteRow,
      error: fetchError,
    } = await supabase
      .from('bounties')
      .select('id, data')
      .eq(
        'id',
        String(
          application.bountyId
        )
      )
      .maybeSingle()

    if (fetchError) {
      throw fetchError
    }

    if (remoteRow) {
      const remoteBounty =
        remoteRow.data &&
        typeof remoteRow.data ===
          'object'
          ? remoteRow.data
          : {}

      const remoteApplications =
        Array.isArray(
          remoteBounty.applications
        )
          ? remoteBounty.applications
          : []

      const finalApplications =
        remoteApplications.some(
          (item) =>
            String(item.id) ===
            String(newApplication.id)
        )
          ? remoteApplications
          : [
              ...remoteApplications,
              newApplication,
            ]

      const updatedRemoteBounty = {
        ...remoteBounty,
        id:
          remoteBounty.id ||
          remoteRow.id,
        applications:
          finalApplications,
      }

      const {
        error: updateError,
      } = await supabase
        .from('bounties')
        .upsert(
          {
            id:
              String(remoteRow.id),
            data:
              updatedRemoteBounty,
          },
          {
            onConflict:
              'id',
          }
        )

      if (updateError) {
        throw updateError
      }

      saveLocalBounties(
        readLocalBounties().map(
          (bounty) =>
            String(bounty.id) ===
            String(
              application.bountyId
            )
              ? updatedRemoteBounty
              : bounty
        )
      )
    }
  }

  window.dispatchEvent(
    new CustomEvent(
      'basebounty:applications-synced'
    )
  )

  window.dispatchEvent(
    new CustomEvent(
      'basebounty:bounties-synced'
    )
  )

  return newApplication
}