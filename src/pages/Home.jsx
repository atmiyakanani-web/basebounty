import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { getBounties } from '../lib/bountyStorage'

function Home() {
  const bounties = useMemo(() => getBounties(), [])

  const openBounties = bounties.filter(
    (bounty) => (bounty.status || 'Open') === 'Open'
  )

  const activeWork = bounties.filter(
    (bounty) =>
      bounty.status === 'Accepted' ||
      bounty.status === 'Submitted'
  )

  const completedWork = bounties.filter(
    (bounty) => bounty.status === 'Completed'
  )

  const recentBounties = openBounties.slice(0, 3)

  return (
    <main className="home-page">

      {/* HERO / DASHBOARD INTRO */}

      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <p className="eyebrow">THE ONCHAIN BOUNTY MARKETPLACE</p>

          <h1>
            BaseBounty
            <br />
            Get work done. Earn for great work.
          </h1>

          <p className="dashboard-hero-text">
            BaseBounty is a bounty marketplace on Base that connects
            clients and contributors through transparent work agreements,
            onchain rewards, and secure escrow.
          </p>

          <div className="dashboard-hero-actions">
            <Link
              to="/explore"
              className="button button-dark"
            >
              Explore Bounties →
            </Link>

            <Link
              to="/create"
              className="button button-light"
            >
              Create a Bounty
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-side">
          <span className="dashboard-side-label">
            BASEBOUNTY
          </span>

          <strong>
            Work
            <br />
            starts here.
          </strong>

          <span className="dashboard-side-mark">
            B
          </span>
        </div>
      </section>


      {/* STATS */}

      <section className="dashboard-stats">

        <div className="dashboard-stat">
          <span>OPEN BOUNTIES</span>
          <strong>{openBounties.length}</strong>
          <p>Available opportunities</p>
        </div>

        <div className="dashboard-stat">
          <span>MY BOUNTIES</span>
          <strong>
            {bounties.filter(
              (bounty) => !String(bounty.id).startsWith('demo-')
            ).length}
          </strong>
          <p>Bounties you created</p>
        </div>

        <div className="dashboard-stat">
          <span>ACTIVE WORK</span>
          <strong>{activeWork.length}</strong>
          <p>Work currently in progress</p>
        </div>

        <div className="dashboard-stat">
          <span>COMPLETED</span>
          <strong>{completedWork.length}</strong>
          <p>Successfully completed</p>
        </div>

      </section>


      {/* QUICK ACTIONS */}

      <section className="dashboard-actions-section">

        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">QUICK ACTIONS</p>
            <h2>What do you want to do?</h2>
          </div>
        </div>

        <div className="dashboard-action-grid">

          <Link
            to="/find-work"
            className="dashboard-action-card"
          >
            <span className="dashboard-action-number">01</span>

            <div>
              <span className="dashboard-action-label">
                FOR WORKERS
              </span>

              <h3>Find Work</h3>

              <p>
                Discover open bounties, apply for work,
                and earn rewards.
              </p>
            </div>

            <strong>→</strong>
          </Link>


          <Link
            to="/hire"
            className="dashboard-action-card"
          >
            <span className="dashboard-action-number">02</span>

            <div>
              <span className="dashboard-action-label">
                FOR CLIENTS
              </span>

              <h3>Hire Someone</h3>

              <p>
                Create a bounty and find the right
                contributor for your work.
              </p>
            </div>

            <strong>→</strong>
          </Link>


          <Link
            to="/create"
            className="dashboard-action-card"
          >
            <span className="dashboard-action-number">03</span>

            <div>
              <span className="dashboard-action-label">
                CREATE
              </span>

              <h3>Create a Bounty</h3>

              <p>
                Define your task, reward the work,
                and publish an opportunity.
              </p>
            </div>

            <strong>→</strong>
          </Link>


          <Link
            to="/my-bounties"
            className="dashboard-action-card"
          >
            <span className="dashboard-action-number">04</span>

            <div>
              <span className="dashboard-action-label">
                DASHBOARD
              </span>

              <h3>My Bounties</h3>

              <p>
                Manage your posted bounties,
                applications, and workers.
              </p>
            </div>

            <strong>→</strong>
          </Link>

        </div>

      </section>


      {/* RECENT BOUNTIES */}

      <section className="dashboard-bounties-section">

        <div className="dashboard-section-heading">
          <div>
            <p className="eyebrow">BASEBOUNTY MARKETPLACE</p>

            <h2>Open bounties.</h2>

            <p>
              Find work that matches your skills and interests
              on the BaseBounty bounty marketplace.
            </p>
          </div>

          <Link
            to="/explore"
            className="dashboard-view-all"
          >
            View all →
          </Link>
        </div>


        {recentBounties.length === 0 ? (

          <div className="dashboard-empty">
            <span>✦</span>

            <h3>No open bounties yet.</h3>

            <p>
              Create the first bounty and start the BaseBounty marketplace.
            </p>

            <Link
              to="/create"
              className="button button-dark"
            >
              Create a Bounty →
            </Link>
          </div>

        ) : (

          <div className="dashboard-bounty-grid">

            {recentBounties.map((bounty) => (

              <article
                className="dashboard-bounty-card"
                key={bounty.id}
              >

                <div className="dashboard-bounty-top">
                  <span>
                    {bounty.category || 'Development'}
                  </span>

                  <strong>
                    ● {bounty.status || 'Open'}
                  </strong>
                </div>

                <h3>{bounty.title}</h3>

                <p>
                  {bounty.description}
                </p>

                <div className="dashboard-bounty-bottom">

                  <div>
                    <span>REWARD</span>

                    <strong>
                      {bounty.reward} USDC
                    </strong>
                  </div>

                  <Link
                    to={`/bounty/${bounty.id}`}
                  >
                    View →
                  </Link>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>


      {/* MY BOUNTIES */}

      <section className="dashboard-client-section">

        <div className="dashboard-client-card">

          <div>
            <p className="eyebrow">
              CLIENT DASHBOARD
            </p>

            <h2>
              Manage your work.
            </h2>

            <p>
              Track your bounties, review applications,
              select contributors, and approve completed work.
            </p>
          </div>

          <div className="dashboard-client-actions">

            <Link
              to="/my-bounties"
              className="button button-dark"
            >
              My Bounties →
            </Link>

            <Link
              to="/create"
              className="button button-light"
            >
              Create New
            </Link>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section
        className="dashboard-how"
        id="how-it-works"
      >

        <div className="dashboard-section-heading">
          <p className="eyebrow">
            HOW BASEBOUNTY WORKS
          </p>

          <h2>
            From idea to completed work.
          </h2>
        </div>


        <div className="dashboard-steps">

          <div className="dashboard-step">
            <span>01</span>

            <h3>Create</h3>

            <p>
              A client creates a bounty with a clear
              task and reward.
            </p>
          </div>

          <div className="dashboard-step">
            <span>02</span>

            <h3>Apply</h3>

            <p>
              Contributors discover the opportunity
              and send an application.
            </p>
          </div>

          <div className="dashboard-step">
            <span>03</span>

            <h3>Complete</h3>

            <p>
              The selected contributor completes the
              requested work.
            </p>
          </div>

          <div className="dashboard-step">
            <span>04</span>

            <h3>Get Paid</h3>

            <p>
              The client reviews the submission and
              approves the reward.
            </p>
          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="home-footer">

        <div>
          <span className="footer-brand-mark">
            B
          </span>

          <strong>
            BaseBounty
          </strong>
        </div>

        <p>
          BaseBounty is the onchain bounty marketplace
          for meaningful work on Base.
        </p>

      </footer>

    </main>
  )
}

export default Home