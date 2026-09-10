import { useState } from 'react'
import './CreateBounty.css'

function CreateBounty() {
  const [recipientType, setRecipientType] = useState('wallet')
  const [bountyType, setBountyType] = useState('website')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    wallet: '',
    email: '',
  })

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const goToReview = () => {
    localStorage.setItem(
      'basebounty_draft',
      JSON.stringify({
        ...formData,
        recipientType,
        bountyType,
      })
    )

    window.location.href = '/review'
  }

  return (
    <div className="create-page">
      <div className="create-container">

        <div className="create-header">
          <a href="/" className="back-link">
            ← Back to BaseBounty
          </a>

          <div className="create-heading">
            <span>CREATE BOUNTY</span>

            <h1>Turn work into a clear agreement.</h1>

            <p>
              Define the task, set the reward, and choose who should
              receive the bounty.
            </p>
          </div>
        </div>

        <div className="create-layout">

          <section className="form-card">

            <div className="form-section">
              <div className="form-section-title">
                <span>01</span>

                <div>
                  <h2>Bounty details</h2>
                  <p>Tell contributors what needs to be done.</p>
                </div>
              </div>

              <label>
                Bounty title

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    updateField('title', e.target.value)
                  }
                  placeholder="e.g. Build a landing page for my startup"
                />
              </label>

              <label>
                Description

                <textarea
                  rows="6"
                  value={formData.description}
                  onChange={(e) =>
                    updateField('description', e.target.value)
                  }
                  placeholder="Describe the work, requirements, deliverables, and expectations..."
                />
              </label>
            </div>

            <div className="form-divider" />

            {/* BOUNTY TYPE */}

            <div className="form-section">
              <div className="form-section-title">
                <span>02</span>

                <div>
                  <h2>Work type</h2>
                  <p>Choose what kind of work the contributor will submit.</p>
                </div>
              </div>

              <div className="recipient-options">

                <button
                  type="button"
                  className={`recipient-option ${
                    bountyType === 'website' ? 'active' : ''
                  }`}
                  onClick={() => setBountyType('website')}
                >
                  <span className="option-icon">◉</span>

                  <span>
                    <strong>Website</strong>
                    <small>Submit a live website or web project</small>
                  </span>

                  {bountyType === 'website' && <b>✓</b>}
                </button>

                <button
                  type="button"
                  className={`recipient-option ${
                    bountyType === 'development' ? 'active' : ''
                  }`}
                  onClick={() => setBountyType('development')}
                >
                  <span className="option-icon">◇</span>

                  <span>
                    <strong>Development</strong>
                    <small>Submit code, repository, and demo</small>
                  </span>

                  {bountyType === 'development' && <b>✓</b>}
                </button>

                <button
                  type="button"
                  className={`recipient-option ${
                    bountyType === 'design' ? 'active' : ''
                  }`}
                  onClick={() => setBountyType('design')}
                >
                  <span className="option-icon">✦</span>

                  <span>
                    <strong>Design</strong>
                    <small>Submit Figma or design files</small>
                  </span>

                  {bountyType === 'design' && <b>✓</b>}
                </button>

                <button
                  type="button"
                  className={`recipient-option ${
                    bountyType === 'writing' ? 'active' : ''
                  }`}
                  onClick={() => setBountyType('writing')}
                >
                  <span className="option-icon">✎</span>

                  <span>
                    <strong>Writing</strong>
                    <small>Submit documents or written work</small>
                  </span>

                  {bountyType === 'writing' && <b>✓</b>}
                </button>

                <button
                  type="button"
                  className={`recipient-option ${
                    bountyType === 'other' ? 'active' : ''
                  }`}
                  onClick={() => setBountyType('other')}
                >
                  <span className="option-icon">+</span>

                  <span>
                    <strong>Other</strong>
                    <small>Submit another type of deliverable</small>
                  </span>

                  {bountyType === 'other' && <b>✓</b>}
                </button>

              </div>
            </div>

            <div className="form-divider" />

            {/* REWARD */}

            <div className="form-section">
              <div className="form-section-title">
                <span>03</span>

                <div>
                  <h2>Reward</h2>
                  <p>Set the amount that will be held in escrow.</p>
                </div>
              </div>

              <label>
                Reward amount

                <div className="amount-input">
                  <input
                    type="number"
                    min="0"
                    value={formData.reward}
                    onChange={(e) =>
                      updateField('reward', e.target.value)
                    }
                    placeholder="0.00"
                  />

                  <span>USDC</span>
                </div>
              </label>

              <div className="info-box">
                <span>◆</span>

                <p>
                  Your reward will be held in smart-contract escrow
                  until the submitted work is approved.
                </p>
              </div>
            </div>

            <div className="form-divider" />

            {/* RECIPIENT */}

            <div className="form-section">
              <div className="form-section-title">
                <span>04</span>

                <div>
                  <h2>Recipient</h2>
                  <p>Choose how the bounty should be assigned.</p>
                </div>
              </div>

              <div className="recipient-options">

                <button
                  type="button"
                  className={`recipient-option ${
                    recipientType === 'wallet' ? 'active' : ''
                  }`}
                  onClick={() => setRecipientType('wallet')}
                >
                  <span className="option-icon">◇</span>

                  <span>
                    <strong>Wallet address</strong>
                    <small>Pay a specific contributor</small>
                  </span>

                  {recipientType === 'wallet' && <b>✓</b>}
                </button>

                <button
                  type="button"
                  className={`recipient-option ${
                    recipientType === 'email' ? 'active' : ''
                  }`}
                  onClick={() => setRecipientType('email')}
                >
                  <span className="option-icon">✉</span>

                  <span>
                    <strong>Email invitation</strong>
                    <small>Invite someone to claim the bounty</small>
                  </span>

                  {recipientType === 'email' && <b>✓</b>}
                </button>

                <button
                  type="button"
                  className={`recipient-option ${
                    recipientType === 'open' ? 'active' : ''
                  }`}
                  onClick={() => setRecipientType('open')}
                >
                  <span className="option-icon">◎</span>

                  <span>
                    <strong>Open to applicants</strong>
                    <small>Let contributors apply for this bounty</small>
                  </span>

                  {recipientType === 'open' && <b>✓</b>}
                </button>

              </div>

              {recipientType === 'wallet' && (
                <label>
                  Wallet address

                  <input
                    type="text"
                    value={formData.wallet}
                    onChange={(e) =>
                      updateField('wallet', e.target.value)
                    }
                    placeholder="0x..."
                  />

                  <small className="field-help">
                    Enter the contributor's EVM wallet address.
                  </small>
                </label>
              )}

              {recipientType === 'email' && (
                <label>
                  Contributor email

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      updateField('email', e.target.value)
                    }
                    placeholder="contributor@example.com"
                  />

                  <small className="field-help">
                    An invitation can be sent to this contributor.
                  </small>
                </label>
              )}

              {recipientType === 'open' && (
                <div className="info-box">
                  <span>◎</span>

                  <p>
                    This bounty will be visible in Explore Bounties.
                    Contributors can apply and you can choose the
                    right person before the reward is released.
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="review-button"
              onClick={goToReview}
            >
              Continue to Review
              <span>→</span>
            </button>

          </section>

          <aside className="preview-panel">

            <div className="preview-label">
              BOUNTY PREVIEW
            </div>

            <div className="preview-empty">
              <div className="preview-symbol">✦</div>

              <h3>Your bounty will appear here.</h3>

              <p>
                Fill in the details and review everything before
                funding the bounty.
              </p>
            </div>

            <div className="preview-note">
              <span>SECURE ESCROW</span>

              <p>
                Funds are locked on-chain and released only when
                the work is approved.
              </p>
            </div>

          </aside>

        </div>
      </div>
    </div>
  )
}

export default CreateBounty