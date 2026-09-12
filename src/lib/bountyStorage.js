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

  IMPORTANT:
  deleted_bounties is used as a permanent record
  of deleted bounty IDs so another device does not
  upload the deleted bounty again.
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
    /*
      First get the shared deleted-bounty list.
      This must happen before we decide which local
      bounties should be uploaded again.
    */
    const {
      data: deletedRows,
      error: deletedError,
    } = await supabase
      .from('deleted_bounties')
      .select('id')

    if (deletedError) {
      throw deletedError
    }

    const deletedIds = new Set(
      Array.isArray(deletedRows)
        ? deletedRows.map((row) =>
            String(row.id)
          )
        : []
    )

    /*
      Get all active/shared bounties.
    */
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

    const remoteBounties =
      Array.isArray(data)
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

      Demo bounties are not stored in Supabase.
      They are always available as sample content.
    */
    const demos =
      localBounties.filter(
        (bounty) => {
          const bountyId =
            String(bounty.id)

          return (
            bountyId.startsWith(
              'demo-'
            ) &&
            !deletedIds.has(
              bountyId
            )
          )
        }
      )

    /*
      If this device already has locally-created
      bounties from before cloud sync was added,
      upload them once.

      IMPORTANT:
      A bounty recorded in deleted_bounties is NEVER
      uploaded again.
    */
    const localUserBounties =
      localBounties.filter(
        (bounty) =>
          !String(
            bounty.id
          ).startsWith('demo-')
      )

    const remoteIds = new Set(
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
            !remoteIds.has(
              bountyId
            ) &&
            !deletedIds.has(
              bountyId
            )
          )
        }
      )

    /*
      Upload only bounties that are not marked
      as deleted.
    */
    for (const bounty of missingRemote) {
      await uploadBounty(bounty)
    }

    const mergedMap =
      new Map()

    /*
      Add demo bounties that are not deleted.
    */
    for (const bounty of demos) {
      const bountyId =
        String(bounty.id)

      if (
        !deletedIds.has(
          bountyId
        )
      ) {
        mergedMap.set(
          bountyId,
          bounty
        )
      }
    }

    /*
      Add cloud bounties that are not deleted.
    */
    for (const bounty of remoteBounties) {
      const bountyId =
        String(bounty.id)

      if (
        !deletedIds.has(
          bountyId
        )
      ) {
        mergedMap.set(
          bountyId,
          bounty
        )
      }
    }

    /*
      Add locally-created bounties that were
      successfully identified as missing remotely.
    */
    for (const bounty of missingRemote) {
      const bountyId =
        String(bounty.id)

      if (
        !deletedIds.has(
          bountyId
        )
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

  /*
    Safety check:
    Never upload a bounty that has already been
    recorded as deleted.
  */
  const {
    data: deletedRows,
    error: deletedCheckError,
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

/*
  Deletes a bounty locally AND records its ID in
  Supabase deleted_bounties.

  The deleted_bounties record is created FIRST.
  This is important because another device could
  otherwise upload the bounty again during sync.
*/
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
    bounty.status !== 'Open'
  ) {
    return {
      success: false,
      reason:
        'This bounty can no longer be deleted because work has already started.',
    }
  }

  /*
    Record the deletion in Supabase FIRST.

    Because deleted_bounties.id is the primary key,
    upsert safely handles the same deletion more
    than once.
  */
  if (supabase) {
    const {
      error: deletedError,
    } = await supabase
      .from('deleted_bounties')
      .upsert(
        {
          id: bountyId,
        },
        {
          onConflict: 'id',
        }
      )

    if (deletedError) {
      console.error(
        'Could not record deleted bounty:',
        deletedError
      )

      return {
        success: false,
        reason:
          'Could not sync bounty deletion.',
      }
    }

    /*
      Now remove the bounty from the shared
      bounties table.
    */
    const {
      error: bountyDeleteError,
    } = await supabase
      .from('bounties')
      .delete()
      .eq(
        'id',
        bountyId
      )

    if (bountyDeleteError) {
      console.error(
        'Could not delete cloud bounty:',
        bountyDeleteError
      )

      return {
        success: false,
        reason:
          'Could not delete bounty from the server.',
      }
    }
  }

  /*
    Remove the bounty from this device.
  */
  const updated =
    bounties.filter(
      (item) =>
        String(item.id) !==
        bountyId
    )

  saveLocalBounties(updated)

  /*
    Tell the currently-open UI that the bounty
    list has changed.
  */
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