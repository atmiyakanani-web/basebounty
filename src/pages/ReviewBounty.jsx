import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  createLocalBounty,
  getDraft,
  clearDraft,
} from '../lib/bountyStorage'
import { fundAndCreateBounty, explorerTxUrl } from '../lib/contract'
import './ReviewBounty.css'

function ReviewBounty() {
  const navigate = useNavigate()

  const [bounty, setBounty] = useState(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [txHash, setTxHash] = useState('')

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

  const handleCreateBounty = async () => {
    if (creating) return

    setError('')
    setTxHash('')
    setCreating(true)

    try {
      if (!window.ethereum) {
        throw new Error('Connect your wallet before publishing a bounty.')
      }

      const recipientAddress =
        bounty.recipientType === 'wallet' && bounty.wallet
          ? bounty.wallet
          : '0x0000000000000000000000000000000000000000'

      const result = await fundAndCreateBounty({
        reward,
        recipient: recipientAddress,
        provider: window.ethereum,
      })

      const createdBounty = createLocalBounty({
        ...bounty,
        bountyType: bounty.bountyType || 'website',
        onchain: true,
        chainId: 84532,
        contractAddress: import.meta.env.VITE_BOUNTY_ESCROW_ADDRESS || '',
        bountyId: result.bountyId,
        approveTxHash: result.approveTxHash,
        createTxHash: result.createTxHash,
        explorerUrl: explorerTxUrl(result.createTxHash),
      })

      clearDraft()
      navigate(`/bounty/${createdBounty.id}`)
    } catch (err) {
      console.error(err)
      setError(err?.reason || err?.shortMessage || err?.message || 'Transaction failed. Please try again.')
      setTxHash('')
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
                Your bounty is designed to use
                Base escrow to secure the reward
                until the work is completed.
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

          {txHash && (
            <a
              className="review-tx-link"
              href={explorerTxUrl(txHash)}
              target="_blank"
              rel="noreferrer"
            >
              View transaction on BaseScan →
            </a>
          )}

          <p className="wallet-note">
            Publishing requires a Base Sepolia wallet and USDC approval.
            The reward is locked in the escrow contract after confirmation.
          </p>

        </aside>

      </section>

    </main>
  )
}

export default ReviewBounty