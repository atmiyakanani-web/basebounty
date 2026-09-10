import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'

import {
  getBounties,
  getApplications,
  getCurrentUserId,
} from '../lib/bountyStorage'

import './ManageBounty.css'

function ManageBounty() {
  const { id } = useParams()
  const [, setRefresh] = useState(0)

  const bounty = getBounties().find(
    (item) => String(item.id) === String(id)
  )

  if (!bounty) {
    return (
      <main className="manage-page">
        <section className="manage-empty">
          <p className="eyebrow">BOUNTY NOT FOUND</p>
          <h1>This bounty does not exist.</h1>
          <p>
            The bounty you are looking for could not be
            found or may have been removed.
          </p>

          <Link
            to="/explore"
            className="button button-dark"
          >
            Explore Bounties →
          </Link>
        </section>
      </main>
    )
  }

  const currentUserId = getCurrentUserId()

  const isOwner =
    bounty.ownerId === currentUserId

  const applications = getApplications().filter(
    (application) =>
      String(application.bountyId) ===
      String(bounty.id)
  )

  if (!isOwner) {
    return (
      <main className="manage-page">
        <section className="manage-empty">
          <p className="eyebrow">ACCESS DENIED</p>

          <h1>
            This is not your bounty.
          </h1>

          <p>
            Only the bounty creator can manage
            applications and approve submitted work.
          </p>

          <div className="manage-empty-actions">
            <Link
              to={`/bounty/${bounty.id}`}
              className="button button-dark"
            >
              View Bounty →
            </Link>

            <Link
              to="/explore"
              className="button button-light"
            >
              Explore Bounties
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const handleAcceptWorker = (application) => {
    const confirmed = window.confirm(
      `Accept ${application.applicantWallet} for "${bounty.title}"?`
    )

    if (!confirmed) return

    const updatedBounties = getBounties().map(
      (item) => {
        if (
          String(item.id) !==
          String(bounty.id)
        ) {
          return item
        }

        return {
          ...item,
          status: 'Accepted',
          contributor:
            application.applicantWallet,
          acceptedApplicationId:
            application.id,
        }
      }
    )

    localStorage.setItem(
      'basebounty_bounties',
      JSON.stringify(updatedBounties)
    )

    const updatedApplications =
      getApplications().map(
        (item) => {
          if (
            item.id ===
            application.id
          ) {
            return {
              ...item,
              status: 'Accepted',
            }
          }

          if (
            String(item.bountyId) ===
              String(bounty.id) &&
            item.status === 'Pending'
          ) {
            return {
              ...item,
              status: 'Rejected',
            }
          }

          return item
        }
      )

    localStorage.setItem(
      'basebounty_applications',
      JSON.stringify(updatedApplications)
    )

    setRefresh((value) => value + 1)

    alert(
      'Worker accepted successfully.'
    )
  }

  const handleCompleteBounty = () => {
    if (
      bounty.status !==
      'Submitted'
    ) {
      return
    }

    const confirmed = window.confirm(
      'Approve the submitted work and complete this bounty?'
    )

    if (!confirmed) return

    const updatedBounties =
      getBounties().map(
        (item) => {
          if (
            String(item.id) !==
            String(bounty.id)
          ) {
            return item
          }

          return {
            ...item,
            status: 'Completed',
            completedAt:
              new Date().toISOString(),
          }
        }
      )

    localStorage.setItem(
      'basebounty_bounties',
      JSON.stringify(updatedBounties)
    )

    setRefresh((value) => value + 1)

    alert(
      'Bounty completed successfully.'
    )
  }

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === 'Pending'
    )

  return (
    <main className="manage-page">

      <header className="manage-header">
        <Link
          to={`/bounty/${bounty.id}`}
          className="manage-back"
        >
          ← Back to bounty
        </Link>

        <div className="manage-header-content">
          <div>
            <p className="eyebrow">
              CLIENT DASHBOARD
            </p>

            <h1>
              {bounty.title}
            </h1>

            <p>
              Manage applications, select a worker,
              and approve completed work.
            </p>
          </div>

          <span className="manage-header-status">
            ● {bounty.status || 'Open'}
          </span>
        </div>
      </header>

      <section className="manage-layout">

        <div className="manage-main">

          <div className="manage-status-card">

            <div>
              <span>STATUS</span>
              <strong>
                {bounty.status || 'Open'}
              </strong>
            </div>

            <div>
              <span>REWARD</span>
              <strong>
                {bounty.reward} USDC
              </strong>
            </div>

            <div>
              <span>APPLICATIONS</span>
              <strong>
                {applications.length}
              </strong>
            </div>

          </div>

          {bounty.status === 'Open' && (
            <section className="applications-section">

              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    APPLICATIONS
                  </p>

                  <h2>
                    Workers who applied.
                  </h2>

                  <p>
                    Review applications and choose
                    the contributor for this bounty.
                  </p>
                </div>

                <span className="application-count">
                  {applications.length}
                </span>
              </div>

              {applications.length === 0 ? (
                <div className="no-applications">
                  <span>✦</span>

                  <h3>
                    No applications yet.
                  </h3>

                  <p>
                    Applications from workers will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="application-list">

                  {applications.map(
                    (application) => (
                      <article
                        className="application-card"
                        key={application.id}
                      >

                        <div className="application-card-top">
                          <span
                            className={
                              application.status ===
                              'Accepted'
                                ? 'application-status accepted'
                                : application.status ===
                                  'Rejected'
                                  ? 'application-status rejected'
                                  : 'application-status'
                            }
                          >
                            {application.status}
                          </span>

                          <small>
                            {application.createdAt
                              ? new Date(
                                  application.createdAt
                                ).toLocaleDateString()
                              : 'Recent'}
                          </small>
                        </div>

                        <div className="application-wallet">
                          <span>
                            APPLICANT WALLET
                          </span>

                          <strong>
                            {application.applicantWallet ||
                              'Wallet not provided'}
                          </strong>
                        </div>

                        <div className="application-message">
                          <span>
                            APPLICATION MESSAGE
                          </span>

                          <p>
                            {application.message ||
                              'No message provided.'}
                          </p>
                        </div>

                        {application.status ===
                          'Pending' && (
                          <button
                            type="button"
                            className="button button-dark"
                            onClick={() =>
                              handleAcceptWorker(
                                application
                              )
                            }
                          >
                            Accept Worker →
                          </button>
                        )}

                      </article>
                    )
                  )}

                </div>
              )}

            </section>
          )}

          {bounty.status === 'Accepted' && (
            <section className="worker-state-card">

              <div className="worker-state-icon">
                ✓
              </div>

              <div>
                <p className="eyebrow">
                  WORK IN PROGRESS
                </p>

                <h2>
                  Worker accepted.
                </h2>

                <p>
                  The selected contributor is now
                  working on this bounty. They can
                  submit their completed work when ready.
                </p>
              </div>

              <div className="accepted-worker">
                <span>
                  CONTRIBUTOR
                </span>

                <strong>
                  {bounty.contributor ||
                    'Selected worker'}
                </strong>
              </div>

            </section>
          )}

          {bounty.status === 'Submitted' && (
            <section className="submission-review-card">

              <div className="submission-review-header">
                <div>
                  <p className="eyebrow">
                    WORK SUBMITTED
                  </p>

                  <h2>
                    Review the completed work.
                  </h2>
                </div>

                <span>
                  READY FOR REVIEW
                </span>
              </div>

              <div className="accepted-worker">
                <span>
                  WORKER
                </span>

                <strong>
                  {bounty.contributor ||
                    'Selected worker'}
                </strong>
              </div>

              <div className="application-message submission-box">
                <span>
                  SUBMISSION
                </span>

                <p>
                  {bounty.submission ||
                    'No submission details provided.'}
                </p>
              </div>

              <button
                type="button"
                className="button button-dark"
                onClick={
                  handleCompleteBounty
                }
              >
                Approve & Complete →
              </button>

            </section>
          )}

          {bounty.status === 'Completed' && (
            <section className="completed-state-card">

              <div className="completed-mark">
                ✓
              </div>

              <div>
                <p className="eyebrow">
                  BOUNTY COMPLETED
                </p>

                <h2>
                  Work approved successfully.
                </h2>

                <p>
                  This bounty has been completed
                  and the submitted work was approved.
                </p>
              </div>

              <div className="accepted-worker">
                <span>
                  CONTRIBUTOR
                </span>

                <strong>
                  {bounty.contributor ||
                    'Selected worker'}
                </strong>
              </div>

            </section>
          )}

        </div>

        <aside className="manage-sidebar">

          <div className="manage-reward-box">
            <span>
              BOUNTY REWARD
            </span>

            <strong>
              {bounty.reward} USDC
            </strong>

            <small>
              {bounty.network || 'Base'} network
            </small>
          </div>

          <div className="manage-info-card">

            <div>
              <span>STATUS</span>

              <strong>
                {bounty.status || 'Open'}
              </strong>
            </div>

            <div>
              <span>APPLICATIONS</span>

              <strong>
                {applications.length}
              </strong>
            </div>

            <div>
              <span>PENDING</span>

              <strong>
                {pendingApplications.length}
              </strong>
            </div>

            <div>
              <span>ESCROW</span>

              <strong>
                {bounty.escrow ||
                  'Smart Contract'}
              </strong>
            </div>

          </div>

          <div className="manage-sidebar-actions">

            <Link
              to={`/bounty/${bounty.id}`}
              className="button button-light"
            >
              View Public Bounty →
            </Link>

            <Link
              to="/my-bounties"
              className="button button-light"
            >
              My Bounties →
            </Link>

          </div>

        </aside>

      </section>
    </main>
  )
}

export default ManageBounty