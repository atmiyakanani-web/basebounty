import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

import {
  getBounties,
  getCurrentUserId,
  getApplications,
  updateBounty,
} from '../lib/bountyStorage'

import './SubmitWork.css'

function SubmitWork() {
  const { id } = useParams()
  const navigate = useNavigate()

  const bounty = getBounties().find(
    (item) => String(item.id) === String(id)
  )

  const [formData, setFormData] = useState({
    liveUrl: '',
    githubUrl: '',
    figmaUrl: '',
    documentUrl: '',
    submissionUrl: '',
    notes: '',
  })

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!bounty) {
    return (
      <main className="submit-page">
        <section className="submit-header">
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
            The bounty you are looking for could not
            be found or may have been removed.
          </p>
        </section>
      </main>
    )
  }

  const currentUserId =
    getCurrentUserId()

  const applications =
    getApplications()

  const myAcceptedApplication =
    applications.find(
      (application) =>
        String(application.bountyId) ===
          String(bounty.id) &&
        String(application.applicantId) ===
          String(currentUserId) &&
        application.status === 'Accepted' &&
        String(application.id) ===
          String(bounty.acceptedApplicationId)
    )

  const isAssignedWorker =
    Boolean(myAcceptedApplication)

  const type =
    bounty.bountyType || 'website'

  const typeName = {
    website: 'Website',
    development: 'Development',
    design: 'Design',
    writing: 'Writing',
    other: 'Other',
  }[type] || 'Other'

  const updateField = (
    field,
    value
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (submitting) return

    if (!isAssignedWorker) {
      setError(
        'You are not the selected worker for this bounty.'
      )
      return
    }

    if (bounty.status !== 'Accepted') {
      setError(
        'This bounty is no longer accepting work submissions.'
      )
      return
    }

    let requiredValue = ''

    if (type === 'website') {
      requiredValue =
        formData.liveUrl
    }

    if (type === 'development') {
      requiredValue =
        formData.githubUrl
    }

    if (type === 'design') {
      requiredValue =
        formData.figmaUrl
    }

    if (type === 'writing') {
      requiredValue =
        formData.documentUrl
    }

    if (type === 'other') {
      requiredValue =
        formData.submissionUrl
    }

    if (!requiredValue.trim()) {
      setError(
        'Please provide the required submission link.'
      )
      return
    }

    if (!formData.notes.trim()) {
      setError(
        'Please add details about your completed work.'
      )
      return
    }

    let submission =
      formData.notes.trim()

    if (type === 'website') {
      submission =
        `Live Website: ${formData.liveUrl.trim()}\n\nDetails: ${formData.notes.trim()}`
    }

    if (type === 'development') {
      submission =
        `GitHub Repository: ${formData.githubUrl.trim()}\n\n${
          formData.liveUrl.trim()
            ? `Live Demo: ${formData.liveUrl.trim()}\n\n`
            : ''
        }Details: ${formData.notes.trim()}`
    }

    if (type === 'design') {
      submission =
        `Figma / Design Link: ${formData.figmaUrl.trim()}\n\nDetails: ${formData.notes.trim()}`
    }

    if (type === 'writing') {
      submission =
        `Document Link: ${formData.documentUrl.trim()}\n\nDetails: ${formData.notes.trim()}`
    }

    if (type === 'other') {
      submission =
        `Submission Link: ${formData.submissionUrl.trim()}\n\nDetails: ${formData.notes.trim()}`
    }

    setSubmitting(true)

    try {
      const result =
        await updateBounty(
          bounty.id,
          {
            status: 'Submitted',

            submission,

            submittedBy:
              currentUserId,

            submittedAt:
              new Date().toISOString(),

            contributor:
              bounty.contributor,

            contributorId:
              bounty.contributorId,

            workerId:
              bounty.workerId,

            acceptedApplicationId:
              bounty.acceptedApplicationId,
          }
        )

      if (!result.success) {
        setError(
          result.reason ||
          'Could not submit your work.'
        )

        setSubmitting(false)
        return
      }

      navigate(
        `/bounty/${bounty.id}`
      )
    } catch (submitError) {
      console.error(
        'Work submission failed:',
        submitError
      )

      setError(
        'Could not sync your submission. Please try again.'
      )

      setSubmitting(false)
    }
  }

  if (
    bounty.status === 'Submitted' ||
    bounty.status === 'Completed'
  ) {
    return (
      <main className="submit-page">
        <section className="submit-header">

          <Link
            to={`/bounty/${bounty.id}`}
            className="details-back"
          >
            ← Back to Bounty
          </Link>

          <p className="eyebrow">
            {bounty.status === 'Completed'
              ? 'BOUNTY COMPLETED'
              : 'WORK SUBMITTED'}
          </p>

          <h1>
            {bounty.status === 'Completed'
              ? 'This bounty is already completed.'
              : 'Work has already been submitted.'}
          </h1>

          <p>
            {bounty.status === 'Completed'
              ? 'The client has already approved the submitted work.'
              : 'The submitted work is currently waiting for client review.'}
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

  if (!isAssignedWorker) {
    return (
      <main className="submit-page">
        <section className="submit-header">

          <Link
            to={`/bounty/${bounty.id}`}
            className="details-back"
          >
            ← Back to Bounty
          </Link>

          <p className="eyebrow">
            ACCESS RESTRICTED
          </p>

          <h1>
            You are not the selected worker.
          </h1>

          <p>
            Only the contributor selected by the
            bounty creator can submit work.
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
    <main className="submit-page">

      <section className="submit-header">

        <Link
          to={`/bounty/${bounty.id}`}
          className="details-back"
        >
          ← Back to Bounty
        </Link>

        <p className="eyebrow">
          SUBMIT WORK · {typeName.toUpperCase()}
        </p>

        <h1>
          Submit your completed work.
        </h1>

        <p>
          Provide the deliverables for this bounty
          and give the client everything needed to
          review your work.
        </p>

      </section>

      <section className="submit-layout">

        <div className="submit-main">

          <form
            className="submit-form"
            onSubmit={handleSubmit}
          >

            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {type === 'website' && (
              <label>
                <span>
                  LIVE WEBSITE URL
                </span>

                <input
                  type="url"
                  value={
                    formData.liveUrl
                  }
                  onChange={(event) =>
                    updateField(
                      'liveUrl',
                      event.target.value
                    )
                  }
                  placeholder="https://yourwebsite.com"
                />
              </label>
            )}

            {type === 'development' && (
              <>
                <label>
                  <span>
                    GITHUB REPOSITORY
                  </span>

                  <input
                    type="url"
                    value={
                      formData.githubUrl
                    }
                    onChange={(event) =>
                      updateField(
                        'githubUrl',
                        event.target.value
                      )
                    }
                    placeholder="https://github.com/username/project"
                  />
                </label>

                <label>
                  <span>
                    LIVE DEMO URL
                  </span>

                  <input
                    type="url"
                    value={
                      formData.liveUrl
                    }
                    onChange={(event) =>
                      updateField(
                        'liveUrl',
                        event.target.value
                      )
                    }
                    placeholder="https://your-demo.com"
                  />
                </label>
              </>
            )}

            {type === 'design' && (
              <label>
                <span>
                  FIGMA / DESIGN LINK
                </span>

                <input
                  type="url"
                  value={
                    formData.figmaUrl
                  }
                  onChange={(event) =>
                    updateField(
                      'figmaUrl',
                      event.target.value
                    )
                  }
                  placeholder="https://figma.com/..."
                />
              </label>
            )}

            {type === 'writing' && (
              <label>
                <span>
                  DOCUMENT LINK
                </span>

                <input
                  type="url"
                  value={
                    formData.documentUrl
                  }
                  onChange={(event) =>
                    updateField(
                      'documentUrl',
                      event.target.value
                    )
                  }
                  placeholder="https://docs.google.com/..."
                />
              </label>
            )}

            {type === 'other' && (
              <label>
                <span>
                  SUBMISSION LINK
                </span>

                <input
                  type="url"
                  value={
                    formData.submissionUrl
                  }
                  onChange={(event) =>
                    updateField(
                      'submissionUrl',
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </label>
            )}

            <label>
              <span>
                WORK DETAILS
              </span>

              <textarea
                value={
                  formData.notes
                }
                onChange={(event) =>
                  updateField(
                    'notes',
                    event.target.value
                  )
                }
                placeholder="Explain what you completed, what you delivered, and anything the client should know..."
                rows="9"
              />
            </label>

            <button
              type="submit"
              className="button button-dark"
              disabled={submitting}
            >
              {submitting
                ? 'Submitting...'
                : 'Submit Work →'}
            </button>

          </form>

        </div>

        <aside className="submit-sidebar">

          <div className="submit-summary">
            <span>BOUNTY</span>

            <h2>
              {bounty.title}
            </h2>
          </div>

          <div className="submit-summary">
            <span>WORK TYPE</span>

            <strong>
              {typeName}
            </strong>
          </div>

          <div className="submit-summary">
            <span>REWARD</span>

            <strong>
              {bounty.reward} USDC
            </strong>
          </div>

          <div className="submit-summary">
            <span>STATUS</span>

            <strong>
              {bounty.status}
            </strong>
          </div>

          <div className="submit-summary">
            <span>NETWORK</span>

            <strong>
              {bounty.network ||
                'Base'}
            </strong>
          </div>

          <div className="submit-warning">
            Once submitted, the client will review
            your work before the bounty is completed.
          </div>

          <Link
            to={`/bounty/${bounty.id}`}
            className="button button-light"
          >
            Back to Bounty
          </Link>

        </aside>

      </section>
    </main>
  )
}

export default SubmitWork