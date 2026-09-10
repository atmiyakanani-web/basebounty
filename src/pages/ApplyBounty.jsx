import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import {
  getBounties,
  getApplications,
  getCurrentUserId,
  createApplication,
} from '../lib/bountyStorage'
import './ApplyBounty.css'

function ApplyBounty() {
  const { id } = useParams()
  const navigate = useNavigate()

  const bounty = getBounties().find(
    (item) => String(item.id) === String(id)
  )

  const currentUserId = getCurrentUserId()

  const [wallet, setWallet] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!bounty) {
    return (
      <main className="apply-page">
        <section className="apply-header">
          <Link
            to="/explore"
            className="details-back"
          >
            ← Back to Explore
          </Link>

          <p className="eyebrow">
            BOUNTY NOT FOUND
          </p>

          <h1>
            This bounty does not exist.
          </h1>

          <p>
            The bounty you are looking for could
            not be found or may have been removed.
          </p>
        </section>
      </main>
    )
  }

  const isOwner =
    bounty.ownerId === currentUserId

  const isOpen =
    bounty.status === 'Open'

  const isOpenRecipient =
    bounty.recipientType === 'open'

  const myApplication =
    getApplications().find(
      (application) =>
        String(application.bountyId) ===
          String(bounty.id) &&
        application.applicantId ===
          currentUserId
    )

  const alreadyApplied =
    Boolean(myApplication)

  const canApply =
    !isOwner &&
    isOpen &&
    isOpenRecipient &&
    !alreadyApplied

  const handleSubmit = (event) => {
    event.preventDefault()

    setError('')

    if (isOwner) {
      setError(
        'You cannot apply to your own bounty.'
      )
      return
    }

    if (!isOpen) {
      setError(
        'This bounty is no longer accepting applications.'
      )
      return
    }

    if (!isOpenRecipient) {
      setError(
        'This bounty has a specific recipient and is not open for applications.'
      )
      return
    }

    if (alreadyApplied) {
      navigate(`/bounty/${bounty.id}`)
      return
    }

    if (!wallet.trim()) {
      setError(
        'Please enter your wallet address.'
      )
      return
    }

    if (!message.trim()) {
      setError(
        'Please explain why you are a good fit for this bounty.'
      )
      return
    }

    createApplication({
      bountyId: bounty.id,
      applicantWallet: wallet.trim(),
      message: message.trim(),
    })

    navigate(
      `/bounty/${bounty.id}?applied=true`
    )
  }

  if (isOwner) {
    return (
      <main className="apply-page">
        <section className="apply-header">
          <Link
            to={`/bounty/${bounty.id}`}
            className="details-back"
          >
            ← Back to Bounty
          </Link>

          <p className="eyebrow">
            YOUR BOUNTY
          </p>

          <h1>
            You cannot apply to your own bounty.
          </h1>

          <p>
            Manage this bounty from your client
            dashboard instead.
          </p>

          <Link
            to={`/bounty/${bounty.id}/manage`}
            className="button button-dark"
          >
            Manage Bounty →
          </Link>
        </section>
      </main>
    )
  }

  if (!isOpen || !isOpenRecipient) {
    return (
      <main className="apply-page">
        <section className="apply-header">
          <Link
            to={`/bounty/${bounty.id}`}
            className="details-back"
          >
            ← Back to Bounty
          </Link>

          <p className="eyebrow">
            APPLICATIONS CLOSED
          </p>

          <h1>
            This bounty is not accepting applications.
          </h1>

          <p>
            {isOpen
              ? 'This bounty has a specific recipient and is invitation-only.'
              : 'The bounty is no longer open for applications.'}
          </p>

          <Link
            to={`/bounty/${bounty.id}`}
            className="button button-dark"
          >
            View Bounty →
          </Link>
        </section>
      </main>
    )
  }

  if (alreadyApplied) {
    return (
      <main className="apply-page">
        <section className="apply-header">
          <Link
            to={`/bounty/${bounty.id}`}
            className="details-back"
          >
            ← Back to Bounty
          </Link>

          <p className="eyebrow">
            APPLICATION SUBMITTED
          </p>

          <h1>
            You already applied.
          </h1>

          <p>
            Your application for this bounty has
            already been submitted to the client.
          </p>

          <Link
            to={`/bounty/${bounty.id}`}
            className="button button-dark"
          >
            View Bounty →
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="apply-page">
      <section className="apply-header">
        <Link
          to={`/bounty/${bounty.id}`}
          className="details-back"
        >
          ← Back to Bounty
        </Link>

        <p className="eyebrow">
          APPLY FOR BOUNTY
        </p>

        <h1>
          Apply for this opportunity.
        </h1>

        <p>
          Tell the client about yourself and why
          you are a good fit for this work.
        </p>
      </section>

      <section className="apply-layout">
        <div className="apply-main">
          <form
            className="apply-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            <label>
              <span>WALLET ADDRESS</span>

              <input
                type="text"
                value={wallet}
                onChange={(event) => {
                  setWallet(event.target.value)
                  setError('')
                }}
                placeholder="0x..."
              />

              <small>
                Your wallet will be used to identify
                where the reward should be sent.
              </small>
            </label>

            <label>
              <span>
                WHY ARE YOU A GOOD FIT?
              </span>

              <textarea
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value)
                  setError('')
                }}
                placeholder="Explain your experience, skills, and how you would complete this bounty..."
                rows="9"
              />
            </label>

            <button
              type="submit"
              className="button button-dark"
              disabled={!canApply}
            >
              Submit Application →
            </button>
          </form>
        </div>

        <aside className="apply-sidebar">
          <div className="apply-summary">
            <span>BOUNTY</span>
            <h2>
              {bounty.title}
            </h2>
          </div>

          <div className="apply-summary">
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

          <div className="apply-summary">
            <span>REWARD</span>
            <strong>
              {bounty.reward} USDC
            </strong>
          </div>

          <div className="apply-summary">
            <span>NETWORK</span>
            <strong>
              {bounty.network || 'Base'}
            </strong>
          </div>

          <div className="apply-summary">
            <span>STATUS</span>
            <strong>
              {bounty.status || 'Open'}
            </strong>
          </div>

          <div className="apply-note">
            Applications are reviewed by the
            bounty creator. If selected, you will
            be able to complete and submit the work.
          </div>
        </aside>
      </section>
    </main>
  )
}

export default ApplyBounty