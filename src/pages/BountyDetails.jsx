import {
  Link,
  useParams,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  getBounties,
  getApplications,
  getCurrentUserId,
} from '../lib/bountyStorage'

import './BountyDetails.css'

function BountyDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const bounty = getBounties().find(
    (item) => String(item.id) === String(id)
  )

  if (!bounty) {
    return (
      <main className="details-page">
        <Link className="details-back" to="/explore">
          ← Back to Explore
        </Link>

        <section className="details-main details-not-found">
          <p className="eyebrow">BOUNTY NOT FOUND</p>
          <h1>This bounty does not exist.</h1>
          <p>
            The bounty you are looking for could not be found
            or may have been removed.
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

  const applications = getApplications()

  const myApplication = applications.find(
    (application) =>
      String(application.bountyId) ===
        String(bounty.id) &&
      application.applicantId === currentUserId
  )

  const wasJustSubmitted =
    new URLSearchParams(
      location.search
    ).get('applied') === 'true'

  const applicationSubmitted =
    Boolean(myApplication) ||
    wasJustSubmitted

  const isMyAcceptedApplication =
    Boolean(
      myApplication &&
      myApplication.status === 'Accepted' &&
      bounty.acceptedApplicationId === myApplication.id
    )

  const isOpen =
    bounty.status === 'Open'

  const isAccepted =
    bounty.status === 'Accepted'

  const isSubmitted =
    bounty.status === 'Submitted'

  const isCompleted =
    bounty.status === 'Completed'

  const recipient =
    bounty.recipientType === 'wallet'
      ? bounty.wallet || 'Wallet recipient'
      : bounty.recipientType === 'email'
        ? bounty.email || 'Email invitation'
        : 'Open to applicants'

  const typeName =
    bounty.bountyType
      ? bounty.bountyType
          .charAt(0)
          .toUpperCase() +
        bounty.bountyType.slice(1)
      : bounty.category ||
        'Development'

  const handleApply = () => {
    if (!isOpen) return
    if (isOwner) return
    if (bounty.recipientType !== 'open') return
    if (applicationSubmitted) return

    navigate(
      `/bounty/${bounty.id}/apply`
    )
  }

  return (
    <main className="details-page">
      <Link
        className="details-back"
        to="/explore"
      >
        ← Back to Explore
      </Link>

      <section className="details-layout">
        <div className="details-main">

          <div className="details-top">
            <span className="details-category">
              {bounty.category ||
                'Development'}
            </span>

            <span className="details-status">
              <b>●</b>
              {bounty.status || 'Open'}
            </span>
          </div>

          <h1>{bounty.title}</h1>

          <p className="details-description">
            {bounty.description}
          </p>

          <div className="details-divider" />

          <section className="details-content-section">
            <p className="eyebrow">
              ABOUT THIS BOUNTY
            </p>

            <h2>
              What needs to be done.
            </h2>

            <p>
              {bounty.description}
            </p>
          </section>

          <div className="details-divider" />

          <section className="details-content-section">
            <p className="eyebrow">
              BOUNTY INFORMATION
            </p>

            <h2>
              Project details.
            </h2>

            <div className="details-info-grid">
              <div>
                <span>WORK TYPE</span>
                <strong>{typeName}</strong>
              </div>

              <div>
                <span>REWARD</span>
                <strong>
                  {bounty.reward} USDC
                </strong>
              </div>

              <div>
                <span>NETWORK</span>
                <strong>
                  {bounty.network || 'Base'}
                </strong>
              </div>

              <div>
                <span>ESCROW</span>
                <strong>
                  {bounty.escrow ||
                    'Smart Contract'}
                </strong>
              </div>

              <div>
                <span>RECIPIENT</span>
                <strong>
                  {recipient}
                </strong>
              </div>

              <div>
                <span>CLIENT</span>
                <strong>
                  {bounty.client ||
                    'Connected wallet'}
                </strong>
              </div>
            </div>
          </section>

          {isSubmitted &&
            bounty.submission && (
              <>
                <div className="details-divider" />

                <section className="details-content-section">
                  <p className="eyebrow">
                    WORK SUBMITTED
                  </p>

                  <h2>
                    The completed work is ready for review.
                  </h2>

                  <div className="details-submission-card">
                    <span>
                      SUBMISSION
                    </span>

                    <p>
                      {bounty.submission}
                    </p>
                  </div>
                </section>
              </>
            )}

          {isCompleted && (
            <>
              <div className="details-divider" />

              <section className="details-completed-card">
                <span>
                  ✓ BOUNTY COMPLETED
                </span>

                <h2>
                  This bounty has been completed.
                </h2>

                <p>
                  The submitted work was approved
                  by the client.
                </p>
              </section>
            </>
          )}
        </div>

        <aside className="details-sidebar">

          <div className="reward-box">
            <span>REWARD</span>

            <strong>
              {bounty.reward} USDC
            </strong>

            <small>
              {bounty.network || 'Base'} network
            </small>
          </div>

          {isOwner && (
            <Link
              to={`/bounty/${bounty.id}/manage`}
              className="button button-dark details-apply"
            >
              Manage Bounty →
            </Link>
          )}

          {!isOwner &&
            isMyAcceptedApplication && (
              <Link
                to={`/bounty/${bounty.id}/submit`}
                className="button button-dark details-apply"
              >
                Submit Work →
              </Link>
            )}

          {!isOwner &&
            isAccepted &&
            !isMyAcceptedApplication && (
              <div className="details-state-card">
                <span>
                  WORK IN PROGRESS
                </span>

                <strong>
                  A worker has been selected.
                </strong>

                <p>
                  This bounty is currently being
                  completed by the selected worker.
                </p>
              </div>
            )}

          {!isOwner &&
            isSubmitted &&
            isMyAcceptedApplication && (
              <div className="details-state-card details-state-success">
                <span>
                  ✓ WORK SUBMITTED
                </span>

                <strong>
                  Waiting for client review.
                </strong>

                <p>
                  Your submission has been sent
                  to the client for approval.
                </p>
              </div>
            )}

          {!isOwner &&
            isSubmitted &&
            !isMyAcceptedApplication && (
              <div className="details-state-card">
                <span>
                  WORK SUBMITTED
                </span>

                <strong>
                  Awaiting client review.
                </strong>

                <p>
                  The client is reviewing the
                  submitted work.
                </p>
              </div>
            )}

          {isCompleted && (
            <div className="details-state-card details-state-success">
              <span>
                ✓ COMPLETED
              </span>

              <strong>
                Bounty completed successfully.
              </strong>

              <p>
                This opportunity is no longer
                accepting applications.
              </p>
            </div>
          )}

          {!isOwner &&
            isOpen &&
            bounty.recipientType === 'open' &&
            !applicationSubmitted && (
              <button
                type="button"
                className="button button-dark details-apply"
                onClick={handleApply}
              >
                Apply for Bounty →
              </button>
            )}

          {!isOwner &&
            isOpen &&
            bounty.recipientType === 'open' &&
            applicationSubmitted && (
              <div className="details-state-card details-state-success">
                <span>
                  ✓ APPLICATION
                </span>

                <strong>
                  Application submitted.
                </strong>

                <p>
                  The client can now review your
                  application.
                </p>
              </div>
            )}

          {!isOwner &&
            isOpen &&
            bounty.recipientType !== 'open' && (
              <div className="details-state-card">
                <span>
                  INVITATION ONLY
                </span>

                <strong>
                  This bounty has a specific recipient.
                </strong>

                <p>
                  Applications are not open for
                  this bounty.
                </p>
              </div>
            )}

          <div className="details-info">

            <div>
              <span>STATUS</span>
              <strong>
                {bounty.status || 'Open'}
              </strong>
            </div>

            <div>
              <span>CLIENT</span>
              <strong>
                {bounty.client ||
                  'Connected wallet'}
              </strong>
            </div>

            <div>
              <span>RECIPIENT</span>
              <strong>
                {recipient}
              </strong>
            </div>

            <div>
              <span>NETWORK</span>
              <strong>
                {bounty.network || 'Base'}
              </strong>
            </div>

          </div>

          <Link
            to="/my-bounties"
            className="button button-light"
          >
            My Bounties →
          </Link>

        </aside>
      </section>
    </main>
  )
}

export default BountyDetails