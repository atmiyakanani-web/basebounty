import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

import {
  getBounties,
  getCurrentUserId,
  syncBounties,
} from '../lib/bountyStorage'

import './FindWork.css'

function FindWork() {
  const currentUserId =
    getCurrentUserId()

  const getWorkerBounties = () =>
    getBounties().filter(
      (bounty) =>
        !String(
          bounty.id
        ).startsWith('demo-') &&
        String(
          bounty.workerId ||
          bounty.contributorId
        ) ===
          String(currentUserId) &&
        (
          bounty.status ===
            'Accepted' ||
          bounty.status ===
            'Submitted' ||
          bounty.status ===
            'Completed'
        )
    )

  const [
    bounties,
    setBounties,
  ] = useState(
    getWorkerBounties
  )

  useEffect(() => {
    const refresh = () => {
      setBounties(
        getWorkerBounties()
      )
    }

    syncBounties().then(refresh)

    const handleSync = () => {
      refresh()
    }

    window.addEventListener(
      'basebounty:bounties-synced',
      handleSync
    )

    const interval =
      setInterval(() => {
        syncBounties().then(
          refresh
        )
      }, 5000)

    return () => {
      clearInterval(interval)

      window.removeEventListener(
        'basebounty:bounties-synced',
        handleSync
      )
    }
  }, [])

  return (
    <main className="role-page">

      <section className="role-page-hero">

        <div>
          <p className="eyebrow">
            WORKER BOARD
          </p>

          <h1>
            Your Work.
          </h1>

          <p>
            View the bounties you have been
            selected for and continue your work.
          </p>
        </div>

        <Link
          to="/explore"
          className="button button-dark"
        >
          Find More Bounties →
        </Link>

      </section>

      <section className="my-bounties-section">

        <div className="my-bounties-heading">

          <div>
            <p className="eyebrow">
              ASSIGNED WORK
            </p>

            <h2>
              Bounties assigned to you
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
              No assigned work yet
            </h2>

            <p>
              When a client accepts your
              application, the bounty will
              appear here automatically.
            </p>

            <Link
              to="/explore"
              className="button button-dark"
              style={{
                marginTop: '22px',
              }}
            >
              Explore Bounties →
            </Link>

          </div>

        ) : (

          <div className="my-bounty-list">

            {bounties.map(
              (bounty) => (
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
                        ● {bounty.status}
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
                        CLIENT
                      </span>

                      <strong>
                        {bounty.client ||
                          'Connected wallet'}
                      </strong>
                    </div>

                    <div>
                      <span>
                        STATUS
                      </span>

                      <strong>
                        {bounty.status}
                      </strong>
                    </div>

                  </div>

                  <div className="my-bounty-actions">

                    <Link
                      to={`/bounty/${bounty.id}`}
                    >
                      View Bounty
                    </Link>

                    {bounty.status ===
                      'Accepted' && (
                      <Link
                        to={`/bounty/${bounty.id}/submit`}
                        className="button button-dark"
                      >
                        Submit Work →
                      </Link>
                    )}

                    {bounty.status ===
                      'Submitted' && (
                      <Link
                        to={`/bounty/${bounty.id}`}
                        className="button button-dark"
                      >
                        View Submission →
                      </Link>
                    )}

                    {bounty.status ===
                      'Completed' && (
                      <Link
                        to={`/bounty/${bounty.id}`}
                        className="button button-light"
                      >
                        Completed ✓
                      </Link>
                    )}

                  </div>

                </article>
              )
            )}

          </div>

        )}

      </section>

    </main>
  )
}

export default FindWork