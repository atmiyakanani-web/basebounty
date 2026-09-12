import { createClient } from '@supabase/supabase-js'

const BOUNTIES_KEY = 'basebounty_bounties'
const DRAFT_KEY = 'basebounty_draft'
const APPLICATIONS_KEY = 'basebounty_applications'
const USER_KEY = 'basebounty_user_id'

/*
  IMPORTANT:
  Paste your Supabase Project URL and Publishable/Anon Key here.

  These are frontend/public values.
  NEVER put a Supabase service_role/private key here.
*/

const SUPABASE_URL = 'https://wdplylhtiwjrjfabqlme.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_oQ6gvyv4KMy4QhHl5vX4VQ_y0dPSSda'

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
    localStorage.setItem(USER_KEY, userId)
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

    const migrated = parsed.map(
      (bounty) => {
        const isDemo =
          String(bounty.id).startsWith(
            'demo-'
          )

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
      }
    )

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

/*
  Downloads the shared marketplace from Supabase.

  This runs in the background from App.jsx.
  LocalStorage is still used as a fast cache so
  the existing pages do not need to become async.
*/
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
      data,
      error,
    } = await supabase
      .from('bounties')
      .select('id, data, created_at')
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      throw error
    }

    const localBounties =
      readLocalBounties()

    const remoteBounties = Array.isArray(data)
      ? data
          .map((row) => {
            if (
              row &&
              row.data &&
              typeof row.data === 'object'
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

    /*
      Keep demo bounties locally.
      Cloud bounties are shared between all devices.
    */
    const demos = localBounties.filter(
      (bounty) =>
        String(bounty.id).startsWith(
          'demo-'
        )
    )

    /*
      If this device already has locally-created
      bounties from before cloud sync was added,
      upload them once.
    */
    const localUserBounties =
      localBounties.filter(
        (bounty) =>
          !String(bounty.id).startsWith(
            'demo-'
          )
      )

    const remoteIds = new Set(
      remoteBounties.map(
        (bounty) => String(bounty.id)
      )
    )

    const missingRemote =
      localUserBounties.filter(
        (bounty) =>
          !remoteIds.has(
            String(bounty.id)
          )
      )

    for (const bounty of missingRemote) {
      await uploadBounty(bounty)
    }

    const mergedMap =
      new Map()

    for (const bounty of demos) {
      mergedMap.set(
        String(bounty.id),
        bounty
      )
    }

    for (const bounty of remoteBounties) {
      mergedMap.set(
        String(bounty.id),
        bounty
      )
    }

    for (const bounty of missingRemote) {
      mergedMap.set(
        String(bounty.id),
        bounty
      )
    }

    const merged = Array.from(
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

export function createLocalBounty(
  draft
) {
  const existing =
    readLocalBounties()

  const newBounty = {
    ...draft,

    id: `bounty-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    status: 'Open',

    category:
      draft.category ||
      'Development',

    network: 'Base',

    escrow: 'Smart Contract',

    client:
      'Connected wallet',

    ownerId:
      getCurrentUserId(),

    createdAt:
      new Date().toISOString(),
  }

  const updated = [
    newBounty,
    ...existing,
  ]

  saveLocalBounties(updated)

  /*
    Upload immediately.
    The UI does not have to wait for the network.
  */
  uploadBounty(newBounty).catch(
    (error) => {
      console.error(
        'Background bounty upload failed:',
        error
      )
    }
  )

  return newBounty
}

export function deleteBounty(id) {
  const bounties =
    readLocalBounties()

  const bounty =
    bounties.find(
      (item) =>
        String(item.id) ===
        String(id)
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
    bounty.status !== 'Open'
  ) {
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

  saveLocalBounties(updated)

  if (supabase) {
    supabase
      .from('bounties')
      .delete()
      .eq('id', String(id))
      .then(({ error }) => {
        if (error) {
          console.error(
            'Could not delete cloud bounty:',
            error
          )
        }
      })
  }

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
  localStorage.removeItem(
    DRAFT_KEY
  )
}

export function getApplications() {
  try {
    const saved =
      localStorage.getItem(
        APPLICATIONS_KEY
      )

    if (!saved) return []

    const parsed =
      JSON.parse(saved)

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

export function createApplication(
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