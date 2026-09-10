import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getBounties,
  getCurrentUserId,
  deleteBounty,
} from '../lib/bountyStorage'

function ExploreBounties() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('open')
  const [bounties, setBounties] = useState(() => getBounties())

  const currentUserId = getCurrentUserId()

  const handleDelete = (id) => {
    const bounty = bounties.find(
      (item) => String(item.id) === String(id)
    )

    if (!bounty) return

    if (bounty.ownerId !== currentUserId) {
      alert('You can only delete your own bounties.')
      return
    }

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

    const result = deleteBounty(id)

    if (!result.success) {
      alert(result.reason)
      return
    }

    setBounties(getBounties())
  }

  const filtered = useMemo(() => {
    return bounties.filter((bounty) => {
      const text = `
        ${bounty.title || ''}
        ${bounty.description || ''}
        ${bounty.category || ''}
      `.toLowerCase()

      const matchesQuery =
        text.includes(query.toLowerCase().trim())

      const matchesCategory =
        category === 'all' ||
        (bounty.category || 'Development').toLowerCase() === category

      const matchesStatus =
        status === 'all' ||
        (bounty.status || 'Open').toLowerCase() === status

      return (
        matchesQuery &&
        matchesCategory &&
        matchesStatus
      )
    })
  }, [bounties, query, category, status])

  return (
    <main className="explore-page">

      <section className="explore-header">

        <div>
          <p className="eyebrow">
            ONCHAIN MARKETPLACE
          </p>

          <h1>
            Explore Bounties.
          </h1>

          <p>
            Discover open opportunities, find meaningful work,
            and earn rewards by completing great projects.
          </p>
        </div>

        <Link
          to="/create"
          className="button button-dark"
        >
          Create a Bounty →
        </Link>

      </section>


      <section className="explore-toolbar">

        <div className="search-box">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bounties..."
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">
            All Categories
          </option>

          <option value="development">
            Development
          </option>

          <option value="design">
            Design
          </option>

          <option value="writing">
            Writing
          </option>

          <option value="website">
            Website
          </option>

          <option value="other">
            Other
          </option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="open">
            Open Bounties
          </option>

          <option value="all">
            All Status
          </option>

          <option value="accepted">
            Accepted
          </option>

          <option value="submitted">
            Submitted
          </option>

          <option value="completed">
            Completed
          </option>
        </select>

      </section>


      <section className="explore-results-header">

        <div>
          <span>
            MARKETPLACE
          </span>

          <strong>
            {filtered.length}
          </strong>

          <small>
            {filtered.length === 1
              ? 'bounty found'
              : 'bounties found'}
          </small>
        </div>

        {(query || category !== 'all' || status !== 'open') && (
          <button
            type="button"
            className="clear-filters-button"
            onClick={() => {
              setQuery('')
              setCategory('all')
              setStatus('open')
            }}
          >
            Clear filters
          </button>
        )}

      </section>


      <section className="bounty-grid">

        {filtered.length === 0 ? (

          <div className="empty-state-card">

            <div className="empty-state-symbol">
              ✦
            </div>

            <h2>
              No bounties found
            </h2>

            <p>
              Try a different search or change your filters.
            </p>

            <button
              type="button"
              className="button button-light"
              onClick={() => {
                setQuery('')
                setCategory('all')
                setStatus('open')
              }}
            >
              Reset Filters
            </button>

          </div>

        ) : (

          filtered.map((bounty) => {

            const isOwner =
              bounty.ownerId === currentUserId

            const canDelete =
              isOwner &&
              bounty.status === 'Open'

            return (

              <article
                className="explore-card"
                key={bounty.id}
              >

                <div className="explore-card-top">

                  <span className="category">
                    {bounty.category ||
                      'Development'}
                  </span>

                  <span className="status">
                    <b />
                    {bounty.status || 'Open'}
                  </span>

                </div>


                <h2>
                  {bounty.title}
                </h2>


                <p>
                  {bounty.description}
                </p>


                <div className="explore-card-details">

                  <div>
                    <span>
                      WORK TYPE
                    </span>

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
                    <span>
                      NETWORK
                    </span>

                    <strong>
                      {bounty.network || 'Base'}
                    </strong>
                  </div>

                </div>


                <div className="explore-card-bottom">

                  <div>
                    <span>
                      REWARD
                    </span>

                    <strong>
                      {bounty.reward} USDC
                    </strong>
                  </div>


                  <div className="explore-card-actions">

                    <Link
                      to={`/bounty/${bounty.id}`}
                    >
                      View Bounty →
                    </Link>

                    {canDelete && (
                      <button
                        type="button"
                        className="delete-bounty-button"
                        onClick={() =>
                          handleDelete(bounty.id)
                        }
                      >
                        Delete
                      </button>
                    )}

                  </div>

                </div>

              </article>

            )
          })

        )}

      </section>

    </main>
  )
}

export default ExploreBounties