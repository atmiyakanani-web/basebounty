import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  createLocalBounty,
  getDraft,
  clearDraft,
} from '../lib/bountyStorage'
import './ReviewBounty.css'

function ReviewBounty() {
  const navigate = useNavigate()

  const [bounty, setBounty] = useState(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setBounty(getDraft())
  }, [])

  if (!bounty) {
    return (
      <main className="review-page">
        <div className="review-empty">
          <span className="review-eyebrow">CREATE BOUNTY</span>

          <h1>No bounty to review</h1>

          <p>
            Start by creating a bounty first.
          </p>

          <Link
            to="/create"
            className="review-primary-button"
          >
            Create a Bounty
            <span>→</span>
          </Link>
        </div>
      </main>
    )
  }

  const recipient =
    bounty.recipientType === 'wallet'
      ? bounty.wallet || 'Wallet address not provided'
      : bounty.recipientType === 'email'
        ? bounty.email || 'Email not provided'
        : 'Open to applicants'

  const recipientLabel =
    bounty.recipientType === 'wallet'
      ? 'Wallet Address'
      : bounty.recipientType === 'email'
        ? 'Email Invitation'
        : 'Open to Applicants'

  const typeName = {
    website: 'Website',
    development: 'Development',
    design: 'Design',
    writing: 'Writing',
    other: 'Other',
  }[bounty.bountyType || 'website']

  const reward = bounty.reward || '0'

  const handleCreateBounty = () => {
    if (creating) return

    setError('')
    setCreating(true)

    try {
      const createdBounty = createLocalBounty({
  ...bounty,
  recipientType: bounty.recipientType || 'open',
  bountyType: bounty.bountyType || 'website',
        onchain: false,
        network: 'Base',
        escrow: 'Smart Contract',
      })

      clearDraft()
      navigate(`/bounty/${createdBounty.id}`)
    } catch (err) {
      console.error(err)
      setError('Could not publish the bounty. Please try again.')
      setCreating(false)
    }
  }

  return (
    <main className="review-page">

      <div className="review-header">

        <Link
          to="/create"
          className="review-back"
        >
          ← Back to edit
        </Link>

        <span className="review-eyebrow">
          CREATE BOUNTY
        </span>

        <h1>
          Review your bounty
        </h1>

        <p>
          Make sure everything is correct before
          publishing your bounty.
        </p>

      </div>

      <section className="review-layout">

        <div className="review-card">

          <div className="review-card-top">
            <div>
              <span>BOUNTY</span>
              <strong>READY TO PUBLISH</strong>
            </div>

            <div className="review-status">
              OPEN
            </div>
          </div>

          <h2>
            {bounty.title || 'Untitled bounty'}
          </h2>

          <p className="review-description">
            {bounty.description ||
              'No description provided.'}
          </p>

          <div className="review-divider" />

          <div className="review-details">

            <div className="review-row">
              <span>WORK TYPE</span>
              <strong>{typeName}</strong>
            </div>

            <div className="review-row">
              <span>BOUNTY REWARD</span>
              <strong>
                {reward} USDC
              </strong>
            </div>

            <div className="review-row">
              <span>RECIPIENT</span>
              <strong>
                {recipientLabel}
              </strong>
            </div>

            <div className="review-row">
              <span>RECIPIENT DETAILS</span>
              <strong className="review-long-value">
                {recipient}
              </strong>
            </div>

            <div className="review-row">
              <span>NETWORK</span>
              <strong>Base</strong>
            </div>

            <div className="review-row">
              <span>PAYMENT</span>
              <strong>USDC</strong>
            </div>

            <div className="review-row">
              <span>ESCROW</span>
              <strong>Smart Contract</strong>
            </div>

          </div>

          <div className="review-divider" />

          <div className="review-security">

            <div className="security-icon">
              ◆
            </div>

            <div>
              <strong>
                Protected by onchain escrow
              </strong>

              <p>
                Base escrow is ready to secure
                bounty rewards when blockchain
                payments are enabled.
              </p>
            </div>

          </div>

        </div>

        <aside className="review-summary">

          <span className="summary-label">
            PAYMENT SUMMARY
          </span>

          <div className="summary-amount">

            <small>
              Total bounty
            </small>

            <strong>
              {reward} USDC
            </strong>

          </div>

          <div className="summary-line">
            <span>Work type</span>
            <strong>{typeName}</strong>
          </div>

          <div className="summary-line">
            <span>Bounty reward</span>
            <strong>{reward} USDC</strong>
          </div>

          <div className="summary-line">
            <span>Network</span>
            <strong>Base</strong>
          </div>

          <div className="summary-line">
            <span>Payment</span>
            <strong>USDC</strong>
          </div>

          <div className="summary-line">
            <span>Escrow</span>
            <strong>Smart Contract</strong>
          </div>

          <div className="summary-divider" />

          <div className="review-confirm">

            <span className="confirm-check">
              ✓
            </span>

            <div>
              <strong>
                Ready to publish
              </strong>

              <p>
                Review your bounty details
                before continuing.
              </p>
            </div>

          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="button"
            className="review-primary-button review-create-button"
            onClick={handleCreateBounty}
            disabled={creating}
          >
            <span>
              {creating
                ? 'Publishing...'
                : 'Confirm & Publish'}
            </span>

            <span>→</span>
          </button>

          <p className="wallet-note">
            Your bounty will be added to the
            BaseBounty marketplace.
          </p>

        </aside>

      </section>

    </main>
  )
}

export default ReviewBounty