import { Link } from 'react-router-dom'
import './FindWork.css'
import { useState } from 'react'
import {
  getBounties,
  getApplications,
  getCurrentUserId,
  deleteBounty,
} from '../lib/bountyStorage'

function MyBounties() {
  const currentUserId = getCurrentUserId()

  const getMyBounties = () =>
    getBounties().filter(
      (bounty) =>
        !String(bounty.id).startsWith('demo-') &&
        bounty.ownerId === currentUserId
    )

  const [bounties, setBounties] =
    useState(getMyBounties)

  const handleDelete = (id) => {
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

    const confirmed =
      window.confirm(
        `Delete "${bounty.title}"?\n\nThis action cannot be undone.`
      )

    if (!confirmed) return

    const result =
      deleteBounty(id)

    if (!result.success) {
      alert(result.reason)
      return
    }

    setBounties(getMyBounties())
  }

  return (
    <main className="role-page">

      <section className="role-page-hero">

        <div>
          <p className="eyebrow">
            CLIENT DASHBOARD
          </p>

          <h1>
            My Bounties.
          </h1>

          <p>
            Manage the work you have posted,
            review applications, select workers,
            and approve completed work.
          </p>
        </div>

        <Link
          to="/create"
          className="button button-dark"
        >
          Create a Bounty →
        </Link>

      </section>

      <section className="my-bounties-section">

        <div className="my-bounties-heading">

          <div>
            <p className="eyebrow">
              YOUR WORK
            </p>

            <h2>
              Bounties you created
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

          <div className="empty-state-card">

            <h2>
              No bounties yet
            </h2>

            <p>
              Create your first bounty and
              start hiring contributors.
            </p>

            <Link
              to="/create"
              className="button button-dark"
              style={{
                marginTop: '22px',
              }}
            >
              Create a Bounty →
            </Link>

          </div>

        ) : (

          <div className="my-bounty-list">

            {bounties.map((bounty) => {

              const applications =
                getApplications().filter(
                  (application) =>
                    String(
                      application.bountyId
                    ) ===
                    String(bounty.id)
                )

              return (
                <article
                  className="my-bounty-card"
                  key={bounty.id}
                >

                  <div className="my-bounty-main">

                    <div className="my-bounty-top">

                      <span>
                        {bounty.category ||
                          'Development'}
                      </span>

                      <strong>
                        ● {bounty.status ||
                          'Open'}
                      </strong>

                    </div>

                    <h2>
                      {bounty.title}
                    </h2>

                    <p>
                      {bounty.description}
                    </p>

                  </div>

                  <div className="my-bounty-meta">

                    <div>
                      <span>
                        REWARD
                      </span>

                      <strong>
                        {bounty.reward} USDC
                      </strong>
                    </div>

                    <div>
                      <span>
                        APPLICATIONS
                      </span>

                      <strong>
                        {applications.length}
                      </strong>
                    </div>

                    <div>
                      <span>
                        WORKER
                      </span>

                      <strong>
                        {bounty.contributor ||
                          'Not selected'}
                      </strong>
                    </div>

                  </div>

                  <div className="my-bounty-actions">

                    <Link
                      to={`/bounty/${bounty.id}`}
                    >
                      View Bounty
                    </Link>

                    <Link
                      to={`/bounty/${bounty.id}/manage`}
                      className="button button-dark"
                    >
                      Manage Bounty →
                    </Link>

                    {bounty.status === 'Open' && (
                      <button
                        type="button"
                        className="delete-bounty-button"
                        onClick={() =>
                          handleDelete(
                            bounty.id
                          )
                        }
                      >
                        Delete
                      </button>
                    )}

                  </div>

                </article>
              )
            })}

          </div>

        )}

      </section>

    </main>
  )
}

export default MyBounties