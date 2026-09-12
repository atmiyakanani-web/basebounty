import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  getBounties,
  getApplications,
  getCurrentUserId,
  deleteBounty,
} from '../lib/bountyStorage'
import './MyBounties.css'

function MyBounties() {
  const currentUserId = getCurrentUserId()

  const [refresh, setRefresh] = useState(0)

  const bounties = useMemo(() => {
    return getBounties().filter(
      (bounty) =>
        !String(bounty.id).startsWith('demo-') &&
        bounty.ownerId === currentUserId
    )
  }, [currentUserId, refresh])

  const applications = getApplications()

  const getApplicationCount = (bountyId) => {
    return applications.filter(
      (application) =>
        String(application.bountyId) ===
        String(bountyId)
    ).length
  }

  const handleDelete = async (id) => {
    const bounty = bounties.find(
      (item) =>
        String(item.id) === String(id)
    )

    if (!bounty) return

    if (bounty.status !== 'Open') {
      alert(
        'This bounty cannot be deleted because work has already started.'
      )
      return
    }

    const confirmed = window.confirm(
      `Delete "${bounty.title}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    const result = await deleteBounty(id)

    if (!result.success) {
      alert(result.reason)
      return
    }

    setRefresh((value) => value + 1)
  }

  const openCount = bounties.filter(
    (bounty) => bounty.status === 'Open'
  ).length

  const activeCount = bounties.filter(
    (bounty) =>
      bounty.status === 'Accepted' ||
      bounty.status === 'Submitted'
  ).length

  const completedCount = bounties.filter(
    (bounty) => bounty.status === 'Completed'
  ).length

  return (
    <main className="my-bounties-page">

      <section className="my-bounties-header">
        <div>
          <p className="eyebrow">
            CLIENT DASHBOARD
          </p>

          <h1>
            My bounties.
          </h1>

          <p>
            Create opportunities, review workers,
            manage active work, and approve completed
            submissions.
          </p>
        </div>

        <Link
          to="/create"
          className="button button-dark"
        >
          Create a Bounty →
        </Link>
      </section>

      <section className="my-bounties-stats">

        <div className="my-bounty-stat">
          <span>TOTAL BOUNTIES</span>
          <strong>{bounties.length}</strong>
          <p>Opportunities you created</p>
        </div>

        <div className="my-bounty-stat">
          <span>OPEN</span>
          <strong>{openCount}</strong>
          <p>Accepting applications</p>
        </div>

        <div className="my-bounty-stat">
          <span>ACTIVE</span>
          <strong>{activeCount}</strong>
          <p>Work in progress</p>
        </div>

        <div className="my-bounty-stat">
          <span>COMPLETED</span>
          <strong>{completedCount}</strong>
          <p>Successfully finished</p>
        </div>

      </section>

      <section className="my-bounties-list-section">

        <div className="my-bounties-section-heading">
          <div>
            <p className="eyebrow">
              YOUR OPPORTUNITIES
            </p>

            <h2>
              Manage your bounties.
            </h2>
          </div>

          <span>
            {bounties.length}{' '}
            {bounties.length === 1
              ? 'Bounty'
              : 'Bounties'}
          </span>
        </div>

        {bounties.length === 0 ? (
          <div className="my-bounties-empty">

            <div className="my-bounties-empty-mark">
              B
            </div>

            <p className="eyebrow">
              NO BOUNTIES YET
            </p>

            <h2>
              Start your first opportunity.
            </h2>

            <p>
              Create a bounty, set a reward, and
              let contributors apply for your work.
            </p>

            <Link
              to="/create"
              className="button button-dark"
            >
              Create Your First Bounty →
            </Link>

          </div>
        ) : (
          <div className="my-bounties-grid">

            {bounties.map((bounty) => {

              const applicationCount =
                getApplicationCount(bounty.id)

              const status =
                bounty.status || 'Open'

              const isOpen =
                status === 'Open'

              const isAccepted =
                status === 'Accepted'

              const isSubmitted =
                status === 'Submitted'

              const isCompleted =
                status === 'Completed'

              return (
                <article
                  className="my-bounty-card"
                  key={bounty.id}
                >

                  <div className="my-bounty-card-top">

                    <span>
                      {bounty.category ||
                        'Development'}
                    </span>

                    <strong
                      className={`my-bounty-status status-${status.toLowerCase()}`}
                    >
                      ● {status}
                    </strong>

                  </div>

                  <h2>
                    {bounty.title}
                  </h2>

                  <p className="my-bounty-description">
                    {bounty.description}
                  </p>

                  <div className="my-bounty-meta">

                    <div>
                      <span>REWARD</span>
                      <strong>
                        {bounty.reward} USDC
                      </strong>
                    </div>

                    <div>
                      <span>WORK TYPE</span>
                      <strong>
                        {bounty.bountyType
                          ? bounty.bountyType
                              .charAt(0)
                              .toUpperCase() +
                            bounty.bountyType.slice(1)
                          : bounty.category ||
                            'Development'}
                      </strong>
                    </div>

                    <div>
                      <span>APPLICATIONS</span>
                      <strong>
                        {applicationCount}
                      </strong>
                    </div>

                    <div>
                      <span>NETWORK</span>
                      <strong>
                        {bounty.network ||
                          'Base'}
                      </strong>
                    </div>

                  </div>

                  {isOpen && (
                    <div className="my-bounty-card-note">
                      <strong>
                        {applicationCount === 0
                          ? 'No applications yet'
                          : `${applicationCount} application${
                              applicationCount === 1
                                ? ''
                                : 's'
                            } received`}
                      </strong>

                      <span>
                        Review applicants and choose
                        the right contributor.
                      </span>
                    </div>
                  )}

                  {isAccepted && (
                    <div className="my-bounty-card-note">
                      <strong>
                        Worker selected
                      </strong>

                      <span>
                        The contributor is currently
                        working on this bounty.
                      </span>
                    </div>
                  )}

                  {isSubmitted && (
                    <div className="my-bounty-card-note my-bounty-note-attention">
                      <strong>
                        Work submitted
                      </strong>

                      <span>
                        Review the completed work and
                        approve the bounty.
                      </span>
                    </div>
                  )}

                  {isCompleted && (
                    <div className="my-bounty-card-note my-bounty-note-complete">
                      <strong>
                        ✓ Completed successfully
                      </strong>

                      <span>
                        This bounty has been completed.
                      </span>
                    </div>
                  )}

                  <div className="my-bounty-actions">

                    <Link
                      to={`/bounty/${bounty.id}`}
                      className="button button-light"
                    >
                      View Bounty
                    </Link>

                    <Link
                      to={`/bounty/${bounty.id}/manage`}
                      className="button button-dark"
                    >
                      {isOpen
                        ? 'Manage Applications →'
                        : isSubmitted
                          ? 'Review Work →'
                          : 'Manage Bounty →'}
                    </Link>

                  </div>

                  {isOpen && (
                    <button
                      type="button"
                      className="my-bounty-delete"
                      onClick={() =>
                        handleDelete(
                          bounty.id
                        )
                      }
                    >
                      Delete Bounty
                    </button>
                  )}

                </article>
              )
            })}

          </div>
        )}

      </section>

      <section className="my-bounties-bottom">

        <div>
          <p className="eyebrow">
            NEED ANOTHER OPPORTUNITY?
          </p>

          <h2>
            Create your next bounty.
          </h2>

          <p>
            Give contributors a clear task and
            a transparent reward.
          </p>
        </div>

        <Link
          to="/create"
          className="button button-dark"
        >
          Create New Bounty →
        </Link>

      </section>

    </main>
  )
}

export default MyBounties